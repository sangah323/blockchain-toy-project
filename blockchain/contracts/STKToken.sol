// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract STKToken is ERC20, Ownable {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Ownable(msg.sender) {} // Ownable(msg.sender): 초기 배포자

    // 보상용 토큰 발행 (owner only)
    function mintSTK() public onlyOwner {
        _mint(owner(), 1_000_000 * 10 ** decimals()); // owner(), 컨트랙트 배포자에게 100만 토큰 민팅
    }
}
