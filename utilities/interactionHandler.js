const log = require("./logger");
const { handleInteractionError } = require("./errorHandler");

function identifyType(interaction) {
	// Application Commands:
	if (interaction.isChatInputCommand()) return "slash";
	if (interaction.isUserContextMenuCommand()) return "user";
	if (interaction.isMessageContextMenuCommand()) return "message";

	// Message Components:
	if (interaction.isButton()) return "button";
	if (interaction.isAnySelectMenu()) return "menu";

	// Modals:
	if (interaction.isModalSubmit()) return "modal";
}

module.exports = {
	// Application Commands: Slash/User/Message Commands
	async applicationCommand(interaction) {
		try {
			log.interaction(interaction);
			const type = identifyType(interaction);
			const command = interaction.client.commands.get(`[${type}] ${interaction.commandName}`);
			if (!command) throw new ReferenceError(`No ${type} command matching "${interaction.commandName}" was found.`);
			await command.execute(interaction);
		} catch (error) {
			handleInteractionError(interaction, error);
		}
	},

	// Message Components: Buttons/Menus
	async messageComponent(interaction) {
		// manejo de interacciones para componentes de mensajes
	},

	async autocomplete(interaction) {
		// manejo de interacciones para autocompletados
	},

	async modal(interaction) {
		// manejo de interaciones para modals.
	}
}