// Credenciales guardadas en sessionStorage como header Basic Auth ya codificado.
// Esto es TEMPORAL: el backend solo soporta Basic Auth por ahora. Guardar
// user:pass (aunque sea en base64, no encriptado) en el navegador no es un
// mecanismo serio de auth para producción -- queda pendiente reemplazarlo
// por un login con token propio más adelante.
const STORAGE_KEY = 'biblio_auth'

export function getAuthHeader(): string | null {
  return sessionStorage.getItem(STORAGE_KEY)
}

export function setCredentials(username: string, password: string) {
  const encoded = btoa(`${username}:${password}`)
  sessionStorage.setItem(STORAGE_KEY, `Basic ${encoded}`)
}

export function clearCredentials() {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function isAuthenticated(): boolean {
  return getAuthHeader() !== null
}
