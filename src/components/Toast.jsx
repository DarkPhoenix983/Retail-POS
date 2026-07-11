import { Icono } from './Icono'

export function Toast ({ toast }) {
  if (!toast) return null

  return (
    <div className='fixed top-4 right-4 z-50 toast-enter'>
      <div
        className='px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium'
        style={{
          backgroundColor: toast.tipo === 'error' ? 'var(--color-danger)' : 'var(--color-success)',
          color: 'white',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <Icono tipo={toast.tipo === 'error' ? 'limpiar' : 'check'} className='w-4 h-4' />
        {toast.mensaje}
      </div>
    </div>
  )
}
