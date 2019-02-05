const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const { abi, bytecode } = require('../compile')

// Run ganache - this allows to create a blockchain in our machine
const server = ganache.server()
server.listen('8080', function (err, blockchain) {
  if (err) console.log({ err })
})

const web3 = new Web3('ws://localhost:8080')

let inbox
let accounts
beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: ['Life!'] })
    .send({
      from: accounts[0],
      gas: 1000000,
      gasPrice: 10
    })
})

describe('Inbox contract', () => {
  it('should compile', () => {
    assert.ok(inbox.options.address)
  })

  it('should get message', async () => {
    const message = await inbox.methods.message().call()
    assert.ok(message)
    assert.strictEqual(message, 'Life!')
  })

  it('should set a message', async () => {
    await inbox.methods.setMessage('Life hack!').send({ from: accounts[0] })
    const message = await inbox.methods.message().call()
    assert.strictEqual(message, 'Life hack!')
  })
})
