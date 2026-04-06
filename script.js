// ================================
// SELECTORES
// ================================
const carritoPanel   = document.querySelector('#carrito-panel')
const cerrarCarrito  = document.querySelector('#cerrar-carrito')
const carritoIcono   = document.querySelector('.cart-icon-wrap')
const carritoBody    = document.querySelector('#carrito-body')
const totalEl        = document.querySelector('#total')
const cartBadge      = document.querySelector('.cart-badge')
const vaciarBtn      = document.querySelector('#vaciar-carrito')
const btnConfirmar   = document.querySelector('#btn-confirmar-compra')
const modalCompra    = document.querySelector('#modal-compra')
const modalCerrar    = document.querySelector('#modal-cerrar')

// ================================
// ABRIR Y CERRAR PANEL CARRITO
// ================================
carritoIcono.addEventListener('click', () => {
    carritoPanel.classList.add('abierto')
})

cerrarCarrito.addEventListener('click', () => {
    carritoPanel.classList.remove('abierto')
})

// ================================
// ESTADO DEL CARRITO (persistente con localStorage)
// ================================
// localStorage guarda datos en el navegador aunque recargues la página.
// JSON.parse convierte el texto guardado de vuelta a un array de JS.
let carrito = JSON.parse(localStorage.getItem('carrito')) || []

// ================================
// AGREGAR PRODUCTO AL CARRITO
// ================================
function agregarAlCarrito(boton) {
    if (!boton) return

    const nombre = boton.dataset.nombre       // data-nombre del HTML
    const precio = Number(boton.dataset.precio) // data-precio → lo convertimos a número
    const imagen = boton.dataset.imagen

    // Buscamos si el producto ya existe en el array
    const productoExistente = carrito.find(p => p.nombre === nombre)

    if (productoExistente) {
        productoExistente.cantidad++
    } else {
        carrito.push({ nombre, precio, imagen, cantidad: 1 })
    }

    actualizarCarrito()
    carritoPanel.classList.add('abierto')
}

