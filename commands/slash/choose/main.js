const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("choose")
		.setDescription("Selecciona aleatoriamente una de las opciones dadas.")
		.addStringOption(option => option
			.setName("opciones")
			.setDescription("Escribe la lista de opciones (Ej: rojo azul verde).")
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName("título")
			.setDescription("El título o nombre de la selección aleatoria que se va a realizar.")
		)
		.addNumberOption(option => option
			.setName("repeticiones")
			.setDescription("La cantidad de veces que quieres que se seleccione aleatoriamente alguna de las opciones.")
			.setMinValue(1)
			.setMaxValue(20)
		)
		.addStringOption(option => option
			.setName("separador")
			.setDescription("El separador a usar para identificar las opciones. Si no se define, se identificará automáticamente.")
		),

	async execute(interaction) {
		const title = interaction.options.getString("título");
		const options = interaction.options.getString("opciones").trim();
		const separator = interaction.options.getString("separador");
		const repetitions = interaction.options.getNumber("repeticiones") ? Number(interaction.options.getNumber("repeticiones")) : null;

		const chooseAnOption = interaction.client.functionalities.get("chooseAnOption");
		await chooseAnOption(interaction, options, title, repetitions, separator);
	}
}