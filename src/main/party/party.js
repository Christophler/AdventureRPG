const uuidv4 = require("uuid").v4;

class Party {
	id;
	ownerDiscordId;
	membersDiscordId;
	size;
	invitations;
	powerLvl;

	constructor(ownerDiscordId, size) {
		this.id = uuidv4();
		this.ownerDiscordId = ownerDiscordId;
		this.membersProfile = [];
		this.size = size;
		this.invitations = [];
		this.powerLvl = 0;
	}
}

module.exports = Party;
