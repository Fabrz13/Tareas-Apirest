📱 Administrador de Tareas Móvil
<h1 align="center">📱 Administrador de Tareas Móvil</h1><p align="center"> <strong>Una aplicación móvil elegante y funcional para gestionar tus tareas diarias, construida con React Native (Expo) y Laravel.</strong> </p><p align="center"> <img src="https://img.shields.io/badge/React_Native-Expo-blue?style=flat&logo=react" alt="React Native"> <img src="https://img.shields.io/badge/TypeScript-4.x-blue?style=flat&logo=typescript"> <img src="https://img.shields.io/badge/Laravel-10.x-red?style=flat&logo=laravel"> <img src="https://img.shields.io/badge/MySQL-5.7+-orange?style=flat&logo=mysql"> <img src="https://img.shields.io/badge/Status-En%20Desarrollo-yellow?style=flat"> </p>
🚀 Requisitos Previos
✅ Node.js 16.0 o superior

✅ Expo CLI

✅ PHP 8.0 o superior

✅ Composer

✅ MySQL

✅ Dispositivo móvil con Expo Go o emulador

⚙️ Instalación
Backend (API Laravel)

# 1. Navega al directorio del backend
cd backend

# 2. Instala dependencias de PHP
composer install

# 3. Copia el archivo de entorno
cp .env.example .env

✍️ Configura tu archivo .env con los datos de conexión a base de datos

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=taskflow_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

# 4. Genera la clave de aplicación
php artisan key:generate

# 5. Ejecuta migraciones
php artisan migrate

# 6. Inicia el servidor de desarrollo
php artisan serve --host=0.0.0.0 --port=8000

🌐 La API estará disponible en:
http://localhost:8000/api

Frontend (App Móvil)

# 1. Instala dependencias de Node.js
npm install

# 2. Configura la URL de la API en src/services/api.ts
const API_BASE_URL = 'http://TU_IP_LOCAL:8000/api';

# 3. Inicia la aplicación Expo
npx expo start

📱 Escanea el código QR con la app Expo Go en tu dispositivo móvil

🔗 Endpoints de la API
📋 Tareas

Método	  Endpoint	          Descripción
GET	    /api/todos	      Listar todas las tareas
POST	  /api/todos	      Crear una nueva tarea
DELETE	/api/todos/{id}	  Eliminar una tarea

🏷️ Categorías
Método	  Endpoint	      Descripción
GET	    /api/categories	Listar todas las categorías

📱 Características de la App Móvil:

🎨 Interfaz moderna con colores atractivos

🔍 Búsqueda en tiempo real

🏷️ Filtrado por categorías y prioridad

📊 Estadísticas de completado

✨ Animaciones y gestos para eliminar

🌙 Modo claro con colores optimizados

🛠️ Tecnologías Utilizadas:

Frontend: React Native, Expo, TypeScript, Axios

Backend: Laravel, PHP, MySQL

Estilo: React Native StyleSheet, Componentes personalizados

Gestos: React Native Gesture Handler

🧑‍💻 Autor
Desarrollado por Fabrizio Castro
📧 [fabriziocastros2003@gmail.com]
🔗 [Fabrz13]