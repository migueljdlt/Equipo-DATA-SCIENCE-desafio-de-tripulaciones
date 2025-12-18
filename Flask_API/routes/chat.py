from flask import Blueprint, request, jsonify
from services.mcp_client import llamar_mcp_query
from utils.session import generar_session_id
from utils.formatter import convertir_respuesta_mcp

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    """Endpoint principal del chatbot"""
    
    # Validar JSON
    if not request.is_json:
        return jsonify({
            "exito": False,
            "mensaje": "Content-Type debe ser application/json"
        }), 400
    
    data = request.get_json()
    mensaje = data.get("message", "").strip()
    
    if not mensaje:
        return jsonify({
            "exito": False,
            "mensaje": "El campo 'message' es obligatorio"
        }), 400
    
    # Obtener o generar session_id
    session_id = data.get("session_id") or generar_session_id()
    usuario_id = data.get("usuario_id", "anonimo")
    rol = data.get("rol", "ventas")
    
    print(f"\n{'='*60}")
    print(f"[Flask API] Nueva petición")
    print(f"  Mensaje: {mensaje}")
    print(f"  Usuario: {usuario_id}")
    print(f"{'='*60}")
    
    # *** CRÍTICO: Llamar a Node.js ***
    respuesta_mcp = llamar_mcp_query(mensaje, usuario_id, rol)
    
    # Convertir al formato personalizado
    respuesta = convertir_respuesta_mcp(respuesta_mcp, session_id)
    
    print(f"[Flask API] Respuesta enviada - Éxito: {respuesta['exito']}")
    
    return jsonify(respuesta), 200