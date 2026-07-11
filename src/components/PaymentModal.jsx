import { Icono } from './Icono'

export function PaymentModal ({
  mostrarPago,
  setMostrarPago,
  totalArticulos,
  total,
  pagoCon,
  setPagoCon,
  procesarCobro,
  inputPagoRef
}) {
  if (!mostrarPago) return null

  return (
    <div className='modal-overlay' onClick={() => setMostrarPago(false)}>
      <div className='modal-card modal-animate' onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
          Procesar Cobro
        </h2>
        <p style={{ fontSize: '0.85rem', marginBottom: '20px', color: 'var(--color-text-muted)' }}>
          {totalArticulos} artículo{totalArticulos !== 1 ? 's' : ''} en la venta
        </p>

        {/* Total a cobrar */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '16px',
            borderRadius: '14px',
            background: 'var(--color-bg-input)'
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 4px' }}>Total a cobrar</p>
          <p style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--color-success)' }}>${total.toFixed(2)}</p>
        </div>

        {/* Input de pago */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            marginBottom: '8px'
          }}
          >
            El cliente paga con:
          </label>
          <input
            ref={inputPagoRef}
            type='number'
            value={pagoCon}
            onChange={(e) => setPagoCon(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const pagoNumero = parseFloat(pagoCon)
                if (pagoCon && pagoNumero >= total) {
                  procesarCobro()
                }
              }
            }}
            placeholder='0.00'
            className='input-field'
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              padding: '14px'
            }}
            min='0'
            step='0.01'
          />
        </div>

        {/* Botones de monto rápido */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {[20, 50, 100, 200, 500, 1000].map(monto => (
            <button
              key={monto}
              onClick={() => setPagoCon(monto.toString())}
              className='btn-outline'
              style={{
                padding: '10px 8px',
                fontSize: '0.9rem',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              ${monto}
            </button>
          ))}
          <button
            onClick={() => setPagoCon(total.toFixed(2))}
            className='btn-primary'
            style={{
              gridColumn: 'span 3',
              padding: '10px 8px',
              fontSize: '0.9rem',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Exacto
          </button>
        </div>

        {/* Cambio */}
        {pagoCon && parseFloat(pagoCon) >= total && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-success-light)',
            color: 'var(--color-success)',
            marginBottom: '20px',
            fontWeight: 600
          }}
          >
            <p style={{ margin: 0 }}>Cambio</p>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
              ${(parseFloat(pagoCon) - total).toFixed(2)}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            type='button'
            onClick={() => setMostrarPago(false)}
            className='btn-outline'
            style={{ flex: 1, padding: '12px', cursor: 'pointer' }}
          >
            Cancelar
          </button>
          <button
            onClick={procesarCobro}
            disabled={!pagoCon || parseFloat(pagoCon) < total}
            className='btn-success flex items-center justify-center gap-2'
            style={{ flex: 1, padding: '12px', cursor: 'pointer' }}
          >
            <Icono tipo='check' className='w-5 h-5' />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
