// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IERC20WithPermit {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract PermitSpender {
    event PermitTransferExecuted(
        address indexed owner,
        address indexed to,
        address token,
        uint256 amount
    );
    IERC20WithPermit token;

    constructor(address _token) {
        token = IERC20WithPermit(_token);
    }

    /**
     * @dev This function is used to authorize a transfer of tokens from one address to another
     * @param to The address that will receive the tokens
     * @param amount The amount of tokens to be transferred
     * @param deadline The timestamp at which this approval expires
     * @param v EIP-712 signature v value
     * @param r EIP-712 signature r value
     * @param s EIP-712 signature s value
     */
    function permitAndTransferFrom(
        address to,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(amount > 0, "Amount must be greater than zero");

        // 1 step. call the permit function to authorize the transfer, make an approve
        token.permit(msg.sender, address(this), amount, deadline, v, r, s);

        // 2 step. call the token transferFrom function
        bool success = token.transferFrom(msg.sender, to, amount);
        require(success, "Transfer failed");

        emit PermitTransferExecuted(msg.sender, to, address(token), amount);
    }
}
