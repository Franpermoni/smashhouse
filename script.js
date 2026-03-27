 let carrito = document.querySelector ('cart-icon-wrap');
 let currentItem = 4;

 carrito.onclick = () => {

    let boxes = [...document.querySelectorAll('.box-container .box')];
    for (var i = currentItem; i < currentItem + 4; i++) {
        boxes[i].style.display = 'inline-block';
 }
 currentItem += 4;
 if (currentItem >= boxes.length) {
    carrito.style.display = 'none';
 }