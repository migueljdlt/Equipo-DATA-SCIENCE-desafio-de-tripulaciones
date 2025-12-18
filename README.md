# Chatbot SQL + Charts 📊

Sistema inteligente de chatbot conversacional que permite realizar consultas a bases de datos mediante lenguaje natural, generando automáticamente código SQL optimizado y visualizaciones de datos en tiempo real. Utiliza modelos de inteligencia artificial (LLM) para interpretar preguntas complejas, ejecutar consultas en PostgreSQL (mediante MCP) y crear gráficos dinámicos en formato base64, facilitando el análisis de datos sin necesidad de conocimientos técnicos en SQL o programación.

## 🚀 Características

- **Generación de SQL con IA**: Usa Ollama + Qwen3 para convertir lenguaje natural en SQL
- **Gráficos automáticos**: Genera pie charts, barras, líneas y columnas en formato base64
- **Arquitectura modular**: Node.js + Flask API + PostgreSQL
- **MCP Protocol**: Integración con Model Context Protocol de Anthropic
- **Base de datos real**: PostgreSQL en Render
- **Sistema de aprendizaje**: Cache de consultas exitosas para mejorar generación SQL
- **Glosarios matemáticos**: Soporte para operaciones matemáticas complejas (porcentajes, promedios, rankings)


## 🏗️ Estructura del proyecto
```
Equipo-DATA-SCIENCE-desafio-de-tripulaciones/
│
├── .env                      # Variables de entorno (NO SUBIR)
├── .env.example             # Template de variables
├── .gitignore               # Archivos ignorados por Git
├── package.json             # Dependencias Node.js
├── requirements.txt         # Dependencias Python
├── server.js                # Punto de entrada Node.js
├── README.md                # Este archivo
│
├── src/                     # Backend Node.js
│   ├── config/
│   │   ├── constants.js     # Schema, glosarios, tipos
│   │   ├── database.js      # Config PostgreSQL
│   │   └── ollama.js        # Config Ollama
│   │
│   ├── services/
│   │   ├── mcpClient.js     # Cliente MCP PostgreSQL
│   │   ├── ollamaService.js # Servicio Ollama
│   │   └── sqlService.js    # Generación y formateo SQL
│   │
│   ├── charts/
│   │   ├── chartGenerator.js # Generador de gráficos
│   │   └── chartUtils.js     # Utilidades gráficos
│   │
│   ├── routes/
│   │   ├── index.js         # Router principal
│   │   ├── queryRoutes.js   # Rutas de consultas
│   │   ├── chartRoutes.js   # Rutas de gráficos
│   │   └── infoRoutes.js    # Info y metadata
│   │
│   ├── utils/
│   │   ├── sqlValidator.js  # Validación SQL
│   │   ├── dataFormatter.js # Formateo datos
│   │   └── helpers.js       # Funciones auxiliares
│   │
│   └── app.js               # App Express principal
│
└── Flask_API/               # API Flask
    ├── config/
    │   └── settings.py      # Configuración Flask
    │
    ├── routes/
    │   ├── chat.py          # Endpoint principal
    │   ├── health.py        # Health checks
    │   └── metadata.py      # Schema y ejemplos
    │
    ├── services/
    │   └── mcp_client.py    # Cliente Node.js
    │
    ├── utils/
    │   ├── formatter.py     # Formato de respuestas
    │   └── session.py       # Gestión de sesiones
    │
    └── app.py               # App Flask principal
```


## 🛠️ Tecnologías

### Backend (Node.js)
- Express.js v4.18.2
- MCP SDK v1.0.0 (Model Context Protocol)
- Chart.js v4.4.6 + chartjs-node-canvas v5.0.0
- PostgreSQL (pg v8.16.3)
- Ollama API
- dotenv v16.0.0

### API (Flask)
- Flask v3.1.2
- Flask-CORS v6.0.2
- Requests v2.32.3

### Base de datos
- PostgreSQL (Render)
- **Tablas**: 
  - `employees` - Empleados
  - `customers` - Clientes
  - `products` - Productos
  - `sales` - Ventas

