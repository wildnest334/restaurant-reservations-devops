#!/bin/bash
# stop_app.sh - detiene contenedores

echo "Deteniendo aplicación..."

docker compose down

echo "Aplicación detenida"