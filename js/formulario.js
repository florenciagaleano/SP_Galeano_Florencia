const arrayHeaders = new Array("ID","NOMBRE","APELLIDO","EDAD","EQUIPO","POSICION","GOLES","TITULO","FACULTAD","GRADUACION","MODIFICAR","ELIMINAR");
const local = "http://localhost:80/parcial";
let tabla = document.getElementById("tabla-personas");
const $btnAgregar = document.getElementById("btnAgregar");
let $formAlta = document.getElementById("form-alta");
let esAlta = 1; //1 es alta, 0 es modificacion y -1 es eliminar
let arrayPersonas = new Array();
let $btnAceptar = document.getElementById("btnAceptar");
let $btnCancelar = document.getElementById("btnCancelar");
const tipoPersonaSelect = document.getElementById("tipo-persona");
let $tipoOperacion = document.getElementById("tipoOperacion");
let spinner = document.getElementById("spinner");

window.addEventListener("load", () => {
    GetPersonasJSON();
});

function agregarDatos() {
    limpiarTabla(tabla);
    tabla.appendChild(crearTabla(arrayPersonas));

}

function limpiarTabla(tabla) {
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
}

function crearTabla(arrayPersonas) {
    const tabla = document.createElement("table");
    tabla.setAttribute("id", "tablePersonas");
    tabla.appendChild(crearCabecera());
    crearCuerpo(arrayPersonas, tabla);
    return tabla;
}

function crearCabecera() {
    const tHead = document.createElement("thead");
    const headRow = document.createElement("tr");

    arrayHeaders.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headRow.appendChild(th);
    });

    tHead.appendChild(headRow);
    return tHead;
}

function crearCuerpo(data, tabla) {
    const tBody = document.createElement('tbody');
    tBody.setAttribute("id", "table-tbody");
    let fila;
    data.forEach(persona => {
        const columnasData = filtrarData(data, persona);
        CrearFila(columnasData, tBody);
    });
    tabla.appendChild(tBody);
}

function CrearFila(columnasData, tBody) {
    const fila = document.createElement("tr");
    columnasData.forEach(columnaInfo => {
        const elemento = document.createElement("td");
        elemento.appendChild(document.createTextNode(columnaInfo?.data ?? '-'));
        fila.appendChild(elemento);
    });
    agregarBotones(fila);
    tBody.appendChild(fila);
}

function agregarBotones(fila) {
    const elementoModificar = document.createElement("td");
    const elementoEliminar = document.createElement("td");

    let buttonModificar = document.createElement("button");
    let buttonEliminar = document.createElement("button");

    buttonModificar.textContent = "Modificar";
    buttonEliminar.textContent = "Eliminar";
    buttonModificar.addEventListener("click", () => {
        let filaClickeada = event.target.closest("tr");
        let idPersonaClickeada = filaClickeada.querySelector("td:first-child") != null ? filaClickeada.querySelector("td:first-child").textContent : null;    //selecciono el primer elemento de la fila (el id)     
        cargarPersona(this.buscarPersonaPorId(idPersonaClickeada));
        mostrarFormularioABM("MODIFICAR");
        esAlta = 0;
    });

    buttonEliminar.addEventListener("click", () => {
        let filaClickeada = event.target.closest("tr");
        let idPersonaClickeada = filaClickeada.querySelector("td:first-child") != null ? filaClickeada.querySelector("td:first-child").textContent : null;    //selecciono el primer elemento de la fila (el id)     
        cargarPersona(this.buscarPersonaPorId(idPersonaClickeada));
        mostrarFormularioABM("ELIMINAR");
        esAlta = -1;
    });

    elementoModificar.appendChild(buttonEliminar);
    elementoEliminar.appendChild(buttonModificar);
    fila.appendChild(elementoModificar);
    fila.appendChild(elementoEliminar);
}

