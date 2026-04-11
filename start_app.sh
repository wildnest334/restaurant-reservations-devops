#!/bin/bash
# start_app.sh - levanta los contenedores ya construidos
echo "▶️  Iniciando aplicación..."
docker-compose up -d
echo "✅ Aplicación iniciada"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:5000"