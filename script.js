// Base de datos de productos - Se carga desde catalogo.js
let productos = [];

let carrito = [];
let filtroActual = "todos";
let busquedaActual = "";

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogo();
    configurarEventos();
});

// Cargar catálogo desde catalogoData (ya está en memoria)
function cargarCatalogo() {
    try {
        // Convertir el catálogo a array de productos
        productos = [];
        let id = 1;
        
        // Agregar imágenes de mueblería
        catalogoData.muebleria.forEach(imagen => {
            productos.push({
                id: id++,
                nombre: imagen.nombre,
                categoria: "muebleria",
                imagen: imagen.ruta,
                tipo: "muebleria"
            });
        });
        
        // Agregar imágenes de colchonería
        catalogoData.colchoneria.forEach(imagen => {
            productos.push({
                id: id++,
                nombre: imagen.nombre,
                categoria: "colchoneria",
                imagen: imagen.ruta,
                tipo: "colchoneria"
            });
        });
        
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        document.getElementById('sinResultados').textContent = 'Error al cargar el catálogo';
        document.getElementById('sinResultados').style.display = 'block';
    }
}

// Configurar eventos
function configurarEventos() {
    // Botones de filtro
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            filtroActual = btn.dataset.filtro;
            aplicarFiltros();
        });
    });

    // Búsqueda
    document.getElementById('busqueda').addEventListener('input', (e) => {
        busquedaActual = e.target.value.toLowerCase();
        aplicarFiltros();
    });

    // Carrito
    document.getElementById('carritoBtn').addEventListener('click', abrirCarrito);
}

// Mostrar productos
function mostrarProductos(productosAMostrar) {
    const catalogo = document.getElementById('catalogo');
    const sinResultados = document.getElementById('sinResultados');

    if (productosAMostrar.length === 0) {
        catalogo.innerHTML = '';
        sinResultados.style.display = 'block';
        return;
    }

    sinResultados.style.display = 'none';
    catalogo.innerHTML = productosAMostrar.map(producto => `
        <div class="producto">
            <div class="producto-imagen" onclick="ampliarImagen('${producto.imagen}', '${producto.nombre}')">
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;">
            </div>
            <button class="producto-btn" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        </div>
    `).join('');
}

// Aplicar filtros
function aplicarFiltros() {
    let productosFiltrados = productos;

    // Filtro por categoría
    if (filtroActual !== 'todos') {
        productosFiltrados = productosFiltrados.filter(p => p.tipo === filtroActual);
    }

    // Filtro por búsqueda
    if (busquedaActual) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.nombre.toLowerCase().includes(busquedaActual)
        );
    }

    mostrarProductos(productosFiltrados);
}

// Agregar al carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    const itemCarrito = carrito.find(item => item.id === productoId);

    if (itemCarrito) {
        itemCarrito.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    actualizarCarrito();
    mostrarNotificacion("¡Producto agregado al carrito!");
}

// Actualizar carrito
function actualizarCarrito() {
    const contador = document.getElementById('carritoContador');
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = total;
    actualizarModalCarrito();
}

// Actualizar modal de carrito
function actualizarModalCarrito() {
    const carritoItems = document.getElementById('carritoItems');

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p style="text-align: center; color: #999;">Tu carrito está vacío</p>';
        return;
    }

    carritoItems.innerHTML = carrito.map(item => `
        <div class="carrito-item">
            <span class="carrito-item-nombre">${item.nombre}</span>
            <div class="carrito-item-cantidad">
                <button onclick="modificarCantidad(${item.id}, -1)">−</button>
                <span>${item.cantidad}</span>
                <button onclick="modificarCantidad(${item.id}, 1)">+</button>
            </div>
            <button class="carrito-item-eliminar" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        </div>
    `).join('');
}

// Modificar cantidad
function modificarCantidad(productoId, cambio) {
    const item = carrito.find(item => item.id === productoId);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            actualizarCarrito();
        }
    }
}

// Eliminar del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarrito();
    mostrarNotificacion("Producto eliminado del carrito");
}

// Abrir carrito
function abrirCarrito() {
    document.getElementById('modalCarrito').classList.add('activo');
}

// Cerrar carrito
function cerrarCarrito() {
    document.getElementById('modalCarrito').classList.remove('activo');
}

