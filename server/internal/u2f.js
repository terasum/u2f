const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const env = require('./ethereum/env')
const contract = require('@truffle/contract')

/** smart-contract jsons */
const BankAccountsRaw = require('../../security-question/u2f-implementation/u2f-ether/build/contracts/BankAccounts.json')
const ECCRaw = require('../../security-question/u2f-implementation/u2f-ether/build/contracts/ECC.json')
const HelperLibraryRaw = require('../../security-question/u2f-implementation/u2f-ether/build/contracts/HelperLibrary.json')
const EllipticCurveRaw = require('../../security-question/u2f-implementation/u2f-ether/build/contracts/EllipticCurve.json')
const ECRecoveryRaw = require('../../security-question/u2f-implementation/u2f-ether/build/contracts/ECRecovery.json')

const virtualu2fToken = require('../../security-question/u2f-implementation/u2f-virtualtoken')
var URLSafeBase64 = require('urlsafe-base64')
const crypto = require('crypto')
const parser = require('tder')
const logger = require('loglevel');



const token = new virtualu2fToken.U2FToken(
  [],
  virtualu2fToken.Type.SECP256K1WithEthereumStyleKeccak,
)

async function loadContract(contractRaw, provider) {
  const contractInstance = await contract(contractRaw)
  contractInstance.defaults({ from: env.adminAddr })
  contractInstance.setProvider(provider)
  contractInstance.setNetwork(env.networkID)
  return contractInstance
}

class BankAccountsAccessor {
  constructor() {
    this.provider = new HDWalletProvider(env.privateKey, env.endpoint);
    this.contract = undefined;
    this.web3 = new Web3(this.provider);
  }

  async deploy() {
    if (this.bankAccounts !== undefined) {
      return this.bankAccounts
    }
    const ECC = await loadContract(ECCRaw, this.provider)
    const HelperLibrary = await loadContract(HelperLibraryRaw, this.provider)
    const EllipticCurve = await loadContract(EllipticCurveRaw, this.provider)
    const ECRecovery = await loadContract(ECRecoveryRaw, this.provider)

    const ellipticCurve = await EllipticCurve.new()
    const ecRecovery = await ECRecovery.new()

    await ECC.link('ECRecovery', ecRecovery.address)
    await ECC.link('EllipticCurve', ellipticCurve.address)

    const ecc = await ECC.new()
    const helper = await HelperLibrary.new()

    const bankAccounts = await loadContract(BankAccountsRaw, this.provider)

    await bankAccounts.link('ECC', ecc.address)
    await bankAccounts.link('HelperLibrary', helper.address)

    this.contract = await bankAccounts.new(0)
    return this
  }

  async getIdentity() {
    return await this.contract.getIdentity()
  }

  async getAddress() {
    logger.info("deploy contract address", this.contract.address)
    return this.contract.address
  }

  async getTransactionHash() {
    logger.info("deploy transaction hash", this.contract.transactionHash)
    return this.contract.transactionHash
  }

  async register() {
    if (this.bankAccounts !== undefined) {
      return undefined
    }
    if (!!this.registered) {
      logger.info("reg-1", this.registered)
      return this.registered
    }

    this.registered = {
      algorithm: 'SECP256K',
      issueTxGasUsed: 0,
    }

    let appIDRaw = await this.contract.getIdentity()
    let appID = Buffer.from(String(appIDRaw).slice(2), 'hex')

    await this.registerToken(appID)
    let issueTx = await this.contract.issueFunds(10000)

    console.log('[1] SECP256k issue tx gas usage: ' + issueTx.receipt.gasUsed)

    this.registered.issueTxGasUsed = issueTx.receipt.gasUsed

    let balance = await this.contract.balance.call()
    console.log('user %s, amount %d (before)', balance['0'], balance['1'])
    this.registered.user = balance['0']
    this.registered.balance_before = balance['1'].toString()
    console.log("reg-2", this.registered)
    return this.registered
  }

