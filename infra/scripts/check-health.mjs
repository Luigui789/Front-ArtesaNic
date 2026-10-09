// Sonda técnica: consulta únicamente salud a través del servidor de Vite.
const frontend = process.env.FRONTEND_URL || "http://127.0.0.1:5173";
const api = process.env.VITE_API_URL || "/api/v1";
const url = new URL(`${api.replace(/\/$/, "")}/salud/`, frontend);
const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
if (!response.ok) throw new Error(`Salud respondió HTTP ${response.status}`);
const data = await response.json();
if (JSON.stringify(data) !== JSON.stringify({ estado: "ok" })) throw new Error("Respuesta de salud inesperada");
console.log(`OK: frontend → backend, GET ${url}, ${JSON.stringify(data)}`);
