import { useEffect, useState } from 'react'
import { api, getEmpresaId } from '../lib/api'

export default function Equipos() {
  const [equipos, setEquipos] = useState([])
  const [error, setError] = useState('')
  const empresaId = getEmpresaId()

  useEffect(() => {
    api
      .get(`/empresas/${empresaId}/equipos`)
      .then(setEquipos)
      .catch((err) => setError(err.message))
  }, [empresaId])

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Equipos</h2>
        <p className="mt-1 text-sm text-slate-500">Vista simple de equipos y cantidad de miembros.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {equipos.map((equipo) => (
          <div key={equipo.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">{equipo.nombre}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Miembros: {equipo.miembros?.length || 0}
            </p>
          </div>
        ))}

        {equipos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
            No hay equipos disponibles.
          </div>
        )}
      </div>
    </div>
  )
}
