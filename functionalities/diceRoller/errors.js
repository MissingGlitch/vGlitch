const log = require("./../../utilities/logger");
const { getInputToDisplay } = require("./others");
const { errorEmbedGenerator, shortenInput } = require("./../../utilities/errorHandler");

const { dnd5eAdvantageTypeDetector, dnd5eAdvantage, dnd5eDisadvantage } = require("./regexes");

// RollCommandError: Clase Padre de los DiceRangeError, ConflitcDataError, InputDataError y EmbedCharRangeError.
// Esta clase es simplemente para agrupar las clases hijas en una sola al momento de realizar la verficiación en el condicional del errorHandler para identifiar los errores que sean instancias de estas clases personalizadas.
class RollCommandError extends Error {
	constructor(message) {
		super(message);
		this.name = "RollCommandError";
	}
}

// Posibles Errores de Rangos de la función "rollDice".
class DiceRangeError extends RollCommandError {
	constructor(message) {
		super(message.EN_name);
		this.name = "DiceRangeError";
		this.embed = errorEmbedGenerator(
			`❌ Error: ${message.ES_name} ❌`,
			`${message.description}`,
			"Tirada ingresada que ocasionó el error:\n" +
			"\`\`\`\n" +
			`${shortenInput(message.input)}\n` +
			"\`\`\`"
		);
	}
}

const DICE_RANGE_ERRORS_SUBTYPES = {
	ZERO_DICE (input) {
		return {
			EN_name: "Zero Dice",
			ES_name: "Sin Dados",
			description: "No se lanza __ningún dado__.",
			input
		}
	},
	ZERO_FACES (input) {
		return {
			EN_name: "Zero Faces",
			ES_name: "Sin Caras",
			description: "No se pueden lanzar dados de __cero caras__.",
			input
		}
	},
	KEEP_ZERO (input) {
		return {
			EN_name: "Keep Zero",
			ES_name: "Quedarse Ninguno",
			description: "No se mantiene __ningún dado__ luego del cálculo.",
			input
		}
	},
	DROP_ALL (input) {
		return {
			EN_name: "Drop All",
			ES_name: "Descartar Todos",
			description: "Se descartan __todos los dados__ luego del cálculo.",
			input
		}
	},
	MAX_DICE_EXCEEDED (input) {
		return {
			EN_name: "Maximum Dice Exceeded",
			ES_name: "Cantidad Máxima de Dados Excedida",
			description: "No se pueden lanzar más de __100 dados__ por tirada.",
			input
		}
	},
	MAX_FACE_EXCEEDED (input) {
		return {
			EN_name: "Maximum Face Exceeded",
			ES_name: "Cantidad Máxima de Caras Excedida",
			description: "No se pueden lanzar dados con más de __1000 caras__.",
			input
		}
	}
};

// Posibles Errores debido a inputs incorrectos.
class InputDataError extends RollCommandError {
	constructor(message) {
		super(message.EN_name);
		this.name = "InputDataError";
		this.embed = errorEmbedGenerator(
			`❌ Error: ${message.ES_name} ❌`,
			`${message.description}`,
			"Input ingresado que ocasionó el error:\n" +
			"\`\`\`\n" +
			`${shortenInput(message.input)}\n` +
			"\`\`\`\n" +
			(message.extra ?? "")
		);
	}
}

const INPUT_DATA_ERRORS_SUBTYPES = {
	TOO_LONG_TITLE (input) {
		return {
			EN_name: "Too Long Title",
			ES_name: "Título Demasiado Largo",
			description: "El título de la tirada no puede tener más de __240 caracteres__.",
			input
		}
	},
	INVALID_DICE_NOTATION (input) {
		return {
			EN_name: "Invalid Dice Notation",
			ES_name: "Notación de Dados Inválida",
			description: `La tirada ingresada no cumple con la __sintaxis de la notación__ de tiradas de dados.`,
			input
		}
	},
	NULL_REPETITIONS (input) {
		return {
			EN_name: "Null Repetitions",
			ES_name: "Repeticiones Nulas",
			description: "La cantidad de repeticiones de una tirada no debe ser __inferior a 1__.",
			input
		}
	},
	MAX_REPETITIONS_EXCEEDED (input) {
		return {
			EN_name: "Max Repetitions Exceeded",
			ES_name: "Cantidad Máxima de Repeticiones Excedida",
			description: "La cantidad de repeticiones de una tirada no puede ser __superior a 20__.",
			input
		}
	},
	INVALID_PARENTHESIS_SYNTAX (input) {
		return  {
			EN_name: "Invalid Parenthesis Syntax",
			ES_name: "Sintaxis de Paréntesis Inválida",
			description: "Hay un error de sintaxis en los __paréntesis__ utilizados en la tirada.",
			input
		}
	},
	INVALID_ADVANTAGETYPE_USAGE (input) {
		return  {
			EN_name: "Invalid Advantage Type Usage",
			ES_name: "Uso de Tipo de Ventaja Inválido",
			description: "La tirada ingresada __no es apta__ para el uso del tipo de ventaja.",
			input,
			extra: "_El tipo de ventaja solo se aplica a tiradas de dados __individuales__._\n> _(Ej.: 1d20, 1d10, 1d8, 1d4, etc.)_"
		}
	}
}

// Posibles Errores debido a conflictos entre los inputs.
class ConflictDataError extends InputDataError {
	constructor(message) {
		super(message);
		this.name = "ConflictDataError";
		this.embed = errorEmbedGenerator(
			`❌ Error: ${message.ES_name} ❌`,
			`${message.description}`,
			"Inputs ingresados que ocasionaron el error:\n" +
			"\`\`\`\n" +
			`${shortenInput(message.input)}\n` +
			"\`\`\`"
		);
	}
}

