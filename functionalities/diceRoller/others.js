const { repetitionNotation, diceDestructurator, diceDetector, dnd5eAdvantageTypeDetector, dnd5eAdvantage, dnd5eDisadvantage } = require("./regexes");

// Desestructurador de Dados
function diceDestructuring (dice) {
	const diceParts = dice.match(diceDestructurator)
	return {
		quantity: diceParts[1] === "" ? 1 : Number(diceParts[1]),
		faces: diceParts[2].toLowerCase() === "f" ? "f" : Number(diceParts[2]),
		keepdropingType: diceParts[4]?.toLowerCase(),
		keepdropingAmount: Number(diceParts[5])
	}
}

// Función para obtener las repeticiones de un string de notación de tiradas de dados.
function getRepetitions(diceRollNotation) {
	const hasRepetitions = diceRollNotation?.match(repetitionNotation);
	const repetitions = hasRepetitions ? Number(hasRepetitions[1]) : null;
	return repetitions;
}

// Función que verifica si se puede aplicar el parámetro (advantagetype) ingresado al input.
function isApplicable(roll) {
	const diceGroupsRolled = roll.match(diceDetector);
	if (diceGroupsRolled.length !== 1) return false;

	const { quantity } = diceDestructuring(diceGroupsRolled[0]);
	if (quantity !== 1) return false;

	return true;
}

// Función para obtener los parámetros (el tipo de ventaja) de un string de notación de tiradas de dados.
// El tipo de ventaja solo se aplicará cuando en la tirada se esté lanzando un solo dado (Ej: 1d20+5).
function getParametersFromText(diceRollNotation, titleAndParameters) {
	if (!diceRollNotation) return "";
	if (!titleAndParameters.match(dnd5eAdvantageTypeDetector)) return "";
	if (!isApplicable(diceRollNotation)) return "";

	const parameter = titleAndParameters.match(dnd5eAdvantageTypeDetector)[0];
	return parameter;
}

// Función para aplicar el tipo de ventaja a la tirada.
function applyAdvantageType(parameter, diceRollNotation) {
	if (!parameter) return diceRollNotation;
	if (!isApplicable(diceRollNotation)) return diceRollNotation;
	const type = parameter.replace("--", "");

	let newDie;
	const originalDie = diceRollNotation.match(diceDetector)[0];
	const { faces } = diceDestructuring(originalDie);
	if (type.match(dnd5eAdvantage)) newDie = `2d${faces}kh1`;
	if (type.match(dnd5eDisadvantage)) newDie = `2d${faces}kl1`;

	const rollWithParametersApplied = diceRollNotation.replace(originalDie, newDie);
	return rollWithParametersApplied;
}

// Función para aplicar el tipo de ventaja al título de la tirada.
function getComplement(parameter) {
	if (!parameter) return "";
	const type = parameter.replace("--", "");
	if (type.match(dnd5eAdvantage)) return " (Ventaja)";
	if (type.match(dnd5eDisadvantage)) return " (Desventaja)";
}

// Función para contar la cantidad de caracteres del embed (y de sus propiedades internas).
function embedCharCounter (embed) {
	const detailedCounter = {
		author: { text: embed.data?.author.name, chars: embed.data?.author.name?.length || 0 },
		title: { text: embed.data?.title, chars: embed.data?.title?.length || 0 },
		description: { text: embed.data?.description, chars: embed.data?.description?.length || 0 },
		footer: { text: embed.data?.footer.text, chars: embed.data?.footer.text?.length || 0 }
	}

	// Fields
	const detailedCounterForFields = [];
	embed.data.fields.forEach(field => {
		detailedCounterForFields.push({
			name: { text: field.name, chars: field.name?.length || 0 },
			value: { text: field.value, chars: field.value?.length || 0 }
		});
	});
	detailedCounter.fields = {
		text: detailedCounterForFields,
		chars: 0
	};
	detailedCounterForFields.forEach(field => {
		detailedCounter.fields.chars += field.name.chars + field.value.chars;
	});

	// Total
	let total = 0;
	for (property in detailedCounter) { total+= detailedCounter[property].chars; }
	detailedCounter.total = total;

	return detailedCounter;
}

// Función para definir el input a mostrar en los EmbedCharRangeError y en el "Error Inesperado".
// Dado que, cuando se ejecuta la funcionalidad mediante un comando slash, ahora el input no solo es la tirada en sí sino también los parámetros utilizados, esta función muestra todo el input enviado (incluyendo los parámetros slash en caso de que se utilice alguno).
function getInputToDisplay(rollFromInput, dataFromSlash, charName) {
	if (dataFromSlash.advantageType || dataFromSlash.title || dataFromSlash.repetitions || charName) {
		let input = `> roll: ${rollFromInput}`;
			if (dataFromSlash.advantageType) input+= `\n> advantageType: ${dataFromSlash.advantageType}`;
			if (dataFromSlash.title) input+= `\n> title: ${dataFromSlash.title}`;
			if (dataFromSlash.repetitions) input+= `\n> repetitions: ${dataFromSlash.repetitions}`;
			if (charName) input+= `\n> charName: ${charName}`;
		return input;
	} else {
		return rollFromInput;
	}
}

module.exports = { getInputToDisplay, isApplicable, getParametersFromText, getRepetitions, getComplement, embedCharCounter, diceDestructuring, applyAdvantageType }