### IA/ML
- Ollama (servidor local)
- Modelo: Qwen3:8b

## 📦 Instalación

### Requisitos previos
- Node.js v24.x o superior
- Python 3.13+
- Ollama instalado localmente
- Acceso a base de datos PostgreSQL

### 1. Clonar repositorio
```bash
git clone https://github.com/migueljdlt/Equipo-DATA-SCIENCE-desafio-de-tripulaciones
cd Equipo-DATA-SCIENCE-desafio-de-tripulaciones
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env` y configura tus credenciales:
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
DATABASE_URL=postgresql://usuario:password@host:5432/database
```

### 3. Instalar dependencias Node.js
```bash
npm install --legacy-peer-deps
```

### 4. Instalar dependencias Python
```bash
# Crear entorno virtual
python -m venv venv_flask

# Activar entorno virtual
# Windows:
.\venv_flask\Scripts\activate
# Linux/Mac:
source venv_flask/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 5. Instalar y configurar Ollama
```bash
# Descargar desde https://ollama.ai

# Descargar modelo Qwen3
ollama pull qwen3:8b

# Verificar que funciona
ollama run qwen3:8b "Hola"
```

## 🚀 Uso

### Iniciar servicios

#### Terminal 1 - Ollama (debe estar corriendo primero)
```bash
# Ya está corriendo como servicio en segundo plano
# Si no, ejecuta: ollama serve
```

#### Terminal 2 - Node.js Server
```bash
node server.js
```

Deberías ver:
```
============================================================
   CHATBOT SQL + CHARTS - BASE DE DATOS RENDER
============================================================
>> API: http://localhost:3001
>> BD: database_final_project (Render)
>> Graficos: bar, column, line, pie
```

#### Terminal 3 - Flask API
```bash
# Activar entorno virtual
.\venv_flask\Scripts\activate  # Windows
source venv_flask/bin/activate  # Linux/Mac

# Iniciar Flask
python Flask_API/app.py
```

Deberías ver:
```
============================================================
   FLASK API - CHATBOT DE VENTAS
============================================================
Flask API:        http://localhost:5000
```

### Hacer una consulta
```python
import requests

response = requests.post(
    "http://localhost:5000/api/chat",
    json={
        "message": "Dame un gráfico pie chart de ventas por mes",
        "usuario_id": "test",
        "rol": "ventas"
    },
    timeout=60
)

result = response.json()
print(f"SQL generado: {result['sql_generado']}")
print(f"Tiene gráfica: {result['tiene_grafica']}")

# La imagen está en base64
if result['grafica_base64']:
    import base64
    from PIL import Image
    from io import BytesIO
    
    base64_str = result['grafica_base64'].split(',')[1]
    image_data = base64.b64decode(base64_str)
    image = Image.open(BytesIO(image_data))
    
```

## 📡 Endpoints

### Flask API (Puerto 5000)

#### POST `/api/chat`
Enviar consulta al chatbot

**Request:**
```json
{
  "message": "¿Cuántas ventas hay en enero?",
  "usuario_id": "test",
  "rol": "ventas"
}
```

**Response:**
```json
{
  "exito": true,
  "session_id": "uuid",
  "mensaje": "Se encontraron 150 ventas en enero",
  "sql_generado": "SELECT COUNT(*) FROM sales WHERE...",
  "datos": [{"count": 150}],
  "columnas": ["count"],
  "total_filas": 1,
  "tipo_grafica": null,
  "tiene_grafica": false,
  "grafica_base64": null
}
```

#### GET `/health`
Health check del sistema

#### GET `/api/schema`
Obtener schema de la base de datos

#### GET `/api/ejemplos`
Obtener ejemplos de consultas

### Node.js Server (Puerto 3001)

#### POST `/api/query`
Procesar query SQL directamente

#### POST `/api/chart`
Generar gráfico desde datos

#### GET `/api/chart/types`
Tipos de gráficos disponibles

## 📊 Ejemplos de consultas

