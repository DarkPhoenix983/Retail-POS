import { useCallback, useState } from 'react'
import { registrarVenta, obtenerResumenDia, resetearVentasDia } from '../services/db'

export function usePayment (carrito, calcularTotal, setCarrito, cargarCategoriasYProductos, mostrarToast, inputPagoRef, inputBusquedaRef) {
  const [mostrarPago, setMostrarPago] = useState(false)
  const [pagoCon, setPagoCon] = useState('')
  const [ventaCompletada, setVentaCompletada] = useState(null)
  const [resumenDia, setResumenDia] = useState({ totalVentas: 0, cantidadVentas: 0 })

  const abrirPago = useCallback(() => {
    if (carrito.length === 0) {
      mostrarToast('El carrito esta vacio', 'error')
      return
    }
    setMostrarPago(true)
    setTimeout(() => inputPagoRef.current?.focus(), 100)
  }, [carrito.length, mostrarToast, inputPagoRef])

  const procesarCobro = useCallback(async () => {
    const total = calcularTotal()
    const pagoNumero = parseFloat(pagoCon)

    if (pagoNumero < total) {
      mostrarToast('El pago debe ser igual o mayor al total', 'error')
      return
    }

    try {
      const venta = await registrarVenta(carrito, total, pagoNumero)

      setVentaCompletada(venta)
      setCarrito([])
      setPagoCon('')
      setMostrarPago(false)

      const resumen = await obtenerResumenDia()
      setResumenDia(resumen)

      await cargarCategoriasYProductos()

      setTimeout(() => {
        setVentaCompletada(null)
        inputBusquedaRef.current?.focus()
      }, 5000)
    } catch (e) {
      console.error(e)
      mostrarToast('Error al procesar la venta', 'error')
    }
  }, [calcularTotal, pagoCon, carrito, setCarrito, cargarCategoriasYProductos, mostrarToast, inputBusquedaRef])

  const resetearVentas = useCallback(async () => {
    if (window.confirm('Estas seguro de que quieres borrar TODAS las ventas de hoy? Esta accion no se puede deshacer.')) {
      try {
        await resetearVentasDia()
        const resumen = await obtenerResumenDia()
        setResumenDia(resumen)
        mostrarToast('Ventas del dia reseteadas correctamente')
      } catch (e) {
        console.error(e)
        mostrarToast('Error al resetear ventas', 'error')
      }
    }
  }, [mostrarToast])

  return {
    mostrarPago, setMostrarPago, pagoCon, setPagoCon, ventaCompletada, setVentaCompletada, resumenDia, setResumenDia, abrirPago, procesarCobro, resetearVentas
  }
}
