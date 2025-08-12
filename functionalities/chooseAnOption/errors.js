const { getInputToDisplay } = require("./others");
const { shortenInput, errorEmbedGenerator } = require("./../../utilities/errorHandler");

/**
 * Clase base para los errores del comando choose.
 * Sirve para agrupar los errores personalizados y facilitar su manejo.
 * @class
 * @extends Error
 */
class ChooseCommandError extends Error {
	/**
	 * @param {string} message - Mensaje de error.
	 */
	constructor(message) {
		super(message);
		this.name = "ChooseCommandError";
	}
}

/**
 * Error por datos de entrada inválidos en el comando choose.
 * @class
 * @extends ChooseCommandError
 */
class InputDataError extends ChooseCommandError {
	/**
	 * @param {{EN_name: string, ES_name: string, description: string, input: string}} errorDetails - Objeto con información del error.
	 */
	constructor(errorDetails) {
		super(errorDetails.EN_name);
		this.name = "InputDataError";
		this.embed = errorEmbedGenerator(
			`❌ Error: ${errorDetails.ES_name} ❌`,
			`${errorDetails.description}`,
			"Input ingresado que ocasionó el error:\n" +
			"\`\`\`\n" +
			`${shortenInput(errorDetails.input)}\n` +
			"\`\`\`\n"
		);
	}
}

/**
 * Subtipos de errores de datos de entrada para el comando choose.
 * Cada función retorna un objeto con los detalles del error.
 * @type {Object.<string, function(string): {EN_name: string, ES_name: string, description: string, input: string}>}
 */
const INPUT_DATA_ERRORS_SUBTYPES = {
	NULL_REPETITIONS(input) {
		return {
			EN_name: "Null Repetitions",
			ES_name: "Repeticiones Nulas",
			description: "La cantidad de repeticiones no debe ser __inferior a 1__.",
			input
		}
	},
	MAX_REPETITIONS_EXCEEDED(input) {
		return {
			EN_name: "Max Repetitions Exceeded",
			ES_name: "Cantidad Máxima de Repeticiones Excedida",
			description: "La cantidad de repeticiones no puede ser __superior a 20__.",
			input
		}
	},
	NOT_ENOUGH_OPTIONS(input) {
		return {
			EN_name: "Not Enough Options",
			ES_name: "Opciones Insuficientes",
			description: "La cantidad de opciones a escoger no debe ser __inferior a 2__.",
			input
		}
	},
	MAX_OPTIONS_EXCEEDED(input) {
		return {
			EN_name: "Max Options Exceeded",
			ES_name: "Cantidad Máxima de Opciones Excedida",
			description: "La cantidad de opciones a elegir no puede ser __superior a 20__.",
			input
		}
	}
}

/**
 * Error por conflicto entre datos de entrada (por ejemplo, dos títulos o dos repeticiones).
 * @class
 * @extends InputDataError
 */
class ConflictDataError extends InputDataError {
	/**
	 * @param {{EN_name: string, ES_name: string, description: string, input: string}} errorDetails - Objeto con información del error.
	 */
	constructor(errorDetails) {
		super(errorDetails);
		this.name = "ConflictDataError";
	}
}

/**
 * Subtipos de errores de conflicto de datos para el comando choose.
 * Cada función retorna un objeto con los detalles del error.
 * @type {Object.<string, function(string): {EN_name: string, ES_name: string, description: string, input: string}>}
 */
const CONFLICT_DATA_ERRORS_SUBTYPES = {
	TWO_REPETITIONS(input) {
		return  {
			EN_name: "Two Repetitions",
			ES_name: "Dos Repeticiones",
			description: "Se han ingresado __dos repeticiones__ para la misma selección.",
			input
		}
	},
	MULTIPLE_TITLES(input) {
		return  {
			EN_name: "Multiple Titles",
			ES_name: "Múltiples Títulos",
			description: "Se ha ingresado __más de 1 título__ para la misma selección.",
			input
		}
	}
}

/**
 * Error por exceder los límites de caracteres permitidos en los embeds de Discord.
 * @class
 * @extends ChooseCommandError
 */
