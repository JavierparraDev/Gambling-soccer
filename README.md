
# Proyecto de Backend con API-Football-chatbot 

Este proyecto es un servidor backend utilizando **Node.js** y **Express** que integra la API-Football para mostrar partidos y estadísticas deportivas mediante un widget. Además, incluye un chatbot funcional básico. Se implementa un sistema de autenticación mediante **Jsonwebtoken (JWT)**.
## Estructura del Proyecto

### Características API-Football

- Rutas para consumir los datos de la API-Football.
- Widget de fútbol para mostrar partidos en tiempo real.
- Configuración de las rutas y parámetros de la API.

### Características Chatbot

- El chatbot responde automáticamente a los usuarios con respuestas preconfiguradas.

### Sistema de Autenticación

- Sistema de autenticación con **JWT (Jsonwebtoken)** para la gestión de sesiones.

## Requisitos

Antes de clonar y ejecutar el proyecto, asegúrate de tener instalados los siguientes requisitos:

- [Node.js](https://nodejs.org) (versión LTS recomendada)
- [npm](https://www.npmjs.com/) (el gestor de paquetes de Node.js)
- [MongoDB](https://www.mongodb.com/)   
- Clave de la API de RapidAPI para API-Football.(key)

### Versiones utilizadas

- **Node.js**: v18.x.x (versión LTS) v20.17.0
- **npm**: v9.x.x  10.8.2
- **MongoDB**: 
- **git**: 2.34.1



### Instalaciones necesarias en WSL 

Este proyecto está configurado para ejecutarse en **WSL (Windows Subsystem for Linux)**, una capa de compatibilidad para ejecutar un entorno Linux en Windows. 

- **instala la distribución de Ubuntu (que es la recomendada).**

- Inicia Ubuntu desde el menú de inicio y asegúrate de actualizar los paquetes

```bash
sudo apt update && sudo apt upgrade

```

- Instala las versiones LTS de Node.js y npm usando NodeSource:



```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

```

- Verifica que se hayan instalado correctamente ejecutando:

```bash
node -v
npm -v

```

### Instrucciones para ejecutar el proyecto


#### Paso 1: Clonar el repositorio

Clona el repositorio desde GitHub:

```bash
git clone https://github.com/JavierparraDev/Gambling-soccer
```

#### Paso 2: Instalar dependencias
Una vez clonado el repositorio, entra en la carpeta del proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```bash
cd Gambling-soccer
npm install

```
#### Paso 3: Ejecutar el servidor
Para iniciar el servidor localmente, puedes usar el siguiente comando:
```bash
npm start  
nodemon index 
node index 
nodemon index.js
node index.js
```

```bash

```