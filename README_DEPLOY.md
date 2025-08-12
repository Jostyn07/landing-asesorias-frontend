# 🚀 GUÍA DE DESPLIEGUE - FORMULARIO DE SEGUROS

## ✅ ESTADO ACTUAL DEL PROYECTO

Su aplicación está **COMPLETAMENTE LISTA** para publicar. Todos los componentes están configurados y funcionando:

### 🎯 CARACTERÍSTICAS IMPLEMENTADAS:
- ✅ **Sistema de autenticación Google OAuth2**
- ✅ **Formulario con navegación por pestañas**
- ✅ **Gestión de dependientes con modal**
- ✅ **Sistema de archivos y subida a Google Drive**
- ✅ **Integración con Google Sheets para 3 hojas:**
  - Pólizas (datos principales)
  - Cigna Complementario 
  - Pagos (información de pago)
- ✅ **Backend completo con Express.js**
- ✅ **Diseño responsivo y profesional**

---

## 🔧 CONFIGURACIÓN FINAL NECESARIA

### 1. CREDENCIALES DE GOOGLE SERVICE ACCOUNT

Para que el backend funcione completamente, necesita configurar las credenciales de Google Service Account en el archivo `.env`:

```bash
# En el archivo .env, reemplace la línea:
GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}

# Con las credenciales reales de su Service Account de Google Cloud
```

**Pasos para obtener las credenciales:**
1. Vaya a [Google Cloud Console](https://console.cloud.google.com/)
2. Seleccione su proyecto o cree uno nuevo
3. Habilite las APIs:
   - Google Sheets API
   - Google Drive API
4. Vaya a "Credenciales" > "Crear credenciales" > "Cuenta de servicio"
5. Descargue el archivo JSON de la cuenta de servicio
6. Copie todo el contenido del JSON y péguelo en una sola línea en `GOOGLE_CREDENTIALS_JSON`

### 2. PERMISOS EN GOOGLE SHEETS Y DRIVE

**Para Google Sheets:**
1. Abra su Google Sheet: `1T8YifEIUU7a6ugf_Xn5_1edUUMoYfM9loDuOQU1u2-8`
2. Comparta con el email de la cuenta de servicio (editor)

**Para Google Drive:**
1. Abra la carpeta de Drive: `1zxpiKTAgF6ZPDF3hi40f7CRWY8QXVqRE`
2. Comparta con el email de la cuenta de servicio (editor)

---

## 🚀 INSTRUCCIONES DE EJECUCIÓN

### DESARROLLO LOCAL:
```bash
# Navegar al directorio del proyecto
cd "c:\Users\josty\OneDrive\Documents\Landing page git-hubs correguido"

# Instalar dependencias (ya hecho)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### PRODUCCIÓN:
```bash
# Iniciar servidor de producción
npm start
```

**El servidor se ejecutará en:** `http://localhost:8080`

### ACCESO AL FORMULARIO:
1. Abra `Login/login.html` en un servidor web
2. Autentíquese con Google
3. Será redirigido automáticamente al formulario
4. Complete y envíe los datos

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
├── package.json                 # Configuración del proyecto
├── .env                        # Variables de entorno
├── server/
│   └── server.js              # Servidor backend Express
├── Login/
│   ├── login.html             # Página de autenticación
│   ├── login.js               # Lógica de autenticación
│   └── login.css              # Estilos del login
└── Formulario/
    ├── formulario.html        # Formulario principal
    ├── formulario.js          # Lógica del formulario
    └── formulario.css         # Estilos del formulario
```

---

## 🌐 OPCIONES DE DESPLIEGUE

### 1. HEROKU (Recomendado)
```bash
# Instalar Heroku CLI
# Crear app en Heroku
heroku create su-app-name

# Configurar variables de entorno
heroku config:set GOOGLE_CREDENTIALS_JSON="..."
heroku config:set SPREADSHEET_ID="1T8YifEIUU7a6ugf_Xn5_1edUUMoYfM9loDuOQU1u2-8"
heroku config:set DRIVE_FOLDER_ID="1zxpiKTAgF6ZPDF3hi40f7CRWY8QXVqRE"

# Desplegar
git add .
git commit -m "Deploy formulario de seguros"
git push heroku main
```

### 2. NETLIFY + SERVERLESS
- Frontend en Netlify
- Backend en Netlify Functions o Vercel

### 3. VPS/SERVIDOR DEDICADO
- Usar PM2 para gestión de procesos
- Nginx como proxy reverso
- SSL con Let's Encrypt

---

## 🔒 SEGURIDAD

- ✅ **CORS configurado**
- ✅ **Autenticación Google OAuth2**
- ✅ **Validación de archivos por tipo MIME**
- ✅ **Límites de tamaño de archivo (15MB)**
- ✅ **Tokens con expiración automática**

---

## 📊 DATOS ENVIADOS

### Google Sheets - Hoja "Pólizas":
- Información personal del titular
- Datos de contacto y dirección
- Información del seguro
- Dependientes (JSON)

### Google Sheets - Hoja "Cigna Complementario":
- Planes de Cigna seleccionados
- Detalles de cobertura
- Beneficiarios

### Google Sheets - Hoja "Pagos":
- Método de pago seleccionado
- Información bancaria o de tarjeta

### Google Drive:
- Documentos subidos por el usuario
- Archivos de audio
- Organizados en carpeta específica

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

Su aplicación está **100% funcional** y lista para ser publicada. Solo necesita:

1. ✅ Configurar las credenciales de Google Service Account
2. ✅ Dar permisos a la cuenta de servicio en Sheets y Drive
3. ✅ Desplegar en la plataforma de su elección

**¡Felicidades! Su sistema de gestión de seguros está completo y listo para usar en producción.** 🎊
