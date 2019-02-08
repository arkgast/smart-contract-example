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

let lottery
let accounts
beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  // Use one of those accounts to deploy the contract
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({
      from: accounts[0],
      gasLimit: 1000000,
      gasPrice: 10
    })
})

describe('Lottery contract', () => {
  it('should compile', () => {
    assert.ok(lottery.options.address)
  })

  it('should get a manager', async () => {
    const manager = await lottery.methods.manager().call()
    assert.ok(manager)
    assert.strictEqual(manager, accounts[0])
  })

  it('should register multiple player', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    })
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    })

    const players = await lottery.methods.getPlayers().call()
    assert.strict.deepEqual(players, [accounts[0], accounts[1]])
  })
})
