/**
 * Configuración de la base de datos
 */
require('dotenv').config();
const URL_PG = process.env.DATABASE_URL
const DB_CONFIG = {
    URL: URL_PG,
    TABLES: ['employees', 'customers', 'products', 'sales', 'users']
};

module.exports = DB_CONFIG;