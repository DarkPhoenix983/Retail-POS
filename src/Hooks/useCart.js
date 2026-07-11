import { useCallback, useState } from 'react'

export function useCart (mostrarToast) {
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = useCallback((producto) => {
    if (producto.stock <= 0) {
      mostrarToast('¡Sin stock!', 'error')
      return
    }

    setCarrito(carritoActual => {
      const existente = carritoActual.find(item => item.id === producto.id)
      if (existente) {
        if (existente.cantidad >= producto.stock) {
          mostrarToast('¡Stock insuficiente!', 'error')
          return carritoActual
        }
        return carritoActual.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      } else {
        return [...carritoActual, { ...producto, cantidad: 1 }]
      }
    })
  }, [mostrarToast])

  const cambiarCantidad = useCallback((id, delta) => {
    setCarrito(carritoActual =>
      carritoActual.map(item => {
        if (item.id !== id) return item
        const nuevaCantidad = item.cantidad + delta
        if (nuevaCantidad <= 0) return item
        if (nuevaCantidad > item.stock) {
          mostrarToast('¡Stock insuficiente!', 'error')
          return item
        }
        return { ...item, cantidad: nuevaCantidad }
      })
    )
  }, [mostrarToast])

  const eliminarDelCarrito = useCallback((id) => {
    setCarrito(carritoActual => carritoActual.filter(item => item.id !== id))
  }, [])

  const limpiarCarrito = useCallback(() => {
    setCarrito([])
  }, [])

  const calcularTotal = useCallback(() => {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  }, [carrito])

  // Calcular el total sumando precio * cantidad de cada item
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  const totalArticulos = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  return { carrito, setCarrito, agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, limpiarCarrito, calcularTotal, total, totalArticulos }
}
