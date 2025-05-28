const Board = artifacts.require("Board");
const STKToken = artifacts.require("STKToken");
const BadgeNFT = artifacts.require("BadgeNFT");
require("dotenv").config();

module.exports = async function (deployer, network, account) {
    const owner = process.env.OWNER_ADDRESS;

    const stkToken = await STKToken.deployed();
    const badgeNFT = await BadgeNFT.deployed();

    await deployer.deploy(Board, stkToken.address, badgeNFT.address, owner);
};
