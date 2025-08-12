const { rollCommandRegex } = require("./../../../functionalities/diceRoller/regexes.js");

module.exports = {
	data: {
		name: "roll",
		description: "Genera un resultado aleatorio a partir de los dados lanzados.",
		aliases: ["lanza", "lanzar", "tira", "tirar"],
		regexes: [rollCommandRegex]
	},

	async execute(message, input) {
		const diceRoller = message.client.functionalities.get("diceRoller");
		await diceRoller.roll(message, input);
	}
}
// `
// roll
// 	prefix + keyword:
// 		vroll 1d20
// 		vr 1d20
// 		vlanza 1d20
// 		vlanzar 1d20
// 		vtirar 1d20
// 		vtira 1d20

// 	only prefix (no keyword):
// 		v1d20

// choose
// 	prefix + keyword:
// 		vchoose 1 2 3
// 		velegir 1 2 3
// 		velige 1 2 3
// 		vescoge 1 2 3
// 		vescoger 1 2 3
// 		vrandom 1 2 3
// 		vazar 1 2 3

// 	only prefix (no keyword):
// 		---

// calculate
// 	prefix + keyword:
// 		vcalculate 1+1
// 		vcalcular 1+1
// 		vcalcula 1+1
// 		vcalc 1+1

// 	only prefix (no keyword):
// 		v1+1
// `