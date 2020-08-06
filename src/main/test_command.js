const CommandBase = require("../lib/commandbase");
const prfManager = require("./profile/profile_manager");
const util = require("./utility/util");
const jsonutil = require("./utility/jsonutil");
const Party = require("./party/party");
const Profile = require("./profile/profile");

class TestCommand extends CommandBase {
	constructor() {
		super(["test"]);
	}

	run(message, args) {
		const user = message.author;
		const prf = new Profile(user.id, user.tag, "Lemon Lizard", 0, 500, 100, 1);
		console.log(prf);
	}
}

module.exports = TestCommand;
