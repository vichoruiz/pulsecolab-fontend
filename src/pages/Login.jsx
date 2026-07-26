import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [token, setToken] = useState('')
  const [empresaId, setEmpresaId] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem('pulsecolab_token', token.trim())
    localStorage.setItem('pulsecolab_empresa_id', empresaId.trim())
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-semibold text-slate-900">PulseColab AI</h1>
          <p className="text-sm text-slate-500">Acceso interno para ADMIN / HRBP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">JWT token</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="min-h-32 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-500"
              placeholder="Pega aquí el token"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Empresa ID</label>
            <input
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              placeholder="UUID de empresa"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
