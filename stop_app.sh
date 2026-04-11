#!/bin/bash
# stop_app.sh - detiene y elimina los contenedores
echo "⏹️  Deteniendo aplicación..."
docker-compose down
echo "✅ Aplicación detenida"