// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BadgeNFT is ERC1155, Ownable {
    constructor()
        ERC1155(
            "https://ipfs.io/ipfs/bafybeifior2j4m3zpojvmf7fqq6wllnfdvtuxn4rzcqfv35k7u3fcnk7ba/{id}.json"
        )
        Ownable(msg.sender)
    {}

    // 등급 배지 발급
    function mintBadge(
        address to,
        uint256 badgeId,
        uint256 amount
    ) public onlyOwner {
        _mint(to, badgeId, amount, "");
    }

    // 0:우수, 1:최우수, 2:MVP
    // MetaData : bafybeifior2j4m3zpojvmf7fqq6wllnfdvtuxn4rzcqfv35k7u3fcnk7ba
    // https://ipfs.io/ipfs/bafybeifior2j4m3zpojvmf7fqq6wllnfdvtuxn4rzcqfv35k7u3fcnk7ba/{id}.json

    // BadgeNFT 권한을 Board CA한테 넘겨야 함 => 내장함수 trnasferOwnership
}
