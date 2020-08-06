const CommandBase = require("../../../lib/commandbase");

const util = require("../../utility/util");
const prfManager = require("../profile_manager");

class InventoryCommand extends CommandBase {
	constructor() {
		super(["inventory", "inv"]);
	}

	run(message, args) {
		const user = message.author;
		if (args.length == 0) {
			const prf = prfManager.getProfileFromId(user.id);
			if (prf != null) {
				const inventoryEmbed = util.getInventoryEmbed(user, prf, prf.inventory);
				message.channel.send(user.toString() + " This is your inventory", { embed: inventoryEmbed });
			} else {
				message.channel.send(user.toString() + " You do not have a profile! Create one with .register");
			}
		} else if (args.length == 1) {
			// .inventory <name> or .inventory <slot>
			const targetId = util.getIdFromAt(args[0]);
			message.guild.members
				.fetch(targetId)
				.then((targetUser) => {
					const prf = prfManager.getProfileFromId(targetId);
					if (prf != null) {
						const inventoryEmbed = util.getInventoryEmbed(targetUser, prf, prf.inventory);
						message.channel.send(user.toString() + " This is " + targetUser.toString() + "'s inventory", { embed: inventoryEmbed });
					} else {
						message.channel.send(user.toString() + " This user does not have a profile. Tell them to make one with .register");
					}
				})
				.catch((err) => {
					message.channel.send(user.toString() + " Target user was not found for some reason.");
				});
		}
	}
}

module.exports = InventoryCommand;
