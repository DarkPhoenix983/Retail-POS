import { Icono } from './Icono'

export function ReceiptModal ({
  ventaCompletada, setVentaCompletada
}) {
  if (!ventaCompletada) return null

  return (
    <div className='modal-overlay' onClick={() => setVentaCompletada(null)}>
      <div
        className='modal-card modal-animate'
        style={{ maxWidth: '300px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono de exito */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '14px',
              borderRadius: '50%',
              marginBottom: '12px',
              background: 'var(--color-success-light)'
            }}
          >
            <Icono
              tipo='check'
              className='w-10 h-10'
              style={{ color: 'var(--color-success)' }}
            />
          </div>

          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--color-success)',
              margin: '0 0 4px'
            }}
          >
            ¡Venta Completada!
          </h2>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              margin: 0
            }}
          >
            {new Date(ventaCompletada.fecha).toLocaleString('es-MX')}
          </p>
        </div>

        {/* Detalle de items */}
        <div
          style={{
            marginBottom: '16px',
            padding: '14px',
            borderRadius: '12px',
            background: 'var(--color-bg-input)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          {ventaCompletada.items.map((item, i) => (
            <div
              key={i}
              className='flex justify-between'
              style={{ fontSize: '0.85rem' }}
            >
              <span style={{ color: 'var(--color-text-secondary)' }}>
                {item.cantidad}x {item.nombre}
              </span>
              <span
                style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}
              >
                ${(item.precio * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Resumen financiero */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '0.9rem'
          }}
        >
          <div
            className='flex justify-between'
            style={{ fontWeight: 700, fontSize: '1.1rem' }}
          >
            <span style={{ color: 'var(--color-text-primary)' }}>Total: </span>
            <span style={{ color: 'var(--color-success)' }}>
              ${ventaCompletada.total.toFixed(2)}
            </span>
          </div>
          <div className='flex justify-between'>
            <span style={{ color: 'var(--color-text-muted)' }}>Pago con: </span>
            <span style={{ color: 'var(--color-text-primary)' }}>
              ${ventaCompletada.pagoCon.toFixed(2)}
            </span>
          </div>
          <div className='flex justify-between' style={{ fontWeight: 600 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Cambio:</span>
            <span style={{ color: 'var(--color-warning)' }}>
              ${ventaCompletada.cambio.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setVentaCompletada(null)}
          className='btn-outline'
          style={{ width: '100%', marginTop: '20px', padding: '12px', cursor: 'pointer' }}
        >
          Cerrar (ESC)
        </button>
      </div>
    </div>
  )
}
