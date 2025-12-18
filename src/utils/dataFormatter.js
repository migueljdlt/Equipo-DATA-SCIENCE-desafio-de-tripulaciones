/**
 * Formateadores de datos para gráficas
 */

function prepararDatosParaGrafico(datos, tipoGrafico) {
    if (!Array.isArray(datos) || datos.length === 0) {
        return [];
    }
    
    const keys = Object.keys(datos[0]);
    
    // Para gráficos de línea, necesita {time, value}
    if (tipoGrafico === 'line') {
        return datos.map(row => {
            const values = Object.values(row);
            return {
                time: String(values[0]),
                value: parseFloat(values[1]) || 0
            };
        });
    }
    
    // Para bar, column, pie: {category, value}
    // Intentar encontrar la mejor columna para category y value
    return datos.map(row => {
        const entries = Object.entries(row);
        
        // Buscar columna de categoría (primera columna de texto)
        let categoryValue = null;
        let numericValue = null;
        
        for (const [key, value] of entries) {
            const keyLower = key.toLowerCase();
            
            // Si es una columna de texto/nombre, usar como categoría
            if (categoryValue === null && (
                keyLower.includes('nombre') ||
                keyLower.includes('empleado') ||
                keyLower.includes('producto') ||
                keyLower.includes('categoria') ||
                keyLower.includes('mes') ||
                keyLower.includes('region') ||
                keyLower.includes('canal') ||
                !isNaN(value) === false
            )) {
                categoryValue = String(value);
            }
            
            // Si es una columna numérica, usar como valor
            if (numericValue === null && (
                keyLower.includes('total') ||
                keyLower.includes('ventas') ||
                keyLower.includes('cantidad') ||
                keyLower.includes('monto') ||
                keyLower.includes('importe') ||
                keyLower.includes('porcentaje')
            ) && !isNaN(parseFloat(value))) {
                numericValue = parseFloat(value);
            }
        }
        
        // Fallback: usar las dos primeras columnas
        if (categoryValue === null) {
            categoryValue = String(Object.values(row)[0]);
        }
        if (numericValue === null) {
            numericValue = parseFloat(Object.values(row)[1]) || 0;
        }
        
        return {
            category: categoryValue,
            value: numericValue
        };
    });
}

module.exports = {
    prepararDatosParaGrafico
};