document.addEventListener("DOMContentLoaded", function () {
    cargarAlimentos();
    cargarCategorias();
    
    const inputBuscar = document.getElementById("txtBuscar");
    const tabla = document.getElementById("tablaAlimentos");
    const filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    inputBuscar.addEventListener("input", function () {
        const valorBusqueda = inputBuscar.value.trim().toLowerCase();

        // Iteramos sobre cada fila de la tabla
        Array.from(filas).forEach((fila) => {
            // Obtenemos los valores de las celdas relevantes
            const columnas = fila.getElementsByTagName("td");
            const registro = columnas[0]?.textContent.trim().toLowerCase() || "";
            const nombre = columnas[1]?.textContent.trim().toLowerCase() || "";
            const categoria = columnas[3]?.textContent.trim().toLowerCase() || "";
            const precio = columnas[4]?.textContent.trim().toLowerCase() || "";

            // Verificamos si hay coincidencia parcial en alguna de las columnas
            if (
                registro.includes(valorBusqueda) || 
                nombre.includes(valorBusqueda) ||
                categoria.includes(valorBusqueda) ||
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


function insertarAlimento() {
    let ruta = "http://localhost:8080/pruebaZarapedCliente/api/alimento/insertarAlimento";

    let categoria = document.getElementById("txtCategoria").data;
    let nombre = document.getElementById("txtNombre").value;
    let descripcion = document.getElementById("txtDescripcion").value;
    let foto = document.getElementById("txtFoto").getAttribute("data-base64");
    let precio = parseFloat(document.getElementById("txtPrecio").value);

    let alimento = {
        categoria: categoria,
        alimento: nombre,
        descripcion: descripcion,
        foto: foto,
        precio: precio
    };
    


    let params = new URLSearchParams(alimento);

    console.log("Datos enviados:", {
    categoria,
    nombre,
    descripcion,
    foto: foto?.substring(0, 50) + "...", // Mostrar solo parte de la base64
    precio
});
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    };

    fetch(ruta, requestOptions)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            alert("Alimento registrado con éxito.");
            cargarAlimentos();
            limpiarCampos();
        })
        .catch(error => console.error("Error al insertar alimento: ", error));
}

function actualizarAlimento() {
    let ruta = "http://localhost:8080/pruebaZarapedCliente/api/alimento/actualizarAlimento";

    let idAlimento = parseInt(document.getElementById("txtIdAlimento").value);
    let nombre = document.getElementById("txtNombre").value;
    let descripcion = document.getElementById("txtDescripcion").value;
    let selectCategoria = document.getElementById("txtCategoria");
    let categoria = selectCategoria.options[selectCategoria.selectedIndex].text;
    let precio = parseFloat(document.getElementById("txtPrecio").value);
    let foto = document.getElementById("txtFoto").getAttribute("data-base64");
    

    let alimento = {
        idAlimento: idAlimento,
        nombre: nombre,
        descripcion: descripcion,
        categoria: categoria,
        precio: precio,
        foto: foto
    };

    let params = new URLSearchParams(alimento);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    };

    fetch(ruta, requestOptions)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            alert("Alimento actualizado con éxito.");
            limpiarCampos();
            cargarAlimentos();
            
        })
        .catch(error => console.error("Error al actualizar alimento: ", error));
}

function eliminarAlimento() {
    let ruta = "http://localhost:8080/pruebaZarapedCliente/api/alimento/eliminarAlimento";

    let idAlimento = parseInt(document.getElementById("txtIdAlimento").value);

    let params = new URLSearchParams({ idAlimento: idAlimento });

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    };

    fetch(ruta, requestOptions)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            alert("Alimento eliminado con éxito.");
            cargarAlimentos();
            limpiarCampos();
        })
        .catch(error => console.error("Error al eliminar alimento: ", error));
}

function cargarAlimentos() {
    let ruta = "http://localhost:8080/pruebaZarapedCliente/api/alimento/getAllAlimentos";

        fetch(ruta)
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById("tablaAlimentos").getElementsByTagName('tbody')[0];

            // Limpia la tabla antes de agregar los datos
            tabla.innerHTML = "";

            // Itera sobre cada alimento y llena la tabla
            data.forEach(alimento => {
                const fila = tabla.insertRow();

                fila.insertCell(0).innerText = alimento.idAlimento || "Sin ID";
                fila.insertCell(1).innerText = alimento.producto?.nombre || "Sin nombre";
                fila.insertCell(2).innerText = alimento.producto?.descripcion || "Sin descripción";
                fila.insertCell(3).innerText = alimento.producto?.categoria?.descripcion || "Sin categoría";
                fila.insertCell(4).innerText = alimento.producto?.precio || "Sin precio";
                
                fila.insertCell(5).innerHTML = 
                        alimento.producto.foto  === "NULL" ? 
                        "Sin imagen" : 
                        `<img src="${alimento.producto.foto}" alt="Imagen" style="width:50px; height:50px;">`;
            
                fila.insertCell(6).innerText = alimento.producto?.activo === 1 ? "Activo" : "Inactivo";

                // Agrega un manejador de eventos para llenar el formulario al hacer clic en la fila
                fila.addEventListener("click", function () {
                    document.getElementById("txtIdAlimento").value = alimento.idAlimento || "";
                    document.getElementById("txtNombre").value = alimento.producto?.nombre || "";
                    document.getElementById("txtDescripcion").value = alimento.producto?.descripcion || "";
                    document.getElementById("txtPrecio").value = alimento.producto?.precio || "";
                    document.getElementById("txtFoto").setAttribute("data-base64", alimento.producto?.foto || "");
                    let categoria = document.getElementById("txtCategoria");
                    let descripcionCategoria = alimento.producto?.categoria?.descripcion || "";
                    
                    // Buscar y seleccionar la opción que coincide con el texto de la categoría
                    for (let i = 0; i < categoria.options.length; i++) {
                       if (categoria.options[i].text === descripcionCategoria) {
                           categoria.selectedIndex = i;
                    break;
                       }
                   }
                });
            });
        })
        .catch(error => {
            console.error("Error al cargar los datos de alimentos:", error);
        });
}

function cargarCategorias(){
    const ruta = "http://localhost:8080/pruebaZarapedCliente/api/alimento/categorias";

    fetch(ruta)
        .then(response => response.json())
        .then(data => {
            const selectCategorias = document.getElementById("txtCategoria");

            // Limpia el contenido actual del select
            selectCategorias.innerHTML = "<option value=''>Seleccione una categoría</option>";

            // Agrega las categorías al select
            data.forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria.idCategoria;
                option.textContent = categoria.descripcion;
                selectCategorias.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar las categorías:", error);
        });
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
        document.getElementById("txtFoto").setAttribute("data-base64", base64Image);

        // Previsualización de la imagen
        document.getElementById("imagen").src = base64Image;
    };
    reader.readAsDataURL(file);
}

function limpiarCampos() {
    document.getElementById("txtIdAlimento").value = "";
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtCategoria").value = "";
    document.getElementById("txtPrecio").value = "";
    document.getElementById("txtFoto").value = "";
    document.getElementById("imagen").src = "";
}
