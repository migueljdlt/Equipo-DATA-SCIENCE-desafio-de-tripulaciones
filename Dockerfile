# ====================================
# IMAGEN BASE CON CUDA PARA GPU
# ====================================
FROM nvidia/cuda:12.2.0-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive

# Variables de entorno para GPU
ENV NVIDIA_VISIBLE_DEVICES=all
ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility

# ====================================
# INSTALAR DEPENDENCIAS DEL SISTEMA
# ====================================
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y python3.11 python3-pip \
    && curl -fsSL https://ollama.com/install.sh | sh \
    && apt-get clean

# ====================================
# CONFIGURAR DIRECTORIOS
# ====================================
WORKDIR /app
RUN mkdir -p /app/logs

# ====================================
# COPIAR PROYECTO E INSTALAR DEPENDENCIAS
# ====================================
COPY . /app/

# Instalar dependencias Node.js
RUN npm install --legacy-peer-deps --ignore-scripts || true

# Instalar dependencias Python 
RUN pip3 install --no-cache-dir -r requirements.txt

# ====================================
# CONFIGURACIÓN SUPERVISOR
# ====================================
RUN echo "[supervisord]\n\
nodaemon=true\n\
logfile=/app/logs/supervisord.log\n\
loglevel=info\n\
\n\
[program:ollama]\n\
command=/usr/local/bin/ollama serve\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/app/logs/ollama.log\n\
stderr_logfile=/app/logs/ollama_error.log\n\
environment=OLLAMA_HOST=0.0.0.0:11434\n\
\n\
[program:nodejs]\n\
command=node server.js\n\
directory=/app\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/app/logs/nodejs.log\n\
stderr_logfile=/app/logs/nodejs_error.log\n\
environment=PORT=3001\n\
\n\
[program:flask]\n\
command=python3 app.py\n\
directory=/app/Flask_API\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/app/logs/flask.log\n\
stderr_logfile=/app/logs/flask_error.log" > /etc/supervisor/conf.d/supervisord.conf

EXPOSE 3001 5000 11434

# ====================================
# DESCARGAR MODELO QWEN3 (CON GPU)
# ====================================
RUN /usr/local/bin/ollama serve & \
    sleep 10 && \
    /usr/local/bin/ollama pull qwen3:8b && \
    pkill ollama

CMD ["/usr/bin/supervisord"]