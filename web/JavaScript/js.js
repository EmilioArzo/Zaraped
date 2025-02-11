// Cargar la tabla al iniciar



document.addEventListener("DOMContentLoaded", function () {
    cargarCategorias();
    CargarTabla(); 
});

const baseUrl = "http://localhost:8080/pruebaZarapedCliente/api/bebida";

function insertar() {
    const ruta = `${baseUrl}/insert`;
    
    let nombreBebida = document.getElementById("txtNombre").value.trim();
    let descripcionBebida = document.getElementById("txtDescripcion").value.trim();
    let fotoBebida = document.getElementById("filImagen").getAttribute("data-base64");
    let precioBebida = parseFloat(document.getElementById("txtPrecio").value);
    let idCategoria = parseInt(document.getElementById("txtCategoria").value);
    
     // Log para verificar los datos recolectados antes de enviarlos
    console.log("Datos enviados:", {
    nombreBebida,
    descripcionBebida,
    fotoBebida: fotoBebida?.substring(0, 50) + "...", // Mostrar solo parte de la base64
    precioBebida,
    idCategoria
});
   
    const datos = new URLSearchParams();
    datos.append("nombre", nombreBebida);
    datos.append("descripcion", descripcionBebida);
    datos.append("foto", fotoBebida);
    datos.append("precio", precioBebida);
    datos.append("idCategoria", idCategoria);
    
    
    if (fotoBebida.length > 1_000_000) { // 1 MB de límite
    alert("La imagen es demasiado grande. Por favor, usa una imagen más pequeña.");
    return;
}

    fetch(ruta, {
        method: "POST",
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: datos.toString()
    })
    .then(response => {
        console.log("Respuesta del servidor:", response.status, response.statusText);
        if (!response.ok) throw new Error("Error al agregar la bebida.");
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);
        alert(data.mensaje);
        CargarTabla(); // Recargar tabla
        limpiar(); // Limpiar campos
    })
    .catch(error => console.error("Error:", error)); 
    CargarTabla();    
}

function convertImageToBase64(event) {
    const file = event.target.files[0];
    
    if (!file) {
        console.error("No se seleccionó ningún archivo.");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;
         // Guardar la imagen en base64 en un atributo personalizado
        document.getElementById("filImagen").setAttribute("data-base64", base64Image);

        // Previsualización de la imagen
        document.getElementById("previewImage").src = base64Image;
    };
    reader.readAsDataURL(file);
}

function CargarTabla() {
//    const ruta = "http://localhost:8080/pruebaZarapedCliente/api/bebida/getall";
const ruta = `${baseUrl}/getall`;
    fetch(ruta)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Respuesta del servidor:", data);

            const tablaRegistros = document.getElementById("tablaRegistros").getElementsByTagName("tbody")[0];
            tablaRegistros.innerHTML = "";

            if (Array.isArray(data)) {
                data.forEach(bebida => {
                    const nuevaFila = tablaRegistros.insertRow();

                    // Acceder correctamente a las propiedades del JSON
                    nuevaFila.insertCell(0).innerHTML = bebida.producto.idProducto;
                    nuevaFila.insertCell(1).innerHTML = bebida.producto.nombre;
                    nuevaFila.insertCell(2).innerHTML = bebida.producto.descripcion;

                    // Manejo de la imagen (mostrar texto si es "NULL")
                    nuevaFila.insertCell(3).innerHTML = 
                        bebida.producto.foto === "NULL" ? 
                        "Sin imagen" : 
                        `<img src="${bebida.producto.foto}" alt="Imagen" style="width:50px; height:50px;">`;

                    nuevaFila.insertCell(4).innerHTML = bebida.producto.precio;
                    nuevaFila.insertCell(5).innerHTML = bebida.producto.categoria.descripcion;
                    nuevaFila.insertCell(6).innerHTML = bebida.producto.categoria.tipo;

                    // Evento para llenar el formulario al hacer clic en una fila
                    nuevaFila.addEventListener("click", () => {
                            console.log("Datos de la fila seleccionada:", bebida.producto);
                            
                        document.getElementById("txtId").value = bebida.producto.idProducto;
                        document.getElementById("txtNombre").value = bebida.producto.nombre;
                        document.getElementById("txtDescripcion").value = bebida.producto.descripcion;
                        document.getElementById("txtPrecio").value = bebida.producto.precio;
                        document.getElementById("txtCategoria").value = bebida.producto.categoria.descripcion;
                        
                         // Previsualizar imagen en el campo de previsualización
    const previewImage = document.getElementById("previewImage");
    if (bebida.producto.foto) {
        previewImage.src = bebida.producto.foto; // Base64 o URL
        previewImage.style.opacity = ".5"; // Mostrar la imagen con opacidad normal
    } else {
        previewImage.src = "imagenes/img-PlaceHolder-InsertarBebida.png"; // Imagen predeterminada
        previewImage.style.opacity = "0.5"; // Opacidad reducida
    }
                        
                    });
                });
            } else {
                console.error("Error: La respuesta no es un array válido", data);
            }
        })
        .catch(error => console.error("Error al cargar los datos:", error));
}

