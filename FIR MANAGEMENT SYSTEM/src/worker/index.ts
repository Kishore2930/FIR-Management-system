import { Hono } from "hono";
import { GoogleGenAI } from "@google/genai";
import type { Env } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// Get all FIR cases
app.get("/api/cases", async (c) => {
  try {
    const result = await c.env.DB.prepare(
      `SELECT * FROM fir_cases ORDER BY created_at DESC`
    ).all();

    return c.json(result.results || []);
  } catch (error) {
    console.error("Error fetching cases:", error);
    return c.json({ error: "Failed to fetch cases" }, 500);
  }
});

// Get single FIR case by ID
app.get("/api/cases/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await c.env.DB.prepare(
      `SELECT * FROM fir_cases WHERE id = ?`
    ).bind(id).first();

    if (!result) {
      return c.json({ error: "Case not found" }, 404);
    }

    return c.json(result);
  } catch (error) {
    console.error("Error fetching case:", error);
    return c.json({ error: "Failed to fetch case" }, 500);
  }
});

// Create new FIR case
app.post("/api/cases", async (c) => {
  try {
    const data = await c.req.json();

    // Generate FIR number
    const yearMonth = new Date().toISOString().slice(0, 7).replace("-", "");
    const countResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM fir_cases WHERE fir_number LIKE ?`
    ).bind(`FIR-${yearMonth}-%`).first();

    const count = (countResult?.count as number) || 0;
    const firNumber = `FIR-${yearMonth}-${String(count + 1).padStart(3, "0")}`;

    const result = await c.env.DB.prepare(
      `INSERT INTO fir_cases (
        fir_number, complainant_name, complainant_address, complainant_phone,
        incident_subject, incident_description, incident_location,
        incident_date, incident_time, witnesses, suspect_info, property_involved,
        status, priority, assigned_to
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *`
    )
      .bind(
        firNumber,
        data.complainant_name,
        data.complainant_address,
        data.complainant_phone,
        data.incident_subject,
        data.incident_description,
        data.incident_location,
        data.incident_date,
        data.incident_time,
        data.witnesses || "",
        data.suspect_info || "",
        data.property_involved || "",
        data.status || "Pending Review",
        data.priority || "Medium",
        data.assigned_to || ""
      )
      .first();

    return c.json(result);
  } catch (error) {
    console.error("Error creating case:", error);
    return c.json({ error: "Failed to create case" }, 500);
  }
});

// Update FIR case
app.put("/api/cases/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();

    const result = await c.env.DB.prepare(
      `UPDATE fir_cases SET
        complainant_name = COALESCE(?, complainant_name),
        complainant_address = COALESCE(?, complainant_address),
        complainant_phone = COALESCE(?, complainant_phone),
        incident_subject = COALESCE(?, incident_subject),
        incident_description = COALESCE(?, incident_description),
        incident_location = COALESCE(?, incident_location),
        incident_date = COALESCE(?, incident_date),
        incident_time = COALESCE(?, incident_time),
        witnesses = COALESCE(?, witnesses),
        suspect_info = COALESCE(?, suspect_info),
        property_involved = COALESCE(?, property_involved),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        assigned_to = COALESCE(?, assigned_to),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING *`
    )
      .bind(
        data.complainant_name ?? null,
        data.complainant_address ?? null,
        data.complainant_phone ?? null,
        data.incident_subject ?? null,
        data.incident_description ?? null,
        data.incident_location ?? null,
        data.incident_date ?? null,
        data.incident_time ?? null,
        data.witnesses ?? null,
        data.suspect_info ?? null,
        data.property_involved ?? null,
        data.status ?? null,
        data.priority ?? null,
        data.assigned_to ?? null,
        id
      )
      .first();

    if (!result) {
      return c.json({ error: "Case not found" }, 404);
    }

    return c.json(result);
  } catch (error) {
    console.error("Error updating case:", error);
    return c.json({ error: "Failed to update case" }, 500);
  }
});

// Delete FIR case
app.delete("/api/cases/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await c.env.DB.prepare(
      `DELETE FROM fir_cases WHERE id = ? RETURNING *`
    ).bind(id).first();

    if (!result) {
      return c.json({ error: "Case not found" }, 404);
    }

    return c.json({ success: true, deleted: result });
  } catch (error) {
    console.error("Error deleting case:", error);
    return c.json({ error: "Failed to delete case" }, 500);
  }
});

// OCR endpoint to extract FIR details from uploaded document
app.post("/api/ocr/extract-fir", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return c.json({ error: "No file uploaded" }, 400);
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let binary = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64Data = btoa(binary);
    console.log("Base64 conversion done, size:", base64Data.length);

    // Determine mime type
    const mimeType = file.type || "image/jpeg";

    // Initialize Gemini AI
    const apiKey = c.env.GEMINI_API_KEY;
    console.log("API Key loaded:", apiKey ? "Yes" : "No");
    if (!apiKey) {
      return c.json({ error: "API key not configured" }, 500);
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    // List of models to try in order of preference
    const modelIds = [
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-2.0-flash-exp"
    ];

    let lastError: any = null;
    console.log("Starting model fallback loop with models:", modelIds.join(", "));

    for (const modelId of modelIds) {
      try {
        console.log(`>>> Attempting extraction with model: [${modelId}]`);
        const response = await ai.models.generateContent({
          model: modelId,
          contents: [
            {
              text: `You are an AI assistant helping to extract information from FIR (First Information Report) complaint letters and documents. 

Analyze the uploaded document and extract the following information:

1. Complainant name
2. Complainant address
3. Complainant phone number
4. Incident subject/nature of complaint
5. Incident description (detailed)
6. Incident location
7. Incident date
8. Incident time
9. Witnesses (if mentioned)
10. Suspect information (if mentioned)
11. Property/items involved (if mentioned)

Return the information in JSON format with these exact keys:
{
  "complainant_name": "extracted name or empty string",
  "complainant_address": "extracted address or empty string",
  "complainant_phone": "extracted phone or empty string",
  "incident_subject": "brief subject or empty string",
  "incident_description": "detailed description or empty string",
  "incident_location": "location or empty string",
  "incident_date": "date in YYYY-MM-DD format or empty string",
  "incident_time": "time in HH:MM format or empty string",
  "witnesses": "witnesses information or empty string",
  "suspect_info": "suspect information or empty string",
  "property_involved": "property/items information or empty string"
}

If any field cannot be determined from the document, use an empty string. Be thorough and extract all available information.`,
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const extractedData = JSON.parse(response.text || "{}");
        console.log(`Extraction successful with model: ${modelId}`);
        return c.json(extractedData);
      } catch (error) {
        console.error(`Extraction error with model ${modelId}:`, error);
        lastError = error;
        // Continue to next model if this one fails
      }
    }

    // If all models failed
    return c.json(
      {
        error: "Failed to extract information from document with all attempted models",
        details: lastError instanceof Error ? lastError.message : String(lastError),
        stack: lastError instanceof Error ? lastError.stack : undefined
      },
      500
    );
  } catch (error) {
    console.error("Critical OCR error:", error);
    return c.json({
      error: "Internal server error during OCR setup",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// POST /api/auth/register
app.post("/api/auth/register", async (c) => {
  try {
    const data = await c.req.json();
    if (!data.email || !data.password || !data.name) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    const hash = await hashPassword(data.password);
    const result = await c.env.DB.prepare(
      `INSERT INTO users (email, password_hash, name, role, department, phone, badge) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, email, name, role`
    ).bind(data.email, hash, data.name, data.role || 'Officer', data.department || '', data.phone || '', data.badge || '').first();
    return c.json(result);
  } catch (error: any) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "Email already exists" }, 400);
    }
    console.error("Error creating user:", error);
    return c.json({ error: "Failed to register" }, 500);
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (c) => {
  try {
    const data = await c.req.json();
    if (!data.email || !data.password) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    const hash = await hashPassword(data.password);
    const user = await c.env.DB.prepare(
      `SELECT id, email, name, role, badge, department, phone, status FROM users WHERE email = ? AND password_hash = ?`
    ).bind(data.email, hash).first();

    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    return c.json({ user });
  } catch (error) {
    console.error("Error logging in:", error);
    return c.json({ error: "Failed to login" }, 500);
  }
});

// GET /api/officers
app.get("/api/officers", async (c) => {
  try {
    const officers = await c.env.DB.prepare(
      `SELECT id, email, name, role, badge, department, phone, cases, status FROM users ORDER BY name ASC`
    ).all();
    return c.json(officers.results || []);
  } catch (error) {
    console.error("Error fetching officers:", error);
    return c.json({ error: "Failed to fetch officers" }, 500);
  }
});

// PUT /api/officers/:id
app.put("/api/officers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();

    const result = await c.env.DB.prepare(
      `UPDATE users SET
        name = COALESCE(?, name),
        role = COALESCE(?, role),
        department = COALESCE(?, department),
        phone = COALESCE(?, phone),
        badge = COALESCE(?, badge),
        status = COALESCE(?, status)
      WHERE id = ?
      RETURNING id, email, name, role, department, phone, badge, status, cases`
    )
      .bind(
        data.name ?? null,
        data.role ?? null,
        data.department ?? null,
        data.phone ?? null,
        data.badge ?? null,
        data.status ?? null,
        id
      )
      .first();

    if (!result) {
      return c.json({ error: "Officer not found" }, 404);
    }

    return c.json(result);
  } catch (error) {
    console.error("Error updating officer:", error);
    return c.json({ error: "Failed to update officer" }, 500);
  }
});

export default app;
