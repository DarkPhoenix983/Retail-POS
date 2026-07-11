import { useCallback, useEffect, useState } from 'react'
import { buscarProductos, obtenerCategorias } from '../services/db'

export function useProducts (dbLista) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])

  // Cargar productos de la DB
  const cargarCategoriasYProductos = useCallback(async () => {
    const cats = await obtenerCategorias()
    setCategorias(['Todas', ...cats])

    let prods = await buscarProductos(busqueda)
    if (categoriaActiva !== 'Todas') {
      prods = prods.filter(p => p.categoria === categoriaActiva)
    }
    setProductos(prods)
  }, [busqueda, categoriaActiva])

  // Ejecutar automaticamente cuando cambia la busqueda o categoria
  useEffect(() => {
    if (!dbLista) return
    cargarCategoriasYProductos()
  }, [dbLista, cargarCategoriasYProductos])

  return { busqueda, setBusqueda, categoriaActiva, setCategoriaActiva, productos, categorias, cargarCategoriasYProductos }
}
