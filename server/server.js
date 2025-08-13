// server.js (drop-in)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { google } = require('googleapis');

const app = express();

// ====== CORS ======
const allowedOrigins = ["https://landing-asesorias-frontend.onrender.com"];
app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin)) ? cb(null, true) : cb(new Error("No autorizado por CORS")),
}));
app.use(express.json({ limit: "2mb" }));

// ====== Multer (memoria) ======
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

// ====== Auth Google ======
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // comparte esta carpeta con el servicio
if (!DRIVE_FOLDER_ID) {
  console.error("Falta GOOGLE_DRIVE_FOLDER_ID");
}

function buildGoogleAuth() {
  const scopes = ["https://www.googleapis.com/auth/drive.file"];

  // Modo 1: JSON completo en ENV (ej: GOOGLE_CREDENTIALS_JSON)
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    console.log("Auth Google: usando GOOGLE_CREDENTIALS_JSON");
    return new google.auth.GoogleAuth({ credentials: creds, scopes });
  }

  // Modo 2: Secret file montado
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY && process.env.GOOGLE_KEYFILE_PATH) {
    console.log("Auth Google: usando keyFile:", process.env.GOOGLE_KEYFILE_PATH);
    return new google.auth.GoogleAuth({ keyFile: process.env.GOOGLE_KEYFILE_PATH, scopes });
  }

  // Tu caso original:
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.log("Auth Google: usando keyFile /etc/secrets/Service-account.json");
    return new google.auth.GoogleAuth({ keyFile: '/etc/secrets/Service-account.json', scopes });
  }

  throw new Error("No hay credenciales de Google configuradas");
}

const auth = buildGoogleAuth();

// ====== Helpers ======
function pickFilesFromReq(req) {
  // Acepta 'file' (single) o 'files' (array)
  // con upload.any() vendrán todos en req.files
  if (Array.isArray(req.files) && req.files.length > 0) return req.files;
  // compat si usas upload.single('file')
  if (req.file) return [req.file];
  return [];
}

// ====== Rutas ======

// acepta 'file' o 'files'
app.post("/api/upload-to-drive", upload.any(), async (req, res) => {
  try {
    const files = pickFilesFromReq(req);
    if (files.length === 0) {
      return res.status(400).json({ ok: false, error: "No se recibió ningún archivo (usa el campo 'file' o 'files')." });
    }
    if (!DRIVE_FOLDER_ID) {
      return res.status(500).json({ ok: false, error: "Falta GOOGLE_DRIVE_FOLDER_ID" });
    }

    const drive = google.drive({ version: "v3", auth });
    const clientName = (req.body.nombreCliente || "").toString().trim();
    const clientLastName = (req.body.apellidoCliente || "").toString().trim();

    const uploaded = [];
    for (const f of files) {
      const safeName = [clientName, clientLastName, Date.now(), f.originalname].filter(Boolean).join("-");
      const createResp = await drive.files.create({
        requestBody: {
          name: safeName,
          parents: [DRIVE_FOLDER_ID],
        },
        media: {
          mimeType: f.mimetype,
          body: Buffer.from(f.buffer),
        },
        fields: "id,name",
      });

      const fileId = createResp.data.id;

      // compartir por enlace (opcional)
      await drive.permissions.create({
        fileId,
        requestBody: { role: "reader", type: "anyone" },
      });

      const { data: getData } = await drive.files.get({
        fileId,
        fields: "webViewLink, webContentLink",
      });

      uploaded.push({
        id: fileId,
        name: createResp.data.name,
        webViewLink: getData.webViewLink,
        webContentLink: getData.webContentLink,
      });
    }

    return res.json({ ok: true, message: "Archivos subidos correctamente", files: uploaded });
  } catch (err) {
    console.error("Upload error:", {
      message: err.message,
      code: err.code,
      errors: err.errors,
      data: err.response?.data,
      status: err.response?.status,
    });
    return res.status(500).json({
      ok: false,
      error: err.response?.data?.error?.message || err.message || "Error interno al subir a Drive",
    });
  }
});

app.post('/api/polizas', (req, res) => {
  res.json({ ok: true, message: "Poliza recibida correctamente" });
});

// Health (útil para Render)
app.get("/health", (_req, res) => res.json({ ok: true }));

// ====== Start ======
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`CORS permitido: ${allowedOrigins.join(", ")}`);
});
