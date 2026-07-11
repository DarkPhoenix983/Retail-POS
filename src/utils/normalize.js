/** Normalizacion de texto quitando acentos/diacriticos para busquedas */
export function normalizarTexto (texto) {
  return texto
    .normalize('NFD') // Descompone
    .replace(/[\u0300-\u036f]/g, '') // Elimina los diacriticos
    .toLowerCase()
}
