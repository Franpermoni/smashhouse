// ABRIR Y CERRAR EL PANEL
const carritoPanel = document.querySelector('#carrito-panel')
const cerrarCarrito = document.querySelector('#cerrar-carrito')
const carritoIcono = document.querySelector('.cart-icon-wrap')

carritoIcono.addEventListener('click', function() {
    carritoPanel.classList.add('abierto')
})

cerrarCarrito.addEventListener('click', function() {
    carritoPanel.classList.remove('abierto')
})

// ================================
// CARRITO
// ================================

// Cargamos el carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || []

function agregarAlCarrito(boton) {
    const nombre = boton.dataset.nombre
    const precio = boton.dataset.precio
    const imagen = boton.dataset.imagen

    const producto = {
        nombre: nombre,
        precio: Number(precio),
        imagen: imagen
    }

    carrito.push(producto)
    actualizarCarrito()
    carritoPanel.classList.add('abierto')
}

function actualizarCarrito() {
    // Guardamos en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito))

    const carritoBody = document.querySelector('#carrito-body')
    const total = document.querySelector('#total')
    const cartBadge = document.querySelector('.cart-badge')

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

function eliminarProducto(index) {
    carrito.splice(index, 1)
    actualizarCarrito()
}

document.querySelector('#vaciar-carrito').addEventListener('click', function() {
    carrito = []
    actualizarCarrito()
})

// Actualizamos el carrito al cargar la página
actualizarCarrito()

// ANIMACIONES AL HACER SCROLL
const elementos = document.querySelectorAll('.animar')

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        }
    })
}, { threshold: 0.1 })

elementos.forEach(function(el) {
    observer.observe(el)
})