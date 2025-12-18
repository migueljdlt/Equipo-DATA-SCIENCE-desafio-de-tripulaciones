/**
 * Generador de gráficas usando QuickChart API (sin canvas nativo)
 */

const https = require('https');

async function generarGraficaBase64(tipo, datos) {
    try {
        // Convertir tipo 'column' a 'bar' para Chart.js
        const chartType = tipo === 'column' ? 'bar' : tipo;
        
        const config = crearConfiguracionGrafica(chartType, datos, tipo === 'bar');
        
        // Usar QuickChart API (servicio gratuito para generar gráficos)
        const chartConfig = encodeURIComponent(JSON.stringify(config));
        const url = `https://quickchart.io/chart?c=${chartConfig}&width=800&height=600&format=png`;
        
        // Descargar la imagen
        const imageBuffer = await descargarImagen(url);
        const base64 = imageBuffer.toString('base64');
        
        return `data:image/png;base64,${base64}`;
    } catch (error) {
        console.error('Error generando gráfica:', error);
        return null;
    }
}

function descargarImagen(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

function crearConfiguracionGrafica(chartType, datos, esHorizontal) {
    const labels = datos.map(d => d.category || d.time || 'Sin etiqueta');
    const values = datos.map(d => d.value || 0);
    
    const colores = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
        '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
    ];
    
    const config = {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Valores',
                data: values,
                backgroundColor: colores.slice(0, datos.length),
                borderColor: colores.slice(0, datos.length),
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: chartType === 'pie',
                    position: 'right'
                },
                title: {
                    display: true,
                    text: obtenerTituloGrafico(chartType, esHorizontal),
                    font: { size: 20, weight: 'bold' }
                }
            },
            scales: chartType !== 'pie' ? {
                x: {
                    beginAtZero: true,
                    grid: { display: true }
                },
                y: {
                    beginAtZero: true,
                    grid: { display: true }
                }
            } : undefined
        }
    };
    
    // Para barras horizontales
    if (esHorizontal && chartType === 'bar') {
        config.options.indexAxis = 'y';
    }
    
    return config;
}

function obtenerTituloGrafico(tipo, esHorizontal) {
    if (tipo === 'bar' && esHorizontal) return 'Gráfico de Barras Horizontales';
    if (tipo === 'bar') return 'Gráfico de Columnas';
    if (tipo === 'line') return 'Gráfico de Líneas';
    if (tipo === 'pie') return 'Gráfico Circular';
    return 'Gráfico';
}

module.exports = {
    generarGraficaBase64
};