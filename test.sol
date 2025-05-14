// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract test is ERC20, ReentrancyGuard {
    constructor() ERC20("Mock", "MOCK") {
        _mint(address(this), 1000000 * 10 ** decimals());
    }

    function receiveFaucet(address user) internal nonReentrant {
        require(user != address(0), "address must exist" );
        transfer(user, 1000);
    }

    function requestTokens() public nonReentrant {
    receiveFaucet(msg.sender);
}
}