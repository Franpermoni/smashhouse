// ================================
// PASO 1 Y 2: ABRIR Y CERRAR EL PANEL
// ================================

// Agarramos los elementos del HTML que necesitamos
const carritoPanel = document.querySelector('#carrito-panel')
const cerrarCarrito = document.querySelector('#cerrar-carrito')
const carritoIcono = document.querySelector('.cart-icon-btn')

// Cuando hacen click en el ícono 🛒 → abre el panel
carritoIcono.addEventListener('click', function() {
    carritoPanel.classList.add('abierto')  // le agrega la clase "abierto"
})

// Cuando hacen click en la ✕ → cierra el panel
cerrarCarrito.addEventListener('click', function() {
    carritoPanel.classList.remove('abierto')  // le saca la clase "abierto"
})