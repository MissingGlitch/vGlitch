/**
 * Extrae las repeticiones, el contenido y el título del input del comando choose.
 * @param {string} input El input original del usuario sin procesar.
 * @returns {{ title: string|string[]|null, content: string|null, repetitions: number|null }} Un objeto que contiene las repeticiones, el contenido y los títulos extraídos del input.
 */
function parseInput(input) {
	// Caso especial: si no hay paréntesis, todo es contenido
	if (!/[()]/.test(input)) {
		return {
			title: null,
			content: input.trim() || null,
			repetitions: null
		};
	}

	let title = null;
	let content = null;
	let repetitions = null;

	// Buscar el primer paréntesis de apertura que delimita el contenido
	const openIndex = input.indexOf("(");
	const closeIndex = (() => {
		// Buscar el paréntesis de cierre correspondiente al de apertura (soporta paréntesis anidados)
		let depth = 0;
		for (let i = openIndex; i < input.length; i++) {
			if (input[i] === "(") depth++;
			else if (input[i] === ")") {
				depth--;
				if (depth === 0) return i;
			}
		}
		return -1;
	})();

	if (openIndex !== -1 && closeIndex !== -1) {
		content = input.slice(openIndex + 1, closeIndex).trim() || null;

		const textBeforeContent = input.slice(0, openIndex).trim();
		const textAfterContent = input.slice(closeIndex + 1).trim();
		const repetitionsRegex = /(\d+)#$/;

		// Buscar repeticiones justo antes del paréntesis de apertura del contenido
		const repMatch = textBeforeContent.match(repetitionsRegex);
		if (repMatch) repetitions = Number(repMatch[1]);

		// Título: lo que queda fuera de las repeticiones y de los paréntesis con el contenido
		const titlesFound = [];
		// Antes del paréntesis, quitando repeticiones si las hay
		const titleBefore = textBeforeContent.replace(repetitionsRegex, "").trim();
		if (titleBefore) titlesFound.push(titleBefore);
		// Después del paréntesis
		const titleAfter = textAfterContent;
		if (titleAfter) titlesFound.push(titleAfter);

		// Cantidad de Títulos Encontrados: 0, 1 o 2
		if (titlesFound.length === 1) {
			title = titlesFound[0];
		}
		if (titlesFound.length === 2) {
			title = titlesFound;
		}
	}

	return {
		title: title,
		content: content,
		repetitions: repetitions
	};
}

// Ejemplos de uso:
// console.log(parseInput("texto1 texto2 texto3"));
// console.log(parseInput("2#(texto1 texto2 texto3)"));
// console.log(parseInput("2#(texto1 texto2 texto3) TextoFuera"));
// console.log(parseInput("TextoFuera 2#(texto1 texto2 texto3)"));
// console.log(parseInput("(texto1 texto2 texto3) TextoFuera"));
// console.log(parseInput("TextoFuera (texto1 texto2 texto3)"));
// console.log(parseInput("5#(texto1 (subtexto1), texto2 (subtexto2), texto3 (subtexto3))"));
// console.log(parseInput("5#(texto1 (subtexto1), texto2 (subtexto2), texto3 (subtexto3)) TextoFuera"));
// console.log(parseInput("5#(1#(a b c) 2#(a b c) 3#(a b c) 4#(a b c) 5#(a b c)) TextoFuera"));

module.exports = { parseInput };