
import './App.css';
import React from 'react';

let total = 0;

function agregarAlCarrito(producto, precio) {
    const lista = document.getElementById("carrito-lista");
    const item = document.createElement("li");
    item.textContent = `${producto} - $${precio.toFixed(2)}`;
    lista.appendChild(item);

    total += precio;
    document.getElementById("total").textContent = total.toFixed(2);
}


export default App;
