import { useState } from 'react'
import { Icono } from './Icono'
import { agregarProducto, actualizarProducto, eliminarProducto } from '../services/db'
import { normalizarTexto } from '../utils/normalize'

export function InventoryPanel ({
  productos,
  categorias = [],
  cargarProductos,
  mostrarToast
}) {
  const [busqueda, setBusqueda] = useState('')
  const [modo, setModo] = useState('lista')
  const [productoActual, setProductoActual] = useState(null)
  const [esNuevaCategoria, setEsNuevaCategoria] = useState(false)

  const categoriasFiltradas = Array.from(new Set([
    'Cuadernos',
    'Bolígrafos',
    'Arte',
    'Escritura',
    'Papelería',
    'Oficina',
    'Escolar',
    ...(categorias || []).filter(cat => cat !== 'Todas' && cat !== 'Todo')
  ])).sort()

  const productosFiltrados = productos.filter(p => {
    const termino = normalizarTexto(busqueda)
    return normalizarTexto(p.nombre).includes(termino) ||
            normalizarTexto(p.codigo).includes(termino) ||
            normalizarTexto(p.categoria).includes(termino)
  })

  const guardarProducto = async (e) => {
    e.preventDefault()
    try {
      const productoParaGuardar = { ...productoActual }
      if (!productoParaGuardar.codigo || productoParaGuardar.codigo.trim() === '') {
        productoParaGuardar.codigo = `SKU-${Date.now().toString().slice(-6)}`
      }

      const codigoNormalizado = (productoParaGuardar.codigo || '').trim().toLowerCase()
      const nombreNormalizado = (productoParaGuardar.nombre || '').trim().toLowerCase()

      if (modo === 'crear') {
        const duplicadoCodigo = productos.some(p => p.codigo.trim().toLowerCase() === codigoNormalizado)
        if (duplicadoCodigo) {
          mostrarToast('Ya existe un producto con este código de barras / SKU', 'error')
          return
        }

        const duplicadoNombre = productos.some(p => p.nombre.trim().toLowerCase() === nombreNormalizado)
        if (duplicadoNombre) {
          mostrarToast('Ya existe un producto con este nombre', 'error')
          return
        }
      } else if (modo === 'editar') {
        const duplicadoCodigo = productos.some(p => p.id !== productoParaGuardar.id && p.codigo.trim().toLowerCase() === codigoNormalizado)
        if (duplicadoCodigo) {
          mostrarToast('Ya existe otro producto con este código de barras / SKU', 'error')
          return
        }

        const duplicadoNombre = productos.some(p => p.id !== productoParaGuardar.id && p.nombre.trim().toLowerCase() === nombreNormalizado)
        if (duplicadoNombre) {
          mostrarToast('Ya existe otro producto con este nombre', 'error')
          return
        }
      }

      if (modo === 'crear') {
        await agregarProducto(productoParaGuardar)
        mostrarToast('Producto agregado exitosamente')
      } else if (modo === 'editar') {
        await actualizarProducto(productoParaGuardar)
        mostrarToast('Producto actualizado exitosamente')
      }
      setModo('lista')
      cargarProductos()
    } catch (e) {
      console.error(e)
      mostrarToast('Error al guardar el producto', 'error')
    }
  }

  const borrarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await eliminarProducto(id)
        mostrarToast('Producto eliminado')
        cargarProductos()
      } catch (e) {
        console.error(e)
        mostrarToast('Error al eliminar el producto', 'error')
      }
    }
  }

  if (modo === 'crear' || modo === 'editar') {
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
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              {modo === 'crear' ? 'Agregar Nuevo Producto' : 'Editar Producto'}
            </h2>
          </div>

          <form onSubmit={guardarProducto} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                  Nombre del Producto
                </label>
                <input
                  required
                  type='text'
                  value={productoActual.nombre}
                  onChange={e => setProductoActual({ ...productoActual, nombre: e.target.value })}
                  className='input-field'
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                  Código de Barras / SKU (Opcional)
                </label>
                <input
                  type='text'
                  placeholder='Se generará uno si se deja vacío'
                  value={productoActual.codigo}
                  onChange={e => setProductoActual({ ...productoActual, codigo: e.target.value })}
                  className='input-field'
                />
              </div>

              <div>
                <div className='flex justify-between items-center mb-1'>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                    Categoría
                  </label>
                  <button
                    type='button'
                    onClick={() => {
                      setEsNuevaCategoria(!esNuevaCategoria)
                      setProductoActual({ ...productoActual, categoria: '' })
                    }}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-primary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {esNuevaCategoria ? 'Seleccionar existente' : '+ Crear nueva'}
                  </button>
                </div>
                {esNuevaCategoria
                  ? (
                    <input
                      required
                      type='text'
                      placeholder='Escribe la nueva categoría'
                      value={productoActual.categoria}
                      onChange={e => setProductoActual({ ...productoActual, categoria: e.target.value })}
                      className='input-field'
                    />
                    )
                  : (
                    <select
                      required
                      value={productoActual.categoria}
                      onChange={e => setProductoActual({ ...productoActual, categoria: e.target.value })}
                      className='input-field'
                      style={{ appearance: 'auto', paddingRight: '24px' }}
                    >
                      <option value=''>-- Selecciona una categoría --</option>
                      {categoriasFiltradas.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                  Precio Venta ($)
                </label>
                <input
                  required
                  type='number'
                  step='0.01'
                  min='0'
                  value={productoActual.precio}
                  onChange={e => setProductoActual({ ...productoActual, precio: parseFloat(e.target.value) || 0 })}
                  className='input-field'
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                  Stock Disponible
                </label>
                <input
                  required
                  type='number'
                  min='0'
                  value={productoActual.stock}
                  onChange={e => setProductoActual({ ...productoActual, stock: parseInt(e.target.value, 10) || 0 })}
                  className='input-field'
                />
              </div>
            </div>

            <div className='pt-4 flex gap-3'>
              <button
                type='button'
                onClick={() => setModo('lista')}
                className='btn-outline'
                style={{ flex: 1, padding: '12px' }}
              >
                Cancelar
              </button>
              <button
                type='submit'
                className='btn-primary flex items-center justify-center gap-2'
                style={{ flex: 1 }}
              >
                <Icono tipo='check' className='w-4 h-4' />
                {modo === 'crear' ? 'Guardar Producto' : 'Actualizar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col p-6 overflow-hidden' style={{ backgroundColor: 'var(--color-bg-main)' }}>
      <div className='flex justify-between items-center mb-5'>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Gestión de Inventario
        </h2>
        <button
          onClick={() => {
            const catInicial = (categorias || []).filter(cat => cat !== 'Todas' && cat !== 'Todo')[0] || 'General'
            setProductoActual({ nombre: '', codigo: '', categoria: catInicial, precio: 0, stock: 0 })
            setEsNuevaCategoria(false)
            setModo('crear')
          }}
          className='btn-primary flex items-center gap-2'
          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
        >
          <Icono tipo='mas' className='w-4 h-4' /> Nuevo Producto
        </button>
      </div>

      <div className='mb-4 relative max-w-md'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2' style={{ color: 'var(--color-text-muted)' }}>
          <Icono tipo='buscar' />
        </div>
        <input
          type='text'
          placeholder='Buscar en el inventario...'
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className='input-field'
          style={{ paddingLeft: '40px' }}
        />
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
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(producto => (
              <tr key={producto.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {producto.codigo}
                </td>
                <td style={{ fontWeight: 500 }}>{producto.nombre}</td>
                <td>
                  <span className='badge badge-category'>{producto.categoria}</span>
                </td>
                <td style={{ fontWeight: 500 }}>${producto.precio.toFixed(2)}</td>
                <td>
                  <span className={producto.stock <= 5 ? 'badge-stock-low' : 'badge-stock-ok'}>
                    {producto.stock}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => {
                      setProductoActual(producto)
                      setEsNuevaCategoria(false)
                      setModo('editar')
                    }}
                    className='btn-outline'
                    style={{ padding: '4px 12px', fontSize: '0.75rem', marginRight: '8px', borderRadius: '8px' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => borrarProducto(producto.id)}
                    className='btn-outline'
                    style={{ padding: '4px 12px', fontSize: '0.75rem', color: 'var(--color-danger)', borderRadius: '8px' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {productosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan='6' style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: 'var(--color-text-muted)'
                  }}
                >
                  No se encontraron productos en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
