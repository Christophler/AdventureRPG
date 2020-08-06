const CommandBase = require("../../../lib/commandbase");
const json = require("../../utility/jsonutil");
const prfManager = require("../profile_manager");
const util = require("../../utility/util");
const emojis = json.emojis;

class ProfileCommand extends CommandBase {
	constructor() {
		super(["profile", "prf"]);
	}

	run(message, args) {
		const discordTag = message.author.tag;
		var prf = null;

		//get profile object
		if (args.length == 0) {
			prf = prfManager.getProfileFromTag(discordTag);
		} else if (args.length == 1) {
			prf = prfManager.getProfileFromId(util.getIdFromAt(args[0]));
		} else {
			message.channel.send(message.author.toString() + "Invalid arguments. .profile [name]");
			return;
		}
		if (prf != null) {
			//profile code display
			const user = message.author;
			const discordTag = user.tag;
			const embed = util.getProfileEmbed(prf, util.getAtFromId(prf.discordId));
			message.channel.send(user.toString() + " \nInventory=" + emojis.inventory + " | Mailbox=" + emojis.mailbox, { embed }).then((botMessage) => {
				botMessage.react(emojis.inventory).then(() => {
					botMessage.react(emojis.mailbox);
				});

				const filter = (reaction, user) => {
					return [emojis.inventory, emojis.mailbox].includes(reaction.emoji.name) && user.tag == discordTag;
				};

				botMessage
					.awaitReactions(filter, { max: 1, time: 10 * 1000, errors: ["time"] })
					.then((collected) => {
						const reaction = collected.first().emoji.name;
						if (reaction === emojis.inventory) {
							//open inventory
							const inventory = prf.inventory;
							const inventoryEmbed = util.getInventoryEmbed(user, prf, inventory);
							botMessage.channel.send(user.toString(), { embed: inventoryEmbed });
						} else {
							//open inbox
							const inbox = prf.inbox;
							const inboxEmbed = util.getInboxEmbed(user, prf);
							botMessage.channel.send(user.toString(), { embed: inboxEmbed });
						}
					})
					.catch((collected) => {
						// console.log(user.tag + "'s session has expired");
					});
			});
		} else {
			message.reply("You currently do not have a registered profile. Do .register <name> to start");
		}
	}
}

module.exports = ProfileCommand;
