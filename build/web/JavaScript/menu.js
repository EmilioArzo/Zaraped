/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */ 


document.getElementById("menu-btn").addEventListener("click", () => {
  const menuItems = document.getElementById("menu-items");

  if (menuItems.style.display === "none") {
    menuItems.style.display = "block";

    // Lista de módulos fijos
    const modules = [
      { name: "Menú", link: "02_menu.html" },
      { name: "Clientes", link: "03_Clientes.html" },
      { name: "Empleados", link: "04_Empleados.html" },
      { name: "Sucursal", link: "05_Sucursal.html" },
      { name: "Bebidas", link: "06_Bebidas.html" },
      { name: "Alimentos", link: "07_Alimentos.html" },
      { name: "Categorias", link: "08_Categorias.html" }
    ];

    menuItems.innerHTML = ""; // Limpiar contenido anterior
    modules.forEach(module => {
      const li = document.createElement("li");
      const button = document.createElement("button");

      button.textContent = module.name;
      button.addEventListener("click", () => {
        window.location.href = module.link; // Redirigir al módulo
      });

      li.appendChild(button);
      menuItems.appendChild(li);
    });
  } else {
    menuItems.style.display = "none";
  }
});
