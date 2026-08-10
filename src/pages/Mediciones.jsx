import { useEffect, useState } from 'react'
import { medicionesApi, getEmpresaId, api } from '../lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Mediciones() {
  const empresaId = getEmpresaId()
  const [mediciones, setMediciones] = useState([])
  const [equipos, setEquipos] = useState([])
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function cargar() {
    medicionesApi.listar(empresaId).then(setMediciones).catch((e) => setError(e.message))
    api.get(`/empresas/${empresaId}/equipos`).then(setEquipos).catch(() => {})
  }

  useEffect(cargar, [empresaId])

  async function crear() {
    if (!equipoSeleccionado) return
    setLoading(true)
    setError('')
    try {
      await medicionesApi.crear(empresaId, equipoSeleccionado, 'manual')
      cargar()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Mediciones</h2>
        <p className="mt-1 text-sm text-slate-500">Lanza check-ins manuales por equipo y revisa su estado.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lanzar nueva medición</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Select value={equipoSeleccionado} onValueChange={setEquipoSeleccionado}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecciona un equipo" />
            </SelectTrigger>
            <SelectContent>
              {equipos.map((eq) => (
                <SelectItem key={eq.id} value={eq.id}>{eq.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={crear} disabled={loading || !equipoSeleccionado}>
            {loading ? 'Creando...' : 'Crear medición'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Respuestas</TableHead>
                <TableHead>Análisis</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediciones.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.equipoNombre}</TableCell>
                  <TableCell><Badge variant="outline">{m.origen}</Badge></TableCell>
                  <TableCell>{m.totalRespuestas}</TableCell>
                  <TableCell>{m.tieneAnalisis ? 'Sí' : 'No'}</TableCell>
                  <TableCell>{m.estado}</TableCell>
                </TableRow>
              ))}
              {mediciones.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-8">Sin mediciones aún.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}