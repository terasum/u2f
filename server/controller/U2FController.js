const BankAccountAccessor = require('../internal/u2f');
const ContractRepository = require('../repository/ContractRepository');
const ContractModel = require('../model/ContractModel');


const env = require('../config');
const util = require('../utils/runtime-utils');

class U2FController {

    constructor() {
        this.bankAccounts = new BankAccountAccessor();
        this.accessor = undefined;
        this.contractRepository = new ContractRepository();
    }

deployed = async (ctx) => {
        let contractModel = this.contractRepository.loadContract();
        if(!util.isNull(contractModel) && util.isNull(this.accessor)) {
            this.accessor = await this.bankAccounts.at(contractModel.address);
        }
        if(!util.isNull(contractModel)) {
            return contractModel;
        }

        this.accessor = await this.bankAccounts.deploy();
        
        let newModel = new ContractModel(
            await this.accessor.getAddress(),
            await this.accessor.getTransactionHash(),
            env.adminAddr,
            env.networkID,
        )
        this.contractRepository.saveContract(newModel);
        return newModel;
    }

    getIdentity = async (ctx) => {
        function convert(appIdHex) {
            let tempbuf = Buffer.from(util.trimRight(String(appIdHex).slice(2), '0'), 'hex');
            let tempstr = tempbuf.toString("utf8");
            return tempstr;
        }

        await this.deployed(ctx);

        let appID = this.contractRepository.loadAppID();

        if (!util.isEmpty(appID)){
            return {
                appID: convert(appID),
                address:  await this.accessor.getAddress()
            }
        } 

        let appIDRaw = await this.accessor.getIdentity();
        if (!util.isEmpty(appIDRaw)){
            this.contractRepository.addAppID(appIDRaw)
        }
        return {
            appID: convert(appID),
            address:  await this.accessor.getAddress()
        }
    }


    register = async (ctx) => {
        await this.deployed();
        let tx_from = ctx.query['tx_from'];
        console.log("tx_from", tx_from);
        return await this.accessor.register(tx_from);
    }

    transfer = async (ctx) =>{
        await this.deploy();
        let tx_from = ctx.query['tx_from'];
        let tx_to = ctx.query['tx_to'];
        let amount = ctx.query['amount'];
        return await this.accessor.transfer(tx_from, tx_to, amount);
    }

    accounts = async (ctx) => {
        await this.deployed();
        return await this.accessor.accounts();
    }

    routers = () => {
        return [
            {
                path:"/u2f/getIdentity",
                method: "GET",
                func: this.getIdentity
            },
            {
                path:"/u2f/deployed",
                method: "GET",
                func: this.deployed
            },
            {
                path:"/u2f/register",
                method: "GET",
                func: this.register
            },
            {
                path:"/u2f/accounts",
                method: "GET",
                func: this.accounts
            },
            {
                path:"/u2f/transfer",
                method: "GET",
                func: this.transfer
            },
        ]
    }
}

module.exports = U2FController;