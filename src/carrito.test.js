/**
 * @jest-environment jsdom
 */

import { agregarAlCarrito, total } from './carrito';

describe('agregarAlCarrito', () => {
    beforeEach(() => {
        // Reinicia el DOM antes de cada prueba
        document.body.innerHTML = `
            <ul id="carrito-lista"></ul>
            <span id="total">0.00</span>
        `;
    });

    test('agrega un producto al carrito y actualiza el total', () => {
        const listaDOM = document.getElementById('carrito-lista');
        const totalDOM = document.getElementById('total');

        agregarAlCarrito('Manzana', 1.00, listaDOM, totalDOM);

        expect(listaDOM.children.length).toBe(1);
        expect(listaDOM.textContent).toContain('Manzana - $1.00');
        expect(totalDOM.textContent).toBe('1.00');
    });
});
