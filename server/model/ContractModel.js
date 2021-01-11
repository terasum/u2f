class ContractModel {
    address = ""
    hash = ""
    deployer = ""
    network_id = ""

    constructor(address, hash, deployer, network_id){
        this.address = address;
        this.hash = hash;
        this.deployer = deployer;
        this.network_id = network_id;
    }

    toJson() {
         return JSON.stringify(this);
    }

    static reconstructor(json) {
        let temp = JSON.parse(json);
        return new ContractModel(temp.address, temp.hash, temp.deployer, temp.network_id);
    }
}

module.exports = ContractModel;