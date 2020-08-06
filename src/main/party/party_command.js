const CommandBase = require("../../lib/commandbase");
const prfManager = require("../profile/profile_manager");
const partyManager = require("./party_manager");
const util = require("../utility/util");

class PartyCommand extends CommandBase {
	constructor() {
		super(["party", "p"]);
	}

	run(message, args) {
		const user = message.author;
		const prf = prfManager.getProfileFromId(user.id);
		if (prf == null) {
			message.channel.send(user.toString() + " You do not have a profile. Create one with .register");
			return;
		}
		if (args.length == 0) {
			const party = partyManager.getParty(prf);
			var membersPrf = [];
			for (var i in party.membersDiscordId) {
				const memberDiscordId = party.membersDiscordId[i];
				const kprf = prfManager.getProfileFromId(membersDiscordId);
				membersPrf.push(kprf);
			}
			var invitationsPrf = [];
			for (var i in party.invitations) {
				const invitationDiscordId = party.invitations[i];
				const lPrf = prfManager.getProfileFromId(invitationDiscordId);
				invitationsPrf.push(lPrf);
			}
			const ownerPrf = prfManager.getProfileFromId(party.ownerDiscordId);
			const partyEmbed = util.getPartyEmbed(party, ownerPrf, membersPrf, invitationsPrf);
			message.channel.send(user.toString(), { embed: partyEmbed });
		} else {
			const type = args[0];
			if (args.length == 1) {
				const party = partyManager.getParty(prf);
				if (party == null) {
					if (type === "create") {
						partyManager.createNewParty(prf.discordId);
						message.channel.send(user.toString() + " A new party was created. **.party invite <@user>** to invite users");
					} else {
						message.channel.send(user.toString() + " Unknown command. View commands by typing **.party help**");
					}
				} else {
					message.channel.send(user.toString() + " You are already in a party. Do **.party leave** to leave it.");
				}
			} else if (args.length == 2) {
				if (type == "invite") {
					const party = partyManager.getParty(prf);
					if (party != null) {
						//party exists
						if (party.ownerDiscordId == user.id) {
							//they are owner
							const targetPrf = prfManager.getProfileFromId(util.getIdFromAt(args[1]));
							if (targetPrf != null) {
								//target has a profile
								if (!party.invitations.includes(targetPrf.discordId)) {
									partyManager.addInvitation(party, targetPrf.discordId);
									message.channel.send(user.toString() + " An invitation has been sent to " + util.getAtFromId(targetPrf.discordId));
								} else {
									message.channel.send(user.toString() + " An invitation has already been sent to this user. Tell them to **.party join** you!");
								}
							} else {
								message.channel.send(user.toString() + " Could not fetch the user's profile. Maybe they haven't **registered**?");
							}
						} else {
							message.channel.send(user.toString() + " You are not the owner of this party.");
						}
					} else {
						message.channel.send(user.toString() + " You are not in a party. **.party create** to create one");
					}
				}
			}
		}
	}
}

module.exports = PartyCommand;