// ================================
// ACTUALIZAR CARRITO (renderizado del DOM)
// ================================
function actualizarCarrito() {

    // Guardamos en localStorage (persiste al recargar)
    localStorage.setItem('carrito', JSON.stringify(carrito))

    // Limpiamos el tbody antes de volver a renderizar
    carritoBody.innerHTML = ''

    let sumaTotal = 0

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad
        sumaTotal += subtotal

        // Creamos la fila de la tabla dinámicamente
        const fila = document.createElement('tr')
        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}"></td>
            <td>${producto.nombre}</td>
            <td>
                <div class="cantidad-control">
                    <button class="btn-restar">−</button>
                    <span class="cantidad-numero">${producto.cantidad}</span>
                    <button class="btn-sumar">+</button>
                </div>
            </td>
            <td>$${subtotal}</td>
            <td><button class="btn-eliminar">✕</button></td>
        `

        // Eventos de los botones de cada fila
        fila.querySelector('.btn-eliminar').addEventListener('click', () => eliminarProducto(index))
        fila.querySelector('.btn-sumar').addEventListener('click',    () => sumarCantidad(index))
        fila.querySelector('.btn-restar').addEventListener('click',   () => restarCantidad(index))

        carritoBody.appendChild(fila)
    })

    // Actualizamos el total y el badge
    totalEl.textContent = '$' + sumaTotal

    const cantidadTotal = carrito.reduce((acc, p) => acc + p.cantidad, 0)
    cartBadge.textContent = cantidadTotal
    cartBadge.style.display = cantidadTotal > 0 ? 'flex' : 'none'
}

// ================================
// FUNCIONES DE CONTROL DEL CARRITO
// ================================
function eliminarProducto(index) {
    carrito.splice(index, 1)  // splice(index, 1) elimina 1 elemento en esa posición
    actualizarCarrito()
}

function sumarCantidad(index) {
    carrito[index].cantidad++
    actualizarCarrito()
}

function restarCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--
    } else {
        carrito.splice(index, 1) // si llega a 0, lo sacamos del array
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
// MODAL CONFIRMAR COMPRA
// ================================
// Cuando se hace click en "Confirmar compra", abrimos el modal
if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío.')
            return
        }

        // Armamos un resumen del carrito para incluir en el form
        // Así el dueño del local recibe qué se pidió en el email
        const resumenDiv = document.querySelector('#resumen-pedido-hidden')
        if (resumenDiv) {
            resumenDiv.innerHTML = ''
            carrito.forEach(p => {
                const input = document.createElement('input')
                input.type  = 'hidden'
                input.name  = `pedido_${p.nombre}`
                input.value = `x${p.cantidad} = $${p.precio * p.cantidad}`
                resumenDiv.appendChild(input)
            })
            // También el total
            const inputTotal = document.createElement('input')
            inputTotal.type  = 'hidden'
            inputTotal.name  = 'total'
            inputTotal.value = '$' + carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
            resumenDiv.appendChild(inputTotal)
        }

        modalCompra.classList.add('abierto')
        carritoPanel.classList.remove('abierto')
    })
}

// Cerrar modal con botón X
if (modalCerrar) {
    modalCerrar.addEventListener('click', () => {
        modalCompra.classList.remove('abierto')
    })
}

// Cerrar modal clickeando el fondo oscuro
if (modalCompra) {
    modalCompra.addEventListener('click', (e) => {
        if (e.target === modalCompra) {
            modalCompra.classList.remove('abierto')
        }
    })
}

// ================================
// MANEJO DE FORMULARIOS (Formspree)
// ================================
// fetch() hace un pedido HTTP en segundo plano sin recargar la página.
// Esto se llama "AJAX" — Asynchronous JavaScript and XML.
function manejarFormulario(formId, okId) {
    const form = document.querySelector(formId)
    const okMsg = document.querySelector(okId)
    if (!form) return

    form.addEventListener('submit', async (e) => {
        e.preventDefault() // evita que recargue la página

        const datos = new FormData(form) // recoge todos los campos del form

        try {
            const respuesta = await fetch(form.action, {
                method: 'POST',
                body: datos,
                headers: { 'Accept': 'application/json' }
            })

            if (respuesta.ok) {
                form.reset() // limpia el form
                if (okMsg) {
                    okMsg.style.display = 'block'
                    setTimeout(() => { okMsg.style.display = 'none' }, 5000)
                }
                // Si es el form de compra, vaciamos el carrito y cerramos el modal
                if (formId === '#form-compra') {
                    carrito = []
                    actualizarCarrito()
                    setTimeout(() => modalCompra.classList.remove('abierto'), 2000)
                }
            } else {
                alert('Hubo un error al enviar. Intentá de nuevo.')
            }
        } catch (error) {
            alert('Error de conexión. Revisá tu internet.')
        }
    })
}

manejarFormulario('#form-contacto', '#form-contacto-ok')
manejarFormulario('#form-compra',   '#form-compra-ok')

// ================================
// SECCIONES EXPANDIBLES (Burgers / Nosotros)
// ================================
// Buscamos todos los botones con clase btn-expand
document.querySelectorAll('.btn-expand').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target        // ej: "burgers-content"
        const contenido = document.querySelector(`#${targetId}`)
        const estaAbierto = contenido.classList.contains('abierto')

        if (estaAbierto) {
            // Si está abierto, lo cerramos
            contenido.classList.remove('abierto')
            btn.classList.remove('abierto')
            btn.textContent = btn.textContent.replace('▴', '▾')
        } else {
            // Si está cerrado, lo abrimos
            contenido.classList.add('abierto')
            btn.classList.add('abierto')
            btn.textContent = btn.textContent.replace('▾', '▴')
        }
    })
})

// ================================
// INICIALIZACIÓN
// ================================
actualizarCarrito()

// ================================
// ANIMACIONES AL HACER SCROLL
// ================================
const elementos = document.querySelectorAll('.animar')

// IntersectionObserver "observa" elementos y actúa cuando entran al viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        }
    })
}, { threshold: 0.1 })

elementos.forEach(el => observer.observe(el))
