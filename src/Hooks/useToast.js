import { useState, useCallback } from 'react'

export function useToast () {
  const [toast, setToast] = useState(null)

  const mostrarToast = useCallback((mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return { toast, mostrarToast }
}
