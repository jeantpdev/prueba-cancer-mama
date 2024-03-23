
if(localStorage.getItem("access_token")){

    const ul2 = document.getElementById("menuLista");
    const li2 = document.createElement('li');
    const button2 = document.createElement('button');
    const a2 = document.createElement('a');
    li2.classList.add('menu__item');
    button2.setAttribute("id", "tickets")
    button2.appendChild(a2)
    li2.appendChild(button2)
    a2.appendChild(document.createTextNode("Tickets"));
    ul2.appendChild(li2);

    const ul = document.getElementById("menuLista");
    const li = document.createElement('li');
    const button = document.createElement('button');
    const a = document.createElement('a');
    li.classList.add('menu__item');
    button.setAttribute("id", "cerrarSesion")
    button.appendChild(a)
    li.appendChild(button)
    a.appendChild(document.createTextNode("Cerrar sesión"));
    ul.appendChild(li);

}else{
    const ul = document.getElementById("menuLista");
    const li = document.createElement('li');
    const button = document.createElement('button');
    const a = document.createElement('a');
    li.classList.add('menu__item');
    button.setAttribute("id", "IniciarSesion")
    a.setAttribute("href", "inicio_sesion.html");
    button.appendChild(a)
    li.appendChild(button)
    a.appendChild(document.createTextNode("Iniciar Sesión"));
    ul.appendChild(li);
}

const cerrarSesion = document.getElementById ("cerrarSesion");

cerrarSesion.onclick = function (){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: '¿Cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('access_token');
          //alert("Has cerrado sesión");
          location.href = "../index.html";
        }
      })
}

const vistaTickets = document.getElementById('tickets');

vistaTickets.onclick = function(){
    location.href = "admin/tickets.html";
}
