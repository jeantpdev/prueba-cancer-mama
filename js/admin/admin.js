import config from '../supabase/keys.js';

const Modelo = {

  async mostrarTodosTickets() {

    const res = await axios({
      method: "GET",
      url: `https://mmphzayxvvhdtrtcvjsq.supabase.co/rest/v1/tickets?select=*&limit=${Controlador.pageSize}&offset=${(Controlador.pageNumber - 1) * Controlador.pageSize}`,
      headers: config.headers,
    });
    return res;
  },

  async insertarDatosCSV(events_recurrence, age, menopause, tumor_size, inv_nodes, node_caps, deg_malig, breast, breast_quead, irradiat) {
    const datos_insertar = {
      events_recurrence: events_recurrence,
      age: age,
      menopause: menopause,
      tumor_size: tumor_size,
      inv_nodes: inv_nodes,
      node_caps: node_caps,
      deg_malig: deg_malig,
      breast: breast,
      breast_quead: breast_quead,
      irradiat: irradiat
    }
    const res = await axios({
      method: "POST",
      url: "https://mmphzayxvvhdtrtcvjsq.supabase.co/rest/v1/datos_csv",
      headers: config.headers,
      data: datos_insertar
    });
    return res;
  },

  async eliminarDatosCSV(idEliminar) {

    const res = await axios({
      method: "DELETE",
      url: `https://mmphzayxvvhdtrtcvjsq.supabase.co/rest/v1/datos_csv?id=eq.${idEliminar}`,
      headers: config.headers,
    });
    return res;
  },

  async buscarPorIdCSV(idDatoCSVBuscar) {

    const res = await axios({
      method: "GET",
      url: `https://mmphzayxvvhdtrtcvjsq.supabase.co/rest/v1/datos_csv?id=eq.${idDatoCSVBuscar}`,
      headers: config.headers,
    });
    return res;
  },

  async buscarTicketPorId(idTicketBuscar) {
    const res = await axios({
      method: "GET",
      url: `https://mmphzayxvvhdtrtcvjsq.supabase.co/rest/v1/tickets?id=eq.${idTicketBuscar}`,
      headers: config.headers,
    });
    return res;
  }
}

const Controlador = {
  pageNumber: 1, // Página actual
  pageSize: 10, // Cantidad de elementos por página

  async obtenerTickets() {
    try {
      const response = await Modelo.mostrarTodosTickets();
      Vista.mostrarTickets(response.data);
    } catch (err) {
      console.log(err);
      Vista.mostrarMensajeError(err);
    }
  },

  async buscarTicketPorId() {
    const { idTicketBuscar } = Vista.getIdTicketBuscar();

    try {
      const response = await Modelo.buscarTicketPorId(idTicketBuscar);
      Vista.mostrarTickets(response.data);
    } catch (err) {
      console.log(err);
      Vista.mostrarMensajeError(err);
    }
  },

  irAPagina: function (page) {
    Controlador.pageNumber = page;
    Controlador.obtenerTickets();
  },

  irAPaginaAnterior: function () {
    if (Controlador.pageNumber > 1) {
      Controlador.irAPagina(Controlador.pageNumber - 1);
    }
  },

  irAPaginaSiguiente: function () {
    Controlador.irAPagina(Controlador.pageNumber + 1);
  },

  async insertarDatosCSV() {
    const { events_recurrence, age, menopause, tumor_size, inv_nodes, node_caps, deg_malig, breast, breast_quead, irradiat } = Vista.getDatosInsertarCSV();
    try {
      const res = await Modelo.insertarDatosCSV(events_recurrence, age, menopause, tumor_size, inv_nodes, node_caps, deg_malig, breast, breast_quead, irradiat);
      Vista.mostrarAlertaSatisfactorio("Datos insertados correctamente");
    } catch (err) {
      Vista.mostrarMensajeError(err);
    }
  },

  obtenerDatosCSV: function () {
    const url = `https://mmphzayxvvhdtrtcvjsq.supabase.co/rest/v1/datos_csv?select=*&limit=${Controlador.pageSize}&offset=${(Controlador.pageNumber - 1) * Controlador.pageSize}`;

    axios({
      method: 'GET',
      url: url,
      headers: config.headers,
    })
      .then(function (response) {
        Vista.mostrarDatosCSV(response.data);
        const totalPages = Math.ceil(response.headers['x-total-count'] / Controlador.pageSize);
        Vista.actualizarPaginacionCSV(totalPages);
      })
      .catch(function (error) {
        console.log(error);
        Vista.mostrarMensajeError(error);
      });
  },

  irAPaginaCSV: function (page) {
    Controlador.pageNumber = page;
    Controlador.obtenerDatosCSV();
  },

  irAPaginaSiguienteCSV: function () {
    Controlador.irAPaginaCSV(Controlador.pageNumber + 1);
  },

  irAPaginaAnteriorCSV: function () {
    if (Controlador.pageNumber > 1) {
      Controlador.irAPaginaCSV(Controlador.pageNumber - 1);
    }
  },

  async buscarPorIdCSV() {
    const { idDatoCSVBuscar } = Vista.getIdCSVDatosBuscar();

    try {
      const response = await Modelo.buscarPorIdCSV(idDatoCSVBuscar);
      Vista.mostrarDatosCSV(response.data);
      Vista.limpiarCampoBuscarIdCSV();
    } catch (err) {
      console.log(err);
      Vista.mostrarMensajeError(err);
    }
  },

  async eliminarDatosCSV() {
    const { idEliminar } = Vista.getIdCSVDatosEliminar();
    try {
      await Modelo.eliminarDatosCSV(idEliminar);
      Vista.mostrarAlertaSatisfactorio("Datos eliminados correctamente")
      this.obtenerDatosCSV();
    } catch (err) {
      console.log(err)
    }
  },

};

