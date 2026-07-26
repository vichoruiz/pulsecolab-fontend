import { useEffect, useState } from 'react'
import { api, getEmpresaId } from '../lib/api'

const initialForm = {
  email: '',
  nombre: '',
  rol: 'COLABORADOR',
}

export default function Usuarios() {
  const empresaId = getEmpresaId()
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function cargarUsuarios() {
    api
      .get(`/empresas/${empresaId}/usuarios`)
      .then(setUsuarios)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    cargarUsuarios()
  }, [empresaId])

  async function crearUsuario(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post(`/empresas/${empresaId}/usuarios`, form)
      setForm(initialForm)
      cargarUsuarios()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function toggleActivo(usuario) {
    setError('')
    try {
      if (usuario.activo) {
        await api.delete(`/empresas/${empresaId}/usuarios/${usuario.id}`)
      } else {
        await api.patch(`/empresas/${empresaId}/usuarios/${usuario.id}`, { activo: true })
      }
      cargarUsuarios()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Usuarios</h2>
        <p className="mt-1 text-sm text-slate-500">CRUD básico de usuarios internos por empresa.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-slate-900">Crear usuario</h3>

        <form onSubmit={crearUsuario} className="grid gap-4 md:grid-cols-4">
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Nombre"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Email"
            required
          />
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="COLABORADOR">COLABORADOR</option>
            <option value="LIDER">LIDER</option>
            <option value="HRBP">HRBP</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Crear usuario'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Listado</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-t border-slate-200">
                  <td className="px-5 py-4 text-slate-900">{usuario.nombre}</td>
                  <td className="px-5 py-4 text-slate-600">{usuario.email}</td>
                  <td className="px-5 py-4 text-slate-600">{usuario.rol}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        usuario.activo
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActivo(usuario)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {usuario.activo ? 'Desactivar' : 'Reactivar'}
                    </button>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-slate-500">
                    No hay usuarios cargados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}