document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:8080/pruebaZarapedCliente/api/cliente/";


    // Elementos del DOM
    const form = document.getElementById("Form");
    const nombreInput = document.getElementById("nombre");
    const apellidosInput = document.getElementById("apellidos");
    const telefonoInput = document.getElementById("telefono");
    const ciudadInput = document.getElementById("ciudad");
    const nombreUsuarioInput = document.getElementById("nombreUsuario");
    const contraseniaInput = document.getElementById("contrasenia");
    const table = document.querySelector(".table tbody");

    // Botones
    const registrarBtn = document.querySelector(".custom-btn1");
    const modificarBtn = document.querySelector(".custom-btn2");
    const eliminarBtn = document.querySelector(".custom-btn3");

    // Cargar las ciudades
const cargarCiudades = async () => {
    try {
        const response = await fetch(apiUrl + "ciudades");
        if (!response.ok) throw new Error("Error al cargar las ciudades");
        const ciudades = await response.json();

        // Verificar si la respuesta contiene las ciudades
        if (ciudades && Array.isArray(ciudades)) {
            // Llenar el select de ciudades
            ciudadInput.innerHTML = '<option value="" disabled selected>Selecciona una ciudad</option>';
            ciudades.forEach(ciudad => {
                ciudadInput.innerHTML += `<option value="${ciudad.idCiudad}">${ciudad.nombre}</option>`;
            });
        } else {
            throw new Error("Formato de respuesta inválido para las ciudades");
        }

    } catch (error) {
        console.error(error);
        alert("Error al cargar las ciudades.");
    }
};

    // Validar campos
    const validarCampos = () => {
        if (!nombreInput.value.trim() || !apellidosInput.value.trim() || !telefonoInput.value.trim() || 
            !ciudadInput.value.trim() || !nombreUsuarioInput.value.trim() || !contraseniaInput.value.trim()) {
            alert("Por favor, completa todos los campos.");
            return false;
        }
        return true;
    };

    // Construir datos para enviar
    const construirDatos = () => {
        const data = new URLSearchParams();
        if (nombreInput.dataset.id) data.append("idCliente", nombreInput.dataset.id);
        data.append("nombre", nombreInput.value);
        data.append("apellidos", apellidosInput.value);
        data.append("telefono", telefonoInput.value);
        data.append("idCiudad", ciudadInput.value);
        data.append("nombreUsuario", nombreUsuarioInput.value);
        data.append("contrasenia", contraseniaInput.value);
        return data;
    };

    // Obtener clientes y mostrar en la tabla
const obtenerClientes = async () => {
    try {
        const response = await fetch(apiUrl + "obtener");
        if (!response.ok) throw new Error("Error al obtener clientes");
        const clientes = await response.json();

        // Limpiar la tabla
        table.innerHTML = "";

        // Llenar la tabla
        clientes.forEach(cliente => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${cliente.idCliente}</td>
                <td>${cliente.persona.nombre}</td>
                <td>${cliente.persona.apellidos}</td>
                <td>${cliente.persona.telefono}</td>
                <td>${cliente.ciudad.nombre}</td>
                <td>${cliente.usuario.nombre}</td>
                <td>${cliente.usuario.contrasenia}</td>
                <td>${cliente.activo ? 'Activo' : 'Inactivo'}</td>  <!-- Mostrar estado -->
                <td>
                    <button class="btn btn-primary btn-sm btn-seleccionar" data-id="${cliente.idCliente}">Seleccionar</button>
                </td>
            `;
            table.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert("Error al cargar clientes.");
    }
};


    // Registrar o actualizar cliente
    const guardarCliente = async (accion) => {
        if (!validarCampos()) return;

        try {
            const url = accion === "registrar" ? apiUrl + "registrar" : apiUrl + "actualizar";
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: construirDatos()
            });

            if (!response.ok) throw new Error(`Error al ${accion} cliente`);
            alert(`Cliente ${accion === "registrar" ? "registrado" : "actualizado"} con éxito.`);
            obtenerClientes(); // Actualizar la tabla
            form.reset();
            delete nombreInput.dataset.id; // Eliminar id seleccionado
        } catch (error) {
            console.error(error);
            alert(`Error al ${accion} cliente.`);
        }
    };

    // Eliminar cliente
    const eliminarCliente = async () => {
        const idCliente = nombreInput.dataset.id; // id del cliente seleccionado
    if (!idCliente) {
        alert("Selecciona un cliente para cambiar su estado.");
        return;
    }

    try {
        const data = new URLSearchParams();
        data.append("idCliente", idCliente);

        const response = await fetch(apiUrl + "eliminar", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data
        });

        if (!response.ok) throw new Error("Error al cambiar el estado del cliente");
        alert("Estado del cliente actualizado con éxito.");
        obtenerClientes(); // Actualizar la tabla
        form.reset();
        delete nombreInput.dataset.id;
    } catch (error) {
        console.error(error);
        alert("Error al cambiar el estado del cliente.");
    }
};

    // Eventos de los botones
    registrarBtn.addEventListener("click", () => guardarCliente("registrar"));
    modificarBtn.addEventListener("click", () => guardarCliente("actualizar"));
    eliminarBtn.addEventListener("click", eliminarCliente);

    // Evento para seleccionar un cliente de la tabla
    table.addEventListener("click", (event) => {
        if (event.target.classList.contains("btn-seleccionar")) {
            const idCliente = event.target.dataset.id;
            const row = event.target.closest("tr");
            const nombre = row.children[1].textContent;
            const apellidos = row.children[2].textContent;
            const telefono = row.children[3].textContent;
            const ciudad = row.children[4].textContent;
            const nombreUsuario = row.children[5].textContent;

            nombreInput.value = nombre;
            apellidosInput.value = apellidos;
            telefonoInput.value = telefono;
            ciudadInput.value = ciudad; // El valor del ID de la ciudad será gestionado por el backend.
            nombreUsuarioInput.value = nombreUsuario;
            nombreInput.dataset.id = idCliente; // Establecer ID del cliente
        }
    });

    // Cargar ciudades al iniciar
    cargarCiudades();
    obtenerClientes();
});

        // Obtener el campo de entrada
        const nombreUsuario = document.getElementById('nombreUsuario');

        // Escuchar el evento 'input' para validar la entrada
        nombreUsuario.addEventListener('input', function (e) {
            // Reemplazar cualquier carácter que no sea letra o espacio
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
        
        function validarMayusculas(input) {
    // Convierte el texto a mayúsculas y elimina caracteres no permitidos
    input.value = input.value.toUpperCase().replace(/[^A-Z\s]/g, '');
}

function validarMinusculas(input) {
    // Convierte el texto a minúsculas y elimina caracteres no permitidos
    input.value = input.value.toLowerCase().replace(/[^a-z\s]/g, '');
}

// También puedes agregar validación en tiempo real si es necesario
document.getElementById('nombreUsuario').addEventListener('input', function (e) {
    e.target.value = e.target.value.toLowerCase().replace(/[^a-z\s]/g, '');
});