const Vista = {
  mostrarTickets: function (datos) {
    const tablaTickets = document.getElementById('tablaTickets');
    tablaTickets.innerHTML = ''; // Limpiar contenido existente

    // Crear la fila de encabezados
    const encabezadoRow = document.createElement('tr');
    for (const encabezado of Object.keys(datos[0])) {
      const th = document.createElement('th');
      th.textContent = encabezado;
      encabezadoRow.appendChild(th);
    }
    tablaTickets.appendChild(encabezadoRow);

    // Crear las filas de datos
    datos.forEach(dato => {
      const fila = document.createElement('tr');
      for (const prop in dato) {
        const celda = document.createElement('td');
        celda.textContent = dato[prop];
        fila.appendChild(celda);
      }
      tablaTickets.appendChild(fila);
    });

  },

  mostrarDatosCSV: function (datos) {
    const tablaDatosCSV = document.getElementById('tablaDatos');
    tablaDatosCSV.innerHTML = ''; // Limpiar contenido existente

    // Crear la fila de encabezados
    const encabezadoRow = document.createElement('tr');
    for (const encabezado of Object.keys(datos[0])) {
      const th = document.createElement('th');
      th.textContent = encabezado;
      encabezadoRow.appendChild(th);
    }
    tablaDatosCSV.appendChild(encabezadoRow);

    // Crear las filas de datos
    datos.forEach(dato => {
      const fila = document.createElement('tr');
      for (const prop in dato) {
        const celda = document.createElement('td');
        celda.textContent = dato[prop];
        fila.appendChild(celda);
      }
      tablaDatosCSV.appendChild(fila);
    });

  },

  mostrarMensajeError: function (mensaje) {
    console.log(mensaje);
  },

  actualizarPaginacion: function (totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ''; // Limpiar paginación existente


    const previousButton = document.createElement('button');
    previousButton.classList.add('pagination-button');
    previousButton.textContent = 'Anterior';
    previousButton.addEventListener('click', function (event) {
      event.preventDefault();
      Controlador.irAPaginaAnterior();
    });

    // Enlaces de páginas
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('button');
      pageLink.href = '#';
      pageLink.textContent = i;
      pageLink.addEventListener('click', function (event) {
        event.preventDefault();
        Controlador.irAPagina(i);
      });

      if (i === Controlador.pageNumber) {
        pageLink.classList.add('active');
      }

      const listItem = document.createElement('li');
      listItem.appendChild(pageLink);

      paginationContainer.appendChild(listItem);
    }

    const nextButton = document.createElement('button');
    nextButton.classList.add('pagination-button');
    nextButton.textContent = 'Siguiente';
    nextButton.addEventListener('click', function (event) {
      event.preventDefault();
      Controlador.irAPaginaSiguiente();
    });

    paginationContainer.appendChild(previousButton);
    paginationContainer.appendChild(nextButton);
  },

  actualizarPaginacionCSV: function (totalPages) {
    const paginationContainerCSV = document.getElementById('paginationContainerCSV');
    paginationContainerCSV.innerHTML = ''; // Limpiar paginación existente


    const previousButton = document.createElement('button');
    previousButton.classList.add('pagination-button');
    previousButton.textContent = 'Anterior';
    previousButton.addEventListener('click', function (event) {
      event.preventDefault();
      Controlador.irAPaginaAnteriorCSV();
    });

    // Enlaces de páginas
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('button');
      pageLink.href = '#';
      pageLink.textContent = i;
      pageLink.addEventListener('click', function (event) {
        event.preventDefault();
        Controlador.irAPaginaCSV(i);
      });

      if (i === Controlador.pageNumber) {
        pageLink.classList.add('active');
      }

      const listItem = document.createElement('li');
      listItem.appendChild(pageLink);

      paginationContainerCSV.appendChild(listItem);
    }

    const nextButton = document.createElement('button');
    nextButton.classList.add('pagination-button');
    nextButton.textContent = 'Siguiente';
    nextButton.addEventListener('click', function (event) {
      event.preventDefault();
      Controlador.irAPaginaSiguienteCSV();
    });

    paginationContainerCSV.appendChild(previousButton);
    paginationContainerCSV.appendChild(nextButton);
  },

  getIdTicketBuscar: function () {
    const idTicket = document.getElementById('idInput').value;
    const idTicketBuscar = idTicket.trim();
    return { idTicketBuscar };
  },

  getDatosInsertarCSV: function () {
    let events_recurrence = document.getElementById('events_recurrence').value;
    let age = document.getElementById('edad').value;
    let menopause = document.getElementById('menopausia').value;
    let tumor_size = document.getElementById('tumorTamaño').value;
    let inv_nodes = document.getElementById('invNodes').value;
    let node_caps = document.getElementById('nodesCaps').value;
    let deg_malig = document.getElementById('gradoTumor').value;
    let breast = document.getElementById('breast').value;
    let breast_quead = document.getElementById('breastQuead').value;
    let irradiat = document.getElementById('irradiat').value;

    const rangos_edad = {
      0: "20-29",
      1: "30-39",
      2: "40-49",
      3: "50-59",
      4: "60-69",
      5: "70-79",
    }

    const rangos_menopausia = {
      0: "ge40",
      1: "lt40",
      2: "premeno"
    }

    const rangos_tumorTamaño = {
      0: "0-4",
      1: "5-9",
      2: "10-14",
      3: "15-19",
      4: "20-24",
      5: "25-29",
      6: "30-34",
      7: "35-39",
      8: "40-44",
      9: "45-49",
      10: "50-54"
    }

    const rangos_invNodes = {
      0: "0-2",
      1: "3-5",
      2: "6-8",
      3: "9-11",
      4: "12-14",
      5: "15-17",
      6: "24-26"
    }

    const rangos_nodesCaps = {
      0: "no",
      1: "si"
    }


    const rangos_gradoTumor = {
      0: "1",
      1: "2",
      2: "3"
    }

    const rangos_breast = {
      0: "left",
      1: "right"
    }

    const rangos_breastQuead = {
      0: "central",
      1: "left_low",
      2: "left_up",
      3: "right_low ",
      4: "right_up"
    }

    const rangos_irradiat = {
      0: "no",
      1: "yes"
    }

    const rangos_clase = {
      0: "no-recurrence-events",
      1: "recurrence-events"
    }

    if (age in rangos_edad) {
      age = rangos_edad[age]
    }

    if (menopause in rangos_menopausia) {
      menopause = rangos_menopausia[menopause]
    }
    if (tumor_size in rangos_tumorTamaño) {
      tumor_size = rangos_tumorTamaño[tumor_size]
    }
    if (inv_nodes in rangos_invNodes) {
      inv_nodes = rangos_invNodes[inv_nodes]
    }
    if (node_caps in rangos_nodesCaps) {
      node_caps = rangos_nodesCaps[node_caps]
    }
    if (deg_malig in rangos_gradoTumor) {
      deg_malig = rangos_gradoTumor[deg_malig]
    }
    if (breast in rangos_breast) {
      breast = rangos_breast[breast]
    }
    if (breast_quead in rangos_breastQuead) {
      breast_quead = rangos_breastQuead[breast_quead]
    }

    if (irradiat in rangos_irradiat) {
      irradiat = rangos_irradiat[irradiat]
    }

    if (events_recurrence in rangos_clase) {
      events_recurrence = rangos_clase[events_recurrence]
    }

    return { events_recurrence, age, menopause, tumor_size, inv_nodes, node_caps, deg_malig, breast, breast_quead, irradiat };
  },

  getIdCSVDatosEliminar: function () {
    const idEliminar = document.getElementById('idInputCSVDelete').value;
    console.log(idEliminar);
    return { idEliminar };
  },

  getIdCSVDatosBuscar: function () {
    const idInputCSV = document.getElementById('idInputCSV').value;
    const idDatoCSVBuscar = idInputCSV.trim();
    return { idDatoCSVBuscar };
  },

  mostrarMensajeError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje,
    })

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

  limpiarCampoBuscarIdCSV: function () {
    idInputCSV.value = "";
  },

  limpiarCampoBuscarIdEliminar: function () {
    idDatoCSVEliminar.value = "";
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const cantidadDatosSelect = document.getElementById('cantidadDatos');
  cantidadDatosSelect.addEventListener('change', function () {
    Controlador.pageSize = parseInt(cantidadDatosSelect.value, 10);
    Controlador.pageNumber = 1;
    Controlador.obtenerTickets();
  });

  const cantidadDatosSelectCSV = document.getElementById('cantidadDatosCSV');
  cantidadDatosSelectCSV.addEventListener('change', function () {
    Controlador.pageSize = parseInt(cantidadDatosSelectCSV.value, 10);
    Controlador.pageNumber = 1;
    Controlador.obtenerDatosCSV();
  });

  const buscarButton = document.getElementById('buscarButton');
  buscarButton.addEventListener('click', function () {
    Controlador.buscarTicketPorId();
  });

  const buscarButtonCSV = document.getElementById('buscarButtonCSV');
  buscarButtonCSV.addEventListener('click', function () {
    Controlador.buscarPorIdCSV();
  });

  Controlador.obtenerDatosCSV();
  Controlador.obtenerTickets();
});

