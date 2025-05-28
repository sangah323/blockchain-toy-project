const STKToken = artifacts.require("STKToken");

module.exports = function (deployer) {
    const name = "STKToken";
    const symbol = "STK"

    deployer.deploy(STKToken, name, symbol);
};
