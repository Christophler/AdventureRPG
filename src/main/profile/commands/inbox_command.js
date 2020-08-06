const CommandBase = require("../../../lib/commandbase");
const prfManager = require("../profile_manager");
const util = require("../../utility/util");

class InboxCommand extends CommandBase {
	constructor() {
		super(["inbox", "mailbox"]);
	}

	run(message, args) {
		const user = message.author;
		if (args.length == 0) {
			const prf = prfManager.getProfileFromId(user.id);
			if (prf != null) {
				const inboxEmbed = util.getInboxEmbed(user, prf);
				message.channel.send(user.toString() + " This is your inbox", { embed: inboxEmbed });
			} else {
				message.channel.send(user.toString() + " You do not have a profile currently. Create one with .register");
			}
		} else {
			message.channel.send(user.toString() + " You can only see your own inbox.");
		}
	}
}

module.exports = InboxCommand;
