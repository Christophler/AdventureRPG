const prfManager = require("../profile/profile_manager");
const json = require("./jsonutil");
const { bot } = require("../app");

const classTypes = json.classTypes;
const settings = json.settings;
const emojis = json.emojis;
const itemTypes = json.itemTypes;

function getClassType(classTypeId) {
	for (var i in classTypes) {
		if (classTypeId == classTypes[i].id) {
			return classTypes[i];
		}
	}
	return null;
}

function getEmoji(classTypeId) {
	if (classTypeId == 0) {
		return emojis.swords;
	} else if (classTypeId == 1) {
		return emojis.shield;
	} else if (classTypeId == 2) {
		return emojis.bow;
	}
}

function getProfileEmbed(profile, author) {
	const classType = getClassType(profile.classTypeId);
	const emoji = getEmoji(classType.id);
	return {
		title: classType.name + " " + emoji,
		description: author.toString(),
		color: 900000,
		thumbnail: {
			url: classType.avatar_url,
		},
		author: {
			name: profile.name,
		},
		fields: [
			{
				name: "XP\t",
				value: profile.xp,
				inline: true,
			},
			{
				name: "HP\t",
				value: profile.hp,
				inline: true,
			},
			{
				name: "Defense\t",
				value: profile.defense,
				inline: true,
			},
		],
	};
}

function getInventoryEmbed(user, profile, inventory) {
	var embed = {
		description: user.toString() + "'s inventory",
		color: 15135210,
		footer: {
			text: ".inventory",
		},
		thumbnail: {
			url: getClassType(profile.classTypeId).avatar_url,
		},
		author: {
			name: profile.name,
		},
		fields: [],
	};
	embed.description += "```";
	if (inventory.length != 0) {
		for (var i in inventory) {
			const item = inventory[i];
			embed.description += "\n" + i + " - " + item.name + " " + item.amount + "x";
		}
	} else {
		embed.description += "\n" + "Nothing but crickets..";
	}
	embed.description += "```";
	return embed;
}

function getItemEmbed(item, ownerUser, index) {
	const embed = {
		title: item.displayName,
		description: ownerUser.toString(),
		color: 7833438,
		footer: {
			text: ".item " + index,
		},
		image: {
			url: item.imageUrl,
		},
		fields: [],
	};
	if (item.type == itemTypes.weapon) {
		embed.fields.push(
			{
				name: "Min Damage",
				value: item.minDamage,
				inline: true,
			},
			{
				name: "Max Damage",
				value: item.maxDamage,
				inline: true,
			},
			{
				name: "Durability",
				value: item.durability,
				inline: true,
			},
			{
				name: "Max Durability",
				value: item.maxDurability,
				inline: true,
			}
		);
	}
	return embed;
}

function getIdFromAt(arg) {
	const id = arg.substring(3, arg.length - 1);
	return id;
}

function getPartyEmbed(party, ownerUser) {
	const embed = {
		title: party.id,
		description: "View your party with .party",
		color: 900000,
		footer: {
			text: "Power Level: " + party.powerLvl,
		},
		author: {
			name: ownerUser.toString(),
		},
		fields: [
			{
				name: "MemberX",
				value: "ClassType",
				inline: true,
			},
			{
				name: "MemberX",
				value: "ClassType",
				inline: true,
			},
			{
				name: "MemberX",
				value: "ClassType",
				inline: true,
			},
			{
				name: "MemberX",
				value: "ClassType",
				inline: true,
			},
			{
				name: "MemberX",
				value: "ClassType",
				inline: true,
			},
			{
				name: "MemberX",
				value: "ClassType",
				inline: true,
			},
		],
	};
	return embed;
}

function getInboxEmbed(user, profile) {
	const embed = {
		description: user.toString(),
		color: 15135210,
		footer: {
			text: ".profile",
		},
		thumbnail: {
			url: getClassType(profile.classTypeId).avatar_url,
		},
		author: {
			name: "Inbox",
		},
		fields: [],
	};
	const inbox = profile.inbox;
	if (inbox.length != 0) {
		for (var i in inbox) {
			const mail = inbox[i];
			const title = mail.title;
			const text = mail.text;
			embed.fields.push({ name: title, value: text });
		}
	} else {
		embed.fields.push({ name: "Empty", value: "Your inbox is empty" });
	}
	return embed;
}

function getIdFromAt(arg) {
	const id = arg.substring(3, arg.length - 1);
	return id;
}

function getAtFromId(id) {
	const at = "<@!" + id + ">";
	return at;
}

function isInteger(number) {
	return number % 1 === 0;
}

function getItemIdFromName(itemName) {
	const items = json.items;
	for (var i in items) {
		const item = items[i];
		if (itemName == item.name) {
			return parseInt(item.id);
		}
	}
	return null;
}

function getItemFromId(itemId) {
	const items = json.items;
	for (var i in items) {
		const item = items[i];
		if (item.id == itemId) {
			return item;
		}
	}
	return null;
}

module.exports.isInteger = isInteger;
module.exports.getItemFromId = getItemFromId;
module.exports.getItemIdFromName = getItemIdFromName;
module.exports.getAtFromId = getAtFromId;
module.exports.getIdFromAt = getIdFromAt;
module.exports.getInventoryEmbed = getInventoryEmbed;
module.exports.getInboxEmbed = getInboxEmbed;
module.exports.getItemEmbed = getItemEmbed;
module.exports.getPartyEmbed = getPartyEmbed;
module.exports.getProfileEmbed = getProfileEmbed;
module.exports.getClassType = getClassType;
