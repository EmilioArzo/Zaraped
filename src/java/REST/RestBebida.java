package REST;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Application;

import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import controladores.controladorBebida;

import java.sql.SQLException;
import jakarta.ws.rs.PathParam;

import com.google.gson.Gson;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import modelo.modeloBebida;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;
import modelo.modeloCategoria;
import modelo.modeloProducto;

@Path("bebida")
public class RestBebida extends Application {
    
    @Path("insert")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response insertBebida(
        @FormParam("nombre") @DefaultValue("") String nombre,
        @FormParam("descripcion") @DefaultValue("") String descripcion,
        @FormParam("foto") @DefaultValue("") String foto,
        @FormParam("precio") @DefaultValue("0") Double precio,
        @FormParam("idCategoria") @DefaultValue("0") int idCategoria
    ) {
        
          // Registro de datos recibidos
    System.out.println("Datos recibidos desde el cliente:");
    System.out.printf("Nombre: %s%nDescripción: %s%nFoto: %s%nPrecio: %.2f%nID Categoría: %d%n",
            nombre,
            descripcion,
            (foto.length() > 20 ? foto.substring(0, 20) + "..." : foto),
            precio,
            idCategoria);
        
        // Validar que los parámetros no sean nulos o vacíos
    if (nombre.isEmpty() || descripcion.isEmpty() || foto.isEmpty() || precio <= 0 || idCategoria <= 0) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("{\"error\": \"Todos los campos son obligatorios y deben ser válidos.\"}")
                .build();
    }
    
        controladorBebida controlador = new controladorBebida();
        modeloProducto producto = new modeloProducto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setFoto(foto);
        producto.setPrecio(precio);
        
        modeloCategoria categoria = new modeloCategoria();
        categoria.setIdCategoria(idCategoria);
        producto.setCategoria(categoria);

        modeloBebida bebida = new modeloBebida();
        bebida.setProducto(producto);

        boolean resultado = controlador.insertarBebida(bebida);

        if (resultado) {
            String out = """
                {"mensaje": "Bebida agregada correctamente", "bebida": "%s"}
            """.formatted(nombre);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"No se pudo agregar la bebida.\"}")
                    .build();
        }
    }

    @Path("getall")
    @GET
    @Produces(MediaType.APPLICATION_JSON)    
    public Response getAll() {
        String out = "";
        try {
            controladorBebida cp = new controladorBebida();
            List<modeloBebida> bebidas = cp.obtenerTodasLasBebidas();
            Gson gs = new Gson();
            out = gs.toJson(bebidas);
            
        } catch (Exception ex) {
            out = "{\"error en el getAll\":\"" + ex.toString() + "\"}";
        } 
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
@Path("update")
@POST
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
public Response updateBebida(
    @FormParam("idProducto") @DefaultValue("0") int idProducto, // Corregimos aquí el ID
    @FormParam("nombre") @DefaultValue("") String nombre,
    @FormParam("descripcion") @DefaultValue("") String descripcion,
    @FormParam("foto") @DefaultValue("") String foto,
    @FormParam("precio") @DefaultValue("0") double precio,
    @FormParam("idCategoria") @DefaultValue("0") int idCategoria
) throws Exception {
    // Validación de parámetros
    if (idProducto <= 0 || nombre.isEmpty() || descripcion.isEmpty() || foto.isEmpty() || precio <= 0 || idCategoria <= 0) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("{\"error\": \"Todos los campos son obligatorios y deben ser válidos.\"}")
                .build();
    }

    controladorBebida controlador = new controladorBebida();
    modeloProducto producto = new modeloProducto();
    producto.setIdProducto(idProducto); // Asegúrate de asignar correctamente el ID
    producto.setNombre(nombre);
    producto.setDescripcion(descripcion);
    producto.setFoto(foto);
    producto.setPrecio(precio);

    modeloCategoria categoria = new modeloCategoria();
    categoria.setIdCategoria(idCategoria);
    producto.setCategoria(categoria);

    modeloBebida bebida = new modeloBebida();
    bebida.setProducto(producto);

    boolean resultado = controlador.actualizarBebida(bebida);

    if (resultado) {
        String out = """
            {"mensaje": "Bebida actualizada correctamente"}
        """;
        return Response.status(Response.Status.OK).entity(out).build();
    } else {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("{\"error\": \"No se pudo actualizar la bebida.\"}")
                .build();
    }
}



@Path("delete")
@POST
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
public Response eliminarBebida(@FormParam("idProducto") int idProducto) {
    // Log para verificar el ID del producto recibido
    System.out.println("ID del producto recibido para eliminación: " + idProducto);

    // Validar el parámetro
    if (idProducto <= 0) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("{\"error\": \"ID del producto no válido.\"}")
                .build();
    }

    controladorBebida controlador = new controladorBebida();
    boolean resultado = controlador.eliminarBebida(idProducto);

    if (resultado) {
        String out = """
            {"mensaje": "Producto con ID %d eliminado correctamente."}
        """.formatted(idProducto);
        return Response.ok(out).build();
    } else {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("{\"error\": \"No se pudo eliminar el producto.\"}")
                .build();
    }
}

  @Path("getAllCategorias") // Endpoint específico
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategorias() {
        try {
            // Instancia del controlador
            controladorBebida controlador = new controladorBebida();
            List<modeloCategoria> categorias = controlador.obtenerCategorias();

            System.out.println("Categorías obtenidas: " + categorias.size());
            
            // Verificar si hay categorías
//            if (categorias == null || categorias.isEmpty()) {
//                // Retornar un 204 No Content si la lista está vacía
//                return Response.status(Response.Status.NO_CONTENT).build();
//            }

             // Convierte la lista en JSON
            Gson gson = new Gson();
            String jsonCategorias = gson.toJson(categorias);


            // Respuesta exitosa con las categorías
            return Response.ok(jsonCategorias).build();

        } catch (Exception e) {
            // Manejar errores
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("{\"mensaje\": \"Error al obtener las categorías: " + e.getMessage() + "\"}")
                           .build();
        }
    }
    
}