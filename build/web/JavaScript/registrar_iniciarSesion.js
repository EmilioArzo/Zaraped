$(document).ready(function(){
    
    $(".contenedor-formularios").find("input, textarea").on("keyup blur focus", function (e) {

        var $this = $(this),
          label = $this.prev("label");

        if (e.type === "keyup") {
            if ($this.val() === "") {
                label.removeClass("active highlight");
            } else {
                label.addClass("active highlight");
            }
        } else if (e.type === "blur") {
            if($this.val() === "") {
                label.removeClass("active highlight"); 
                } else {
                label.removeClass("highlight");   
                }   
        } else if (e.type === "focus") {
            if($this.val() === "") {
                label.removeClass("highlight"); 
            } 
            else if($this.val() !== "") {
                label.addClass("highlight");
            }
        }

    });

    $(".tab a").on("click", function (e) {

        e.preventDefault();

        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");

        target = $(this).attr("href");

        $(".contenido-tab > div").not(target).hide();

        $(target).fadeIn(600);

    });
    
});


$(document).ready(function(){
    $("#form-login").submit(function(e){
        e.preventDefault();

        let usuario = $("#usuario").val().trim();
        let contrasena = $("#contrasena").val().trim();

        if (usuario === "" || contrasena === "") {
            alert("Por favor, llena todos los campos.");
            return;
        }

        $.ajax({
            url: "LoginServlet", // Nombre del servlet en Java
            type: "POST",
            data: {usuario: usuario, contrasena: contrasena},
            success: function(response){
                if (response === "OK") {
                    window.location.href = "dashboard.html"; // Redirigir si es correcto
                } else {
                    alert("Usuario o contraseña incorrectos");
                }
            },
            error: function(xhr, status, error){
                console.error("Error en la petición AJAX: " + error);
                alert("Hubo un error al conectar con el servidor.");
            }
        });
    });
});
