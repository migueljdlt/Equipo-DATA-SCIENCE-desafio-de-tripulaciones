def determinar_tipo_grafica(tipo_mcp, datos, columnas, grafico_mcp):
    if grafico_mcp and grafico_mcp.get("base64"):
        return grafico_mcp["tipo"], True, grafico_mcp["base64"]
    if not datos or not columnas:
        return None, False, None
    filas = len(datos)
    cols = len(columnas)
    if cols == 2 and 2 <= filas <= 6:
        return "pie", False, None
    if filas > 10:
        return "line", False, None
    if filas > 1:
        return "bar", False, None
    return None, False, None