import { useState, useEffect } from 'react'
import { obtenerHistorialVentas, eliminarVenta } from '../services/db'

export function SalesHistoryPanel ({ mostrarToast }) {
  const [ventas, setVentas] = useState([])
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Cargar ventas al montar el componente
  useEffect(() => {
    cargarVentas()
  }, [])

  const cargarVentas = async () => {
    try {
      setCargando(true)
      const data = await obtenerHistorialVentas()
      setVentas(data)
    } catch (e) {
      console.error(e)
      mostrarToast('Error al cargar el historial', 'error')
    } finally {
      setCargando(false)
    }
  }
  const handleEliminarVenta = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm(`¿Estás seguro de eliminar la venta #${id}? Esta acción restaurará el stock de los productos.`)) {
      return
    }

    try {
      setCargando(true)
      await eliminarVenta(id)
      mostrarToast('Venta eliminada correctamente', 'success')
      cargarVentas()
      if (ventaSeleccionada && ventaSeleccionada.id === id) {
        setVentaSeleccionada(null)
      }
    } catch (e) {
      console.error(e)
      mostrarToast('Error al eliminar la venta', 'error')
      setCargando(false)
    }
  }

  // Vista de detalle de una venta
  if (ventaSeleccionada) {
    return (
      <div className='flex-1 p-6 overflow-y-auto' style={{ backgroundColor: 'var(--color-bg-main)' }}>
        <div
          className='max-w-2xl mx-auto' style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div className='flex items-center justify-between mb-6'>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Venta #{ventaSeleccionada.id}
            </h2>
            <button
              onClick={() => setVentaSeleccionada(null)}
              className='btn-outline'
              style={{ padding: '6px 16px', fontSize: '0.8rem' }}
            >
              Volver al historial
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            {new Date(ventaSeleccionada.fecha).toLocaleString('es-MX')}
          </p>

          {/* Tabla de items */}
          <table className='inventory-table'>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>P. Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {ventaSeleccionada.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.precio_unitario.toFixed(2)}</td>
                  <td style={{ fontWeight: 500 }}>${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Resumen */}
          <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'var(--color-bg-input)' }}>
            <div className='flex justify-between' style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Total:</span>
              <span style={{ color: 'var(--color-success)' }}>${ventaSeleccionada.total.toFixed(2)}</span>
            </div>
            <div className='flex justify-between' style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Pago con:</span>
              <span>${ventaSeleccionada.pago_con.toFixed(2)}</span>
            </div>
            <div className='flex justify-between' style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Cambio:</span>
              <span style={{ color: 'var(--color-warning)' }}>${ventaSeleccionada.cambio.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Vista principal: lista de ventas
  return (
    <div className='flex-1 flex flex-col p-6 overflow-hidden' style={{ backgroundColor: 'var(--color-bg-main)' }}>
      <div className='flex justify-between items-center mb-5'>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          Historial de Ventas
        </h2>
        <button onClick={cargarVentas} className='btn-outline' style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Actualizar
        </button>
      </div>

      <div
        className='flex-1 overflow-y-auto rounded-xl' style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <table className='inventory-table'>
          <thead>
            <tr>
              <th># Venta</th>
              <th>Fecha</th>
              <th>Articulos</th>
              <th>Total</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => (
              <tr key={venta.id}>
                <td style={{ fontWeight: 500 }}>#{venta.id}</td>
                <td>{new Date(venta.fecha).toLocaleString('es-MX')}</td>
                <td>{venta.items.length} producto{venta.items.length !== 1 ? 's' : ''}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                  ${venta.total.toFixed(2)}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => setVentaSeleccionada(venta)}
                    className='btn-outline'
                    style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                  >
                    Ver detalle
                  </button>
                  <button
                    onClick={(e) => handleEliminarVenta(venta.id, e)}
                    className='btn-outline'
                    style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '8px', marginLeft: '8px', borderColor: '#ef4444', color: '#ef4444' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {ventas.length === 0 && (
              <tr>
                <td
                  colSpan='5' style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: 'var(--color-text-muted)'
                  }}
                >
                  {cargando ? 'Cargando ventas...' : 'No hay ventas registradas aun.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
