const uuidv4 = require("uuid").v4;
const jsonutil = require("../utility/jsonutil");
const settings = jsonutil.settings;
const partiesFolderPath = jsonutil.partiesFolderPath;
const fs = require("fs");

var parties = [];

function createNewParty(ownerDiscordTag) {
	parties.push(new Party(ownerDiscordTag, settings.partySize, 0));
	this.push();
}

function removeParty(id) {
	parties.splice(parties.indexOf(getParty(id)), 1);
	push();
}

function getPartyFromId(id) {
	for (var i in parties) {
		const party = parties[i];
		if (party.id === id) {
			return party;
		}
	}
	return null;
}

function getParty(discordTag) {
	for (var i in parties) {
		const party = parties[i];
		const ownerTag = party.ownerDiscordTag;
		const members = party.members;
		if (discordTag == ownerTag || members.includes(discordTag)) {
			return parties[i];
		}
	}
	return null;
}

function getPartyFromOwner(ownerDiscordTag) {
	for (var i in parties) {
		const party = parties[i];
		if (party.ownerDiscordTag == ownerDiscordTag) {
			return party;
		}
	}
	return null;
}

function push() {
	//delete all profiles
	fs.readdir(partiesFolderPath, (err, files) => {
		if (err != null) console.log(err);
		for (var i in files) {
			const file = files[i];
			const filePath = partiesFolderPath + "\\" + file;
			fs.unlink(filePath, (err) => {
				if (err != null) {
					console.log("Could not delete file with path: " + filePath);
				} else {
					console.log("Unlinked party: " + file);
				}
			});
		}
	});

	const rewrite = () => {
		parties.forEach((party) => {
			jsonutil.write(partiesFolderPath + "\\" + party.id, party);
			console.log("Pushed party: " + party.id);
		});
	};

	setTimeout(rewrite, 3 * 1000);
}

function pull() {
	this.parties = [];
	fs.readdir(partiesFolderPath, (err, files) => {
		if (err != null) console.log(err);
		files.forEach((file) => {
			const read = jsonutil.read(partiesFolderPath + "\\" + file);
			this.parties.push(new Party(read.ownerDiscordTag, read.size, read.powerLvl));
			console.log("Pulled party: " + read.id);
		});
	});
}

class Party {
	id;
	ownerDiscordTag;
	maxSize;
	members;
	invitations;
	powerLvl;

	constructor(ownerDiscordTag, maxSize, powerLvl) {
		this.id = uuidv4();
		this.ownerDiscordTag = ownerDiscordTag;
		this.maxSize = maxSize;
		this.members = [];
		this.invitations = [];
		this.powerLvl = powerLvl; //util.getPowerLevel(party); TBA
	}

	addUser(discordTag) {
		this.members.push(discordTag);
	}

	removeUser(discordTag) {
		this.members.splice(members.indexof(discordTag), 1);
	}

	containsUser(discordTag) {
		return this.members.includes(discordTag);
	}

	addInvitation(discordTag) {
		this.invitations.push(discordTag);
	}

	removeInvitations(discordTag) {
		this.invitiations.splice(invitations.indexof(discordTag), 1);
	}

	containsInvitiation(discordTag) {
		return this.invitations.includes(discordTag);
	}
}

module.exports.getParty = getParty;
module.exports.getPartyFromOwner = getPartyFromOwner;
module.exports.removeParty = removeParty;
module.exports.createNewParty = createNewParty;
module.exports.push = push;
module.exports.pull = pull;
