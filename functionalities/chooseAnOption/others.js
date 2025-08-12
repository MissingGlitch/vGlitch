/**
 * Extrae las opciones de un texto, detectando automáticamente el separador más frecuente,
 * o usando el separador especificado si se proporciona.
 * Si no se encuentra un separador, devuelve el texto como una sola opción o un array vacío si está vacío.
 * @param {string} originalTextInput - Texto original ingresado por el usuario.
 * @param {string} [specifiedSeparator] - Separador especificado por el usuario (opcional).
 * @returns {string[]} Array de opciones extraídas del texto.
 */

function getOptionsFromText(originalTextInput, specifiedSeparator) {
	const textInput = originalTextInput.trim();

	// Si se especifica un separador, usarlo directamente
	if (specifiedSeparator && specifiedSeparator.length > 0) {
		return textInput
			.split(specifiedSeparator)
			.map(option => option.trim())
			.filter(option => option !== "");
	}

	const possibleSeparators = {};

	// Contamos la frecuencia de cada carácter no alfanumérico y no espacio
	const alphanumericCharacters = /[a-zA-Z0-9\s\u00C0-\u00FF]/;
	for (let i = 0; i < textInput.length; i++) {
		const char = textInput[i];
		if (!alphanumericCharacters.test(char)) {
			possibleSeparators[char] = (possibleSeparators[char] ?? 0) + 1;
		}
	}

	let mostFrequentSeparator = null;
	let maxFrequency = 0;

	// Encontramos el carácter no alfanumérico/espacio más frecuente
	for (const separator in possibleSeparators) {
		if (possibleSeparators[separator] > maxFrequency) {
			maxFrequency = possibleSeparators[separator];
			mostFrequentSeparator = separator;
		}
	}

	if (!mostFrequentSeparator) {
		// Si no se encontró un separador no alfanumérico, verificamos la frecuencia del espacio
		const spaceFrequency = textInput.match(/ /g)?.length ?? 0;
		if (spaceFrequency > 0) {
			mostFrequentSeparator = " "; // Establecemos el espacio como separador
			maxFrequency = spaceFrequency;
		}
	}

	if (mostFrequentSeparator) {
		return textInput.split(mostFrequentSeparator).map(option => option.trim()).filter(option => option !== "");
	} else if (textInput !== "") {
		return [textInput]; // Si no se encontraron separadores, pero hay texto, devolvemos un array con el texto como único elemento
	} else {
		return []; // Si no, devolvemos la cadena vacía
	}
}

// console.log("Ejemplo 1:", "a, b, c", "=>", getOptionsFromText("a, b, c")); // [ 'a', 'b', 'c' ]
// console.log("Ejemplo 2:", "uno;dos; tres", "=>", getOptionsFromText("uno;dos; tres")); // [ 'uno', 'dos', 'tres' ]
// console.log("Ejemplo 3:", "opción1 opción2 opción3", "=>", getOptionsFromText("opción1 opción2 opción3")); // [ 'opción1', 'opción2', 'opción3' ]
// console.log("Ejemplo 4:", "sola", "=>", getOptionsFromText("sola")); // [ 'sola' ]
// console.log("Ejemplo 5:", "a|b|c|d", "=>", getOptionsFromText("a|b|c|d")); // [ 'a', 'b', 'c', 'd' ]
// console.log("Ejemplo 6:", "uno, dos; tres", "=>", getOptionsFromText("uno, dos; tres")); // [ 'uno, dos', 'tres' ]
// console.log("Ejemplo 7:", "   a   b   c   ", "=>", getOptionsFromText("   a   b   c   ")); // [ 'a', 'b', 'c' ]
// console.log("Ejemplo 8:", "x", "=>", getOptionsFromText("x")); // [ 'x' ]
// console.log("Ejemplo 9:", "", "=>", getOptionsFromText("")); // []
// console.log("Ejemplo 10:", "1-2-3-4", "=>", getOptionsFromText("1-2-3-4")); // [ '1', '2', '3', '4' ]
// console.log("Ejemplo 11 (separador ','):", "a, b, c", "=>", getOptionsFromText("a, b, c", ",")); // [ 'a', 'b', 'c' ]
// console.log("Ejemplo 12 (separador ';'):", "uno;dos; tres", "=>", getOptionsFromText("uno;dos; tres", ";")); // [ 'uno', 'dos', 'tres' ]
// console.log("Ejemplo 13 (separador '|'):", "a|b|c|d", "=>", getOptionsFromText("a|b|c|d", "|")); // [ 'a', 'b', 'c', 'd' ]
// console.log("Ejemplo 14 (separador '-'):", "1-2-3-4", "=>", getOptionsFromText("1-2-3-4", "-")); // [ '1', '2', '3', '4' ]
// console.log("Ejemplo 15 (separador espacio):", "rojo azul verde", "=>", getOptionsFromText("rojo azul verde", " ")); // [ 'rojo', 'azul', 'verde' ]

function getInputToDisplay(dataFromText, dataFromSlash, optionList, rawInput) {
	const input = (
		`Data from Text:\n` +
		`> title(s): ${dataFromText.title}\n` +
		`> repetitions: ${dataFromText.repetitions}\n\n` +

		`Data from Slash:\n` +
		`> title: ${dataFromSlash.title}\n` +
		`> repetitions: ${dataFromSlash.repetitions}\n` +
		`> separator: ${dataFromSlash.separator}\n\n` +

		`Option List (${optionList.length}):\n` +
		`> ${optionList} \n\n` +

		`Raw Input:\n` +
		`> ${rawInput}`
	);

	return input;
}

module.exports = { getOptionsFromText, getInputToDisplay };