



document.addEventListener("DOMContentLoaded", function () {
    const formEmpleado = document.getElementById("formEmpleado");
    const nombrePersona = document.getElementById("nombrePersona");
    const apellidosPersona = document.getElementById("apellidosPersona");
    const telefonoPersona = document.getElementById("telefonoPersona");
    const ciudadPersona = document.getElementById("ciudadPersona");
    const nombreUsuario = document.getElementById("nombreUsuario");
    const contraseniaUsuario = document.getElementById("contraseniaUsuario");
    const idSucursal = document.getElementById("idSucursal");
    const activoEmpleado = document.getElementById("activoEmpleado");
    const idEmpleadoInput = document.getElementById("idEmpleado");
    const tableBody = document.getElementById("table-body");
    const inputBusqueda = document.getElementById("Input5");

    const apiBaseUrl = "http://localhost:8080/pruebaZarapedCliente/api/empleado";

    // Variable para almacenar los empleados en memoria
    let empleados = [];

    // Función para obtener el siguiente ID del empleado
    function obtenerSiguienteIdEmpleado() {
        fetch(`${apiBaseUrl}/getall`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const ultimoEmpleado = data[data.length - 1];
                    const siguienteId = ultimoEmpleado.idEmpleado + 1;
                    idEmpleadoInput.value = siguienteId;
                } else {
                    idEmpleadoInput.value = 1;
                }
            })
            .catch(error => {
                console.error("Error al obtener el último empleado:", error);
                idEmpleadoInput.value = 1;
            });
    }

    obtenerSiguienteIdEmpleado();

    // Función para registrar un nuevo empleado
    document.getElementById("registrarEmpleado").addEventListener("click", function (e) {
        e.preventDefault();
        const empleadoData = {
            idEmpleado: idEmpleadoInput.value,
            nombrePersona: nombrePersona.value,
            apellidosPersona: apellidosPersona.value,
            telefonoPersona: telefonoPersona.value,
            idCiudadPersona: ciudadPersona.value,
            nombreUsuario: nombreUsuario.value,
            contraseniaUsuario: contraseniaUsuario.value,
            activoUsuario: 1,
            idSucursal: idSucursal.value,
            activoEmpleado: activoEmpleado.value
        };

        fetch(`${apiBaseUrl}/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(empleadoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === "Empleado insertado exitosamente") {
                alert("Empleado registrado exitosamente");
                obtenerEmpleados();
                obtenerSiguienteIdEmpleado();
                limpiarCampos(); // Limpiar campos después de insertar
            } else {
                alert("Error al registrar empleado");
            }
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
            alert("Ocurrió un error al procesar la solicitud");
        });
    });

    // Función para actualizar un empleado
    document.getElementById("modificarEmpleado").addEventListener("click", function (e) {
        e.preventDefault();
        const empleadoData = {
            idEmpleado: idEmpleadoInput.value,
            nombrePersona: nombrePersona.value,
            apellidosPersona: apellidosPersona.value,
            telefonoPersona: telefonoPersona.value,
            idCiudadPersona: ciudadPersona.value,
            nombreUsuario: nombreUsuario.value,
            contraseniaUsuario: contraseniaUsuario.value,
            activoUsuario: 1,
            idSucursal: idSucursal.value,
            activoEmpleado: activoEmpleado.value
        };

        fetch(`${apiBaseUrl}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(empleadoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === "Empleado actualizado exitosamente") {
                alert("Empleado modificado exitosamente");
                obtenerEmpleados();
                limpiarCampos(); // Limpiar campos después de insertar
            } else {
                alert("Error al modificar empleado");
            }
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
            alert("Ocurrió un error al procesar la solicitud");
        });
    });

    // Función para dar de baja a un empleado
