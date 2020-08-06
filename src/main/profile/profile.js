const jsonutil = require("../utility/jsonutil");

class Profile {
	inventory = [];
	inbox = [];

	constructor(discordId, discordTag, name, xp, hp, defense, classTypeId) {
		this.discordId = discordId;
		this.discordTag = discordTag;
		this.name = name;
		this.xp = xp;
		this.hp = hp;
		this.defense = defense;
		this.classTypeId = classTypeId;
	}

	addItem(item) {
		for (var i in this.inventory) {
			const kItem = this.inventory[i];
			if (kItem.id == item.id) {
				kItem.amount += item.amount;
				return;
			}
		}
		this.inventory.push(item);
	}

	removeItem(index) {
		this.inventory.splice(index, 1);
	}

	addMail({ title, text }) {
		this.inbox.push({ title, text });
	}

	removeMail(mailId) {
		for (var i in this.inbox) {
			const mail = inbox[i];
			if (mail.id == mailId) {
				this.inbox.splice(this.inbox.indexOf(mail), 1);
			}
		}
	}

	getMail(mailId) {
		for (var i in this.inbox) {
			const mail = inbox[i];
			if (mail.id == mailId) {
				return mail;
			}
		}
		return null;
	}
}

module.exports = Profile;