class EmbedCharRangeError extends ChooseCommandError {
	/**
	 * @param {{EN_name: string, ES_name: string, description: string, input: string}} errorDetails - Objeto con información del error.
	 */
	constructor(errorDetails) {
		super(errorDetails.EN_name);
		this.name = "EmbedCharRangeError";
		this.embed = errorEmbedGenerator(
			`❌ Error: ${errorDetails.ES_name} ❌`,
			`${errorDetails.description}`,
			"Input ingresado que ocasionó el error:\n" +
			"\`\`\`\n" +
			`${shortenInput(errorDetails.input)}\n` +
			"\`\`\`"
		);
	}
}

/**
 * Subtipos de errores de rango de caracteres para los embeds de Discord.
 * Cada función retorna un objeto con los detalles del error.
 * @type {Object.<string, function(string): {EN_name: string, ES_name: string, description: string, input: string}>}
 */
const EMBED_CHAR_RANGE_ERRORS_SUBTYPES = {
	TOTAL_MESSAGE_CHARS_EXCEEDED(input) {
		return  {
			EN_name: "Total Message Characters Exceeded",
			ES_name: "Caracteres Totales del Mensaje Excedidos",
			description: "Los cálculos necesarios para elaborar la respuesta superan el máximo de los __6000 caraceteres__ permitidos para el mensaje total.",
			input
		}
	},
	TOTAL_HEADER_CHARS_EXCEEDED(input) {
		return  {
			EN_name: "Total Header Characters Exceeded",
			ES_name: "Caracteres Totales del Encabezado del Mensaje Excedidos",
			description: "El Título y/o alguna de las Opciones son demasiado largos y superan el máximo de los __256 caraceteres__ permitidos para el encabezado del mensaje de respuesta.",
			input
		}
	},
	TOTAL_BODY_CHARS_EXCEEDED_FOR_SINGLE(input) {
		return  {
			EN_name: "Total Body Characters Exceeded",
			ES_name: "Caracteres Totales del Cuerpo del Mensaje Excedidos",
			description: "Las opciones a escoger son demasiado largas y en conjunto superan el máximo de los __4000 caraceteres__ permitidos para el cuerpo del mensaje de respuesta.",
			input
		}
	},
	TOTAL_BODY_CHARS_EXCEEDED_FOR_MULTIPLE(input) {
		return  {
			EN_name: "Total Body Characters Exceeded",
			ES_name: "Caracteres Totales del Cuerpo del Mensaje Excedidos",
			description: "Las opciones a escoger son demasiado largas y en conjunto superan el máximo de los __1000 caraceteres__ permitidos para el cuerpo del mensaje de respuesta (con repeticiones).",
			input
		}
	}
}

/**
 * Manejador general de errores para el comando choose.
 * Devuelve el embed de error correspondiente o un mensaje genérico si el error no es reconocido.
 * @param {Error} error - El error lanzado.
 * @param {{ title: string|string[]|null, content: string|null, repetitions: number|null }} dataFromText - Datos del input de texto.
 * @param {{ title: string|null, repetitions: number|null, separator: string|null }} dataFromSlash - Datos del input slash.
 * @param {string[]} optionList - Lista de opciones procesadas.
 * @param {string} rawInput - Input original recibido.
 * @returns {Object} Embed de error para mostrar en Discord.
 */
function chooseCommandErrorHandler (error, dataFromText, dataFromSlash, optionList, rawInput) {
	if (error instanceof ChooseCommandError) return error.embed;
	else return errorEmbedGenerator(
		"⚠️ Error: Ha ocurrido un error inesperado ⚠️",
		error.message,
		`Input que ocasionó el error:\n` +
		"\`\`\`\n" +
		`${shortenInput(getInputToDisplay(dataFromText, dataFromSlash, optionList, rawInput))}\n` +
		"\`\`\`\n"
	);
}

module.exports = {
	chooseCommandErrorHandler,
	ChooseCommandError,

	InputDataError,
	INPUT_DATA_ERRORS_SUBTYPES,

	ConflictDataError,
	CONFLICT_DATA_ERRORS_SUBTYPES,

	EmbedCharRangeError,
	EMBED_CHAR_RANGE_ERRORS_SUBTYPES
};