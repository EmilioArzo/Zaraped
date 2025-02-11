package REST;

import com.google.gson.Gson;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import controladores.controladorEmpleado;
import modelo.modeloEmpleado;
import modelo.modeloPersona;
import modelo.modeloUsuario;
import modelo.modeloCiudad;
import modelo.modeloEstado;

import java.util.List;

@Path("empleado")
public class restEmpleado extends Application {

    // Insertar un nuevo empleado
    @Path("insert")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertEmpleado(
            @FormParam("nombrePersona") String nombrePersona,
            @FormParam("apellidosPersona") String apellidosPersona,
            @FormParam("telefonoPersona") String telefonoPersona,
            @FormParam("idCiudadPersona") int idCiudadPersona,  
            @FormParam("nombreUsuario") String nombreUsuario,
            @FormParam("contraseniaUsuario") String contraseniaUsuario,
            @FormParam("activoUsuario") int activoUsuario,
            @FormParam("idSucursal") int idSucursal,
            @FormParam("activoEmpleado") int activoEmpleado) {

        controladorEmpleado controlador = new controladorEmpleado();

        // Crear la ciudad y asociar un estado vacío (se puede mejorar con un DAO que obtenga la ciudad completa)
        modeloCiudad ciudad = new modeloCiudad(idCiudadPersona, null, new modeloEstado(0, null));

        modeloPersona persona = new modeloPersona(0, nombrePersona, apellidosPersona, telefonoPersona, ciudad);
        modeloUsuario usuario = new modeloUsuario(0, nombreUsuario, contraseniaUsuario, activoUsuario);
        modeloEmpleado empleado = new modeloEmpleado(0, null, persona, usuario, activoEmpleado);
        empleado.setIdSucursal(idSucursal);

        controlador.insertEmpleado(empleado);

        String out = "{\"result\":\"Empleado insertado exitosamente\"}";
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    // Obtener todos los empleados
    @Path("getall")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllEmpleados() {
        List<modeloEmpleado> empleados;
        try {
            controladorEmpleado controlador = new controladorEmpleado();
            empleados = controlador.getAllEmpleados();

            // Asegurar que los datos de la ciudad y estado están completos
            for (modeloEmpleado emp : empleados) {
                if (emp.getPersona() != null && emp.getPersona().getCiudad() != null) {
                    modeloCiudad ciudad = emp.getPersona().getCiudad();
                    if (ciudad.getEstado() == null) {
                        ciudad.setEstado(new modeloEstado(0, "Desconocido")); // Default si falta estado
                    }
                }
            }

            Gson gson = new Gson();
            String out = gson.toJson(empleados);
            return Response.status(Response.Status.OK).entity(out).build();
        } catch (Exception ex) {
            String out = "{\"error\":\"" + ex.toString() + "\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    // Actualizar datos de un empleado
    @Path("update")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEmpleado(
            @FormParam("idEmpleado") int idEmpleado,
            @FormParam("nombrePersona") String nombrePersona,
            @FormParam("apellidosPersona") String apellidosPersona,
            @FormParam("telefonoPersona") String telefonoPersona,
            @FormParam("idCiudadPersona") int idCiudadPersona,
            @FormParam("nombreUsuario") String nombreUsuario,
            @FormParam("contraseniaUsuario") String contraseniaUsuario,
            @FormParam("activoUsuario") int activoUsuario,
            @FormParam("idSucursal") int idSucursal,
            @FormParam("activoEmpleado") int activoEmpleado) {

        controladorEmpleado controlador = new controladorEmpleado();

        modeloCiudad ciudad = new modeloCiudad(idCiudadPersona, null, new modeloEstado(0, null));
        modeloPersona persona = new modeloPersona(idEmpleado, nombrePersona, apellidosPersona, telefonoPersona, ciudad);
        modeloUsuario usuario = new modeloUsuario(idEmpleado, nombreUsuario, contraseniaUsuario, activoUsuario);
        modeloEmpleado empleado = new modeloEmpleado(idEmpleado, null, persona, usuario, activoEmpleado);
        empleado.setIdSucursal(idSucursal);

        controlador.updateEmpleado(empleado);

        String out = "{\"result\":\"Empleado actualizado exitosamente\"}";
        return Response.status(Response.Status.OK).entity(out).build();
    }

    // Dar de baja a un empleado
    @Path("delete")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response bajaEmpleado(@FormParam("idEmpleado") int idEmpleado) {
        controladorEmpleado controlador = new controladorEmpleado();
        try {
            controlador.bajaEmpleado(idEmpleado);
            String out = "{\"result\":\"Empleado dado de baja exitosamente\"}";
            return Response.status(Response.Status.OK).entity(out).build();
        } catch (Exception e) {
            String out = "{\"error\":\"Error al dar de baja al empleado\"}";
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }
}
