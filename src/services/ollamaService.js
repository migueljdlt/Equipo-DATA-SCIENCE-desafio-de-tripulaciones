/**
 * Servicio de Ollama
 */

const OLLAMA_CONFIG = require('../config/ollama');

async function llamarOllama(prompt, temperature = OLLAMA_CONFIG.TEMPERATURE_SQL) {
    try {
        const response = await fetch(`${OLLAMA_CONFIG.URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_CONFIG.MODELO,
                messages: [{ role: 'user', content: prompt }],
                stream: false,
                options: { temperature }
            })
        });
        
        const data = await response.json();
        return data.message?.content || '';
    } catch (error) {
        console.error('Error llamando Ollama:', error.message);
        return `ERROR: ${error.message}`;
    }
}

module.exports = { llamarOllama };