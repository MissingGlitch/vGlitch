const { shortenInput, errorEmbedGenerator } = require("./../../utilities/errorHandler");

/**
 * Clase base para los errores del comando calculate.
 * Sirve para agrupar los errores personalizados y facilitar su manejo.
 * @class
 * @extends Error
 */
class CalculateCommandError extends Error {
	/**
	 * @param {string} message - Mensaje de error.
	 */
	constructor(message) {
		super(message);
		this.name = "ChooseCommandError";
	}
}

/**
 * Error por datos de entrada inválidos en el comando calculate.
 * @class
 * @extends CalculateCommandError
 */
class InputDataError extends CalculateCommandError {
	/**
	 * @param {{EN_name: string, ES_name: string, description: string, input: string}} errorDetails - Objeto con información del error.
	 */
	constructor(errorDetails) {
		super(errorDetails.EN_name);
		this.name = "InputDataError";
		this.embed = errorEmbedGenerator(
			`❌ Error: ${errorDetails.ES_name} ❌`,
			`${errorDetails.description}`,
			"Operación (input) ingresada que ocasionó el error:\n" +
			"\`\`\`\n" +
			`${shortenInput(errorDetails.input)}\n` +
			"\`\`\`\n"
		);
	}
}

/**
 * Subtipos de errores de datos de entrada para el comando calculate.
 * Cada función retorna un objeto con los detalles del error.
 * @type {Object.<string, function(string): {EN_name: string, ES_name: string, description: string, input: string}>}
 */
const INPUT_DATA_ERRORS_SUBTYPES = {
	TOO_LONG_OPERATION(input) {
		return {
			EN_name: "Too Long Operation",
			ES_name: "Operación Demasiado Larga",
			description: "La operación a calcular no puede superar los __300 caracteres__.",
			input
		}
	},
	INVALID_CHARACTERS(input) {
		return {
			EN_name: "Invalid Characters",
			ES_name: "Caracteres Inválidos",
			description: "Se han ingresados caracteres no permitidos en la operación.",
			input
		}
	}
}

/**
 * Manejador general de errores para el comando calculate.
 * Devuelve el embed de error correspondiente o un mensaje genérico si el error no es reconocido.
 * @param {Error} error - El error lanzado.
 * @param {{ title: string|null, operation: string|null }} input - Datos del input.
 * @returns {Object} Embed de error para mostrar en Discord.
 */
function calculateCommandErrorHandler (error, operation) {
	if (error instanceof CalculateCommandError) return error.embed;
	else return errorEmbedGenerator(
		`❌ Error: ${error.message} ❌`,
		`Ha ocurrido un error al intentar evaluar la operación.`,
		`Operación (input) ingresada que ocasionó el error:\n` +
		"\`\`\`\n" +
		`${shortenInput(operation)}\n` +
		"\`\`\`\n"
	);
}

module.exports = {
	calculateCommandErrorHandler,
	CalculateCommandError,

	InputDataError,
	INPUT_DATA_ERRORS_SUBTYPES
};