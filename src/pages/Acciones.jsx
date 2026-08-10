import { useEffect, useState } from 'react'
import { accionesApi, getEmpresaId, api } from '../lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const estadoColor = {
  pendiente: 'bg-slate-100 text-slate-700',
  en_progreso: 'bg-blue-100 text-blue-700',
  completada: 'bg-emerald-100 text-emerald-700',
  vencida: 'bg-red-100 text-red-700',
}

export default function Acciones() {
  const empresaId = getEmpresaId()
  const [acciones, setAcciones] = useState([])
  const [equipos, setEquipos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({ equipoId: '', descripcion: '', responsableId: '', fechaLimite: '' })

  function cargar() {
    accionesApi.listar(empresaId).then(setAcciones).catch((e) => setError(e.message))
    api.get(`/empresas/${empresaId}/equipos`).then(setEquipos).catch(() => {})
    api.get(`/empresas/${empresaId}/usuarios`).then(setUsuarios).catch(() => {})
  }

  useEffect(cargar, [empresaId])

  async function crear(e) {
    e.preventDefault()
    setError('')
    try {
      await accionesApi.crear(empresaId, form)
      setForm({ equipoId: '', descripcion: '', responsableId: '', fechaLimite: '' })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  async function cambiarEstado(accion, estado) {
    try {
      await accionesApi.actualizar(empresaId, accion.id, { estado })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Acciones</h2>
        <p className="mt-1 text-sm text-slate-500">Seguimiento de acciones con responsable y fecha límite.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Card>
        <CardHeader><CardTitle className="text-base">Nueva acción</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={crear} className="grid gap-3 md:grid-cols-2">
            <Select value={form.equipoId} onValueChange={(v) => setForm({ ...form, equipoId: v })}>
              <SelectTrigger><SelectValue placeholder="Equipo" /></SelectTrigger>
              <SelectContent>
                {equipos.map((eq) => <SelectItem key={eq.id} value={eq.id}>{eq.nombre}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={form.responsableId} onValueChange={(v) => setForm({ ...form, responsableId: v })}>
              <SelectTrigger><SelectValue placeholder="Responsable" /></SelectTrigger>
              <SelectContent>
                {usuarios.filter(u => u.activo).map((u) => <SelectItem key={u.id} value={u.id}>{u.nombre} ({u.rol})</SelectItem>)}
              </SelectContent>
            </Select>

            <Textarea
              className="md:col-span-2"
              placeholder="Descripción de la acción"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              required
            />

            <Input
              type="date"
              value={form.fechaLimite}
              onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })}
            />

            <Button type="submit">Crear acción</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Fecha límite</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acciones.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="max-w-xs truncate">{a.descripcion}</TableCell>
                  <TableCell>{a.equipo?.nombre}</TableCell>
                  <TableCell>{a.responsable?.nombre}</TableCell>
                  <TableCell>{a.fechaLimite ? new Date(a.fechaLimite).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    <Select value={a.estado} onValueChange={(v) => cambiarEstado(a, v)}>
                      <SelectTrigger className="w-36">
                        <Badge className={estadoColor[a.estado]}>{a.estado}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">pendiente</SelectItem>
                        <SelectItem value="en_progreso">en_progreso</SelectItem>
                        <SelectItem value="completada">completada</SelectItem>
                        <SelectItem value="vencida">vencida</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {acciones.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-8">Sin acciones registradas.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}