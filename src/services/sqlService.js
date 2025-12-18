/**
 * Servicio de generación y formateo de SQL
 */

const { llamarOllama } = require('./ollamaService');
const OLLAMA_CONFIG = require('../config/ollama');
const {
    SCHEMA_DESCRIPCION,
    GLOSARIO,
    GLOSARIO_MATEMATICO,
    EJEMPLOS_APRENDIDOS
} = require('../config/constants');

/**
 * Genera SQL con restricciones basadas en el rol del usuario
 * @param {string} pregunta - Pregunta del usuario en lenguaje natural
 * @param {string} userRole - Rol del usuario ('admin', 'hr', 'mkt')
 * @returns {Promise<string>} Query SQL generada
 */
function generarSQL(pregunta, userRole = 'admin') {
    // Definir permisos por rol
    const PERMISOS_ROL = {
        admin: {
            tablas_permitidas: ['employees', 'customers', 'products', 'sales', 'users'],
            descripcion: 'Acceso completo a todas las tablas'
        },
        hr: {
            tablas_permitidas: ['employees'],
            descripcion: 'Solo acceso a información de empleados'
        },
        mkt: {
            tablas_permitidas: ['customers', 'products', 'sales'],
            descripcion: 'Acceso a clientes, productos y ventas'
        }
    };

    const permisos = PERMISOS_ROL[userRole] || PERMISOS_ROL.admin;
    const tablasPermitidas = permisos.tablas_permitidas.join(', ');

    // Buscar ejemplos similares aprendidos
    let ejemplosRelevantes = '';
    if (EJEMPLOS_APRENDIDOS.length > 0) {
        const similares = EJEMPLOS_APRENDIDOS
            .filter(ej => {
                const palabrasPregunta = pregunta.toLowerCase().split(' ');
                const palabrasEjemplo = ej.pregunta.toLowerCase().split(' ');
                const coincidencias = palabrasPregunta.filter(p => 
                    palabrasEjemplo.some(pe => pe.includes(p) || p.includes(pe))
                );
                return coincidencias.length >= 2;
            })
            .slice(-3);
        
        if (similares.length > 0) {
            ejemplosRelevantes = '\n\nEJEMPLOS APRENDIDOS DE CONSULTAS EXITOSAS:\n';
            similares.forEach(ej => {
                ejemplosRelevantes += `Usuario: "${ej.pregunta}"\nSQL: ${ej.sql}\n\n`;
            });
        }
    }

    const prompt = `/no_think
Genera SOLO la query SQL para PostgreSQL. Sin explicaciones, sin markdown, sin comentarios.
Eres un experto SQL analista de datos con 10 años de experiencia.
CONTEXTO: Base de datos de ventas con empleados, clientes y productos.

${SCHEMA_DESCRIPCION}

${GLOSARIO}

${GLOSARIO_MATEMATICO}

${ejemplosRelevantes}

CONTROL DE ACCESO Y PERMISOS:
ROL DEL USUARIO: ${userRole}
TABLAS PERMITIDAS: ${tablasPermitidas}
RESTRICCIÓN: ${permisos.descripcion}

⚠️ REGLA CRÍTICA DE SEGURIDAD:
- SOLO puedes consultar las tablas: ${tablasPermitidas}
- Si la pregunta requiere tablas NO permitidas, responde con: ERROR_PERMISO_DENEGADO
- NO generes SQL que acceda a tablas fuera de tu permiso
- Si el rol es 'hr', NUNCA accedas a customers, products o sales
- Si el rol es 'mkt', NUNCA accedas a employees
- Si el rol es 'admin', tienes acceso completo
- En el caso de que se pida acceso a algun dato denegado, devolver -blocked-

EJEMPLOS DE CONSULTAS EXITOSAS (aprende de estos):
Usuario: "ventas del mes pasado"
SQL: SELECT SUM(total) FROM sales WHERE sale_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND sale_timestamp < DATE_TRUNC('month', CURRENT_DATE);

Usuario: "top 3 empleados"
SQL: SELECT CONCAT(e.first_name, ' ', e.last_name) AS empleado, SUM(s.total) AS ventas FROM sales s JOIN employees e ON s.employee_id = e.employee_id GROUP BY e.employee_id, e.first_name, e.last_name ORDER BY ventas DESC LIMIT 3;

INSTRUCCIONES PARA CÁLCULOS:
- Si menciona "X%", usa: valor * (X/100) o valor * 0.0X
- Para promedios: AVG(campo)
- Para participación: (valor/total)*100
- Redondea decimales: ROUND(valor, 2)

REGLAS IMPORTANTES:
1. Solo SELECT (nunca INSERT, UPDATE, DELETE)
2. Siempre incluye LIMIT 100
3. Para nombres completos usa: CONCAT(first_name, ' ', last_name) AS nombre
4. Para fechas usa: EXTRACT(MONTH FROM sale_timestamp) o DATE_TRUNC('month', sale_timestamp)
5. Siempre usa alias descriptivos (AS total_ventas, AS nombre_empleado, etc)
6. Para JOINs usa los IDs correctos:
   - sales.employee_id = employees.employee_id
   - sales.customer_id = customers.customer_id  
   - sales.product_id = products.product_id
7. VERIFICA que todas las tablas en tu SQL estén en la lista de tablas permitidas

EJEMPLOS POR ROL:

ROL ADMIN (acceso completo):
- "ventas por empleado" -> SELECT CONCAT(e.first_name, ' ', e.last_name) AS empleado, SUM(s.total) AS total_ventas FROM sales s JOIN employees e ON s.employee_id = e.employee_id GROUP BY e.employee_id, e.first_name, e.last_name ORDER BY total_ventas DESC LIMIT 100;

ROL HR (solo employees):
- "lista de empleados" -> SELECT CONCAT(first_name, ' ', last_name) AS nombre, position AS puesto, salary AS salario FROM employees ORDER BY last_name LIMIT 100;
- "empleados del departamento ventas" -> SELECT CONCAT(first_name, ' ', last_name) AS nombre, position FROM employees WHERE department = 'Sales' LIMIT 100;
- "cuántos empleados hay" -> SELECT COUNT(*) AS total_empleados FROM employees;

ROL MKT (customers, products, sales):
- "top 5 productos" -> SELECT p.product_name AS producto, SUM(s.quantity) AS cantidad_vendida FROM sales s JOIN products p ON s.product_id = p.product_id GROUP BY p.product_id, p.product_name ORDER BY cantidad_vendida DESC LIMIT 5;
- "ventas por mes" -> SELECT EXTRACT(MONTH FROM sale_timestamp) AS mes, SUM(total) AS total_ventas FROM sales GROUP BY mes ORDER BY mes LIMIT 100;
- "clientes con más compras" -> SELECT c.customer_name AS cliente, COUNT(s.sale_id) AS num_compras FROM sales s JOIN customers c ON s.customer_id = c.customer_id GROUP BY c.customer_id, c.customer_name ORDER BY num_compras DESC LIMIT 10;

PREGUNTA DEL USUARIO (ROL: ${userRole}): ${pregunta}

VALIDACIÓN FINAL ANTES DE RESPONDER:
1. ¿Todas las tablas en mi SQL están en [${tablasPermitidas}]?
2. Si NO, responde: ERROR_PERMISO_DENEGADO
3. Si SÍ, genera el SQL

SQL:`;

    return llamarOllama(prompt, OLLAMA_CONFIG.TEMPERATURE_SQL);
}

