const Modelo = {
  async iniciarSesion(username, password) {
    const datos_insertar = {
      usuario: username,
      contrasena: password
    }
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:5000/login",
      data: datos_insertar
    });
    return res;
  }
}

const Vista = {
  getDatosIniciarSesion() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    return { username, password };
  },

  mostrarMensajeError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje,
    })

  },

  mostrarMensajeSatisfactorio(mensaje) {
    console.log(mensaje);
  },

  limpiarCampos() {
    username.value = "";
    password.value = "";
  },

  redirigirAIndex() {
    location.href = ("../index.html");
  }
}

const Controlador = {
  async iniciarSesion() {
    const { username, password } = Vista.getDatosIniciarSesion();
    try {
      const res = await Modelo.iniciarSesion(username, password);
      if (res.data.acceso == "AUTORIZADO") {
        const access_token = res.data.access_token;
        localStorage.setItem("access_token", access_token);
        Vista.mostrarMensajeSatisfactorio("Inicio de sesión exitoso");
        Vista.redirigirAIndex();
      } else {
        Vista.mostrarMensajeError("Usuario no encontrado")
        Vista.limpiarCampos();
      }

    } catch (err) {
      Vista.mostrarMensajeError('Error al iniciar sesión');
      console.log(err);

      Vista.limpiarCampos();
    }
  }
}


const botonIniciarSesion = document.getElementById('botonIniciarSesion');

botonIniciarSesion.onclick = function () {
  Controlador.iniciarSesion()
}

const botonRetroceder = document.getElementById('botonRetroceder');

botonRetroceder.onclick = function () {
  location.href = ('../index.html')
}