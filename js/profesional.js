class Profesional extends Persona{

    constructor(id, nombre, apellido, edad, titulo,facultad,añoGraduacion) {
        super(id, nombre, apellido, edad);
            this.titulo = titulo;
            this.facultad = facultad;
            this.añoGraduacion = añoGraduacion;
    }
    
    toString() {
        return `Profesional { id: ${this.id}, nombre: ${this.nombre}, apellido: ${this.apellido}, edad: ${this.edad} }`;
      }
    
}