El chatbot entiende lenguaje natural:
```
✅ "¿Cuántas ventas hay en total?"
✅ "Top 5 empleados con más ventas"
✅ "Gráfico de barras de ventas por producto"
✅ "Dame un pie chart de ventas por método de pago"
✅ "Calcula el 5% de las ventas totales"
✅ "¿Cuál es el promedio de ventas por empleado?"
✅ "Ventas que superan el promedio"
✅ "Participación porcentual de cada región"
✅ "Gráfico de líneas de ventas por mes"
✅ "Top 10% de productos más vendidos"
```

## 🔧 Troubleshooting

### Error: "Cannot find module 'dotenv'"
```bash
npm install dotenv --legacy-peer-deps
```

### Error: "Puerto 3001 en uso"
```powershell
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Error: "Ollama no responde"
```bash
# Verificar que Ollama está corriendo
ollama list

# Reiniciar Ollama
# Windows: Cerrar desde el systray y abrir de nuevo
# Linux/Mac: systemctl restart ollama
```

### Gráficos no se generan
1. Verificar que `chartjs-node-canvas` está instalado
2. Ver logs del servidor Node.js
3. Verificar que los datos tienen el formato correcto

## 🎓 Proyecto académico

Desarrollado como parte del bootcamp de **Data Science en TheBridge**.

### Desafío de tripulaciones
Proyecto colaborativo entre equipos de:
- 📊 **Data Science** - Análisis y modelo SQL
- 💻 **Full Stack** - Integración frontend/backend
- 🔒 **Cybersecurity** - Seguridad y validación

### Objetivos del proyecto
- ✅ Aplicar conocimientos de bases de datos SQL
- ✅ Integrar IA (LLMs) para procesamiento de lenguaje natural
- ✅ Crear APIs REST profesionales
- ✅ Generar visualizaciones dinámicas
- ✅ Trabajo en equipo multidisciplinar

## 📚 Aprendizajes clave

- **Model Context Protocol (MCP)**: Integración con herramientas de IA
- **Prompt Engineering**: Diseño de prompts para generación SQL
- **API Design**: Arquitectura modular y escalable
- **Data Visualization**: Generación dinámica de gráficos
- **DevOps**: Manejo de entornos, dependencias y deploy

## 🔐 Seguridad

- ✅ Variables sensibles en `.env` (no en Git)
- ✅ Validación estricta de SQL (solo SELECT)
- ✅ Prevención de inyección SQL
- ✅ CORS configurado correctamente
- ✅ Timeout en peticiones

## 🚀 Próximas mejoras

- [ ] Deploy en producción (Render/Railway)
- [ ] Frontend React para interfaz visual
- [ ] Autenticación de usuarios
- [ ] Cache de consultas frecuentes
- [ ] Tests automatizados
- [ ] CI/CD con GitHub Actions
- [ ] Soporte para más modelos LLM
- [ ] Exportar gráficos en múltiples formatos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👤 Autores
- [Miguel de la Torre](https://github.com/migueljdlt), [Luna Pérez Troncoso](https://github.com/LunaPerezT), [Álvaro Martínez](https://github.com/Alvaro-mval), [Rosenila Vega](https://github.com/Rosinela-v), [Jose Vila](https://github.com/joseevila), [Juan Pablo Rizzi](https://github.com/rizzijp), [Alejandro Cerro](https://github.com/alc98)

- Proyecto (Data Science): [Equipo-DATA-SCIENCE-desafio-de-tripulaciones](https://github.com/migueljdlt/Equipo-DATA-SCIENCE-desafio-de-tripulaciones)
- Proyecto (Full Stack): [https://github.com/carlgomezro-spec/desafio-tripulaciones.git]
- Proyecto (Ciberseguridad): [https://github.com/Davott17/Desafio-Tripulaciones-Ciberseguridad]

## 📝 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 🙏 Agradecimientos

- **TheBridge** - Por el bootcamp y el desafío
- **Anthropic** - Por el protocolo MCP
- **Ollama** - Por facilitar el uso de LLMs locales

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub