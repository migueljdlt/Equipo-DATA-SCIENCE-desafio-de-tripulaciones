def determinar_tipo_grafica(tipo_mcp, datos, columnas, grafico_mcp):
    """Determina el tipo de gráfica"""
    # Si Node.js generó gráfico, usar ese
    if grafico_mcp and isinstance(grafico_mcp, dict):
        if 'base64' in grafico_mcp and grafico_mcp['base64']:
            return grafico_mcp['tipo'], True, grafico_mcp['base64']
    
    # Si es tipo gráfico pero no hay base64
    if tipo_mcp == 'grafico':
        num_filas = len(datos) if datos else 0
        if 2 <= num_filas <= 6:
            return "pie", False, None
        elif num_filas > 10:
            return "line", False, None
        else:
            return "bar", False, None
    
    return None, False, None


def convertir_respuesta_mcp(respuesta_mcp, session_id):
    """
    Convierte la respuesta de Node.js al formato personalizado del frontend
    """
    exito = respuesta_mcp.get('exito', False)
    tipo_mcp = respuesta_mcp.get('tipo', 'texto')
    mensaje = respuesta_mcp.get('mensaje', '')
    datos = respuesta_mcp.get('datos', [])
    columnas = respuesta_mcp.get('columnas', [])
    sql_generado = respuesta_mcp.get('sql_generado')
    grafico_mcp = respuesta_mcp.get('grafico')
    
    total_filas = len(datos) if isinstance(datos, list) else 0
    
    # Determinar tipo de gráfica
    tipo_grafica, tiene_grafica, grafica_base64 = determinar_tipo_grafica(
        tipo_mcp, datos, columnas, grafico_mcp
    )
    
    return {
        "exito": exito,
        "session_id": session_id,
        "mensaje": mensaje,
        "sql_generado": sql_generado,
        "datos": datos,
        "columnas": columnas,
        "total_filas": total_filas,
        "tipo_grafica": tipo_grafica,
        "tiene_grafica": tiene_grafica,
        "grafica_base64": grafica_base64
    }