const path = require('path')
const fs = require('fs')
var solc = require('solc')

const contractFile = path.resolve(__dirname, 'contracts', 'inbox.sol')
const source = fs.readFileSync(contractFile, 'utf8')

var input = {
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
				'Inbox': [ 'abi', 'evm.bytecode.opcodes' ]
			}
		}
	}
}

var output = JSON.parse(solc.compile(JSON.stringify(input)))

// `output` here contains the JSON output as specified in the documentation
for (var contractName in output.contracts['inbox.sol']) {
  console.log(output.contracts['inbox.sol'][contractName])
}
