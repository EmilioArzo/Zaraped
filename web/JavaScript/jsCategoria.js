document.addEventListener("DOMContentLoaded", () => {
    // Cargar todas las categorías al cargar la página
    getAllCategorias();

    // Escuchar los eventos de clic en la tabla para cargar datos en los inputs
    document.getElementById("tablaRegistros").addEventListener("click", cargarCategoria);
});

// URL base del servidor
const BASE_URL = "http://localhost:8080/pruebaZarapedCliente/api/categoria";

// Obtener todas las categorías y mostrarlas en la tabla
function getAllCategorias() {
    fetch(`${BASE_URL}/getAllCategorias`)
        .then(response => response.json())
        .then(data => {
            // Limpiar la tabla antes de agregar nuevas filas
            const tbody = document.getElementById("tablaCuerpo");
            tbody.innerHTML = "";

            data.forEach(categoria => {
                const row = document.createElement("tr");
                row.setAttribute("data-id", categoria.idCategoria);
                row.innerHTML = `
                    <td>${categoria.idCategoria}</td>
                    <td>${categoria.descripcion}</td>
                    <td>${categoria.tipo}</td>
                    <td>${categoria.activo === 1 ? "Activo" : "Inactivo"}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error("Error al obtener categorías:", error));
}

// Insertar una nueva categoría
function insertar() {
    const descripcion = document.getElementById("txtDescripcion").value; // Descripción
    const tipo = document.getElementById("txtTipo").value; // Tipo

    if (!descripcion || !tipo) {
        alert("Por favor, complete los campos de descripción y tipo.");
        return;
    }

    const data = new URLSearchParams();
    data.append("descripcion", descripcion);
    data.append("tipo", tipo);

    fetch(`${BASE_URL}/insertCategoria`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    })
    .then(response => response.json())
    .then(data => {
        alert("Categoría insertada correctamente.");
        getAllCategorias();  // Recargar la lista de categorías
        limpiarFormulario();
    })
    .catch(error => console.error("Error al insertar la categoría:", error));
}

// Actualizar una categoría existente
function actualizar() {
    const id = document.getElementById("txtId").value;
    const descripcion = document.getElementById("txtDescripcion").value;
    const tipo = document.getElementById("txtTipo").value;
    const activo = 1;  // Establecer como activo (puedes modificarlo según la lógica)

    if (!id || !descripcion || !tipo) {
        alert("Por favor, complete los campos de ID, descripción y tipo.");
        return;
    }

    const data = new URLSearchParams();
    data.append("idCategoria", id);
    data.append("descripcion", descripcion);
    data.append("tipo", tipo);
    data.append("activo", activo);

    fetch(`${BASE_URL}/updateCategoria`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    })
    .then(response => response.json())
    .then(data => {
        alert("Categoría actualizada correctamente.");
        getAllCategorias();  // Recargar la lista de categorías
        limpiarFormulario();
    })
    .catch(error => console.error("Error al actualizar la categoría:", error));
}

// Eliminar (inactivar) una categoría
function eliminar() {
    const id = document.getElementById("txtId").value;

    if (!id) {
        alert("Por favor, seleccione una categoría para eliminar.");
        return;
    }

    const data = new URLSearchParams();
    data.append("idCategoria", id);

    fetch(`${BASE_URL}/deleteCategoria`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    })
    .then(response => response.json())
    .then(data => {
        alert("Categoría eliminada correctamente.");
        getAllCategorias();  // Recargar la lista de categorías
        limpiarFormulario();
    })
    .catch(error => console.error("Error al eliminar la categoría:", error));
}

// Limpiar el formulario
function limpiarFormulario() {
    document.getElementById("txtId").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtTipo").value = "";
}

// Cargar los datos de la categoría seleccionada en la tabla
function cargarCategoria(event) {
    const row = event.target.closest("tr");

    if (row) {
        const idCategoria = row.getAttribute("data-id");

        fetch(`${BASE_URL}/getCategoriaById?idCategoria=${idCategoria}`)
            .then(response => response.json())
            .then(categoria => {
                if (categoria.idCategoria) {
                    document.getElementById("txtId").value = categoria.idCategoria;
                    document.getElementById("txtDescripcion").value = categoria.descripcion;
                    document.getElementById("txtTipo").value = categoria.tipo;
                } else {
                    alert("Categoría no encontrada.");
                }
            })
            .catch(error => console.error("Error al cargar la categoría:", error));
    }
    
    window.onload = getAllCategorias;
}

