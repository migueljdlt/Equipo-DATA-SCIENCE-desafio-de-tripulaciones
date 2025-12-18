/**
 * Cliente MCP PostgreSQL
 */

const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const DB_CONFIG = require('../config/database');
const { SCHEMA_DESCRIPCION } = require('../config/constants');

class MCPPostgresClient {
    constructor() {
        this.client = null;
        this.transport = null;
    }
    
    async connect() {
        this.transport = new StdioClientTransport({
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-postgres', DB_CONFIG.URL]
        });
        
        this.client = new Client({
            name: 'chatbot-sql-client',
            version: '1.0.0'
        }, {
            capabilities: {}
        });
        
        await this.client.connect(this.transport);
        console.log('>> MCP PostgreSQL conectado (Render)');
        return this;
    }
    
    async disconnect() {
        if (this.client) {
            await this.client.close();
        }
    }
    
    async query(sql) {
        try {
            const result = await this.client.callTool({
                name: 'query',
                arguments: { sql }
            });
            
            if (result.content && result.content[0]) {
                const text = result.content[0].text;
                try {
                    return { exito: true, datos: JSON.parse(text), error: null };
                } catch {
                    return { exito: true, datos: text, error: null };
                }
            }
            return { exito: true, datos: [], error: null };
        } catch (error) {
            return { exito: false, datos: [], error: error.message };
        }
    }
    
    async getSchema() {
        return SCHEMA_DESCRIPCION;
    }
    
    async listTables() {
        return DB_CONFIG.TABLES;
    }
}

module.exports = MCPPostgresClient;