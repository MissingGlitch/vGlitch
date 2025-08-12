const { diceDestructuring } = require("./others");
const { repetitionNotation } = require("./regexes");

// Función para dejar espacios entre cada símbolo (+ - * /) y sus números/dados.
function fixTextNotation (text) {
	const symbols = ["+","-","*","/"];
	const textWithoutSpaces = text.replaceAll(" ", "");

	let finalText = textWithoutSpaces;
	symbols.forEach(sym => {
		finalText = finalText.replaceAll(sym, ` ${sym} `);
	});

	return finalText;
}

// Función para dar un formato bonito a los resultados antes de enviarlos en el embed.
function formatDiceResults (originalInput, diceRolledperRepetitions, results) {
	const originalInputFixed = fixTextNotation(originalInput);
	const messageWithFormat = [];
	diceRolledperRepetitions.forEach((repetition, index) => {
		messageWithFormat.push(`${originalInputFixed.replace(repetitionNotation, "")}`);
		repetition.forEach(dice => {
			const { quantity, faces, keepdropingType } = diceDestructuring(dice.diceRolled);

			// Ordenamiento para que queden bonitos los resultados de mayor a menor.
			dice.results.sort((a,b) => b-a);

			let diceWithFormat = JSON.stringify(dice.results).replaceAll(",", ", ");
			dice.results.forEach(result => {
				if (faces === "f") { // Fate/Fudge Dice Formatting
					diceWithFormat = diceWithFormat.replaceAll(new RegExp(`(?<!-)1`, "g"), "+");
					diceWithFormat = diceWithFormat.replaceAll("-1", "-");
				} else { // Bolding Critics
					if (result === 1 || result === faces)
						diceWithFormat = diceWithFormat.replace(new RegExp(`(?<!\\*\\*__)(?<=( |\\[))${result}(?=(,|\\]))(?!__\\*\\*)`), `**__${result}__**`);
				}
			});

			if (quantity > 1) {
				// Crossing Off Discarded Results
				if (keepdropingType) {
					const keys = Object.keys(dice);
					const remainingResults = [...dice.results];
					dice[keys[2]].forEach(result => {
						const valueIndex = remainingResults.findIndex(x => x === result);
						remainingResults.splice(valueIndex, 1);
					});

					// Esta variable es para determinar si los valores que hay que tachar son los más bajos. Dependiendo de esta variable se aplica una pequeña diferencia en las regex a usar en la parte de debajo para que las mismas empiecen por delante o por atrás según corresponda.
					const type = keepdropingType;
					const crossOutLowests = (type === "kh") || (type === "k") || (type === "dl") || (type === "d");

					if (faces === "f") {
						remainingResults.forEach(result => {																	// ${crossOutLowests ? "\u0337|, -" : "\u0337"}
							if (result === 1) diceWithFormat = diceWithFormat.replace(new RegExp(`(?<!\u0337)(?<=( |\\[))\\+(?=(,|\\]))(?!(${crossOutLowests ? "\u0337|, \\+" : "\u0337"}))`), "\u0337+\u0337");
							if (result === -1) diceWithFormat = diceWithFormat.replace(new RegExp(`(?<!\u0337)(?<=( |\\[))-(?=(,|\\]))(?!(${crossOutLowests ? "\u0337|, -" : "\u0337"}))`), "\u0337-\u0337");
							if (result === 0) diceWithFormat = diceWithFormat.replace(new RegExp(`(?<!~~)(?<=( |\\[))${result}(?=(,|\\]))(?!(${crossOutLowests ? `~~|, ${result}` : "~~"}))`), `~~${result}~~`);
						});
					} else {
						remainingResults.forEach(result => {
							diceWithFormat = diceWithFormat.replace(new RegExp(`(?<!~~)(?<=( |\\[|\\*\\*__))${result}(?=(,|\\]|__\\*\\*))(?!(${crossOutLowests ? `~~|, ${result}|__\\*\\*, \\*\\*__${result}` : "~~"}))`), `~~${result}~~`);
						});
					}
				}
			}

			// Text with format
			diceWithFormat = `${diceWithFormat} ${dice.diceRolled}`;

			// Replacing the original text with the formatted text
			messageWithFormat[index] = messageWithFormat[index].replace(new RegExp(`(?<!(\\d+|\\[((\\*\\*__|~~|\u0337|\\*\\*__~~)?(\\d+|\\+|\\-)(~~__\\*\\*|\u0337|~~|__\\*\\*)?, )*(\\*\\*__|~~|\u0337|\\*\\*__~~)?(\\d+|\\+|\\-)(~~__\\*\\*|\u0337|~~|__\\*\\*)?\\] ))${dice.diceRolled}`, "i"), diceWithFormat);
		});

		// Adding the total
		messageWithFormat[index] = `\` ${results[index]} \` ⟵ `.concat(messageWithFormat[index]);
	});

	return messageWithFormat.map(msg => { return {name: "", value: msg} });
}

module.exports = { formatDiceResults }