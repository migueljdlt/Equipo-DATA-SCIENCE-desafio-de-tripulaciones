/**
 * Aplicación Express principal
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const MCPPostgresClient = require('./services/mcpClient');
const configurarRutas = require('./routes');
const { TIPOS_PERMITIDOS } = require('./config/constants');
const OLLAMA_CONFIG = require('./config/ollama');

const PORT = process.env.PORT || 3000;

async function crearApp() {
    const app = express();
    
    // Middleware
    app.use(cors());
    app.use(express.json());
    
    // Conectar MCP PostgreSQL
    console.log('>> Conectando con MCP PostgreSQL (Render)...');
    const mcp = new MCPPostgresClient();
    await mcp.connect();
    
    // Configurar rutas
    configurarRutas(app, mcp);
    
    // Iniciar servidor
    app.listen(PORT, () => {
        console.log('');
        console.log('============================================================');
        console.log('   CHATBOT SQL + CHARTS - BASE DE DATOS RENDER');
        console.log('   Gráficas en formato BASE64');
        console.log('============================================================');
        console.log(`>> API: http://localhost:${PORT}`);
        console.log(`>> BD: database_final_project (Render)`);
        console.log(`>> Tablas: employees, customers, products, sales`);
        console.log(`>> Graficos: ${TIPOS_PERMITIDOS.join(', ')}`);
        console.log(`>> Formato: PNG Base64`);
        console.log(`>> Modelo: ${OLLAMA_CONFIG.MODELO}`);
        console.log('');
        console.log('Ctrl+C para detener.');
        console.log('============================================================');
    });
    
    return app;
}

module.exports = crearApp;