// Finalizar compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    alert(`¡Gracias por tu compra!\n\nTotal: $${total.toFixed(2)}\n\nTus productos han sido procesados.`);
    carrito = [];
    actualizarCarrito();
    cerrarCarrito();
}
// Consultar por WhatsApp
function consultarPorWhatsapp() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Crear mensaje con lista de productos
    let listadoProductos = "Hola, consulta sobre estos productos:%0A%0A";
    carrito.forEach((item, index) => {
        listadoProductos += `${index + 1}. ${item.nombre}%0A   Cantidad: ${item.cantidad}%0A`;
    });
    listadoProductos += "%0AGracias!";

    // Número de WhatsApp
    const numeroWhatsapp = "5493875803393";
    const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${listadoProductos}`;

    // Crear HTML visual con imágenes
    let htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consulta de Productos</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: #f5f5f5;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #25D366;
            text-align: center;
            margin-bottom: 30px;
        }
        .productos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .producto-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .producto-img {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }
        .producto-info {
            padding: 15px;
            text-align: center;
        }
        .producto-nombre {
            font-weight: bold;
            color: #333;
            margin: 10px 0;
            word-break: break-word;
            font-size: 0.9em;
        }
        .producto-cantidad {
            color: #666;
            font-size: 0.85em;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
        }
        .whatsapp-btn {
            display: inline-block;
            background: #25D366;
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            margin: 10px;
            font-size: 1.1em;
            transition: all 0.3s;
        }
        .whatsapp-btn:hover {
            background: #1EA855;
            transform: scale(1.05);
        }
        .cerrar-btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            margin: 10px;
            font-size: 1.1em;
            cursor: pointer;
            border: none;
            transition: all 0.3s;
        }
        .cerrar-btn:hover {
            background: #5568d3;
            transform: scale(1.05);
        }
        .instrucciones {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            color: #1565c0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📸 Tus Productos Seleccionados</h1>
        <div class="instrucciones">
            <p><strong>✅ Haz clic en "Enviar por WhatsApp"</strong> para enviar esta consulta al equipo</p>
        </div>
        <div class="productos-grid">
`;

    // Agregar cada producto con su imagen
    carrito.forEach((item, index) => {
        htmlContent += `
            <div class="producto-card">
                <img src="${item.imagen}" alt="${item.nombre}" class="producto-img">
                <div class="producto-info">
                    <div style="font-size: 1.2em; font-weight: bold; color: #25D366;">${index + 1}</div>
                    <div class="producto-nombre">${item.nombre}</div>
                    <div class="producto-cantidad">Cant: ${item.cantidad}</div>
                </div>
            </div>
        `;
    });

    htmlContent += `
        </div>
        <div class="footer">
            <a href="${urlWhatsapp}" target="_blank" class="whatsapp-btn">
                📱 Enviar por WhatsApp
            </a>
            <button class="cerrar-btn" onclick="window.close()">
                ✕ Cerrar
            </button>
        </div>
    </div>
</body>
</html>
    `;

    // Abrir en nueva ventana
    const newWindow = window.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();

    // Limpiar carrito
    carrito = [];
    actualizarCarrito();
    cerrarCarrito();
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 2000);
}

// Cerrar modal al hacer clic afuera
document.addEventListener('DOMContentLoaded', () => {
    const modalCarrito = document.getElementById('modalCarrito');
    if (modalCarrito) {
        modalCarrito.addEventListener('click', (e) => {
            if (e.target.id === 'modalCarrito') {
                cerrarCarrito();
            }
        });
    }
});

// Ampliar imagen
function ampliarImagen(src, nombre) {
    const modal = document.createElement('div');
    modal.id = 'modalImagen';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        cursor: pointer;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;

    const img = document.createElement('img');
    img.src = src;
    img.alt = nombre;
    img.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 10px;
    `;

    const titulo = document.createElement('p');
    titulo.textContent = nombre;
    titulo.style.cssText = `
        color: white;
        margin-top: 20px;
        text-align: center;
        font-size: 1.1em;
        max-width: 90%;
    `;

    const cerrarBtn = document.createElement('button');
    cerrarBtn.textContent = '✕';
    cerrarBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: white;
        color: black;
        border: none;
        width: 40px;
        height: 40px;
        font-size: 1.5em;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: bold;
    `;
    cerrarBtn.onmouseover = () => cerrarBtn.style.background = '#f0f0f0';
    cerrarBtn.onmouseout = () => cerrarBtn.style.background = 'white';
    cerrarBtn.onclick = (e) => {
        e.stopPropagation();
        modal.remove();
    };

    container.appendChild(cerrarBtn);
    container.appendChild(img);
    container.appendChild(titulo);
    modal.appendChild(container);

    modal.onclick = () => modal.remove();

    document.body.appendChild(modal);
}
