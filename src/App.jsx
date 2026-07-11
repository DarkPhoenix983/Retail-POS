import { usePOS } from './Hooks/usePOS'
import { Sidebar } from './components/Sidebar'
import { ProductGrid } from './components/ProductGrid'
import { Cart } from './components/Cart'
import { PaymentModal } from './components/PaymentModal'
import { ReceiptModal } from './components/ReceiptModal'
import { InventoryPanel } from './components/InventoryPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { Toast } from './components/Toast'

function App () {
  const pos = usePOS()

  if (!pos.dbLista) {
    return (
      <div className='h-screen flex flex-col items-center justify-center space-y-4' style={{ backgroundColor: 'var(--color-bg-main)' }}>
        <div className='w-10 h-10 border-4 border-t-transparent rounded-full animate-spin' style={{ borderColor: 'var(--color-primary) transparent var(--color-primary) var(--color-primary)' }} />
        <p style={{ color: 'var(--color-text-secondary)' }}>Cargando Sistema POS...</p>
      </div>
    )
  }

  // Título dinámico según la vista
  const titulos = {
    pos: 'Punto de Venta',
    inventario: 'Inventario',
    configuracion: 'Configuración'
  }

  return (
    <div className='h-screen flex overflow-hidden'>
      {/* Sidebar Fijo a la Izquierda */}
      <Sidebar
        vistaActiva={pos.vistaActiva}
        setVistaActiva={pos.setVistaActiva}
        resumenDia={pos.resumenDia}
        resetearVentas={pos.resetearVentas}
        nombreTienda={pos.nombreTienda}
      />

      {/* Contenido Principal */}
      <div className='main-content'>
        {/* Barra Superior */}
        <div className='top-bar'>
          <span className='top-bar-title'>
            {titulos[pos.vistaActiva] || 'Punto de Venta'}
          </span>
          {pos.vistaActiva === 'pos' && (
            <div className='top-bar-shortcuts'>
              <span className='shortcut-badge'>F2 Buscar</span>
              <span className='shortcut-badge'>Enter Cobrar</span>
            </div>
          )}
        </div>

        {/* Área de Contenido */}
        <div className='flex flex-1 overflow-hidden'>
          {pos.vistaActiva === 'pos' && (
            <>
              <ProductGrid
                busqueda={pos.busqueda}
                setBusqueda={pos.setBusqueda}
                categorias={pos.categorias}
                categoriaActiva={pos.categoriaActiva}
                setCategoriaActiva={pos.setCategoriaActiva}
                productos={pos.productos}
                agregarAlCarrito={pos.agregarAlCarrito}
                inputBusquedaRef={pos.inputBusquedaRef}
              />

              <Cart
                carrito={pos.carrito}
                totalArticulos={pos.totalArticulos}
                total={pos.total}
                cambiarCantidad={pos.cambiarCantidad}
                eliminarDelCarrito={pos.eliminarDelCarrito}
                limpiarCarrito={pos.limpiarCarrito}
                abrirPago={pos.abrirPago}
              />
            </>
          )}

          {pos.vistaActiva === 'inventario' && (
            <InventoryPanel
              productos={pos.productos}
              categorias={pos.categorias}
              cargarProductos={pos.cargarCategoriasYProductos}
              mostrarToast={pos.mostrarToast}
            />
          )}

          {pos.vistaActiva === 'configuracion' && (
            <SettingsPanel
              nombreTienda={pos.nombreTienda}
              guardarNombreTienda={pos.guardarNombreTienda}
              mostrarToast={pos.mostrarToast}
            />
          )}
        </div>
      </div>

      {/* Modales (se muestran sobre todo) */}
      {pos.vistaActiva === 'pos' && (
        <PaymentModal
          mostrarPago={pos.mostrarPago}
          setMostrarPago={pos.setMostrarPago}
          totalArticulos={pos.totalArticulos}
          total={pos.total}
          pagoCon={pos.pagoCon}
          setPagoCon={pos.setPagoCon}
          procesarCobro={pos.procesarCobro}
          inputPagoRef={pos.inputPagoRef}
        />
      )}

      <ReceiptModal
        ventaCompletada={pos.ventaCompletada}
        setVentaCompletada={pos.setVentaCompletada}
      />

      <Toast toast={pos.toast} />
    </div>
  )
}

export default App
