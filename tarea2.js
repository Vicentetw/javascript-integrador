// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        /* Si no me definen stock, pongo 10 por dafault la cambio
        a una sola línea operador de coalescencia nula (nullish coalescing operator) 
        if (stock){
            this.stock = stock;
        }else {
        this.stock =10
        }*/
        this.stock = stock || 10;
    }
}

// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vacío
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * Función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    /**
 * función que agrega @{cantidad} de productos con @{sku} al carrito
 */
async agregarProducto(sku, cantidad) {
    console.log(`Agregando ${cantidad} ${sku}`);

    try {
        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku);

        console.log("Producto encontrado", producto);

        // Creo un producto nuevo
        const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
        this.productos.push(nuevoProducto);
        this.precioTotal = this.precioTotal + (producto.precio * cantidad);

        // Actualizar la lista de categorías solo si la categoría no estaba en la lista
        if (!this.categorias.includes(producto.categoria)) {
            this.categorias.push(producto.categoria);
        }
    } catch (error) {
        console.log(error); // Mostrar mensaje de error si el producto no existe
    }
}

    /**
     * Función que elimina @{cantidad} de productos con @{sku} del carrito
     */
    eliminarProducto(sku, cantidad) {
        console.log(`Eliminando ${cantidad} ${sku}`);

        return new Promise((resolve, reject) => {
            const productoExistente = this.productos.find(prod => prod.sku === sku);

            if (!productoExistente) {
                reject(`El producto ${sku} no existe en el carrito.`);
                return;
            }

            if (cantidad < productoExistente.cantidad) {
                // Si la cantidad es menor a la cantidad del producto en el carrito, restar esa cantidad
                productoExistente.cantidad -= cantidad;
                resolve();
            } else {
                // Si la cantidad es mayor o igual a la cantidad del producto en el carrito, eliminar el producto
                const index = this.productos.indexOf(productoExistente);
                this.productos.splice(index, 1);
                resolve();
            }
        });
    }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);
            }
        }, 1500);
    });
}

const carrito = new Carrito();

carrito.agregarProducto('WE328NJ', 2)
    .then(() => carrito.agregarProducto('WE328NJ', 2))
    .then(() => carrito.agregarProducto('WE328NJ', 2))
    .then(() => carrito.agregarProducto('WE328NJ', 1))
    .then(() => carrito.agregarProducto('KS944RUR', 3))
    .then(() => {
        console.log(carrito.productos);
        console.log(carrito.categorias);
        console.log(carrito.precioTotal);
    })
    .catch(error => console.log(error));

carrito.eliminarProducto('WE328NJ', 1)
    .then(() => {
        console.log(carrito.productos);
        console.log(carrito.categorias);
        console.log(carrito.precioTotal);
    })
    .catch(error => console.log(error));
