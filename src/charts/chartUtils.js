/**
 * Utilidades para gráficas
 */

const { TIPOS_PERMITIDOS } = require('../config/constants');

function validarTipoGrafico(tipo) {
    return TIPOS_PERMITIDOS.includes(tipo);
}

function obtenerDescripcionTipos() {
    return {
        bar: 'Barras horizontales',
        column: 'Barras verticales (columnas)',
        line: 'Líneas (tendencias)',
        pie: 'Circular (proporciones)'
    };
}

module.exports = {
    validarTipoGrafico,
    obtenerDescripcionTipos
};