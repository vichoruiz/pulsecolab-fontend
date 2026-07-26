import { useEffect, useState } from 'react'
import { api, getEmpresaId } from '../lib/api'

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const empresaId = getEmpresaId()

  useEffect(() => {
    api
      .get(`/empresas/${empresaId}/dashboard`)
      .then(setData)
      .catch((err) => setError(err.message))
  }, [empresaId])

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  }

  if (!data) {
    return <div className="text-sm text-slate-500">Cargando dashboard...</div>
  }

  const { empresa, totales, porEquipo } = data

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">{empresa.nombre}</h2>
        <p className="mt-1 text-sm text-slate-500">
          {empresa.industria} · Estado: {empresa.estado}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Equipos" value={totales.equipos} />
        <MetricCard label="Colaboradores activos" value={totales.colaboradoresActivos} />
        <MetricCard label="Check-ins" value={totales.mediciones} />
        <MetricCard label="Respuestas" value={totales.respuestas} />
        <MetricCard label="Análisis completados" value={totales.analisisCompletados} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Vista por equipo</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Equipo</th>
                <th className="px-5 py-3 font-medium">Mediciones</th>
                <th className="px-5 py-3 font-medium">Respuestas</th>
                <th className="px-5 py-3 font-medium">Último estado</th>
              </tr>
            </thead>
            <tbody>
              {porEquipo.map((equipo) => (
                <tr key={equipo.equipoId} className="border-t border-slate-200">
                  <td className="px-5 py-4 text-slate-900">{equipo.nombre}</td>
                  <td className="px-5 py-4 text-slate-600">{equipo.mediciones}</td>
                  <td className="px-5 py-4 text-slate-600">{equipo.respuestas}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {equipo.ultimoEstado}
                    </span>
                  </td>
                </tr>
              ))}
              {porEquipo.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-slate-500">
                    No hay equipos registrados aún.
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