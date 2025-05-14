// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20Permit {
    constructor() ERC20("MyTokenPermit", "MTP") ERC20Permit("MyToken") {
        mint();
    }

    function mint() public {
        _mint(msg.sender, 5 ether);
    }
}
