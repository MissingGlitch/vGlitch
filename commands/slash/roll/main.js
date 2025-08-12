const { SlashCommandBuilder } = require("discord.js");
const { AdvantageTypes } = require("./utils");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("roll")
		.setDescription("Genera un resultado aleatorio a partir de los dados lanzados.")
		.addStringOption(option => option
			.setName("tirada")
			.setDescription("La tirada de dados a realizar.")
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName("tipo-de-ventaja")
			.setDescription("El tipo de ventaja a aplicar en la tidada.")
			.addChoices(
				{name: "ventaja", value: AdvantageTypes.Advantage},
				{name: "desventaja", value: AdvantageTypes.Disadvantage},
				{name: "normal", value: AdvantageTypes.Normal}
			)
		)
		.addStringOption(option => option
			.setName("título")
			.setDescription("El título o nombre de la tirada en cuestión.")
		)
		.addNumberOption(option => option
			.setName("repeticiones")
			.setDescription("La cantidad de veces que quieres que se repita la tirada.")
			.setMinValue(1)
			.setMaxValue(20)
		),

	async execute(interaction) {
		const roll = interaction.options.getString("tirada");
		const advantageType = interaction.options.getString("tipo-de-ventaja");
		const title = interaction.options.getString("título");
		const repetitions = interaction.options.getNumber("repeticiones");

		const diceRoller = interaction.client.functionalities.get("diceRoller");
		await diceRoller.roll(interaction, roll, advantageType, title, repetitions);
	}
}