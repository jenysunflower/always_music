import pkg from 'pg';
import 'dotenv/config';
const { Pool } = pkg;

// Paso 1: Configuración de Conexión con la base de datos
const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

const connection_pool = new Pool({
  connectionString,
  idleTimeoutMillis: 0,
  allowExitOnIdle: true,
});

// Declaración de funciones antes de usarlas

// Función para insertar un estudiante en la base de datos
const insertEstudiantetoDatabase = async (pool, nombre, rut, curso, nivel) => {
  try {
    const query = 'INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4)';
    const result = await pool.query(query, [nombre, rut, curso, nivel]);
    if (result.rowCount === 1) {
      console.log(`Estudiante ${nombre} insertado con éxito.`);
    }
  } catch (error) {
    console.error('Error insertando estudiante:', error);
  }
};

// Función para ingresar un estudiante
const ingresarEstudiante = (arrayComandos, connection_pool) => {
  if (
    arrayComandos[1] &&
    arrayComandos[2] &&
    arrayComandos[3] &&
    arrayComandos[4]
  ) {
    const nombre = arrayComandos[1];
    const rut = arrayComandos[2];
    const curso = arrayComandos[3];
    const nivel = arrayComandos[4];
    insertEstudiantetoDatabase(connection_pool, nombre, rut, curso, nivel);
  } else {
    console.log("Faltan datos para ingresar al estudiante.");
  }
};

// Función para consultar estudiante por RUT
const consultarRut = (arrayComandos, connection_pool) => {
  if (arrayComandos[1]) {
    const rut = arrayComandos[1];
    consultaRuttoDatabase(connection_pool, rut);
  } else {
    console.log("Debes ingresar un RUT.");
  }
};

// Función para consulta por RUT
const consultaRuttoDatabase = async (pool, rut) => {
  try {
    const query = 'SELECT * FROM estudiantes WHERE rut = $1';
    const result = await pool.query(query, [rut]);
    if (result.rowCount === 0) {
      console.log("Estudiante no encontrado.");
    } else {
      console.log(result.rows);
    }
  } catch (error) {
    console.error('Error consultando estudiante:', error);
  }
};

// Función para consultar todos los estudiantes
const consultarTodosLosEstudiantes = (connection_pool) => {
  consultaGlobaltoDatabase(connection_pool);
};

// Función para consulta global
const consultaGlobaltoDatabase = async (pool) => {
  try {
    const query = 'SELECT * FROM estudiantes';
    const result = await pool.query(query);
    if (result.rowCount === 0) {
      console.log("No se encontraron estudiantes.");
    } else {
      console.log(result.rows);
    }
  } catch (error) {
    console.error('Error consultando estudiantes:', error);
  }
};

// Función para editar un estudiante
const editarEstudiante = (arrayComandos, connection_pool) => {
  if (
    arrayComandos[1] &&
    arrayComandos[2] &&
    arrayComandos[3] &&
    arrayComandos[4]
  ) {
    const nombre = arrayComandos[1];
    const rut = arrayComandos[2];
    const curso = arrayComandos[3];
    const nivel = arrayComandos[4];
    editarEstudiantetoDatabase(connection_pool, nombre, rut, curso, nivel);
  } else {
    console.log("Faltan datos para edición.");
  }
};

// Función para editar un estudiante en la base de datos
const editarEstudiantetoDatabase = async (pool, nombre, rut, curso, nivel) => {
  try {
    const query = 'UPDATE estudiantes SET nombre = $1, curso = $2, nivel = $3 WHERE rut = $4';
    const result = await pool.query(query, [nombre, curso, nivel, rut]);
    if (result.rowCount === 1) {
      console.log(`Estudiante ${nombre} actualizado con éxito.`);
    } else {
      console.log("Estudiante no encontrado.");
    }
  } catch (error) {
    console.error('Error actualizando estudiante:', error);
  }
};

// Función para eliminar un estudiante
const eliminarEstudiante = (arrayComandos, connection_pool) => {
  if (arrayComandos[1]) {
    const rut = arrayComandos[1];
    eliminarEstudiantetoDatabase(connection_pool, rut);
  } else {
    console.log("Debes ingresar un RUT.");
  }
};

// Función para eliminar un estudiante en la base de datos
const eliminarEstudiantetoDatabase = async (pool, rut) => {
  try {
    const query = 'DELETE FROM estudiantes WHERE rut = $1';
    const result = await pool.query(query, [rut]);
    if (result.rowCount === 1) {
      console.log(`Estudiante con RUT ${rut} eliminado con éxito.`);
    } else {
      console.log("Estudiante no encontrado.");
    }
  } catch (error) {
    console.error('Error eliminando estudiante:', error);
  }
};

// Paso 2: Escucha de comandos en consola
const arrayComandos = process.argv.slice(2);

if (arrayComandos[0]) {
  switch (arrayComandos[0]) {
    case "nuevo":
      ingresarEstudiante(arrayComandos, connection_pool);
      break;

    case "rut":
      consultarRut(arrayComandos, connection_pool);
      break;

    case "consulta":
      consultarTodosLosEstudiantes(connection_pool);
      break;

    case "editar":
      editarEstudiante(arrayComandos, connection_pool);
      break;

    case "eliminar":
      eliminarEstudiante(arrayComandos, connection_pool);
      break;

    default:
      console.log("Comando inválido");
  }
} else {
  console.log("Debes ingresar un comando");
}
