const prfManager = require("../profile_manager");
const CommandBase = require("../../../lib/commandbase");
const util = require("../../utility/util");

class ItemCommand extends CommandBase {
	constructor() {
		super(["item", "i"]);
	}

	run(message, args) {
		const user = message.author;
		const channel = message.channel;
		if (args.length == 1) {
			const slot = parseInt(args[0]);
			//if is a number and the number is an integer.
			if (!isNaN(args[0]) && slot % 1 == 0) {
				const prf = prfManager.getProfileFromId(user.id);
				if (prf != null) {
					const inventory = prf.inventory;
					const item = inventory[slot];
					if (item != undefined) {
						const itemEmbed = util.getItemEmbed(item, user, slot);
						channel.send(user.toString() + "  **" + item.displayName + "** on slot **" + slot + "**", { embed: itemEmbed });
					} else {
						channel.send(user.toString() + " That is an invalid slot");
					}
				} else {
					channel.send(user.toString() + " You do not have a profile. Create one with **.register**");
				}
			} else {
				channel.send(user.toString() + " " + args[0] + " is not an integer!");
			}
		} else {
			channel.send(user.toString() + " Invalid arguments. **.i <slot>** to view an item in your inventory. Do **.inv** to view your invnetory.");
		}
	}
}

module.exports = ItemCommand;