if (localStorage.getItem("access_token")) {

  const ul2 = document.getElementById("menuLista");
  const li2 = document.createElement('li');
  const button2 = document.createElement('button');
  const a2 = document.createElement('a');
  li2.classList.add('menu__item', 'menu__item--active');
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

} else {
  const ul = document.getElementById("menuLista");
  const li = document.createElement('li');
  const button = document.createElement('button');
  const a = document.createElement('a');
  li.classList.add('menu__item');
  button.setAttribute("id", "IniciarSesion")
  a.setAttribute("href", "pages/inicio_sesion.html");
  button.appendChild(a)
  li.appendChild(button)
  a.appendChild(document.createTextNode("Iniciar Sesión"));
  ul.appendChild(li);
}

const cerrarSesion = document.getElementById("cerrarSesion");

cerrarSesion.onclick = function () {
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
      location.href = "../../index.html";
    }
  })
}

const enviarDatosCSV = document.getElementById('enviarDatos');

enviarDatosCSV.onclick = function () {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: '¿Deseas insertar estos datos?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si',
    cancelButtonText: 'No',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      Controlador.insertarDatosCSV();
    }
  })
}

const botonEliminarDatoCSV = document.getElementById('botonEliminarDatoCSV');

botonEliminarDatoCSV.onclick = function () {
  const id = document.getElementById('idInputCSVDelete').value;
  if (id == "") {
    Vista.mostrarMensajeError("Tienes que digitar un ID");
  } else {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Borrar este dato?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Controlador.eliminarDatosCSV()
      }
    })
  }

}

const botonActualizarTablaCSV = document.getElementById('botonActualizarTablaCSV');

botonActualizarTablaCSV.onclick = function () {

  if (Controlador.obtenerDatosCSV()) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: "Actualizado",
      showConfirmButton: false,
      timer: 800
    })
  }

}

const botonActualizarTablaTickets = document.getElementById('botonActualizarTablaTickets');

botonActualizarTablaTickets.onclick = function () {

  if (Controlador.obtenerTickets()) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: "Actualizado",
      showConfirmButton: false,
      timer: 800
    })
  }
  
}