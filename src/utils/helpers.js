/**
 * Funciones auxiliares
 */

const { PALABRAS_GRAFICO, TIPOS_GRAFICO } = require('../config/constants');

function detectarPeticionGrafico(pregunta) {
    const preguntaLower = pregunta.toLowerCase();
    for (const palabra of PALABRAS_GRAFICO) {
        if (preguntaLower.includes(palabra)) {
            return true;
        }
    }
    return false;
}

function detectarTipoGrafico(pregunta) {
    const preguntaLower = pregunta.toLowerCase();
    
    // Buscar coincidencias de tipo de gráfico (ordenadas por prioridad)
    const tiposOrdenados = [
        ['pie chart', 'pie'],
        ['pastel', 'pie'],
        ['circular', 'pie'],
        ['tarta', 'pie'],
        ['torta', 'pie'],
        ['barras horizontales', 'bar'],
        ['horizontal', 'bar'],
        ['barra', 'bar'],
        ['columnas', 'column'],
        ['columna', 'column'],
        ['vertical', 'column'],
        ['lineas', 'line'],
        ['linea', 'line'],
        ['tendencia', 'line'],
        ['evolucion', 'line'],
        ['line', 'line']
    ];
    
    for (const [palabraClave, tipo] of tiposOrdenados) {
        if (preguntaLower.includes(palabraClave)) {
            return tipo;
        }
    }
    
    // Por defecto: bar
    return 'bar';
}

module.exports = {
    detectarPeticionGrafico,
    detectarTipoGrafico
};