function GetPersonasJSON() {
    var xhttp = new XMLHttpRequest();
    let endpoint = "personasFutbolitasProfesionales.php";
    mostrarSpinner();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            ocultarSpinner();
            if(xhttp.status == 200){
                const data = JSON.parse(xhttp.response);
                arrayPersonas = GetPersonas(data);
                tabla.appendChild(crearTabla(arrayPersonas));
            }else{
                console.error("Error:", xhttp);
                alert("No se pudo obtener a las personas.");
                $btnAgregar.hidden = true;

            }
        }else{
            console.error("Error:", xhttp);
            alert("No se pudo obtener a las personas.");
            $btnAgregar.hidden = true;
        }
    };
    xhttp.open("GET", `${local}/${endpoint}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

function GetPersonas(data) {
    let arrayPersonas = data.map(
        (elemento) => {
            if ('equipo' in elemento && 'posicion' in elemento && 'cantidadGoles' in elemento) {
                return new Futbolista(elemento.id, elemento.nombre, elemento.apellido, elemento.edad, elemento.equipo,elemento.posicion,elemento.cantidadGoles);
            } else if ('titulo' in elemento && 'facultad' in elemento && 'añoGraduacion' in elemento) {
                return new Profesional(elemento.id, elemento.nombre, elemento.apellido, elemento.edad,elemento.titulo,elemento.facultad,elemento.añoGraduacion);
            } else {
                return new Persona(elemento.id, elemento.nombre, elemento.apellido, elemento.edad);
            }
        }
    );

    return arrayPersonas;
}

function filtrarData(data, persona) {
    let columnasData = [];

    const campos = {
        id: 'ID',
        nombre: 'NOMBRE',
        apellido: 'APELLIDO',
        edad: 'EDAD',
        equipo: 'EQUIPO',
        posicion: 'POSICION',
        cantidadGoles: 'GOLES',
        titulo: 'TITULO',
        facultad: 'FACULTAD',
        añoGraduacion: 'GRADUACION'
    };

    for (const campo in campos) {
        if (persona instanceof Futbolista && (campo === 'titulo' || campo === 'facultad' || campo === 'añoGraduacion')) {
            columnasData.push({ data: '-' });
        } else if (persona instanceof Profesional && (campo === 'equipo' || campo === 'posicion' || campo === 'cantidadGoles')) {
            columnasData.push({ data: '-' });
        } else {
            columnasData.push({ data: persona[campo] || '-' });
        }
    }

    return columnasData;
}

tipoPersonaSelect.addEventListener("change", () => {
    let esFutbolista = tipoPersonaSelect.value === "futbolista";
    filtrarFormAlta(esFutbolista);
});

function filtrarFormAlta(esFutbolista){
    let campoEquipo = document.getElementById('campoEquipo');
    let campoPosicion = document.getElementById('campoPosicion');
    let campoGoles = document.getElementById('campoGoles');
    let campoTitulo = document.getElementById('campoTitulo');
    let campoFacultad = document.getElementById('campoFacultad');
    let campoGraduacion = document.getElementById('campoGraduacion');

    if (esFutbolista) {
        campoEquipo.style.display = 'block';
        campoPosicion.style.display = 'block';
        campoGoles.style.display = 'block';
        
        campoTitulo.style.display = 'none';
        campoFacultad.style.display = 'none';
        campoGraduacion.style.display = 'none';
    } else {
        campoEquipo.style.display = 'none';
        campoPosicion.style.display = 'none';
        campoGoles.style.display = 'none';

        campoTitulo.style.display = 'block';
        campoFacultad.style.display = 'block';
        campoGraduacion.style.display = 'block';
    }

}


function ABMPersona(persona) {
    if((esAlta == 1 || esAlta == 0) &&  !validarPersona(persona)){
        alert("Hubo un problema al cargar a la persona. Revisar los datos");
    }else{
        switch (esAlta) {
            case 1:
                agregarPersona(persona);
                break;
            case 0:
                modificarPersona(persona);
                break;
            case -1:
                eliminarPersona(persona.id);
                break;
        }
    }
}

async function agregarPersona(data) {
    let endpoint = "personasFutbolitasProfesionales.php";
    mostrarSpinner();

    try {
        const req  = {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        };

        let response = await fetch(`${local}/${endpoint}`, req);

        if (response.status == 200) {
            const responseData = await response.json();
            data.id = responseData.id;
            arrayPersonas.push(data);
            agregarDatos();
            ocultarFormularioABM();
        } else {
            console.error('Error:', response);
            alert('No se pudo realizar la operacion. El odigo devuelto fue ' + response.status);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo realizar la operacion');
    } finally {
        ocultarSpinner();
    }
}

$btnAgregar.addEventListener("click", (e) => {
    e.preventDefault();
    esAlta = 1;
    mostrarFormularioABM("ALTA");
});

$btnAceptar.addEventListener("click", (e) => {
    e.preventDefault();
    const nuevaPersona = obtenerDatosFormulario();
    ABMPersona(nuevaPersona);
    ocultarFormularioABM();
});

$btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    ocultarFormularioABM();
});

function ocultarFormularioABM() {
    $formAlta.hidden = true;
    tabla.hidden = false;
    $btnAgregar.hidden = false;
    $tipoOperacion.textContent = "ALTA";
}

function mostrarFormularioABM(operacion) {
    $formAlta.hidden = false;
    tabla.hidden = true;
    $btnAgregar.hidden = true;
    $tipoOperacion.textContent = operacion;
}

function obtenerDatosFormulario(){
    let tipoPersonaSelect = document.getElementById("tipo-persona");
    let idTxt = document.getElementById("txtId").value;
    let nombreTxt = document.getElementById("txtNombre").value;
    let apellidoTxt = document.getElementById("txtApellido").value;
    let edadTxt = document.getElementById("txtEdad").value;
    let tipoPersona = tipoPersonaSelect.value;

    let datosComunes = {
        id: idTxt,
        nombre: nombreTxt,
        apellido: apellidoTxt,
        edad: edadTxt,
    };

    if (tipoPersona == "futbolista") {
        let equipoTxt = document.getElementById("txtEquipo").value;
        let posicionTxt = document.getElementById("txtPosicion").value;
        let golesTxt = document.getElementById("txtGoles").value;

        return { ...datosComunes, equipo: equipoTxt, posicion: posicionTxt, cantidadGoles: golesTxt };
    } else if (tipoPersona == "profesional") {
        let tituloTxt = document.getElementById("txtTitulo").value;
        let facultadTxt = document.getElementById("txtFacultad").value;
        let graduacionTxt = document.getElementById("txtGraduacion").value;

        return { ...datosComunes, titulo: tituloTxt, facultad: facultadTxt, añoGraduacion: graduacionTxt };
    } else {
        return datosComunes;
    }
}

function modificarPersona(data) {
    let endpoint = "personasFutbolitasProfesionales.php";
    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    mostrarSpinner();

    fetch(`${local}/${endpoint}`, req)
        .then(response => {
            ocultarSpinner();
            if (response.status == 200) {
                return response;
            } else {
                console.error("Error:", response.statusText);
                alert("No se pudo realizar la operacion :(");
                throw new Error("OperaciOn fallida");
            }
        })
        .then(response => {
            arrayPersonas = arrayPersonas.map(persona => {
                if (persona.id == data.id) {
                    return data;
                }
                return persona;
            });
            agregarDatos();
            ocultarFormularioABM();
        })        
        .catch(error => {
            alert("No se pudo realizar la operacion.");
            console.error("Error:", error);
        });
}

function cargarPersona(persona) {
    let nombreTxt = document.getElementById("txtNombre");
    nombreTxt.value = persona.nombre;

    let apellidoTxt = document.getElementById("txtApellido");
    apellidoTxt.value = persona.apellido;

    let edadTxt = document.getElementById("txtEdad");
    edadTxt.value = persona.edad;

    let tipoPersonaSelect = document.getElementById("tipo-persona");

    if (persona instanceof Futbolista) {
        tipoPersonaSelect.value = 'futbolista';
        filtrarFormAlta(true); // Muestra campos de Futbolista
        let equipoTxt = document.getElementById("txtEquipo");
        equipoTxt.value = persona.equipo;
        
        let posicionTxt = document.getElementById("txtPosicion");
        posicionTxt.value = persona.posicion;

        let golesTxt = document.getElementById("txtGoles");
        golesTxt.value = persona.cantidadGoles;
    } else if (persona instanceof Profesional) {
        tipoPersonaSelect.value = 'profesional';
        filtrarFormAlta(false);

        let tituloTxt = document.getElementById("txtTitulo");
        tituloTxt.value = persona.titulo;
        
        let facultadTxt = document.getElementById("txtFacultad");
        facultadTxt.value = persona.facultad;

        let graduacionTxt = document.getElementById("txtGraduacion");
        graduacionTxt.value = persona.añoGraduacion;
    }
}

function buscarPersonaPorId(id) {
    if (id != null) {
        let idTxt = document.getElementById("txtId");
        idTxt.value = id;
    }
    return arrayPersonas.filter(persona => persona.id == id)[0];
}

async function eliminarPersona(id) {
    mostrarSpinner();
    let endpoint = "personasFutbolitasProfesionales.php";
    try {

        const req  = {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        };
        let response = await fetch(`${local}/${endpoint}`, req);

        if (response .status == 200) {
            arrayPersonas = arrayPersonas.filter(persona => persona.id != id);
            agregarDatos();
            ocultarFormularioABM();
        } else {
            console.error('Error:', response);
            alert('No se pudo realizar la operacion');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo realizar la operacion');
    } finally {
        ocultarSpinner();
    }
}

function validarPersona(persona){
    if(persona.id == null || persona.apellido == null || persona.nombre == null || persona.edad == null || parseInt(persona.edad) < 14){
        return false;
    }else if(persona instanceof Futbolista && (persona.cantidadGoles == null || persona.posicion == null || persona.equipo == null)){
        return false;
    }else if(persona instanceof Profesional && (persona.añoGraduacion || persona.facultad || persona.titulo || parseInt(persona.añoGraduacion) < 1950 || persona.facultad == "" || persona.titulo == "")){
        return false;
    }

    return true;
    
}


/*  SPINNER */
function mostrarSpinner() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";
    var botones = document.querySelectorAll('button');
    botones.forEach(function(boton) {//desactivo todos los botones
        boton.disabled = true;
    });
}

function ocultarSpinner() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none";
    ocultarFormularioABM();
    var botones = document.querySelectorAll('button');
    botones.forEach(function(boton) {//los vuelvo a activar
        boton.disabled = false;
    });

}
