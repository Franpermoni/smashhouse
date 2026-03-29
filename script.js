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

// ================================
// PASO 3: AGREGAR PRODUCTOS AL CARRITO
// ================================

let carrito = []

function agregarAlCarrito(boton) {
    // Leemos los datos del botón clickeado
    const nombre = boton.dataset.nombre
    const precio = boton.dataset.precio
    const imagen = boton.dataset.imagen

    // Creamos el producto
    const producto = {
        nombre: nombre,
        precio: Number(precio),
        imagen: imagen
    }

    // Lo agregamos al array
    carrito.push(producto)

    // Actualizamos el panel
    actualizarCarrito()

    // Abrimos el panel automáticamente
    carritoPanel.classList.add('abierto')
}

function actualizarCarrito() {
    const carritoBody = document.querySelector('#carrito-body')
    const total = document.querySelector('#total')
    const cartBadge = document.querySelector('.cart-badge')

    // Limpiamos la tabla
    carritoBody.innerHTML = ''

    let sumaTotal = 0

    carrito.forEach(function(producto, index) {
        sumaTotal += producto.precio

        carritoBody.innerHTML += `
            <tr>
                <td><img src="${producto.imagen}" alt="${producto.nombre}"></td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarProducto(${index})">✕</button>
                </td>
            </tr>
        `
    })

    total.textContent = '$' + sumaTotal
    cartBadge.textContent = carrito.length
    cartBadge.style.display = carrito.length > 0 ? 'flex' : 'none'
}

// ================================
// PASO 4: ELIMINAR PRODUCTOS
// ================================
function eliminarProducto(index) {
    carrito.splice(index, 1)  // elimina 1 elemento en la posición index
    actualizarCarrito()
}

// ================================
// PASO 5: VACIAR CARRITO
// ================================
document.querySelector('#vaciar-carrito').addEventListener('click', function() {
    carrito = []           // vaciamos el array
    actualizarCarrito()    // actualizamos el panel
})

// Cargamos el carrito desde localStorage al abrir la página
carrito = JSON.parse(localStorage.getItem('carrito')) || []

// Al actualizar el carrito también lo guardamos
function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
    
    // ... el resto del código que ya tenés
}