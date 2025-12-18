/**
 * Validación de SQL
 */

function validarSQL(sql) {
    const sqlUpper = sql.toUpperCase().trim();
    
    if (!sqlUpper.startsWith('SELECT')) {
        return { valido: false, mensaje: 'Solo se permiten consultas SELECT' };
    }
    
    const prohibidas = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE'];
    for (const op of prohibidas) {
        if (new RegExp(`\\b${op}\\b`).test(sqlUpper)) {
            return { valido: false, mensaje: `Operacion no permitida: ${op}` };
        }
    }
    
    if (/;\s*\w+/.test(sqlUpper)) {
        return { valido: false, mensaje: 'Multiples statements no permitidos' };
    }
    
    if (sql.includes('--') || sql.includes('/*')) {
        return { valido: false, mensaje: 'Comentarios no permitidos' };
    }
    
    return { valido: true, mensaje: 'OK' };
}

function limpiarSQL(sql) {
    sql = sql.replace(/```sql\s*/gi, '');
    sql = sql.replace(/```\s*/g, '');
    sql = sql.replace(/<think>[\s\S]*?<\/think>/gi, '');
    
    const match = sql.match(/SELECT\s+[\s\S]+/i);
    if (match) {
        sql = match[0];
    }
    
    sql = sql.split(/\s+/).join(' ').trim();
    
    if (!sql.endsWith(';')) {
        sql += ';';
    }
    
    return sql;
}

module.exports = {
    validarSQL,
    limpiarSQL
};