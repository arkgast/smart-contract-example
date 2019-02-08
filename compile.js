const path = require('path')
const fs = require('fs')
const solc = require('solc')

const contractFile = path.resolve(__dirname, 'contracts', 'lottery.sol')
const source = fs.readFileSync(contractFile, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    'lottery.sol': {
      content: source
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 100
    },
    outputSelection: {
      'lottery.sol': {
        'Lottery': [ 'abi', 'evm.bytecode' ]
      }
    }
  }
}

const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)))
const { abi, evm } = compiledContract.contracts['lottery.sol'].Lottery

module.exports = {
  abi,
  bytecode: evm.bytecode.object
}
