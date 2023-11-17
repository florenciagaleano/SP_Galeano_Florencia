class Futbolista extends Persona{

    constructor(id, nombre, apellido, edad, equipo,posicion,cantidadGoles) {
        super(id, nombre, apellido, edad);
            this.equipo = equipo;
            this.posicion = posicion;
            this.cantidadGoles = cantidadGoles;
    }
    
    toString() {
        return `Futbolista { id: ${this.id}, nombre: ${this.nombre}, apellido: ${this.apellido}, edad: ${this.edad} }`;
    }

    toJsonSinId() {
        return JSON.stringify({
            nombre: this.nombre,
            apellido: this.apellido,
            edad: this.edad,
            equipo: this.equipo,
            posicion: this.posicion,
            cantidadGoles: this.cantidadGoles
        });
    }
}
    