function formatearRespuesta(pregunta, datos) {
    if (!datos || datos.length === 0) {
        return 'No se encontraron datos para tu consulta.';
    }
    
    if (datos.length === 1 && Object.keys(datos[0]).length === 1) {
        const valor = Object.values(datos[0])[0];
        return `El resultado es: ${valor}`;
    }
    
    const prompt = `/no_think
Responde brevemente (1-2 frases) a la pregunta basandote en los datos.
No menciones SQL ni bases de datos. Se conciso.

Pregunta: ${pregunta}
Datos: ${JSON.stringify(datos.slice(0, 5))}
Total registros: ${datos.length}

Respuesta:`;

    return llamarOllama(prompt, OLLAMA_CONFIG.TEMPERATURE_TEXT);
}

function guardarEjemploAprendido(pregunta, sql) {
    EJEMPLOS_APRENDIDOS.push({
        pregunta: pregunta,
        sql: sql,
        timestamp: new Date().toISOString()
    });

    // Limitar a últimos 100 ejemplos
    if (EJEMPLOS_APRENDIDOS.length > 100) {
        EJEMPLOS_APRENDIDOS.shift();
    }

    console.log(`>> Ejemplo aprendido (total: ${EJEMPLOS_APRENDIDOS.length})`);
}

module.exports = {
    generarSQL,
    formatearRespuesta,
    guardarEjemploAprendido
};