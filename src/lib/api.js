const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function getToken() {
  return localStorage.getItem('pulsecolab_token')
}

export function getEmpresaId() {
  return localStorage.getItem('pulsecolab_empresa_id')
}

async function apiFetch(path, options = {}) {
  const token = getToken()

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    let message = `Error ${response.status}`
    try {
      const data = await response.json()
      message = data.message || message
    } catch {}
    throw new Error(message)
  }

  return response.json()
}

export function decodeToken() {
  const token = getToken()
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function getUserRole() {
  return decodeToken()?.rol || null
}

export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
}

export const preguntasApi = {
  listar: (empresaId) => api.get(`/empresas/${empresaId}/preguntas-checkin`),
  crear: (empresaId, data) => api.post(`/empresas/${empresaId}/preguntas-checkin`, data),
}

export const medicionesApi = {
  listar: (empresaId) => api.get(`/empresas/${empresaId}/mediciones`),
  crear: (empresaId, equipoId, origen) =>
    api.post(`/empresas/${empresaId}/equipos/${equipoId}/mediciones`, { origen }),
  analisis: (empresaId, medicionId) =>
    api.get(`/empresas/${empresaId}/mediciones/${medicionId}/analisis`),
}

export const accionesApi = {
  listar: (empresaId) => api.get(`/empresas/${empresaId}/acciones`),
  crear: (empresaId, data) => api.post(`/empresas/${empresaId}/acciones`, data),
  actualizar: (empresaId, accionId, data) => api.patch(`/empresas/${empresaId}/acciones/${accionId}`, data),
}

export const conversacionesApi = {
  listar: (empresaId) => api.get(`/empresas/${empresaId}/conversaciones`),
  detalle: (empresaId, conversacionId) => api.get(`/empresas/${empresaId}/conversaciones/${conversacionId}`),
}

export const aprobacionesApi = {
  listar: (empresaId) => api.get(`/empresas/${empresaId}/aprobaciones`),
  resolver: (empresaId, aprobacionId, decision) =>
    api.patch(`/empresas/${empresaId}/aprobaciones/${aprobacionId}`, { decision }),
}