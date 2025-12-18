from flask import Blueprint, jsonify
import requests
from config.settings import MCP_SERVER_URL

metadata_bp = Blueprint("metadata", __name__)

@metadata_bp.route("/api/schema", methods=["GET"])
def get_schema():
    """Obtiene schema de la BD desde Node.js"""
    try:
        response = requests.get(f"{MCP_SERVER_URL}/api/schema", timeout=10)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@metadata_bp.route("/api/ejemplos", methods=["GET"])
def get_ejemplos():
    """Obtiene ejemplos desde Node.js"""
    try:
        response = requests.get(f"{MCP_SERVER_URL}/api/ejemplos", timeout=10)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500