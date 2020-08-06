const json = require("../utility/jsonutil");
const util = require("../utility/util");

const items = json.items;
const itemTypes = json.itemTypes;

class Item {
	constructor(id, amount, durability) {
		const item = util.getItemFromId(id);
		this.id = id;
		this.type = items.type;
		this.name = item.name;
		this.displayName = item.displayName;
		this.lore = item.lore;
		this.amount = amount;
		this.imageUrl = item.image_url;
		if (this.type == itemTypes.weapon) {
			this.maxDurability = item.maxDurability;
			if (durability == undefined) {
				this.durability = this.maxDurability;
			} else {
				this.durability = durability;
			}
		}

		this.minDamage = item.minDamage;
		this.maxDamage = item.maxDamage;
	}

	generateRandomDamage() {
		const damage = Math.random() * (this.maxDamage - this.minDamage) + this.minDamage;
		return damage;
	}
}

module.exports = Item;
