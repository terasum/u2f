const BankAccountAccessor = require('../internal/u2f');

const bankAccount = new BankAccountAccessor();


async function invoke() {
    const accessor = await bankAccount.deploy();
    console.log(accessor);
    let appIDRaw = await accessor.getIdentity();
    let appID = Buffer.from(String(appIDRaw).slice(2), 'hex');
    console.log(appID);
}

invoke().then();


