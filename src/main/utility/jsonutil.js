const fs = require("jsonfile");

function write(path, obj) {
	fs.writeFile(path + ".json", obj, { spaces: 2 }, (err) => {
		if (err != null) console.log(`${err}`);
	});
}

function read(path) {
	return fs.readFileSync(path);
}

module.exports.write = write;
module.exports.read = read;

const dataPath = "C:\\Users\\Jeremy_Mark\\Documents\\GitHub\\AdventureRPG\\src\\main\\data";
module.exports.settings = this.read(dataPath + "\\settings.json");
module.exports.classTypes = this.read(dataPath + "\\classTypes.json");
module.exports.partyHelpMsg = read(dataPath + "\\partyHelpMsg.json");
module.exports.emojis = read(dataPath + "\\emojis.json");
module.exports.items = read(dataPath + "\\items.json").items;
module.exports.itemTypes = read(dataPath + "\\items.json").itemTypes;
module.exports.admins = read(dataPath + "\\admins.json").admins;

module.exports.profilesFolderPath = dataPath + "\\profiles";
module.exports.partiesFolderPath = dataPath + "\\parties";
