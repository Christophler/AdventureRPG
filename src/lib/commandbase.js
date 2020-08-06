class CommandBase {
	names = [];

	constructor(names) {
		this.names = names;
	}

	/**
	 * Runs the command code
	 * @param {message object} message
	 * @param {args of the message} args
	 */
	run(message, args) {
		throw new Error("This method is abstract");
	}
}

module.exports = CommandBase;
