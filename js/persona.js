class Persona{

    constructor(id, nombre, apellido, edad) {
        if (id && nombre && apellido && edad > 15) {        
            this.id = id;
            this.nombre = nombre;
            this.apellido = apellido;
            this.edad = edad;
        }
    }
    
    toString() {
        return `Persona { id: ${this.id}, nombre: ${this.nombre}, apellido: ${this.apellido}, edad: ${this.edad} }`;
      }
    
    toJson() {
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            edad: this.edad
        });
    }
}