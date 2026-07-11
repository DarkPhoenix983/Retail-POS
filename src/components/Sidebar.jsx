import { Icono } from './Icono'

export function Sidebar ({
  vistaActiva,
  setVistaActiva,
  resumenDia,
  resetearVentas,
  nombreTienda
}) {
  const navItems = [
    { id: 'pos', label: 'Punto de Venta', icono: 'tienda' },
    { id: 'inventario', label: 'Inventario', icono: 'inventario' },
    { id: 'configuracion', label: 'configuracion', icono: 'config' }
  ]

  return (
    <aside className='sidebar'>
      {/* logo */}
      <div className='sidebar-logo'>
        <div className='flex items-center gap-3'>
          <div
            className='p-2 rounded-xl'
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Icono tipo='tienda' className='w-5 h-5 text-white' />
          </div>
          <div>
            <h1>{nombreTienda}</h1>
            <p>Sistema de Ventas</p>
          </div>
        </div>
      </div>

      <nav className='sidebar-nav'>
        <p
          style={{
            fontSize: '0.70rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '8px 16px 4px',
            margin: 0
          }}
        >
          Menu Principal
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setVistaActiva(item.id)}
            className={`sidebar-nav-item ${vistaActiva === item.id ? 'active' : ''}`}
          >
            <Icono tipo={item.icono} className='nav-icon' />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className='sidebar-footer'>
        <div className='sidebar-stats'>
          <p className='stats-label'>Ventas de Hoy</p>
          <p className='stats-value'>${resumenDia?.totalVentas?.toFixed(2) || '0.00'}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Cant: {resumenDia?.cantidadVentas || 0}
          </p>
        </div>
        <button
          onClick={resetearVentas}
          className='sidebar-nav-item'
          style={{
            color: 'var(--color-danger)',
            fontSize: '0.8rem',
            padding: '8px 12px',
            marginTop: '4px',
            borderRadius: '8px'
          }}
        >
          <Icono tipo='limpiar' className='w-4 h-4' style={{ color: 'var(--color-danger)' }} />
          <span>Resetear Ventas</span>
        </button>
      </div>
    </aside>
  )
}
