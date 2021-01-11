const db = require('../internal/database');

class ContractRepository {
    static CONTRACT_STORAGE_KEY = '__contract__';

    saveContract(contractModel){
        return db.put(ContractRepository.CONTRACT_STORAGE_KEY, contractModel);
    }

    loadContract() {
        let contract = db.get(ContractRepository.CONTRACT_STORAGE_KEY);
        if (contract === undefined) {
            return null;
        }
        console.log(contract);
        return contract;
    }

    addAppID(appID) {
        let contract = db.get(ContractRepository.CONTRACT_STORAGE_KEY);
        if (contract === undefined) {
            return db.put(ContractRepository.CONTRACT_STORAGE_KEY, {appID: appID});
        }
        contract.appID = appID;
        this.saveContract(contract);
    }

    loadAppID() {
        let contract = db.get(ContractRepository.CONTRACT_STORAGE_KEY);
        if (contract === undefined) {
            return null;
        } 
        return contract.appID;

    }
}

module.exports = ContractRepository; 