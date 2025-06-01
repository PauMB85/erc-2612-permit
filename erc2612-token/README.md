# ERC-2612 Permit extension for EIP-20 approvals

## build
```bash
forge build --force --build-info
```

## deploy
```bash
source .env
forge script script/Deploy.s.sol:Deploy --rpc-url rootstock_testnet --private-key $PRIVATE_KEY --broadcast --verify --verifier blockscout --verifier-url 'https://rootstock-testnet.blockscout.com/api/' --legacy
```