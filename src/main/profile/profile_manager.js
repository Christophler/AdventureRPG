const fs = require("fs");
const json = require("../utility/jsonutil");
const Item = require("./item");
const Profile = require("./profile");

const profilesFolderPath = json.profilesFolderPath;

class ProfileManager {
	profiles = [];

	constructor() {
		this.profiles = [];
	}

	addProfile(profile) {
		this.profiles.push(profile);
	}

	getProfileFromTag(discordTag) {
		for (var i in this.profiles) {
			if (this.profiles[i].discordTag == discordTag) {
				return this.profiles[i];
			}
		}
		return null;
	}

	getProfileFromId(discordId) {
		for (var i in this.profiles) {
			const prf = this.profiles[i];
			if (prf.discordId == discordId) {
				return prf;
			}
		}
		return null;
	}

	deleteProfile(profile) {
		for (var i in this.profiles) {
			if (this.profiles[i] === profile) {
				this.profiles.splice(i, 1);
				break;
			}
		}
	}

	contains(discordTag) {
		for (var i in this.profiles) {
			var prf = this.profiles[i];
			if (prf.discordTag == discordTag) {
				return true;
			}
		}
		return false;
	}

	pullAllProfiles() {
		this.profiles = [];
		fs.readdir(profilesFolderPath, (err, files) => {
			if (err != null) console.log(err);
			for (var i in files) {
				const file = files[i];
				const read = json.read(profilesFolderPath + "\\" + file);
				const prf = new Profile(read.discordId, read.discordTag, read.name, read.xp, read.hp, read.defense, read.classTypeId);
				for (var i in read.inventory) {
					const readItem = read.inventory[i];
					var item;
					if (readItem.durability != undefined) {
						item = new Item(readItem.id, readItem.amount, readItem.durability);
					} else {
						item = new Item(readItem.id, readItem.amount);
					}
					prf.addItem(item);
				}

				for (var i in read.inbox) {
					const readMail = read.inbox[i];
					const mail = { title: readMail.title, text: readMail.text };
					prf.addMail(mail);
				}
				this.addProfile(prf);
				console.log("Pulled profile: " + prf.discordTag);
			}
		});
	}

	push() {
		//delete all profiles
		fs.readdir(profilesFolderPath, (err, files) => {
			if (err != null) console.log(err);
			for (var i in files) {
				const file = files[i];
				const filePath = profilesFolderPath + "\\" + file;
				fs.unlink(filePath, (err) => {
					if (err != null) {
						console.log("Could not delete file with path: " + filePath);
					} else {
						console.log("Unlinked profile: " + file);
					}
				});
			}
		});

		//re write all profiles based on cache
		const rewrite = () => {
			this.profiles.forEach((prf) => {
				json.write(profilesFolderPath + "\\" + prf.discordId, prf);
				console.log("Pushed profile: " + prf.discordTag);
			});
		};
		setTimeout(rewrite, 3 * 1000);
	}
}

const prfManager = new ProfileManager();
module.exports = prfManager;
