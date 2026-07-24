import Database from '@tauri-apps/plugin-sql'
import { normalizarTexto } from '../utils/normalize'

let db = null

function getDb () {
  if (!db && typeof window !== 'undefined' && window.__db) {
    db = window.__db
  }
  return db
}

const INICIAL_PRODUCTS = [
  {
    nombre: 'Resistol blanco 20g',
    categoria: 'Pegamentos',
    precio: 15.5,
    stock: 20,
    codigo: ''
  },
  {
    nombre: 'Resistol blanco 50g',
    categoria: 'Pegamentos',
    precio: 25.5,
    stock: 15,
    codigo: 'RES-B-002'
  },
  {
    nombre: 'Resistol blanco 1kg',
    categoria: 'Pegamentos',
    precio: 50,
    stock: 10,
    codigo: 'RES-B-003'
  },
  {
    nombre: 'Resistol blanco 5kg',
    categoria: 'Pegamentos',
    precio: 150,
    stock: 5,
    codigo: 'RES-B-004'
  }
]

export async function inicializarDB () {
  if (typeof window !== 'undefined' && window.__db) {
    db = window.__db
    return
  }

  db = await Database.load('sqlite:papeleria.db')

  if (typeof window !== 'undefined') {
    window.__db = db
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      categoria TEXT NOT NULL,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL,
      codigo TEXT NOT NULL
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT NOT NULL,
      total REAL NOT NULL,
      pago_con REAL NOT NULL,
      cambio REAL NOT NULL
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS ventas_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ventas_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY(ventas_id) REFERENCES ventas(id)
    )
  `)

  // Verificación de productos
  const resultado = await db.select('SELECT COUNT(*) as count FROM productos')
  if (resultado[0].count === 0) {
    console.log('Inserción de productos iniciales')
    for (const p of INICIAL_PRODUCTS) {
      await db.execute(
        'INSERT INTO productos (nombre, categoria, precio, stock, codigo) VALUES ($1, $2, $3, $4, $5)',
        [p.nombre, p.categoria, p.precio, p.stock, p.codigo]
      )
    }
  } else {
    console.log('Base de datos cargada correctamente')
  }
}

// Obtener todos los productos
export async function obternerProductos () {
  if (!getDb()) return []
  return await db.select('SELECT * FROM productos')
}

// Buscar productos
export async function buscarProductos (termino) {
  if (!getDb()) return []
  const terminoLimpio = termino.trim()
  if (!terminoLimpio) return await obternerProductos()

  // Normalizar el término de búsqueda
  const terminoNorm = normalizarTexto(terminoLimpio)

  // Obtener todos los productos y filtrarlos
  const todo = await obternerProductos()
  return todo.filter(p => {
    const nombreNorm = normalizarTexto(p.nombre)
    const categoriaNorm = normalizarTexto(p.categoria)
    const codigoNorm = normalizarTexto(p.codigo)
    return nombreNorm.includes(terminoNorm) ||
           categoriaNorm.includes(terminoNorm) ||
           codigoNorm.includes(terminoNorm)
  })
}

// Obtener categorías únicas
export async function obtenerCategorias () {
  if (!getDb()) return []
  const rows = await db.select(
    'SELECT DISTINCT categoria FROM productos ORDER BY categoria ASC'
  )
  return rows.map((r) => r.categoria)
}

// Registrar una nueva venta
export async function registrarVenta (items, total, pagoCon) {
  if (!getDb()) throw new Error('DB no inicializada')

  const fecha = new Date().toISOString()
  const cambio = pagoCon - total

  const resultado = await db.execute(
    'INSERT INTO ventas (fecha, total, pago_con, cambio) VALUES ($1, $2, $3, $4)',
    [fecha, total, pagoCon, cambio]
  )

  const ventaId = resultado.lastInsertId

  for (const item of items) {
    const subtotal = item.precio * item.cantidad
    await db.execute(
      'INSERT INTO ventas_items (ventas_id, producto_id, nombre, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5, $6)',
      [ventaId, item.id, item.nombre, item.cantidad, item.precio, subtotal]
    )

    // Descontar del stock (ignorar si es -1, o sea, infinito)
    await db.execute(
      'UPDATE productos SET stock = MAX(0, stock - $1) WHERE id = $2 AND stock != -1',
      [item.cantidad, item.id]
    )
  }

  console.log('Venta registrada en SQLite: ', ventaId)
  return { id: ventaId, fecha, items, total, pagoCon, cambio }
}

// Calcular ventas del día
export async function obtenerResumenDia () {
  if (!getDb()) return { totalVentas: 0, cantidadVentas: 0, promedioVentas: 0 }

  const hoy = new Date().toISOString().split('T')[0]
  const t = `${hoy}%`

  const rows = await db.select(
    'SELECT COUNT(*) as cant, SUM(total) as tot FROM ventas WHERE fecha LIKE $1',
    [t]
  )

  const cantidad = rows[0].cant || 0
  const total = rows[0].tot || 0

  return {
    totalVentas: total,
    cantidadVentas: cantidad,
    promedioVenta: cantidad > 0 ? total / cantidad : 0
  }
}

// Agregar un nuevo producto
export async function agregarProducto (producto) {
  if (!getDb()) throw new Error('DB no inicializada')

  const { nombre, categoria, precio, stock, codigo } = producto
  await db.execute(
    'INSERT INTO productos (nombre, categoria, precio, stock, codigo) VALUES ($1, $2, $3, $4, $5)',
    [nombre, categoria, precio, stock, codigo]
  )
}

// Actualizar un producto ya existente
export async function actualizarProducto (producto) {
  if (!getDb()) throw new Error('DB no inicializada')

  const { id, nombre, categoria, precio, stock, codigo } = producto
  await db.execute(
    'UPDATE productos SET nombre = $1, categoria = $2, precio = $3, stock = $4, codigo = $5 WHERE id = $6',
    [nombre, categoria, precio, stock, codigo, id]
  )
}

// Eliminar un producto
export async function eliminarProducto (id) {
  if (!getDb()) throw new Error('DB no inicializada')
  await db.execute(
    'DELETE FROM productos WHERE id = $1',
    [id]
  )
}

// Borrar todo el historial de ventas
export async function borrarHistorialVentasCompleto () {
  if (!getDb()) throw new Error('DB no inicializada')
  await db.execute('DELETE FROM ventas_items')
  await db.execute('DELETE FROM ventas')
}

// Resetear todas las ventas del día actual
export async function resetearVentasDia () {
  if (!getDb()) throw new Error('DB no inicializada')
  const hoy = new Date().toISOString().split('T')[0]
  const t = `${hoy}%`

  // Eliminar los ítems de esta venta
  await db.execute(
    'DELETE FROM ventas_items WHERE ventas_id IN (SELECT id FROM ventas WHERE fecha LIKE $1)',
    [t]
  )

  // Eliminamos las ventas totales
  await db.execute(
    'DELETE FROM ventas WHERE fecha LIKE $1',
    [t]
  )
}

// Obtener historial de ventas con sus items
export async function eliminarVenta (id) {
  if (!getDb()) throw new Error('DB no inicializada')

  // Obtener items de la venta para restaurar stock
  const items = await db.select(
    'SELECT producto_id, cantidad FROM ventas_items WHERE ventas_id = $1',
    [id]
  )

  // Restaurar stock (ignorar si es -1, o sea, infinito)
  for (const item of items) {
    await db.execute(
      'UPDATE productos SET stock = stock + $1 WHERE id = $2 AND stock != -1',
      [item.cantidad, item.producto_id]
    )
  }

  // Eliminar items
  await db.execute(
    'DELETE FROM ventas_items WHERE ventas_id = $1',
    [id]
  )

  // Eliminar venta
  await db.execute(
    'DELETE FROM ventas WHERE id = $1',
    [id]
  )
}

// Obtener historial de ventas con sus items
export async function obtenerHistorialVentas () {
  if (!getDb()) return []

  // ventas ordenadas por fecha
  const ventas = await db.select(
    'SELECT * FROM ventas ORDER BY fecha DESC'
  )

  // Por cada venta, traer sus items
  for (const venta of ventas) {
    const items = await db.select(
      'SELECT * FROM ventas_items WHERE ventas_id = $1',
      [venta.id]
    )
    venta.items = items
  }

  return ventas
}
