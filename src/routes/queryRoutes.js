/**
 * Rutas de consultas SQL
 */

const express = require('express');
const { generarSQL, formatearRespuesta, guardarEjemploAprendido } = require('../services/sqlService');
const { validarSQL, limpiarSQL } = require('../utils/sqlValidator');
const { detectarPeticionGrafico, detectarTipoGrafico } = require('../utils/helpers');
const { prepararDatosParaGrafico } = require('../utils/dataFormatter');
const { generarGraficaBase64 } = require('../charts/chartGenerator');

const router = express.Router();

function crearQueryRoutes(mcp) {
    router.post('/query', async (req, res) => {
        const { pregunta, usuario_id = 'anonimo', rol = 'ventas' } = req.body;
        
        const resultado = {
            exito: false,
            tipo: 'texto',
            mensaje: '',
            datos: [],
            columnas: [],
            sql_generado: null,
            grafico: null,
            usuario_id,
            rol
        };
        
        try {
            console.log(`\n>> Pregunta: ${pregunta}`);
            
            const quiereGrafico = detectarPeticionGrafico(pregunta);
            const tipoGrafico = quiereGrafico ? detectarTipoGrafico(pregunta) : null;
            
            if (quiereGrafico) {
                console.log(`>> Grafico solicitado: ${tipoGrafico}`);
            }
            
            // Generar SQL
            console.log('>> Generando SQL...');
            let sql = await generarSQL(pregunta);
            sql = limpiarSQL(sql);
            resultado.sql_generado = sql;
            console.log(`>> SQL: ${sql}`);
            
            // Validar
            const validacion = validarSQL(sql);
            if (!validacion.valido) {
                resultado.mensaje = `SQL rechazado: ${validacion.mensaje}`;
                return res.json(resultado);
            }
            
            // Ejecutar
            console.log('>> Ejecutando query...');
            const respuesta = await mcp.query(sql);
            
            if (!respuesta.exito) {
                resultado.mensaje = `Error: ${respuesta.error}`;
                return res.json(resultado);
            }
            
            const datos = respuesta.datos;
            resultado.datos = datos;
            
            if (Array.isArray(datos) && datos.length > 0) {
                resultado.columnas = Object.keys(datos[0]);
            }
            
            // Generar grafico si se pidio
            if (quiereGrafico && Array.isArray(datos) && datos.length > 0) {
                console.log(`>> Generando grafico tipo: ${tipoGrafico}`);
    
                try {
                    const datosGrafico = prepararDatosParaGrafico(datos, tipoGrafico);
                    console.log('>> Datos preparados para grafico:', JSON.stringify(datosGrafico, null, 2));
        
                    if (datosGrafico.length === 0) {
                        console.log('⚠️  No hay datos para generar grafico');
                        resultado.grafico = { tipo: tipoGrafico, error: 'No hay datos para visualizar' };
                    } else {
                        const base64Image = await generarGraficaBase64(tipoGrafico, datosGrafico);
            
                        if (base64Image) {
                            resultado.grafico = {
                                tipo: tipoGrafico,
                                base64: base64Image
                            };
                            resultado.tipo = 'grafico';
                            console.log(`✅ Grafico generado exitosamente (${base64Image.length} caracteres)`);
                        } else {
                            console.log('❌ generarGraficaBase64 retornó null');
                            resultado.grafico = { tipo: tipoGrafico, error: 'Error generando imagen' };
                        }
                    }
                } catch (chartError) {
                    console.error('❌ Error en generación de grafico:', chartError);
                    resultado.grafico = { error: chartError.message };
                }
            }
            
            // Formatear respuesta
            console.log('>> Formateando respuesta...');
            const mensaje = await formatearRespuesta(pregunta, datos);
            
            if (resultado.tipo !== 'grafico') {
                if (datos.length === 1 && resultado.columnas.length === 1) {
                    resultado.tipo = 'numero';
                } else if (datos.length > 1) {
                    resultado.tipo = 'tabla';
                }
            }
            
            resultado.exito = true;
            if (resultado.exito && datos.length > 0) {
                guardarEjemploAprendido(pregunta, sql);
            }

            resultado.mensaje = mensaje;
            
            console.log('>> OK');
            res.json(resultado);
            
        } catch (error) {
            console.error('>> Error:', error.message);
            resultado.mensaje = `Error: ${error.message}`;
            res.json(resultado);
        }
    });

    return router;
}

module.exports = crearQueryRoutes;