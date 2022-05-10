
class Messages {
    constructor(element) {
        if (element.name) {
            this.name = element.name;
        }
        if (element.price) {
            this.price = element.price;
        }
        if (element.ownerLogin) {
            this.ownerLogin = element.ownerLogin;
        }
        if(element.nftSource){
            this.nftSource =  element.nftSource;
        }
    }
}

module.exports = Messages;