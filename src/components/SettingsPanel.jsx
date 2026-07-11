import { useState } from 'react'
import { Icono } from './Icono'

export function SettingsPanel ({ nombreTienda, guardarNombreTienda, mostrarToast }) {
  const [nombreLocal, setNombreLocal] = useState(nombreTienda)
  const [guardado, setGuardado] = useState(false)

  const guardarConfig = () => {
    guardarNombreTienda(nombreLocal)
    setGuardado(true)
    mostrarToast('Configuración guardada correctamente')
    setTimeout(() => setGuardado(false), 2000)
  }

  return (
    <div className='flex-1 overflow-y-auto p-6' style={{ backgroundColor: 'var(--color-bg-main)' }}>
      <div className='max-w-3xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0
          }}
          >
            Configuración
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            margin: '4px 0 0 0'
          }}
          >
            Personaliza tu sistema de punto de venta
          </p>
        </div>

        {/* Información de la Tienda */}
        <div className='settings-section'>
          <h3>
            <Icono tipo='tienda' className='w-5 h-5' style={{ color: 'var(--color-primary)' }} />
            Información de la Tienda
          </h3>
          <div className='settings-row' style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
            <label>Nombre de la tienda</label>
            <input
              type='text'
              value={nombreLocal}
              onChange={(e) => setNombreLocal(e.target.value)}
              className='input-field'
              style={{ maxWidth: '400px' }}
            />
          </div>
        </div>

        {/* Atajos de Teclado */}
        <div className='settings-section'>
          <h3>
            <Icono tipo='buscar' className='w-5 h-5' style={{ color: 'var(--color-primary)' }} />
            Atajos de Teclado
          </h3>
          <div className='settings-row'>
            <div>
              <label>Buscar productos</label>
              <p>Enfoca el campo de búsqueda</p>
            </div>
            <span style={{
              padding: '4px 12px',
              background: 'var(--color-bg-input)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            }}
            >
              F2
            </span>
          </div>
          <div className='settings-row'>
            <div>
              <label>Cobrar venta</label>
              <p>Abre la ventana de cobro</p>
            </div>
            <span style={{
              padding: '4px 12px',
              background: 'var(--color-bg-input)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            }}
            >
              F5
            </span>
          </div>
          <div className='settings-row'>
            <div>
              <label>Cerrar ventanas</label>
              <p>Cierra modales abiertos</p>
            </div>
            <span style={{
              padding: '4px 12px',
              background: 'var(--color-bg-input)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            }}
            >
              Esc
            </span>
          </div>
        </div>

        {/* Acerca de */}
        <div className='settings-section'>
          <h3>
            <Icono tipo='check' className='w-5 h-5' style={{ color: 'var(--color-primary)' }} />
            Acerca del Sistema
          </h3>
          <div className='settings-row'>
            <div>
              <label>Versión</label>
              <p>Versión actual del sistema</p>
            </div>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)'
            }}
            >
              1.0.0
            </span>
          </div>
          <div className='settings-row'>
            <div>
              <label>Base de Datos</label>
              <p>Motor de almacenamiento local</p>
            </div>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-success)'
            }}
            >
              SQLite ✓ Conectada
            </span>
          </div>
        </div>

        {/* Botón guardar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            onClick={guardarConfig}
            className='btn-primary'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px'
            }}
          >
            <Icono tipo='check' className='w-4 h-4' />
            {guardado ? 'Guardado ✓' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
