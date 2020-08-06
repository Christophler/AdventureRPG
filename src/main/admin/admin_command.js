const CommandBase = require("../../lib/commandbase");
const util = require("../utility/util");
const prfManager = require("../profile/profile_manager");
const Item = require("../profile/item");
const json = require("../utility/jsonutil");
const items = json.items;
const admins = json.admins;

class AdminCommand extends CommandBase {
	constructor() {
		super(["admin"]);
	}
	run(message, args) {
		// .admin give <@> <item> <amount>
		const argsLength = args.length;
		const send = (msg) => {
			message.channel.send(msg);
		};
		const user = message.author;
		if (admins.includes(user.id)) {
			if (argsLength > 0) {
				const type = args[0].toLowerCase();
				if (type === "give") {
					if (args.length != 4) {
						send(user.toString() + " Invalid arguments. Instructions: .admin give <@user> <item_id/item_name> <amount>");
						return;
					}
					const targetUserId = util.getIdFromAt(args[1]);
					const targetUserPrf = prfManager.getProfileFromId(targetUserId);
					if (targetUserPrf != null) {
						if (!isNaN(args[3])) {
							const amount = parseInt(args[3]);
							if (util.isInteger(amount) && amount >= 1) {
								var id;
								if (!isNaN(args[2])) {
									//if a number
									id = parseInt(args[2]);
								} else {
									id = util.getItemIdFromName(args[2]);
								}
								const targetItem = new Item(id, amount);
								if (targetItem != null) {
									targetUserPrf.addItem(targetItem);
									prfManager.push();
									send(user.toString() + " " + amount + "x **" + targetItem.displayName + "** has been added to their inventory.");
								} else {
									send(user.toString() + " **" + id + "** is not a valid item id.");
								}
							} else {
								send(user.toString() + " The amount you entered is not invalid.");
							}
						} else {
							send(user.toString() + " The amount you entered is not an number.");
						}
					} else {
						send(user.toString() + " This player does not have a profile. Tell them to do **.register** to create one.");
					}
				}
			} else {
				send(user.toString() + " Invalid admin command.");
			}
		} else {
			send(user.toString() + " You do not have permission to this command");
		}
	}
}

module.exports = AdminCommand;