  async accounts() {
    if (this.bankAccounts !== undefined) {
        return []
    }
    return await this.web3.eth.getAccounts();
  }

  async registerToken(appID) {
    let tx = await this.contract.getRegistrationChallenge()
    console.log(tx.logs)
    let result = tx.logs[0].args
    let challenge = Buffer.from(String(result['1']).slice(2), 'hex')

    var registrationRequest = {
      version: 'U2F_V2',
      type: 'u2f_register_request',
      appId: appID,
      registerRequests: [
        {
          challenge: URLSafeBase64.encode(challenge),
        },
      ],
    }

    let response = await token.HandleRegisterRequest(registrationRequest)

    let calculatedAppID = '0x' + sha2(appID)
    let clientData =
      '0x' + Buffer.from(response.clientData, 'base64').toString('hex')
    let signature = '0x' + getSignature(response.registrationData)
    let keyHandle = '0x' + response.keyHandle
    let publicKey = '0x' + getUserPublicKey(response.registrationData)
    let attestationKey =
      '0x' + getAttestationPublicKey(response.registrationData)

    let answerTX = await this.contract.answerRegistrationChallenge(
      calculatedAppID,
      clientData,
      keyHandle,
      publicKey,
      attestationKey,
      signature,
      0,
    )

    console.log(
      '[0] SECP256k registration gas usage: ' + answerTX.receipt.gasUsed,
      answerTX.logs[0].args.verified,
    )
    // assert.equal(answerTX.logs[0].args.verified, true)
  }

  async deployed() {
    return await this.deploy()
  }
}

function getSignature(registrationData) {
  /*
   * | Reserved (1 Byte) | PKey (65 Bytes) | KeyHandleLength (1 Byte) | KeyHandle (KeyHandleLength Bytes)
   * | Attestation Certificate (variable bytes) | signature (71-73 Bytes)
   *
   */

  let dataBuf = URLSafeBase64.decode(registrationData)
  let keyHandleLength = dataBuf.readUInt8(66)
  let startOfCertificate = 67 + keyHandleLength
  let lengthOfCertificate = dataBuf.readUInt16BE(startOfCertificate + 2) + 4
  let endOfCertificate = startOfCertificate + lengthOfCertificate

  let signature = dataBuf.slice(endOfCertificate)
  return signature.toString('hex')
}

function getUserPublicKey(registrationData) {
  /*
   * | Reserved (1 Byte) | PKey (65 Bytes) | KeyHandleLength (1 Byte) | KeyHandle (KeyHandleLength Bytes)
   * | Attestation Certificate (variable bytes) | signature (71-73 Bytes)
   *
   */

  let dataBuf = URLSafeBase64.decode(registrationData)
  return dataBuf.slice(1, 66).toString('hex')
}

function sha2(message) {
  return crypto.createHash('sha256').update(message).digest().toString('hex')
}

function getAttestationPublicKey(registrationData) {
  /*
   * | Reserved (1 Byte) | PKey (65 Bytes) | KeyHandleLength (1 Byte) | KeyHandle (KeyHandleLength Bytes)
   * | Attestation Certificate (variable bytes) | signature (71-73 Bytes)
   *
   */

  let dataBuf = URLSafeBase64.decode(registrationData)
  let keyHandleLength = dataBuf.readUInt8(66)

  let startOfCertificate = 67 + keyHandleLength

  let lengthOfCertificate = dataBuf.readUInt16BE(startOfCertificate + 2) + 4
  let endOfCertificate = startOfCertificate + lengthOfCertificate

  let certBuffer = dataBuf.slice(startOfCertificate, endOfCertificate)

  let certRaw = parser.parse(certBuffer)
  let publicKey = certRaw.child[0].child[6].child[1].data

  return publicKey.slice(2)
}

module.exports = BankAccountsAccessor
