import { useEffect, useRef, useState } from 'react'
import { inicializarDB, obtenerResumenDia } from '../services/db'
import { useToast } from './useToast'
import { useCart } from './useCart'
import { useProducts } from './useProducts'
import { usePayment } from './usePayment'

export function usePOS () {
  const [dbLista, setdbLista] = useState(false)
  const [vistaActiva, setVistaActiva] = useState('pos')
  const [nombreTienda, setNombreTienda] = useState(() => {
    return localStorage.getItem('nombreTienda') || 'Papelería Angy'
  })

  const guardarNombreTienda = (nuevoNombre) => {
    setNombreTienda(nuevoNombre)
    localStorage.setItem('nombreTienda', nuevoNombre)
  }

  const inputBusquedaRef = useRef(null)
  const inputPagoRef = useRef(null)

  const { toast, mostrarToast } = useToast()

  const {
    busqueda, setBusqueda,
    categoriaActiva, setCategoriaActiva,
    productos,
    productosTodos,
    categorias,
    cargarCategoriasYProductos
  } = useProducts(dbLista)

  const {
    carrito, setCarrito,
    agregarAlCarrito, cambiarCantidad,
    eliminarDelCarrito, limpiarCarrito,
    calcularTotal, total, totalArticulos
  } = useCart(mostrarToast)

  const {
    mostrarPago, setMostrarPago,
    pagoCon, setPagoCon,
    ventaCompletada, setVentaCompletada,
    resumenDia, setResumenDia,
    abrirPago, procesarCobro, resetearVentas
  } = usePayment(carrito, calcularTotal, setCarrito, cargarCategoriasYProductos, mostrarToast, inputPagoRef, inputBusquedaRef)

  // Inicializar la aplicacion
  useEffect(() => {
    async function init () {
      try {
        await inicializarDB()
        setdbLista(true)
        const resumen = await obtenerResumenDia()
        setResumenDia(resumen)
        inputBusquedaRef.current?.focus()
      } catch (e) {
        console.error('error inicializando app', e)
      }
    }
    init()
  }, [])

  // Atajos del sistema
  useEffect(() => {
    const manejarTecla = (e) => {
      if (e.key === 'F2') {
        e.preventDefault()
        inputBusquedaRef.current?.focus()
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        abrirPago()
      }
      if (e.key === 'Escape') {
        setMostrarPago(false)
        setVentaCompletada(null)
      }
    }
    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [abrirPago, setMostrarPago, setVentaCompletada])

  // Exportacion general a App.jsx
  return {
    dbLista,
    vistaActiva,
    setVistaActiva,
    toast,
    mostrarToast,
    inputBusquedaRef,
    inputPagoRef,

    // para useProducts
    busqueda,
    setBusqueda,
    categoriaActiva,
    setCategoriaActiva,
    productos,
    productosTodos,
    categorias,
    cargarCategoriasYProductos,

    // Para useCart
    carrito,
    total,
    totalArticulos,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    limpiarCarrito,

    // Para usePayment
    mostrarPago,
    setMostrarPago,
    pagoCon,
    setPagoCon,
    ventaCompletada,
    setVentaCompletada,
    resumenDia,
    abrirPago,
    procesarCobro,
    resetearVentas,

    // Nombre de la Tienda
    nombreTienda,
    guardarNombreTienda
  }
}
