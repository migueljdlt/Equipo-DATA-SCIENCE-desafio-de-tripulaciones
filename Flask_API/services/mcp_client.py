import requests
from config.settings import MCP_SERVER_URL, REQUEST_TIMEOUT
def verificar_servidor_mcp():
    try:
        r = requests.get(f"{MCP_SERVER_URL}/health", timeout=5)
        return r.status_code == 200 and r.json().get("status") == "ok"
    except:
        return False
def llamar_mcp_query(pregunta, usuario_id="anonimo", rol="ventas"):
    payload = {
        "pregunta": pregunta,
        "usuario_id": usuario_id,
        "rol": rol
    }
    try:
        r = requests.post(
            f"{MCP_SERVER_URL}/api/query",
            json=payload,
            timeout=REQUEST_TIMEOUT
        )
        r.raise_for_status()
        return r.json()
    except requests.exceptions.Timeout:
        return {
            "exito": False,
            "tipo": "texto",
            "mensaje": "Timeout con el servidor MCP",
            "datos": [],
            "columnas": [],
            "sql_generado": None,
            "grafico": None
        }
    except Exception as e:
        return {
            "exito": False,
            "tipo": "texto",
            "mensaje": str(e),
            "datos": [],
            "columnas": [],
            "sql_generado": None,
            "grafico": None
        }