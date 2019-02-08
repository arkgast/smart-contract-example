pragma solidity ^0.5.3;

contract Lottery {
    address public manager; 
    address payable[] public players;

    constructor () public payable {
        manager = msg.sender;   
    }

    function enter() public payable {
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function pickWinner() public payable restricted {
        // require(players.length > 1);
        uint index = random() % players.length;
        address payable player = players[index];
        player.transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}
