import { useEffect, useState } from 'react'
import { conversacionesApi, aprobacionesApi, getEmpresaId } from '../lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}

export default function Conversaciones() {
  const empresaId = getEmpresaId()
  const [conversaciones, setConversaciones] = useState([])
  const [activa, setActiva] = useState(null)
  const [detalle, setDetalle] = useState(null)
  const [aprobaciones, setAprobaciones] = useState([])
  const [error, setError] = useState('')
  const [aprobacionAbierta, setAprobacionAbierta] = useState(null)

  useEffect(() => {
    conversacionesApi.listar(empresaId).then((data) => {
      setConversaciones(data)
      if (data.length > 0) setActiva(data[0].id)
    }).catch((e) => setError(e.message))

    aprobacionesApi.listar(empresaId).then(setAprobaciones).catch(() => {})
  }, [empresaId])

  useEffect(() => {
    if (!activa) return
    conversacionesApi.detalle(empresaId, activa).then(setDetalle).catch((e) => setError(e.message))
  }, [activa, empresaId])

  async function resolver(aprobacionId, decision) {
    try {
      await aprobacionesApi.resolver(empresaId, aprobacionId, decision)
      const actualizadas = await aprobacionesApi.listar(empresaId)
      setAprobaciones(actualizadas)
    } catch (e) {
      setError(e.message)
    }
  }

  const pendientes = aprobaciones.filter((a) => a.estado === 'pendiente')
  const resueltas = aprobaciones.filter((a) => a.estado !== 'pendiente')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Conversaciones</h2>
        <p className="mt-1 text-sm text-slate-500">
          Inbox del agente conversacional. Canal WhatsApp simulado mientras no hay integración real.
        </p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardContent className="p-2">
            {conversaciones.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiva(c.id)}
                className={`w-full rounded-lg p-3 text-left text-sm transition ${
                  activa === c.id ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
                }`}
              >
                <div className="font-medium">{c.nombreContacto || c.telefono}</div>
                <div className={`mt-1 truncate text-xs ${activa === c.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {c.ultimoMensaje}
                </div>
              </button>
            ))}
            {conversaciones.length === 0 && (
              <p className="p-3 text-sm text-slate-500">No hay conversaciones aún.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            {detalle?.mensajes?.map((m) => (
              <div
                key={m.id}
                className={`max-w-md rounded-2xl px-4 py-2 text-sm ${
                  m.rol === 'usuario_externo'
                    ? 'bg-slate-100 text-slate-900'
                    : 'ml-auto bg-slate-900 text-white'
                }`}
              >
                {m.contenido}
                {m.tierAccion && (
                  <div className="mt-1 text-xs opacity-70">Tier {m.tierAccion}</div>
                )}
              </div>
            ))}
            {!detalle && <p className="text-sm text-slate-500">Selecciona una conversación.</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Aprobaciones pendientes del agente</h3>
          <div className="space-y-3">
            {pendientes.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="text-sm text-slate-900">{a.accionPropuesta}</p>
                  <div className="mt-1 flex gap-2">
                    <Badge variant="outline">Tier {a.tier}</Badge>
                    {a.requiereMutua && <Badge variant="outline">Requiere aprobación mutua</Badge>}
                    {a.aprobadorId && <Badge variant="outline">Ya aprobado por {a.aprobador?.nombre || '1 usuario'}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => resolver(a.id, 'rechazada')}>Rechazar</Button>
                  <Button size="sm" onClick={() => resolver(a.id, 'aprobada')}>Aprobar</Button>
                </div>
              </div>
            ))}
            {pendientes.length === 0 && (
              <p className="text-sm text-slate-500">No hay aprobaciones pendientes.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {resueltas.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 text-base font-semibold text-slate-900">Historial de decisiones</h3>
            <div className="space-y-2">
              {resueltas.map((a) => (
                <div key={a.id} className="rounded-lg border border-slate-200">
                  <button
                    onClick={() => setAprobacionAbierta(aprobacionAbierta === a.id ? null : a.id)}
                    className="flex w-full items-center justify-between p-3 text-left"
                  >
                    <span className="text-sm text-slate-900">{a.accionPropuesta}</span>
                    <Badge variant={a.estado === 'aprobada' ? 'default' : 'outline'}>
                      {ESTADO_LABEL[a.estado] || a.estado}
                    </Badge>
                  </button>
                  {aprobacionAbierta === a.id && (
                    <div className="border-t border-slate-100 p-3 text-xs text-slate-500 space-y-1">
                      <p>Tier: {a.tier}</p>
                      <p>Resuelto por: {a.aprobador?.nombre || '—'}</p>
                      {a.requiereMutua && <p>Confirmación mutua por: {a.aprobadorMutuo?.nombre || 'pendiente'}</p>}
                      <p>Fecha: {a.resueltoAt ? new Date(a.resueltoAt).toLocaleString('es-CL') : '—'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}