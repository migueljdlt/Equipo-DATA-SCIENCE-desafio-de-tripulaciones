/**
 * Configuración de Ollama
 */

const OLLAMA_CONFIG = {
    URL: 'http://localhost:11434',
    MODELO: 'qwen3:8b',
    TEMPERATURE_SQL: 0.1,
    TEMPERATURE_TEXT: 0.3
};

module.exports = OLLAMA_CONFIG;