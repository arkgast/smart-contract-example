const path = require('path')
const fs = require('fs')
const solc = require('solc')

const contractFile = path.resolve(__dirname, 'contracts', 'inbox.sol')
const source = fs.readFileSync(contractFile, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    'inbox.sol': {
      content: source
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 100
    },
    outputSelection: {
      'inbox.sol': {
        'Inbox': [ 'abi', 'evm.bytecode' ]
      }
    }
  }
}

const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)))
const { abi, evm } = compiledContract.contracts['inbox.sol'].Inbox

module.exports = {
  abi,
  bytecode: evm.bytecode.object
}
