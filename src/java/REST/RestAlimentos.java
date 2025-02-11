package REST;

import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.sql.DriverManager;
import java.sql.Connection;
import controladores.ControllerAlimentos;
import modelo.modeloAlimento;
import modelo.modeloProducto;
import modelo.modeloCategoria;
import modelo.modeloAlimento;


@Path("alimento")
public class RestAlimentos extends Application {
    
    @Path("insertarAlimento")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertarAlimento(
        @FormParam("categoria") @DefaultValue("") String categoria,
        @FormParam("alimento") @DefaultValue("") String nombre,
        @FormParam("descripcion") @DefaultValue("") String descripcion,
        @FormParam("foto") @DefaultValue("") String foto,
        @FormParam("precio") @DefaultValue("0") double precio
    ) {
        String out;
        Gson gson = new Gson();
        ControllerAlimentos controller = new ControllerAlimentos();

        try {
            modeloAlimento alimento = controller.insertarAlimento(categoria, nombre, descripcion, foto, precio);
            out = gson.toJson(alimento);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @Path("actualizarAlimento")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response actualizarAlimento(
        @FormParam("idAlimento") @DefaultValue("0") int idAlimento,
        @FormParam("nombre") @DefaultValue("") String nombre,
        @FormParam("descripcion") @DefaultValue("") String descripcion,
        @FormParam("categoria") @DefaultValue("") String categoriaDesc,
        @FormParam("precio") @DefaultValue("0") double precio,
        @FormParam("foto") @DefaultValue("") String foto
    ) {
        String out;
        ControllerAlimentos controller = new ControllerAlimentos();

        try {
            controller.actualizarAlimento(idAlimento, nombre, descripcion, foto, precio, categoriaDesc);
            out = """
              {"result":"Actualización realizada"}
              """;
            return Response.ok(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @Path("eliminarAlimento")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAlimento(@FormParam("idAlimento") @DefaultValue("0") int idAlimento) {
        String out;
        ControllerAlimentos controller = new ControllerAlimentos();

        try {
            controller.eliminarAlimento(idAlimento);
            out = """
              {"result":"Eliminación realizada"}
              """;
            return Response.ok(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    @Path("getAllAlimentos")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllAlimentos() {
        List<modeloAlimento> lista;
        String out;
        Gson gson = new Gson();
        ControllerAlimentos controller = new ControllerAlimentos();

        try {
            lista = controller.getAllAlimentos();
            out = gson.toJson(lista);
            return Response.ok(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }
    
@Path("categorias")
@GET
@Produces(MediaType.APPLICATION_JSON)
public Response getCategoriasAlimentos() {
    ControllerAlimentos controller = new ControllerAlimentos();
    String out;
    Gson gson = new Gson();

    try {
        List<modeloCategoria> categorias = controller.Categorias();
        out = gson.toJson(categorias);
        return Response.ok(out).build();
    } catch (Exception e) {
        e.printStackTrace();
        out = """
          {"result":"Error de servidor"}
          """;
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
    }
}
 
}