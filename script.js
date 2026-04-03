// ================================
// SELECTORES (los definimos una sola vez para optimizar)
// ================================
const carritoPanel = document.querySelector('#carrito-panel')
const cerrarCarrito = document.querySelector('#cerrar-carrito')
const carritoIcono = document.querySelector('.cart-icon-wrap')
const carritoBody = document.querySelector('#carrito-body')
const total = document.querySelector('#total')
const cartBadge = document.querySelector('.cart-badge')
const vaciarBtn = document.querySelector('#vaciar-carrito')

// ================================
// ABRIR Y CERRAR PANEL
// ================================
carritoIcono.addEventListener('click', () => {
    carritoPanel.classList.add('abierto')
})

cerrarCarrito.addEventListener('click', () => {
    carritoPanel.classList.remove('abierto')
})

// ================================
// ESTADO DEL CARRITO (persistente)
// ================================
let carrito = JSON.parse(localStorage.getItem('carrito')) || []

// ================================
// AGREGAR PRODUCTO AL CARRITO
// ================================
function agregarAlCarrito(boton) {
    if (!boton) return // validación por seguridad

    const nombre = boton.dataset.nombre
    const precio = Number(boton.dataset.precio)
    const imagen = boton.dataset.imagen

    // buscamos si el producto ya existe
    const productoExistente = carrito.find(p => p.nombre === nombre)

    if (productoExistente) {
        // si ya existe, aumentamos cantidad
        productoExistente.cantidad++
    } else {
        // si no existe, lo agregamos
        carrito.push({
            nombre,
            precio,
            imagen,
            cantidad: 1
        })
    }

    actualizarCarrito()
    carritoPanel.classList.add('abierto')
}

// ================================
// ACTUALIZAR CARRITO (renderizado)
// ================================
function actualizarCarrito() {

    // guardamos en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito))

    // limpiamos el contenido (mejor que innerHTML +=)
    carritoBody.innerHTML = ''

    let sumaTotal = 0

    carrito.forEach((producto, index) => {

        // calculamos total por producto
        const subtotal = producto.precio * producto.cantidad
        sumaTotal += subtotal

        // creamos la fila dinámicamente
        const fila = document.createElement('tr')

        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}"></td>
            <td>${producto.nombre}</td>
            <td>
                <button class="btn-restar">-</button>
                ${producto.cantidad}
                <button class="btn-sumar">+</button>
            </td>
            <td>$${subtotal}</td>
            <td>
                <button class="btn-eliminar">✕</button>
            </td>
        `

        // ================================
        // EVENTOS (sin usar onclick)
        // ================================

        // eliminar producto
        fila.querySelector('.btn-eliminar')
            .addEventListener('click', () => eliminarProducto(index))

        // sumar cantidad
        fila.querySelector('.btn-sumar')
            .addEventListener('click', () => sumarCantidad(index))

        // restar cantidad
        fila.querySelector('.btn-restar')
            .addEventListener('click', () => restarCantidad(index))

        carritoBody.appendChild(fila)
    })

    // actualizamos total general
    total.textContent = '$' + sumaTotal

    // badge con total de unidades (no productos)
    const cantidadTotal = carrito.reduce((acc, p) => acc + p.cantidad, 0)
    cartBadge.textContent = cantidadTotal
    cartBadge.style.display = cantidadTotal > 0 ? 'flex' : 'none'
}

// ================================
// FUNCIONES DE CONTROL
// ================================

// eliminar producto completo
function eliminarProducto(index) {
    carrito.splice(index, 1)
    actualizarCarrito()
}

// sumar cantidad
function sumarCantidad(index) {
    carrito[index].cantidad++
    actualizarCarrito()
}

// restar cantidad
function restarCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--
    } else {
        // si queda en 0 lo eliminamos
        carrito.splice(index, 1)
    }
    actualizarCarrito()
}

// ================================
// VACIAR CARRITO
// ================================
vaciarBtn.addEventListener('click', () => {
    carrito = []
    actualizarCarrito()
})

// ================================
// INICIALIZACIÓN (cuando carga la página)
// ================================
actualizarCarrito()

// ================================
// ANIMACIONES AL HACER SCROLL
// ================================
const elementos = document.querySelectorAll('.animar')

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        }
    })
}, { threshold: 0.1 })

elementos.forEach(el => observer.observe(el))