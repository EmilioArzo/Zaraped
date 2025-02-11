package REST;

import com.google.gson.Gson;
import controladores.controladorCategoria;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.Application;
import modelo.modeloCategoria;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.QueryParam;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@Path("categoria")
public class restCategoria extends Application {

    
    /**
     * Obtener todas las categorías.
     */
    @Path("getAllCategorias")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategorias() throws SQLException, IOException {

        controladorCategoria categoriaController = new controladorCategoria();
        List<modeloCategoria> categorias = categoriaController.getAllCategorias();

        Gson gson = new Gson();
        String out = gson.toJson(categorias);
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    
        /**
     * Eliminar (inactivar) una categoría.
     */
    @Path("deleteCategoria")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCategoria(
            @FormParam("idCategoria") int id
    ) throws SQLException, IOException {

        controladorCategoria categoriaController = new controladorCategoria();
        categoriaController.deleteCategoria(id);

        String message = String.format("La categoría con ID %d ha sido desactivada correctamente.", id);
        return Response.status(Response.Status.OK).entity(message).build();
    }
    
    
    
    /**
     * Insertar una nueva categoría.
     */
@Path("insertCategoria")
@POST
@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
@Produces(MediaType.APPLICATION_JSON)
public Response insertarCategoria(
        @FormParam("descripcion") String descripcion,
        @FormParam("tipo") String tipo) throws SQLException, IOException {

    // Validación simple de entradas
    if (descripcion == null || descripcion.isEmpty() || tipo == null || tipo.isEmpty()) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("{\"error\":\"Los campos 'descripcion' y 'tipo' son obligatorios.\"}")
                .build();
    }

    // Crear un objeto modelo con los datos recibidos
    modeloCategoria categoria = new modeloCategoria();
    categoria.setDescripcion(descripcion);
    categoria.setTipo(tipo);
    categoria.setActivo(1);

    try {
        // Llamar al controlador para insertar la categoría
        controladorCategoria categoriaController = new controladorCategoria();
        categoria = categoriaController.insertCategoria(categoria);  // Aquí se obtiene el idCategoria generado

        // Serializar el objeto actualizado a JSON
        Gson gson = new Gson();
        String out = gson.toJson(categoria);

        // Responder con el JSON del objeto creado, incluyendo el idCategoria
        return Response.status(Response.Status.CREATED).entity(out).build();
    } catch (SQLException e) {
        e.printStackTrace();
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("{\"error\":\"Ocurrió un error al insertar la categoría.\"}")
                .build();
    }
}





    /**
     * Actualizar una categoría existente.
     */
@Path("updateCategoria")
@POST
@Consumes(MediaType.APPLICATION_FORM_URLENCODED)  // Cambié a 'application/x-www-form-urlencoded'
@Produces(MediaType.APPLICATION_JSON)
public Response updateCategoria(
        @FormParam("idCategoria") int id,
        @FormParam("descripcion") String descripcion,
        @FormParam("tipo") String tipo,
        @FormParam("activo") int activo) throws SQLException, IOException {

    // Validación simple de entradas
    if (id == 0 || descripcion == null || descripcion.isEmpty() || tipo == null || tipo.isEmpty()) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("{\"error\":\"Los campos 'idCategoria', 'descripcion', 'tipo' y 'activo' son obligatorios.\"}")
                .build();
    }

    modeloCategoria categoria = new modeloCategoria();
    categoria.setIdCategoria(id);
    categoria.setDescripcion(descripcion);
    categoria.setTipo(tipo);
    categoria.setActivo(activo);

    try {
        controladorCategoria categoriaController = new controladorCategoria();
        categoriaController.updateCategoria(categoria);  // Llamar al método de controlador para actualizar la categoría

        // Serializar el objeto actualizado a JSON
        Gson gson = new Gson();
        String out = gson.toJson(categoria);

        // Responder con el JSON del objeto actualizado
        return Response.status(Response.Status.OK).entity(out).build();
    } catch (SQLException e) {
        e.printStackTrace();
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("{\"error\":\"Ocurrió un error al actualizar la categoría.\"}")
                .build();
    }
}

    
    

    /**
     * Obtener una categoría por su ID.
     */
@Path("getCategoriaById")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCategoriaById(
            @QueryParam("idCategoria") int id
    ) throws SQLException, IOException {

        controladorCategoria categoriaController = new controladorCategoria();
        modeloCategoria categoria = categoriaController.buscarCategoriaPorId(id);  // Llamamos al método para obtener la categoría por ID

        // Verificar si la categoría fue encontrada
        if (categoria == null) {
            // Si no se encuentra la categoría, respondemos con un error 404
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("{\"error\":\"Categoría no encontrada\"}")
                           .build();
        }

        // Convertir el objeto modeloCategoria a JSON
        Gson gson = new Gson();
        String out = gson.toJson(categoria);

        // Responder con la categoría en formato JSON
        return Response.status(Response.Status.OK).entity(out).build();
    }

}
