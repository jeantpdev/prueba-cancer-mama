import config from '../supabase/keys.js';


//Modelo que recibe los datos y los envia a la base de datos
const Modelo = {
  async enviarTicket( nombre, apellido, correo, titulo, descripcion ) {
    
    const datos_insertar_bd = {
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      titulo: titulo,
      descripcion: descripcion
    }

    //se almacena la respuesta en "res" para obtener el resultado de la petición y retornarla para mostrar en la vista
    const res = axios({
      method: "POST",
      url: "https://mmphzayxvvhdtrtcvjsq.supabase.co/rest/v1/tickets",
      headers: config.headers,
      data: datos_insertar_bd,
    });
    return res
  }
}

const Vista = {
  //Método de la vista que recibe los valores que hay en el DOM y los retorna
  getDatosTicket() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    return { nombre, apellido, correo, titulo, descripcion };
  },

  mostrarMensajeError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'Algo salió mal',
      text: mensaje,
    })
  },

  mostrarAlertaSatisfactorio(mensaje){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: mensaje,
      showConfirmButton: false,
      timer: 1500
    })
  },

  vaciarCampos(){
    nombre.value = "";
    apellido.value = "";
    correo.value = "";
    titulo.value = "";
    descripcion.value = "";
  }

}

const Controlador = {
  async enviarTicket() {
    const { nombre, apellido, correo, titulo, descripcion } = Vista.getDatosTicket();
    let VACIO = "";
    if (nombre == VACIO || apellido == VACIO || correo == VACIO || titulo == VACIO || descripcion == VACIO){
      let mensaje = "Los campos no pueden estar vacíos";
      Vista.mostrarMensajeError(mensaje);
    }else{
      try {
        const res = await Modelo.enviarTicket(nombre, apellido, correo ,titulo, descripcion);
        let TICKET_CREADO = "201";
        if (res.status == TICKET_CREADO) {
          Vista.mostrarAlertaSatisfactorio("Ticket enviado");
          Vista.vaciarCampos();
        }
      } catch (err) {
        Vista.mostrarMensajeError(err);
      }
    }
  }
}

const botonEnviar = document.getElementById('botonEnviar');

botonEnviar.onclick = function(){
  Controlador.enviarTicket();
}

if (localStorage.getItem("access_token")) {

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

  const cerrarSesion = document.getElementById("cerrarSesion");

  cerrarSesion.onclick = function () {
    localStorage.removeItem('access_token');
    alert("Has cerrado sesión");
    location.href = "../../index.html";
  }

  const vistaTickets = document.getElementById('tickets');

  vistaTickets.onclick = function () {
    location.href = "admin/tickets.html";
  }
} else {
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


