#  Restaurant Reservations DevOps Project

##  Descripción

Este proyecto consiste en el desarrollo y despliegue de una aplicación web para la gestión de reservaciones de un restaurante, aplicando prácticas de DevOps.

La aplicación está compuesta por:

* **Frontend:** Interfaz web servida con Nginx
* **Backend:** API REST desarrollada con Node.js y Express
* **Base de datos:** MongoDB
* **Infraestructura:** Docker, Docker Compose y AWS EC2
* **Almacenamiento:** Amazon S3 para logs

---

##  Arquitectura

```
Usuario → Frontend (Nginx) → Backend (Node.js) → MongoDB
                                   ↓
                                 Logs → EC2 → S3
```

---

##  Tecnologías utilizadas

* Node.js
* Express
* MongoDB
* Docker
* Docker Compose
* AWS EC2
* Amazon S3
* Bash (automatización)
* Cron (tareas programadas)

---

##  Despliegue de la aplicación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/restaurant-reservations-devops.git
cd restaurant-reservations-devops
```

---

### 2. Ejecutar despliegue

```bash
chmod +x deploy.sh
./deploy.sh
```

---

### 3. Acceso a la aplicación

* Frontend: `http://<IP_PUBLICA>:3000`
* Backend: `http://<IP_PUBLICA>:5000`

---

##  Docker Compose

La aplicación se ejecuta con tres servicios:

* **backend**
* **frontend**
* **db (MongoDB)**

Se utiliza un volumen para persistir los datos de MongoDB y un bind mount para los logs:

```yaml
volumes:
  - /home/ec2-user/restaurant-reservations-devops/backend/logs:/app/logs
```

Esto permite almacenar los logs fuera del contenedor.

---

##  Scripts de automatización (Bash)

Se implementaron los siguientes scripts:

###  deploy.sh

Construye y levanta los contenedores:

```bash
docker compose down --remove-orphans
docker compose build --no-cache
docker compose up -d
```

---

###  start_app.sh

Inicia la aplicación:

```bash
docker compose up -d
```

---

###  stop_app.sh

Detiene la aplicación:

```bash
docker compose down
```

---

##  Automatización con cron

Se configuraron tareas programadas en Linux:

```bash
crontab -e
```

Ejemplo:

```bash
0 9 * * * /home/ec2-user/restaurant-reservations-devops/start_app.sh
0 22 * * * /home/ec2-user/restaurant-reservations-devops/stop_app.sh
```

Esto automatiza el encendido y apagado de la aplicación.

---

##  Uso de Amazon S3

Se creó un bucket para almacenar logs del sistema.

### Subida manual:

```bash
aws s3 cp ~/restaurant-reservations-devops/backend/logs/app.log s3://restaurant-reservations-logs-ariel/
```

---

### Automatización:

```bash
*/5 * * * * aws s3 cp /home/ec2-user/restaurant-reservations-devops/backend/logs/app.log s3://restaurant-reservations-logs-ariel/
```

---

##  Verificación

### Contenedores activos:

```bash
docker ps
```

### Logs:

```bash
cat backend/logs/app.log
```

---

##  Seguridad (Security Groups)

Para permitir el acceso a la aplicación, se deben abrir los siguientes puertos en AWS:

* **3000** → Frontend
* **5000** → Backend
* **27017** → MongoDB (opcional, solo para pruebas)

---

##  Problemas encontrados y soluciones

###  Logs no visibles en EC2

**Causa:** No se había configurado un volumen en Docker
**Solución:** Se agregó un bind mount en docker-compose

---

###  Error de conexión a MongoDB

**Causa:** Uso incorrecto de localhost
**Solución:** Uso de hostname del servicio (`db`)

---

###  Docker Compose no aplicaba cambios

**Solución:** Uso de `--force-recreate` y rutas absolutas

---

##  Conclusión

Se logró implementar un flujo completo de DevOps que incluye:

* Contenerización de la aplicación
* Despliegue en la nube (AWS EC2)
* Persistencia de datos
* Automatización con Bash y cron
* Integración con servicios cloud (S3)

---

##  Autor

Ariel Martínez

---
