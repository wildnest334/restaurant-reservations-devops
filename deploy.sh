#!/bin/bash
# deploy.sh - construye y levanta todos los contenedores
echo "🚀 Desplegando aplicación..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d
echo "✅ Aplicación desplegada"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:5000"