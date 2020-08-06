const Discord = require("discord.js");
const jsonutil = require("./utility/jsonutil");
const party = require("./party/party");
const prfManager = require("./profile/profile_manager");
const settings = jsonutil.settings;

const RegisterCommand = require("./profile/commands/register_command");
const TestCommand = require("./test_command");
const ProfileCommand = require("./profile/commands/profile_command");
const PartyCommand = require("./party/party_command");
const AdminCommand = require("./admin/admin_command");
const InventoryCommand = require("./profile/commands/inventory_command");
const InboxCommand = require("./profile/commands/inbox_command");
const ItemCommand = require("./profile/commands/item_command");

const bot = new Discord.Client();
const commands = [];

function registerCommands() {
	const registerCommand = new RegisterCommand();
	commands.push(registerCommand);

	const profileCommand = new ProfileCommand();
	commands.push(profileCommand);

	const testCommand = new TestCommand();
	commands.push(testCommand);

	const partyCommand = new PartyCommand();
	commands.push(partyCommand);

	const adminCommand = new AdminCommand();
	commands.push(adminCommand);

	const inventoryCommand = new InventoryCommand();
	commands.push(inventoryCommand);

	const inboxCommand = new InboxCommand();
	commands.push(inboxCommand);

	const itemCommand = new ItemCommand();
	commands.push(itemCommand);
}

bot.on("message", (message) => {
	if (message.author.bot) return;

	var tmp = message.content.split(" ");
	const enteredCmd = tmp.shift().toLowerCase();
	const args = tmp;

	if (enteredCmd.startsWith(settings.prefix)) {
		commands.forEach((command) => {
			const prefixlessEnteredCmdSplit = enteredCmd.split("");
			const prefixlessEnteredCmd = prefixlessEnteredCmdSplit.slice(1, prefixlessEnteredCmdSplit.length).join("");
			if (command.names.includes(prefixlessEnteredCmd)) {
				command.run(message, args);
			}
		});
	}
});

bot.on("ready", () => {
	registerCommands();
	prfManager.pullAllProfiles();
	party.pull();
	console.log("Bot activated.");
	bot.channels.fetch(settings.activationChannelId).then((channel) => {
		channel.send("I am here and ready to simp");
	});
});

console.log("Loading...");
bot.login(settings.token);

module.exports.bot = bot;
