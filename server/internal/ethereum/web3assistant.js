 const Web3 = require('web3')
 
 // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
 const loadWeb3 = async () => {
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    return new Web3(provider);

  }

  const loadAccount= async (web3) => {
    // Set the current blockchain account
    return web3.eth.accounts[0]
  }

  module.exports = {
    loadWeb3,
    loadAccount,
  }