require('dotenv').config()
const Web3 = require('web3')
const Tx = require('ethereumjs-tx')

const { bytecode } = require('./compile')

const rinkebyUrl = `https://rinkeby.infura.io/v3/${process.env.INFURA_TOKEN}`
const web3 = new Web3(rinkebyUrl)

// Rinkeby account
const account = '0x3eFe452F085785C29F3e7F606458332414c57E4b'
const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex')

web3.eth.getTransactionCount(account, (err, txCount) => {
  if (err) console.log({ err })

  // Create a transaction object
  const txObject = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(1000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    data: '0x' + bytecode
  }

  // Sign transaction
  const tx = new Tx(txObject)
  tx.sign(privateKey)

  const serializedTx = tx.serialize()
  const raw = '0x' + serializedTx.toString('hex')

  // Broadcast the transaction
  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    if (err) console.log({ err })

    console.log(txHash.contractAddress)
  })
})