function actualizar() {
    const ruta = `${baseUrl}/update`;

    let idProducto = parseInt(document.getElementById("txtId").value.trim());
    let nombreBebida = document.getElementById("txtNombre").value.trim();
    let descripcionBebida = document.getElementById("txtDescripcion").value.trim();
    let fotoBebida = document.getElementById("filImagen").getAttribute("data-base64");
    let precio = parseFloat(document.getElementById("txtPrecio").value);
    let idCategoria = parseInt(document.getElementById("txtCategoria").value);

    // Validación del ID
    if (isNaN(idProducto) || idProducto <= 0) {
        alert("El ID del producto no es válido.");
        return;
    }

    // Validación de la imagen
    if (fotoBebida.length > 1_000_000) { // 1 MB de límite
        alert("La imagen es demasiado grande. Por favor, usa una imagen más pequeña.");
        return;
    }

    const datos = new URLSearchParams();
    datos.append("idProducto", idProducto); // Enviamos el ID correcto
    datos.append("nombre", nombreBebida);
    datos.append("descripcion", descripcionBebida);
    datos.append("foto", fotoBebida);
    datos.append("precio", precio);
    datos.append("idCategoria", idCategoria);

    fetch(ruta, {
        method: "POST", // Usamos POST para mantener consistencia
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: datos.toString()
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al actualizar la bebida.");
            return response.json();
        })
        .then((data) => {
            alert(data.mensaje);
            CargarTabla(); // Recargar tabla
            limpiar(); // Limpiar formulario
        })
        .catch((error) => console.error("Error:", error));

}

function eliminar() {
    const ruta = `${baseUrl}/delete`;
    let idProducto = parseInt(document.getElementById("txtId").value.trim());

   if (!idProducto || isNaN(idProducto) || parseInt(idProducto) <= 0) { 
       alert("ID del producto no válido."); 
       return; }

    const datos = new URLSearchParams();
    datos.append("idProducto", idProducto);

    fetch(ruta, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: datos.toString(),
    })
        .then((response) => {
            console.log("Respuesta del servidor:", response.status, response.statusText);
            if (!response.ok) throw new Error("Error al eliminar la bebida.");
            return response.json();
        })
        .then((data) => {
            console.log("Datos recibidos:", data);
            alert(data.mensaje);
            CargarTabla(); // Recargar la tabla después de eliminar
            limpiar();
        })
//        .catch((error) => {
//            console.error("Error:", error);
//            alert("No se pudo eliminar el producto.");
//        });
}

function limpiar() {
    document.getElementById("txtId").value = "";
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtPrecio").value = "";
    document.getElementById("txtCategoria").value = "";
}


const API_URL = "http://localhost:8080/pruebaZarapedCliente/api/bebida/getAllCategorias";

async function cargarCategorias() {
    try {
        // Realiza la solicitud a la API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }


        // Convierte la respuesta en un JSON
        const categorias = await response.json();

 console.log("Categorías recibidas:", categorias); 
 
        // Verifica si las categorías están llegando correctamente
        if (!categorias || categorias.length === 0) {
            console.warn("No hay categorías para mostrar.");
            return;
        }

        // Busca el contenedor donde se mostrarán las descripciones
        const selectCategoria = document.getElementById("txtCategoria");
        selectCategoria.innerHTML = ""; // Limpia el contenido previo

        // Itera sobre las categorías y las añade al contenedor
        categorias.forEach((categoria) => {
            const option = document.createElement("option");
            option.value = categoria.idCategoria;
            option.textContent = categoria.descripcion; // Muestra la descripción
            selectCategoria.appendChild(option);
            console.log("Agregando opción:", categoria.descripcion);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

// Llama a la función cuando se cargue la página
document.addEventListener("DOMContentLoaded", cargarCategorias);

document.addEventListener("DOMContentLoaded", function () {
    const inputBuscar = document.getElementById("txtBuscar");
    const tabla = document.getElementById("tablaRegistros");
    const filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    inputBuscar.addEventListener("input", function () {
        const valorBusqueda = inputBuscar.value.trim().toLowerCase();

        // Iteramos sobre cada fila de la tabla
        Array.from(filas).forEach((fila) => {
            // Obtenemos los valores de las celdas relevantes
            const columnas = fila.getElementsByTagName("td");
            const idProducto = columnas[0]?.textContent.trim().toLowerCase() || "";
            const nombre = columnas[1]?.textContent.trim().toLowerCase() || "";
            const descripcion = columnas[2]?.textContent.trim().toLowerCase() || "";
            const precio = columnas[4]?.textContent.trim().toLowerCase() || "";

            // Verificamos si hay coincidencia parcial en alguna de las columnas
            if (
                idProducto.includes(valorBusqueda) || 
                nombre.includes(valorBusqueda) ||
                descripcion.includes(valorBusqueda) ||
                precio.includes(valorBusqueda)
            ) {
                fila.style.display = ""; // Mostrar fila
            } else {
                fila.style.display = "none"; // Ocultar fila
            }
        });

        // Restaurar todas las filas si el campo está vacío
        if (valorBusqueda === "") {
            Array.from(filas).forEach((fila) => (fila.style.display = ""));
        }
    });
});

