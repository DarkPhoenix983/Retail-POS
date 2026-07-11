import { Icono } from './Icono'

export function ProductGrid ({
  busqueda,
  setBusqueda,
  categorias,
  categoriaActiva,
  setCategoriaActiva,
  productos,
  agregarAlCarrito,
  inputBusquedaRef
}) {
  return (
    <div className='flex-1 flex flex-col overflow-hidden p-5'>
      {/* Barra de búsqueda */}
      <div className='flex gap-3 mb-4'>
        <div className='flex-1 relative'>
          <div className='absolute left-4 top-1/2 -translate-y-1/2' style={{ color: 'var(--color-text-muted)' }}>
            <Icono tipo='buscar' className='w-5 h-5' />
          </div>
          <input
            ref={inputBusquedaRef}
            type='text'
            placeholder='Buscar producto por nombre, categoría o código... (F2)'
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className='input-field'
            style={{ paddingLeft: '44px', fontSize: '1rem', padding: '14px 16px 14px 44px' }}
          />
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className='flex gap-2 mb-4 flex-wrap'>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`category-pill ${categoriaActiva === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
        {productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
      </p>

      {/* Grid de productos */}
      <div className='flex-1 overflow-y-scroll pr-1'>
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {productos.map(producto => {
            const esBajoStock = producto.stock > 0 && producto.stock <= 5
            const esSinStock = producto.stock === 0

            return (
              <button
                key={producto.id}
                onClick={() => agregarAlCarrito(producto)}
                className={`product-card group ${esBajoStock ? 'low-stock' : ''}`}
                style={{ opacity: esSinStock ? 0.5 : 1 }}
                disabled={esSinStock}
              >
                <div className='flex justify-between items-start mb-3'>
                  <span className='badge badge-category' style={{ fontSize: '0.8rem', padding: '3px 12px' }}>
                    {producto.categoria}
                  </span>
                  <span
                    className={
                    esSinStock
                      ? 'badge-stock-none'
                      : esBajoStock
                        ? 'badge-stock-low'
                        : 'badge-stock-ok'
                  } style={{ fontSize: '0.85rem' }}
                  >
                    Stock: {producto.stock}
                  </span>
                </div>
                <h3 style={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  marginBottom: '4px',
                  lineHeight: '1.3',
                  color: 'var(--color-text-primary)'
                }}
                >
                  {producto.nombre}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                  Código: {producto.codigo}
                </p>
                <div className='flex justify-between items-center'>
                  <span style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)'
                  }}
                  >
                    ${producto.precio.toFixed(2)}
                  </span>
                  {!esSinStock && (
                    <span className='p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity' style={{ backgroundColor: 'var(--color-primary)' }}>
                      <Icono tipo='mas' className='w-5 h-5 text-white' />
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {productos.length === 0 && (
          <div className='flex flex-col items-center justify-center py-16'>
            <Icono tipo='buscar' className='w-14 h-14 mb-3' style={{ color: 'var(--color-text-muted)' }} />
            <p style={{ fontWeight: 500, fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>No se encontraron productos</p>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>Intenta con otro término de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
