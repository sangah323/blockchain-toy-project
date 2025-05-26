// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract STKToken is ERC20 {
    address public owner;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        owner = msg.sender;
    }

    // 보상용 토큰 발행 (owner only)
    function minting() public {
        require(msg.sender == owner, "Only owner can mint");
        _mint(owner, 1_000_000 * 10 ** decimals()); // owner(), 컨트랙트 배포자에게 100만 토큰 민팅
    }

    // owner가 사용자에게 보상 지급
    function reward(address user, uint256 amount) public {
        require(msg.sender == owner, "Only owner can mint");
        require(balanceOf(owner) >= amount, "Not enough balance");
        _transfer(owner, user, amount); // owner가 user에게 amount 지급
    }

    // 토큰 소유자 주소 조회
    function getOwner() public view returns (address) {
        return owner;
    }
}
