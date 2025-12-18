/**
 * Rutas de información
 */

const express = require('express');
const { SCHEMA_DESCRIPCION, TIPOS_PERMITIDOS } = require('../config/constants');
const DB_CONFIG = require('../config/database');
const OLLAMA_CONFIG = require('../config/ollama');

const router = express.Router();

function crearInfoRoutes(mcp) {
    // Health check
    router.get('/health', (req, res) => {
        res.json({ status: 'ok', database: 'Render PostgreSQL' });
    });
    
    // Info principal
    router.get('/', (req, res) => {
        res.json({
            servicio: 'Chatbot SQL + Charts',
            database: 'Render PostgreSQL (database_final_project)',
            modelo: OLLAMA_CONFIG.MODELO,
            graficos: TIPOS_PERMITIDOS,
            formato_grafico: 'base64',
            tablas: DB_CONFIG.TABLES,
            endpoints: [
                'POST /api/query',
                'POST /api/chart',
                'GET /api/chart/types',
                'GET /api/schema',
                'GET /api/tables',
                'GET /api/ejemplos'
            ]
        });
    });
    
    // Schema
    router.get('/schema', (req, res) => {
        res.json({ schema: SCHEMA_DESCRIPCION });
    });
    
    // Tablas
    router.get('/tables', (req, res) => {
        res.json({ tablas: DB_CONFIG.TABLES });
    });
    
    // Ejemplos
    router.get('/ejemplos', (req, res) => {
        res.json({
            ejemplos: [
                'Cuantas ventas hay en total?',
                'Top 5 empleados con mas ventas',
                'Ventas por producto',
                'Ventas por canal de venta',
                'Grafico de barras de ventas por empleado',
                'Grafico de lineas de ventas por mes',
                'Pie chart de ventas por metodo de pago',
                'Top 10 productos mas vendidos',
                'Ventas por region del cliente',
                'Calcula el 5% de las ventas totales',
                'Dame el promedio de ventas',
                'Ventas que superan el promedio',
                'Calcula comision del 3% para cada empleado',
                'Participacion porcentual de cada producto',
                'Top 10% de productos mas vendidos',
            ]
        });
    });

    return router;
}

module.exports = crearInfoRoutes;