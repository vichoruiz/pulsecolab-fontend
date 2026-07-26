export default function Chats() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Chats</h2>
        <p className="mt-1 text-sm text-slate-500">
          Vista reservada para la futura integración conversacional tipo WhatsApp.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto max-w-xl">
          <p className="text-lg font-medium text-slate-900">Próximamente</p>
          <p className="mt-2 text-sm text-slate-500">
            Aquí vivirá el historial conversacional de colaboradores con el agente, junto con
            contexto, seguimiento y trazabilidad de interacciones.
          </p>
        </div>
      </div>
    </div>
  )
}