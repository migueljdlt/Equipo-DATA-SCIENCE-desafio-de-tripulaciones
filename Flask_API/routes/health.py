from flask import Blueprint, jsonify
from services.mcp_client import verificar_servidor_mcp
from config.settings import MCP_SERVER_URL
from datetime import datetime

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health_check():
    """Health check en la raíz"""
    mcp_disponible = verificar_servidor_mcp()
    
    return jsonify({
        "status": "ok" if mcp_disponible else "degraded",
        "components": {
            "flask": "ok",
            "mcp_server": "ok" if mcp_disponible else "unavailable"
        },
        "mcp_url": MCP_SERVER_URL,
        "timestamp": datetime.now().isoformat()
    }), 200 if mcp_disponible else 503