/**
 * Punto de entrada principal
 */

const crearApp = require('./src/app');

crearApp().catch(error => {
    console.error('Error fatal:', error.message);
    process.exit(1);
});