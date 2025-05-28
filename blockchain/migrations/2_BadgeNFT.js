const BadgeNFT = artifacts.require("BadgeNFT");

module.exports = function (deployer) {
  deployer.deploy(BadgeNFT);
};
