"""
API Flask para Chatbot de Ventas
=================================
"""

from flask import Flask
from flask_cors import CORS
from routes.chat import chat_bp
from routes.health import health_bp
from routes.metadata import metadata_bp

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [  
            "http://localhost:5173",
            "https://globo-market.onrender.com"
        ],
        "supports_credentials": True,
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "allow_headers": "*"
    }
})

@app.route("/")
def home():
    return {"message": "CORS configurado correctamente"}

# Registrar blueprints
app.register_blueprint(health_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(metadata_bp)

if __name__ == "__main__":
    print("\n" + "="*70)
    print("   FLASK API - CHATBOT DE VENTAS")
    print("="*70)
    print("\nFlask API:        http://localhost:5000")
    print("Endpoints:")
    print("  GET  /health         - Health check")
    print("  POST /api/chat       - Chat endpoint")
    print("  GET  /api/schema     - Database schema")
    print("  GET  /api/ejemplos   - Example queries")
    print("\nPresiona Ctrl+C para detener")
    print("="*70 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)