const CONFLICT_DATA_ERRORS_SUBTYPES = {
	TWO_TITLES (slashInput, textInput) {
		return  {
			EN_name: "Two Titles",
			ES_name: "Dos Títulos",
			description: "Se han ingresado __dos títulos__ para la misma tirada.",
			input: `> text: ${textInput}\n` + `> slash: ${slashInput}`
		}
	},
	TWO_REPETITIONS (slashInput, textInput) {
		return  {
			EN_name: "Two Repetitions",
			ES_name: "Dos Repeticiones",
			description: "Se han ingresado __dos repeticiones__ para la misma tirada.",
			input: `> text: ${textInput}\n` + `> slash: ${slashInput}`
		}
	},
	TWO_ADVANTAGETYPES (slashInput, textInput) {
		return  {
			EN_name: "Two Advantage Types",
			ES_name: "Dos Tipos de Ventaja",
			description: "Se han ingresado __dos tipos de ventaja__ para la misma tirada.",
			input: `> text: ${textInput}\n` + `> slash: ${slashInput}`
		}
	}
}

// Posibles Errores de Exceso de Caracteres de Embeds
class EmbedCharRangeError extends RollCommandError {
	constructor(message) {
		super(message.EN_name);
		this.name = "EmbedCharRangeError";
		this.embed = errorEmbedGenerator(
			`❌ Error: ${message.ES_name} ❌`,
			`${message.description}`,
			"Input ingresado que ocasionó el error:\n" +
			"\`\`\`\n" +
			`${shortenInput(message.input)}\n` +
			"\`\`\`"
		);
	}
}

const EMBED_CHAR_RANGE_ERRORS_SUBTYPES = {
	TOTAL_MESSAGE_CHARS_EXCEEDED (input) {
		return  {
			EN_name: "Total Message Characters Exceeded",
			ES_name: "Caracteres Totales del Mensaje Excedidos",
			description: "Los cálculos necesarios para elaborar la respuesta superan el máximo de los __6000 caraceteres__ permitidos para el mensaje total.",
			input
		}
	},
	MAXIMUM_ROLL_CHARS_EXCEEDED (input) {
		return  {
			EN_name: "Maximum Rolled Characters Exceeded",
			ES_name: "Caracteres Máximos de la Tirada Excedidos",
			description: "Los cálculos necesarios para elaborar la respuesta superan el máximo de los __1024 caraceteres__ permitidos para tiradas individuales.",
			input
		}
	}
}

// Manejador de Errores General
function rollCommandErrorHanlder (error, rollFromInput, dataFromSlash, charName) { // ! muchos parámetros, ver si se puede hacer solo con "error"
	if (error instanceof RollCommandError) return error.embed;
	else return errorEmbedGenerator(
		"⚠️ Error: Ha ocurrido un error inesperado ⚠️",
		error.message,
		`Input que ocasionó el error:\n` +
		"\`\`\`\n" +
		`${getInputToDisplay(rollFromInput, dataFromSlash, charName)}\n` +
		"\`\`\`\n"
	);
}

// Posibles Advertencias al realizar cierto tipo de inputs.
const WARNING_TYPES = {
	PARAMETER_IN_TITLE (titleInput) {
		let parameter, messageDescription;
		const messageTitle = "⚠️ **Advertencia:** Parece que se ha intentado usar un parámetro (__PARAMETER__) ⚠️\n" + "> ";

		// Advantage Type in Title.
		if (titleInput.match(dnd5eAdvantageTypeDetector)) {
			const type = titleInput.match(dnd5eAdvantageTypeDetector)[1];
			if (type.match(dnd5eAdvantage)) parameter = "ventaja";
			if (type.match(dnd5eDisadvantage)) parameter = "desventaja";
			messageDescription = "_El parámetro PARAMETER solo se aplica en tiradas de dados individuales, de modo que si se intenta usar en otro tipo de tirada se interpretará como parte del título._";
		}

		// Unknown Parameter.
		else {
			parameter = "desconocido";
			messageDescription = "_Todos los parámetros van precedidos de un doble guion _`--`_, sin embargo dado que no se logró reconocer el parámetro introducido, se interpretó como parte del título._";
		}

		const warning = messageTitle + messageDescription;
		log.warn(`Parámetro <${parameter}> en el título de la tirada: "${titleInput}".`);
		return warning.replaceAll("PARAMETER", parameter);
	},
	DROP_ZERO (roll) {
		const warning = "⚠️ **Advertencia:** No se está descartando __ningún dado__ ⚠️\n" + "> " +
		"_Si no se desea descartar ningún dado, preferiblemente ingrese la tirada con normalidad sin hacer uso de un _`droping = 0`_ para evitar redundancias._";

		log.warn(`En la tirada <${roll}> no se está descartando ningún dado (Drop Zero).`)
		return warning;
	},
	KEEP_TOO_MUCH (roll) {
		const warning = "⚠️ **Advertencia:** Se están manteniendo __demasiados dados__ ⚠️\n" + "> " +
		"_Si desea quedarse con todos los dados, preferiblemente ingrese la tirada con normalidad sin hacer uso de un _`keeping ≥ dados`_ para evitar redundancias._";

		log.warn(`En la tirada <${roll}> se están manteniendo demasiados dados (Keep Too Much).`)
		return warning;
	}
}

module.exports = {
	WARNING_TYPES,

	rollCommandErrorHanlder,
	RollCommandError,

	DiceRangeError,
	DICE_RANGE_ERRORS_SUBTYPES,

	InputDataError,
	INPUT_DATA_ERRORS_SUBTYPES,

	ConflictDataError,
	CONFLICT_DATA_ERRORS_SUBTYPES,

	EmbedCharRangeError,
	EMBED_CHAR_RANGE_ERRORS_SUBTYPES
};