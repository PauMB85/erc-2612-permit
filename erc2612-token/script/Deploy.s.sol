// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/MyToken.sol";
import "../src/PermitSpender.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        MyToken token = new MyToken();
        console.log("Token deployed at:", address(token));

        PermitSpender spender = new PermitSpender(address(token));
        console.log("PermitSpender deployed at:", address(spender));

        vm.stopBroadcast();
    }
}
