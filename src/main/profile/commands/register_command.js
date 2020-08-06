const CommandBase = require("../../../lib/commandbase");
const Profile = require("../profile");
const prfManager = require("../profile_manager");
const jsonutil = require("../../utility/jsonutil");

const emojis = jsonutil.emojis;
const classTypes = jsonutil.classTypes;

class RegisterCommand extends CommandBase {
	constructor() {
		super(["register"]);
	}

	run(message, args) {
		if (args.length == 1) {
			const author = message.author;
			const discordId = author.id;
			const discordTag = author.tag;
			const name = args[0];
			const currentPrf = prfManager.getProfileFromTag(discordTag);
			if (currentPrf == null) {
				this.runRegisterSequence(message, author, discordId, discordTag, name);
			} else {
				message.channel.send(author.toString() + ' Would you like to create a new profile and delete "' + currentPrf.name + '"').then((botMessage) => {
					botMessage.react(emojis.yes).then(() => {
						botMessage.react(emojis.no);
					});
					const filter = (reaction, user) => {
						const filterCheck = [emojis.yes, emojis.no].includes(reaction.emoji.name) && user.tag == discordTag;
						return filterCheck;
					};
					botMessage
						.awaitReactions(filter, { max: 1, time: 30 * 1000, errors: ["time"] })
						.then((collected) => {
							const reaction = collected.first().emoji.name;
							if (reaction === emojis.yes) {
								this.runRegisterSequence(message, author, discordId, discordTag, name);
							} else if (reaction === no) {
								botMessage.channel.send("Your profile was not deleted " + author.toString());
							}
						})
						.catch((collected) => {
							console.log(collected);
							botMessage.channel.send(author.toString() + " your session has expired.");
						});
				});
			}
		} else {
			message.reply("Invalid arguments. .register <name>");
		}
	}

	runRegisterSequence(message, author, discordId, discordTag, name) {
		message.channel.send(author.toString() + " Pick a class: Knight=" + emojis.swords + " | Tank=" + emojis.shield + " | Archer=" + emojis.bow).then((botMessage) => {
			botMessage.react(emojis.swords).then(() => {
				botMessage.react(emojis.shield).then(() => {
					botMessage.react(emojis.bow);
				});
			});
			const filter = (reaction, user) => {
				const filterCheck = [emojis.bow, emojis.shield, emojis.swords].includes(reaction.emoji.name) && user.tag === discordTag;
				return filterCheck;
			};
			botMessage
				.awaitReactions(filter, { max: 1, time: 30000, errors: ["time"] })
				.then((collected) => {
					const reaction = collected.first().emoji.name;
					var xp = 0;
					var hp = -1;
					var defense = -1;
					var classTypeId = -1;
					var classTypeName = "";
					if (reaction == emojis.bow) {
						//archer
						const archer = classTypes.archer;
						classTypeId = archer.id;
						classTypeName = archer.name;
						hp = archer.hp;
						defense = archer.defense;
					} else if (reaction == emojis.shield) {
						//tank
						const tank = classTypes.tank;
						classTypeId = tank.id;
						classTypeName = tank.name;
						hp = tank.hp;
						defense = tank.defense;
					} else {
						//knight
						const knight = classTypes.knight;
						classTypeId = knight.id;
						classTypeName = knight.name;
						hp = knight.hp;
						defense = knight.defense;
					}
					const currentPrf = prfManager.getProfileFromTag(discordTag);
					if (currentPrf != null) prfManager.deleteProfile(currentPrf);
					const profile = new Profile(discordId, discordTag, name, xp, hp, defense, classTypeId, [], []);
					prfManager.addProfile(profile);
					prfManager.push();
					botMessage.channel.send(author.toString() + ' you have created a profile named "' + name + '" as a ' + classTypeName + ".");
				})
				.catch((collected) => {
					botMessage.channel.send(author.toString() + " your session has expired.");
				});
		});
	}
}

module.exports = RegisterCommand;
