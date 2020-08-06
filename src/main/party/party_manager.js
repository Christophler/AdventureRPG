const Party = require("./party");
const fs = require("fs");
const json = require("../utility/jsonutil");
const settings = json.settings;

class PartyManager {
	parties;
	constructor() {
		this.parties = [];
	}

	addInvitation(party, discordId) {
		party.invitations.push(discordId);
		this.push();
	}

	removeInvitation(party, discordId) {
		party.invitations.splice(party.indexOf(discordId), 1);
		this.push();
	}

	createNewParty(ownerPrf) {
		const party = new Party(ownerPrf, settings.partySize);
		this.parties.push(party);
		this.push();
	}

	deleteParty(party) {
		this.parties.splice(this.parties.indexOf(party), 1);
	}

	getParty(profile) {
		for (var i in this.parties) {
			const party = this.parties[i];
			const ownerDiscordId = party.ownerDiscordId;
			const membersId = party.membersId;
			if (ownerDiscordId == profile.discordId || membersId.includes(profile.discordId)) {
				return party;
			}
		}
		return null;
	}

	pull() {
		fs.readdir(json.partiesFolderPath, (err, files) => {
			if (err != null) {
				console.log(err);
			}
			files.forEach((file) => {
				const read = json.read(json.partiesFolderPath + "\\" + file);
				this.parties.push(read);
				console.log("Pulled party: " + read.id);
			});
		});
	}

	push() {
		//delete all parties
		fs.readdir(json.partiesFolderPath, (err, files) => {
			if (err != null) console.log(err);
			for (var i in files) {
				const file = files[i];
				const filePath = json.partiesFolderPath + "\\" + file;
				fs.unlink(filePath, (err) => {
					if (err != null) {
						console.log("Could not delete file with path: " + filePath);
					} else {
						console.log("Unlinked party: " + file);
					}
				});
			}
		});

		//re write all parties based on cache
		const rewrite = () => {
			this.parties.forEach((party) => {
				json.write(json.partiesFolderPath + "\\" + party.id, party);
				console.log("Pushed party: " + party.id);
			});
		};
		setTimeout(rewrite, 1.5 * 1000);
	}
}

const partyManager = new PartyManager();
module.exports = partyManager;
