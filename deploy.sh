#!/bin/bash

echo "Desplegando aplicación..."

docker compose down --remove-orphans
docker compose up --build -d

echo "Aplicación desplegada"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"