package REST;

import com.google.gson.Gson;
import controladores.controladorCliente;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import modelo.modeloClientes;

import java.util.List;

@Path("cliente")
public class restCliente extends Application {

    @Path("registrar")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response registrarCliente(
            @FormParam("nombre") String nombre,
            @FormParam("apellidos") String apellidos,
            @FormParam("telefono") String telefono,
            @FormParam("idCiudad") int idCiudad,
            @FormParam("nombreUsuario") String nombreUsuario,
            @FormParam("contrasenia") String contrasenia
    ) {
        controladorCliente ctrl = new controladorCliente();
        ctrl.registrarCliente(nombre, apellidos, telefono, idCiudad, nombreUsuario, contrasenia);
        return Response.status(Response.Status.CREATED).entity("{\"result\":\"Cliente registrado\"}").build();
    }

    @Path("actualizar")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response actualizarCliente(
            @FormParam("idCliente") int idCliente,
            @FormParam("nombre") String nombre,
            @FormParam("apellidos") String apellidos,
            @FormParam("telefono") String telefono,
            @FormParam("idCiudad") int idCiudad,
            @FormParam("nombreUsuario") String nombreUsuario,
            @FormParam("contrasenia") String contrasenia
    ) {
        controladorCliente ctrl = new controladorCliente();
        ctrl.actualizarCliente(idCliente, nombre, apellidos, telefono, idCiudad, nombreUsuario, contrasenia);
        return Response.ok("{\"result\":\"Cliente actualizado\"}").build();
    }

    @Path("eliminar")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarCliente(@FormParam("idCliente") int idCliente) {
        controladorCliente ctrl = new controladorCliente();
        System.out.println("El id que enviaste es" + idCliente);
        ctrl.eliminarCliente(idCliente);
        return Response.ok("{\"result\":\"Cliente eliminado\"}").build();
    }

    @Path("obtener")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerClientes() {
        controladorCliente ctrl = new controladorCliente();
        List<modeloClientes.Cliente> clientes = ctrl.obtenerClientes();

        Gson gson = new Gson();
        return Response.ok(gson.toJson(clientes)).build();
    }
@Path("ciudades")
@GET
@Produces(MediaType.APPLICATION_JSON)
public Response obtenerCiudades() {
    controladorCliente ctrl = new controladorCliente();
    List<modelo.modeloCiudad> ciudades = ctrl.obtenerCiudades();

    Gson gson = new Gson();
    return Response.ok(gson.toJson(ciudades)).build();
}

}