document.getElementById("eliminarEmpleado").addEventListener("click", function (e) {
    e.preventDefault();
    
    const idEmpleado = idEmpleadoInput.value;  // Obtener el id del empleado del formulario

    // Realizar la petición para cambiar el estado de activo a 0
    fetch(`${apiBaseUrl}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            idEmpleado: idEmpleado
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "Empleado dado de baja exitosamente") {
            alert("Empleado dado de baja exitosamente");
            obtenerEmpleados();  // Recargar la lista de empleados sin los dados de baja
            limpiarCampos();     // Limpiar los campos del formulario
        } else {
            alert("Error al dar de baja al empleado");
        }
    })
    .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        alert("Ocurrió un error al procesar la solicitud");
    });
});




// Función para obtener todos los empleados
function obtenerEmpleados() {
    fetch(`${apiBaseUrl}/getall`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                // Filtramos los empleados activos (activo == 1)
                const empleadosActivos = data.filter(empleado => empleado.activo === 1);
                
                // Ordenar los empleados por idEmpleado de menor a mayor
                empleadosActivos.sort((a, b) => a.idEmpleado - b.idEmpleado);

                empleados = empleadosActivos; // Asignamos solo los empleados activos a la variable global
                llenarTabla(empleadosActivos); // Llenamos la tabla con los empleados activos
            } else {
                tableBody.innerHTML = "<tr><td colspan='6'>No se encontraron empleados</td></tr>";
            }
        })
        .catch(error => {
            console.error("Error al obtener empleados:", error);
            tableBody.innerHTML = "<tr><td colspan='6'>Error al cargar los empleados</td></tr>";
        });
}

// Función para llenar la tabla con los empleados
function llenarTabla(empleados) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

    empleados.forEach(empleado => {
        const fila = document.createElement("tr");
        fila.setAttribute("data-id", empleado.idEmpleado);
        fila.innerHTML = `
            <td>${empleado.idEmpleado || "N/A"}</td>
            <td>${empleado.persona?.nombre || "N/A"} ${empleado.persona?.apellidos || ""}</td>
            <td>${empleado.persona?.telefono || "N/A"}</td>
            <td>${empleado.persona?.ciudad?.nombre || "N/A"}</td>
            <td>${empleado.sucursal?.nombre || "N/A"}</td>
            <td>${empleado.usuario?.nombre || "N/A"}</td>
        `;
        tableBody.appendChild(fila);
    });
}




    // Función para cargar los datos del empleado seleccionado en el formulario
    function cargarEmpleadoEnFormulario(empleado) {
        fetch(`${apiBaseUrl}/getall`)
    .then(response => response.json())
    .then(data => {
        console.log("Datos recibidos del backend:", data);
        empleados = data;

        // Verificar si los datos son correctos
        empleados.forEach(empleado => {
            // Verifica si 'activo' está en el lugar correcto (empleado.usuario.activo)
            const activoEmpleado = document.getElementById("activoEmpleado");

            // Verificar el valor de 'activo' de cada empleado
            console.log("Activo del empleado:", empleado.usuario.activo);

            // Asignar el valor de "activo" a la opción correspondiente
            if (empleado.usuario.activo === 1) {
                console.log("Valor asignado: Sí");
                activoEmpleado.value = "1";  // Establece 'Sí' si activo es 1
            } else {
                console.log("Valor asignado: No");
                activoEmpleado.value = "0";  // Establece 'No' si activo es 0
            }
        });

        llenarTabla(data);  // Si tienes una función para llenar la tabla
    })
    .catch(error => {
        console.error("Error al obtener empleados:", error);
        tableBody.innerHTML = "<tr><td colspan='6'>Error al cargar los empleados</td></tr>";
    });
        
        
    console.log("Valor de activoEmpleado al cargar el empleado:", empleado.activoEmpleado);  // Verifica el valor

    nombrePersona.value = empleado.persona.nombre || "";
    apellidosPersona.value = empleado.persona.apellidos || "";
    telefonoPersona.value = empleado.persona.telefono || "";
    ciudadPersona.value = empleado.persona.ciudad.idCiudad || "";
    nombreUsuario.value = empleado.usuario.nombre || "";
    contraseniaUsuario.value = empleado.usuario.contrasenia || "";
    idSucursal.value = empleado.sucursal.idSucursal || "";

    // Asignamos el valor de activoEmpleado y mostramos 'Sí' o 'No'
    if (empleado.activoEmpleado === 1) {
        activoEmpleado.value = "1"; // Si es 1, seleccionamos 'Sí'
    } else {
        activoEmpleado.value = "0"; // Si es 0, seleccionamos 'No'
    }

    // Aseguramos que el campo 'Activo' se actualice correctamente
    if (activoEmpleado.value === "1") {
        activoEmpleado.options[0].selected = true;  // Selecciona 'Sí'
        activoEmpleado.options[1].selected = false; // Desmarca 'No'
    } else {
        activoEmpleado.options[0].selected = false; // Desmarca 'Sí'
        activoEmpleado.options[1].selected = true;  // Selecciona 'No'
    }

    // Esto es para asegurarnos de que el idEmpleado también esté visible, aunque desactivado
    idEmpleadoInput.value = empleado.idEmpleado;  // Asigna el ID del empleado
}

    // Evento para seleccionar un empleado de la tabla
    tableBody.addEventListener("click", function (e) {
        const filaSeleccionada = e.target.closest("tr");
        if (filaSeleccionada) {
            const idEmpleadoSeleccionado = filaSeleccionada.getAttribute("data-id");
            const empleado = empleados.find(emp => emp.idEmpleado == idEmpleadoSeleccionado);
            if (empleado) {
                cargarEmpleadoEnFormulario(empleado);
            }
        }
    });
    
    
    
    function limpiarCampos(){
    // Limpiar todos los inputs
    nombrePersona.value = "";
    apellidosPersona.value = "";
    telefonoPersona.value = "";
    ciudadPersona.value = "";
    nombreUsuario.value = "";
    contraseniaUsuario.value = "";
    idSucursal.value = "";
    activoEmpleado.value = "1"; // Restablecer a "Sí"
    idEmpleadoInput.value = ""; // Limpiar el ID del empleado
}



// Implementación de búsqueda
inputBusqueda.addEventListener("input", function () {
    const busqueda = inputBusqueda.value.toLowerCase();

    // Filtrar empleados por idEmpleado, nombre o apellidos
    const empleadosFiltrados = empleados.filter(empleado => 
        empleado.idEmpleado.toString().includes(busqueda) ||  // Buscar por idEmpleado
        `${empleado.persona?.nombre} ${empleado.persona?.apellidos}`.toLowerCase().includes(busqueda)  // Buscar por nombre o apellidos
    );

    // Llenar la tabla con los empleados filtrados
    llenarTabla(empleadosFiltrados);
});


    
    

    obtenerEmpleados();
});
