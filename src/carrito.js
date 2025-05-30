export let total = 0;

export function agregarAlCarrito(producto, precio, listaDOM, totalDOM) {
    const item = document.createElement("li");
    item.textContent = `${producto} - $${precio.toFixed(2)}`;
    listaDOM.appendChild(item);

    total += precio;
    totalDOM.textContent = total.toFixed(2);
}
