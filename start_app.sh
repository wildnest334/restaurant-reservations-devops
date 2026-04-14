#!/bin/bash
# start_app.sh - inicia contenedores

echo "Iniciando aplicación..."

docker compose up -d

echo "Aplicación iniciada"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"