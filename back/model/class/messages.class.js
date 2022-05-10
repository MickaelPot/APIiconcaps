
class Messages {
    constructor(element) {
        if (element.sender) {
            this.sender = element.sender;
        }
        if (element.receiver) {
            this.receiver = element.receiver;
        }
        if (element.message) {
            this.message = element.message;
        }
    }
}

module.exports = Messages;