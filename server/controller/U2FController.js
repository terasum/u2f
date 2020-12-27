const BankAccountAccessor = require('../internal/u2f');
const env = require('../internal/ethereum/env');

class U2FController {

    constructor() {
        this.bankAccounts = new BankAccountAccessor();
        this.accessor = undefined;
    }

    health = async (ctx) => {
       ctx.body = {oracle_status: "OK"}
    }

    deploy = async () => {
        if (!this.accessor) {
            this.accessor = await this.bankAccounts.deploy();
        }
        return this.accessor;
    }

    getIdentity = async (ctx) => {
        await this.deploy();
        let appIDRaw = await this.accessor.getIdentity();
        let appID = Buffer.from(String(appIDRaw).slice(2), 'hex');
        ctx.body = {
            appID: appID.toString("utf8"),
            address: this.accessor.address
        }
    }

    deployed = async (ctx) => {
        await this.deploy();
        ctx.body = {
            address: await this.accessor.getAddress(),
            hash: await this.accessor.getTransactionHash(),
            deployer: env.adminAddr,
            network_id: env.networkID,
        }
    }

    register = async (ctx) => {
        await this.deploy();
        ctx.body = await this.accessor.register();
    }

    accounts = async (ctx) => {
        await this.deploy();
        ctx.body = await this.accessor.accounts();
    }

    routers = () => {
        return [
            {
                path:"/u2f/health",
                method: "GET",
                func: this.health
            },
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
        ]
    }
}

module.exports = U2FController;