//Modelo que recibe los datos y los envia a la base de datos
const Modelo = {
  //función asíncrona que recibe la data a enviar
  async enviarDatosPruebaUsuario(edad, menopausia, tumorTamaño, invNodes, nodesCaps, gradoTumor, breast, breastQuead, irradiat) {
    //se guarda en un objeto para luego ser enviado como data en AXIOS
    const datos_insertar = {
      edad: parseInt(edad),
      menopausia: parseInt(menopausia),
      tumorTamaño: parseInt(tumorTamaño),
      invNodes: parseInt(invNodes),
      nodesCaps: parseInt(nodesCaps),
      gradoTumor: parseInt(gradoTumor),
      breast: parseInt(breast),
      breastQuead: parseInt(breastQuead),
      irradiat: parseInt(irradiat)
    }

    //se almacena la respuesta en "res" para obtener el resultado de la petición y retornarla para mostrar en la vista
    const res = axios({
      method: "POST",
      url: "http://127.0.0.1:5000/insertar_datos_paciente",
      data: datos_insertar,
    });
    return res
  }
}

const Vista = {
  //Método de la vista que recibe los valores que hay en el DOM y los retorna
  getInfoPruebaUsuario() {
    const edad = document.getElementById('edad').value;
    const menopausia = document.getElementById('menopausia').value;
    const tumorTamaño = document.getElementById('tumorTamaño').value;
    const invNodes = document.getElementById('invNodes').value;
    const nodesCaps = document.getElementById('nodesCaps').value;
    const gradoTumor = document.getElementById('gradoTumor').value;
    const breast = document.getElementById('breast').value;
    const breastQuead = document.getElementById('breastQuead').value;
    const irradiat = document.getElementById('irradiat').value;
    return { edad, menopausia, tumorTamaño, invNodes, nodesCaps, gradoTumor, breast, breastQuead, irradiat };
  },

  //Método para mostrar los mensajes de errores
  mostrarMensajeError(mensaje) {
    console.log(mensaje);
  },

  mostrarResultadoPrueba(mensaje, precision) {
    const izquierdaGrilla = document.getElementById('izquierdaGrilla');
    const album = document.createElement('div');
    album.innerHTML = `
      <h1>Resultados de la prueba: ${mensaje}</h1>
      <h2>Precision del algoritmo: ${precision}</h2>
    `;

    izquierdaGrilla.appendChild(album);

  },

  mostrarAlertaSatisfactorio(mensaje) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: mensaje,
      showConfirmButton: false,
      timer: 1500
    })
  },


  mostrarMensajeError(mensaje) {
    console.log(mensaje)
  }
}


const Controlador = {
  async enviarDatosPruebaUsuario() {
    const { edad, menopausia, tumorTamaño, invNodes, nodesCaps, gradoTumor, breast, breastQuead, irradiat } = Vista.getInfoPruebaUsuario();

    try {
      //Se envian los datos al modelo y se espera hasta que se ejecute (el modelo) y retorne un resultado
      const res = await Modelo.enviarDatosPruebaUsuario(edad, menopausia, tumorTamaño, invNodes, nodesCaps, gradoTumor, breast, breastQuead, irradiat);
      //dentro de "res" se almacena el resultado de AXIOS.
      //Si el status en correcto, se muestra un alert
      console.log(res)
      if (res.status == "200") {
        let precision = res.data.precision;
        if (res.data.resultado_prueba == "0") {
          let mensaje = "No hay eventos recurrentes."
          Vista.mostrarResultadoPrueba(mensaje, precision)
        } else {
          let mensaje = "Hay eventos recurrentes."
          Vista.mostrarResultadoPrueba(mensaje, precision)
        }
      }
      //Caso contrario, mostrará un mensaje de error que se envia a la vista para mostrarla
    } catch (err) {
      Vista.mostrarMensajeError(err);
    }
  }
}

const enviarDatos = document.getElementById('enviarDatos')

enviarDatos.onclick = function () {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Puedes cancelar y confirmar los datos que vas a enviar.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, enviar datos',
    cancelButtonText: 'No enviar datos'

  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Enviados!',
        '¡Tus datos han sido enviados!',
        'success'
      )
      Controlador.enviarDatosPruebaUsuario();
    }
  })

}

const exportarPDF = document.getElementById('exportarPDF');

exportarPDF.onclick = function () {
  // Selecciona el elemento que deseas exportar a PDF
  var elemento = document.querySelector('.container');

  // Configura las opciones de exportación
  var opciones = {
    margin: [10, 10, 10, 10], // Márgenes en píxeles
    filename: 'resultados_prueba_cancer.pdf', // Nombre del archivo PDF resultante
    html2canvas: { scale: 2 }, // Configuración de html2canvas (opcional)
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // Configuración de jsPDF (opcional)
  };

  // Ejecuta la función html2pdf para generar el PDF
  html2pdf().set(opciones).from(elemento).save();
}