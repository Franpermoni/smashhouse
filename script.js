// ABRIR Y CERRAR EL PANEL
const carritoPanel = document.querySelector('#carrito-panel')
const cerrarCarrito = document.querySelector('#cerrar-carrito')
const carritoIcono = document.querySelector('.cart-icon-wrap')

// Abrir panel al clickear el 🛒
carritoIcono.addEventListener('click', function() {
    carritoPanel.classList.add('abierto')
})

// Cerrar panel al clickear la ✕
cerrarCarrito.addEventListener('click', function() {
    carritoPanel.classList.remove('abierto')
})