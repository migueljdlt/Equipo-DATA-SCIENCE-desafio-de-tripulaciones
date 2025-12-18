/**
 * Rutas de gráficas
 */

const express = require('express');
const { generarGraficaBase64 } = require('../charts/chartGenerator');
const { prepararDatosParaGrafico } = require('../utils/dataFormatter');
const { validarTipoGrafico, obtenerDescripcionTipos } = require('../charts/chartUtils');
const { TIPOS_PERMITIDOS } = require('../config/constants');

const router = express.Router();

// Tipos de gráfico disponibles
router.get('/chart/types', (req, res) => {
    res.json({ 
        tipos: TIPOS_PERMITIDOS,
        descripcion: obtenerDescripcionTipos()
    });
});

// Generar gráfico directo
router.post('/chart', async (req, res) => {
    const { tipo = 'bar', datos } = req.body;
    
    if (!validarTipoGrafico(tipo)) {
        return res.json({
            exito: false,
            error: `Tipo no soportado. Usa: ${TIPOS_PERMITIDOS.join(', ')}`
        });
    }
    
    try {
        const datosPreparados = prepararDatosParaGrafico(datos, tipo);
        const base64Image = generarGraficaBase64(tipo, datosPreparados);
        
        if (base64Image) {
            res.json({
                exito: true,
                tipo,
                base64: base64Image
            });
        } else {
            res.json({
                exito: false,
                error: 'Error generando gráfica'
            });
        }
    } catch (error) {
        res.json({ exito: false, error: error.message });
    }
});

module.exports = router;