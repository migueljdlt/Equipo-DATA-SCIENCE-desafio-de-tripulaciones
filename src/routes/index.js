/**
 * Router principal
 */

const express = require('express');
const crearQueryRoutes = require('./queryRoutes');
const chartRoutes = require('./chartRoutes');
const crearInfoRoutes = require('./infoRoutes');

function configurarRutas(app, mcp) {
    const router = express.Router();
    
    // Rutas de información (root y health en raíz)
    const infoRoutes = crearInfoRoutes(mcp);
    app.use('/', infoRoutes);
    
    // Rutas de API
    router.use(crearQueryRoutes(mcp));
    router.use(chartRoutes);
    
    app.use('/api', router);
}

module.exports = configurarRutas;