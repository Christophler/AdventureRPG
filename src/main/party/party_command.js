const CommandBase = require("../../lib/commandbase");
const partyManager = require("./party");
const prfManager = require("../profile/profile_manager");
const json = require("../utility/jsonutil");
const util = require("../utility/util");
const partyHelpMsgEmbed = json.partyHelpMsg.embed;
const { bot } = require("../app");

class PartyCommand extends CommandBase {
	constructor() {
		super(["party", "p"]);
	}

	run(message, args) {
		const author = message.author;
		const profile = prfManager.getProfileFromTag(author.tag);
		if (profile != null) {
			if (args.length > 0) {
				const type = args[0].toLowerCase();
				if (args.length == 1) {
					if (type === "create") {
						const party = partyManager.getParty(author.tag);
						if (party == null) {
							partyManager.createNewParty(author.tag);
							message.channel.send(author.toString() + " A new party was created. Invite users with .party invite <@user>");
						} else {
							message.channel.send(author.toString() + " You are already in a party. .party leave to leave your party");
						}
					} else if (type === "leave") {
						const party = partyManager.getParty(author.tag);
						if (party != null) {
							partyManager.removeParty(party.id);
							if (party.ownerDiscordTag == author.tag) {
								message.channel.send(author.toString() + " You have disbanded the party.");
							} else {
								message.channel.send(author.toString() + " You have left the party.");
							}
						} else {
							message.channel.send(author.toString() + " You are not in a party.");
						}
					} else if (type === "help") {
						message.channel.send(message.author.toString(), { embed: partyHelpMsgEmbed });
					} else {
						message.channel.send(author.toString() + " Invalid arguments! .party help");
					}
				} else if (args.length == 2) {
					const target = args[1];
					const targetUserId = util.getIdFromAt(target);
					message.guild.members
						.fetch(targetUserId)
						.then((member) => {
							var targetUser = member.user;
							if (targetUser.tag != author.tag) {
								const party = partyManager.getParty(author.id);
								if (author.tag == party.ownerDiscordTag) {
									if (party != null) {
										party.addInvitiation(targetUser.tag);
										message.channel.send(author.toString() + " invite sent. Tell " + targetUser.toString() + " to do .party join " + author.toString());
									} else {
										message.channel.send(author.toString() + " you do not have a party. Do so with .party create");
									}
								} else {
									message.channel.send(author.toString() + " You are not the owner of this party.");
								}
							} else {
								message.channel.send(author.toString() + " You cannot invite yourself");
							}
						})
						.catch((err) => {
							message.channel.send(author.toString() + " Could not find this user");
						});
					} else if (type === "kick") {
						const party = partyManager.getParty(author.id);
						if (party.ownerDiscordTag == author.tag) {
							if (party != null) {
								if (party.containsUser(targetUser.tag)) {
									party.removeUser(targetUser.tag);
									message.channel.send(author.toString() + " You have kicked " + targetUser.toString());
								} else {
									message.channel.send(author.toString() + " " + targetUser.toString() + " is not in your party.");
								}
							} else {
								message.channel.send(author.toString() + " You do not have a party Create a party with .party create");
							}
						} else {
							message.channel.send(author.toString() + " You are not the party leader.");
						}
					} else if (type === "join") {
						const currentParty = getParty(author.tag);
						if (currentParty == null) {
							const desiredParty = getPartyFromOwner(targetUser.tag);
							if (desiredParty != null) {
								if (desiredParty.containsInvitation(author.tag)) {
									if (desiredParty.members.length < 4) {
										desiredParty.removeInvitation(author.tag);
										desiredParty.addUser(author.tag);
										message.channel.send(author.toString() + " You have joined the party owned by " + targetUser.toString());
									} else {
										message.channel.send(author.toString() + " Sorry this party is full. Parties are maxed at 5");
									}
								} else {
									message.channel.send(author.toString() + " You were not invited to join this party.");
								}
							} else {
								message.channel.send(author.toString() + " This player does not have a party created.");
							}
						} else {
							message.channel.send(author.toString() + " You are currently in a party. .party leave to leave your party.");
						}
					} else {
						message.channel.send(author.toString() + " Invalid arguments! .party help");
					}
				} else {
					message.channel.send(author.toString() + " Unknown command. Do .party help for command help");
				}
			} else {
				const party = partyManager.getParty(author.tag);
				if (party != null) {
					const ownerPrf = prfManager.getProfileFromTag(party.ownerDiscordTag);
					var userString;
					bot.members.fetch(ownerPrf.discordId).then((user) => {
						userString = user.toString();
					});
					const partyEmbed = util.getPartyEmbed(party, userString);
					message.channel.send(author.toString() + " Your party:", { embed: partyEmbed });
				} else {
					message.channel.send(author.toString() + " You are not in a party");
				}
			}
		} else {
			message.channel.send(author.toString() + " You currently do not have a profile. Create one with .register");
		}
	}
}

module.exports = PartyCommand;
