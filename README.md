# nft-share-platform-subgraph
Subgraph implementation for contract indexing

## Project setup
`cd nft-share-platform-subgraph`
`npm ci`

## How to run tests

1. Install docker. Check https://github.com/LimeChain/matchstick/blob/main/README.md#docker- if needed
2. Run `npm run docker-build`
3. Make sure that in `package.json` the `test` command has the correct path to your source folder
4. Run `npm run test`