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
    const searchInput = document.getElementById("Input5");
    const table = document.querySelector(".table tbody");

    // Botones
    const registrarBtn = document.querySelector(".custom-btn1");
    const modificarBtn = document.querySelector(".custom-btn2");
    const eliminarBtn = document.querySelector(".custom-btn3");

    // Mostrar clientes en la tabla
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
        <td>${cliente.usuario.contrasenia}</td> <!-- Columna de contraseña -->
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

    // Registrar cliente
    const registrarCliente = async () => {
        try {
            const data = new URLSearchParams();
            data.append("nombre", nombreInput.value);
            data.append("apellidos", apellidosInput.value);
            data.append("telefono", telefonoInput.value);
            data.append("idCiudad", ciudadInput.value);
            data.append("nombreUsuario", nombreUsuarioInput.value);
            data.append("contrasenia", contraseniaInput.value);

            const response = await fetch(apiUrl + "registrar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data
            });

            if (!response.ok) throw new Error("Error al registrar cliente");
            alert("Cliente registrado con éxito.");
            obtenerClientes(); // Actualizar la tabla
        } catch (error) {
            console.error(error);
            alert("Error al registrar cliente.");
        }
    };

    // Actualizar cliente
    const actualizarCliente = async () => {
        try {
            const data = new URLSearchParams();
            data.append("idCliente", nombreInput.dataset.id); // id del cliente seleccionado
            data.append("nombre", nombreInput.value);
            data.append("apellidos", apellidosInput.value);
            data.append("telefono", telefonoInput.value);
            data.append("idCiudad", ciudadInput.value);
            data.append("nombreUsuario", nombreUsuarioInput.value);
            data.append("contrasenia", contraseniaInput.value);

            const response = await fetch(apiUrl + "actualizar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data
            });

            if (!response.ok) throw new Error("Error al actualizar cliente");
            alert("Cliente actualizado con éxito.");
            obtenerClientes(); // Actualizar la tabla
        } catch (error) {
            console.error(error);
            alert("Error al actualizar cliente.");
        }
    };

    // Eliminar cliente
    const eliminarCliente = async () => {
        try {
            const idCliente = nombreInput.dataset.id; // id del cliente seleccionado
            if (!idCliente) {
                alert("Selecciona un cliente para eliminar.");
                return;
            }

            const data = new URLSearchParams();
            data.append("idCliente", idCliente);

            const response = await fetch(apiUrl + "eliminar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data
            });

            if (!response.ok) throw new Error("Error al eliminar cliente");
            alert("Cliente eliminado con éxito.");
            obtenerClientes(); // Actualizar la tabla
        } catch (error) {
            console.error(error);
            alert("Error al eliminar cliente.");
        }
    };

    // Seleccionar cliente
    table.addEventListener("click", event => {
        if (event.target.classList.contains("btn-seleccionar")) {
            const row = event.target.closest("tr");
            const cells = row.querySelectorAll("td");

            // Rellenar los campos con los datos del cliente seleccionado
            nombreInput.dataset.id = event.target.dataset.id; // Guardar el id del cliente
            nombreInput.value = cells[1].textContent;
            apellidosInput.value = cells[2].textContent;
            telefonoInput.value = cells[3].textContent;
            ciudadInput.value = cells[4].textContent;
            nombreUsuarioInput.value = cells[5].textContent;
        }
    });

    // Eventos de los botones
    registrarBtn.addEventListener("click", registrarCliente);
    modificarBtn.addEventListener("click", actualizarCliente);
    eliminarBtn.addEventListener("click", eliminarCliente);

    // Cargar clientes al cargar la página
    obtenerClientes();
});
