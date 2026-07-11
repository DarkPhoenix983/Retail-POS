import { Icono } from './Icono'

export function Cart ({
  carrito,
  totalArticulos,
  total,
  cambiarCantidad,
  eliminarDelCarrito,
  limpiarCarrito,
  abrirPago,
}) {
  return (
    <div className='cart-panel'>
      {/* Header del carrito */}
      <div
        className='flex items-center justify-between px-5 py-4'
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className='flex items-center gap-2'>
          <Icono tipo='carrito' className='w-6 h-6' style={{ color: 'var(--color-text-secondary)' }} />
          <h2 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-primary)', margin: 0 }}>
            Venta Actual
          </h2>
          {totalArticulos > 0 && (
            <span className='badge-count' style={{ fontSize: '0.8rem', padding: '2px 10px' }}>
              {totalArticulos}
            </span>
          )}
        </div>
        {carrito.length > 0 && (
          <button
            onClick={limpiarCarrito}
            className='p-2 rounded-lg transition-colors cursor-pointer'
            style={{ color: 'var(--color-danger)' }}
            title='Limpiar carrito'
          >
            <Icono tipo='limpiar' className='w-5 h-5' />
          </button>
        )}
      </div>

      {/* Lista de items */}
      <div className='flex-1 overflow-y-auto p-4 space-y-2'>
        {carrito.length === 0
          ? (
            <div className='flex flex-col items-center justify-center h-full'>
              <Icono tipo='carrito' className='w-14 h-14 mb-3' style={{ color: 'var(--color-text-muted)' }} />
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                El carrito está vacío
              </p>
              <p style={{ fontSize: '0.9rem', marginTop: '4px', color: 'var(--color-text-muted)' }}>
                Haz clic en un producto para agregarlo
              </p>
            </div>
            )
          : (
              carrito.map((item) => (
                <div key={item.id} className='cart-item'>
                  <div className='flex-1 min-w-0'>
                    <p style={{
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0
                    }}
                    >
                      {item.nombre}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                      ${item.precio.toFixed(2)} c/u
                    </p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <button
                      onClick={() => cambiarCantidad(item.id, -1)}
                      className='p-2 rounded-lg transition-colors cursor-pointer'
                      style={{
                        backgroundColor: 'var(--color-bg-input)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <Icono tipo='menos' className='w-4 h-4' />
                    </button>
                    <span style={{
                      width: '36px',
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)'
                    }}
                    >
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => cambiarCantidad(item.id, 1)}
                      className='p-2 rounded-lg transition-colors cursor-pointer'
                      style={{
                        backgroundColor: 'var(--color-bg-input)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)'
                      }}
                    >
                      <Icono tipo='mas' className='w-4 h-4' />
                    </button>
                  </div>
                  <div className='text-right'>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      margin: 0
                    }}
                    >
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </p>
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className='cursor-pointer transition-colors'
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-danger)',
                        background: 'none',
                        border: 'none',
                        marginTop: '2px',
                        fontFamily: 'inherit'
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))
            )}
      </div>

      {/* Footer con total y botón de cobro */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg-card)'
      }}
      >
        <div style={{ marginBottom: '12px' }}>
          <div className='flex justify-between' style={{ fontSize: '0.95rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Artículos:</span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{totalArticulos}</span>
          </div>
          <div className='flex justify-between' style={{ fontSize: '1.3rem', fontWeight: 700 }}>
            <span style={{ color: 'var(--color-text-primary)' }}>Total:</span>
            <span style={{ color: 'var(--color-success)' }}>${total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={abrirPago}
          disabled={carrito.length === 0}
          className='btn-success flex items-center justify-center gap-2'
          style={{ width: '100%', fontSize: '1.1rem', padding: '14px 20px' }}
        >
          <Icono tipo='dinero' className='w-6 h-6' />
          Cobrar (Enter)
        </button>
      </div>
    </div>
  )
}
