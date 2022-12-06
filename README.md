# nft-share-platform-subgraph

TODO: specify license before publishing this repo

Subgraph implementation for contract indexing. This indexes the `TalkoFactory`, `ShareableERC721` and `LikeERC721` contracts. Only address of deployed `TalkoFactory` has to be provided, other contracts are added dynamically as they are deployed.

### Project structure

Clone this repository using git. If you will be using also other repositories from atarca, place them all ine one directory. Example structure:
```
.
├── my dev folder
│   ├── nft-share-platform-frontend
│   └── nft-share-platform-backend
│   └── nft-share-platform-contracts
│   └── nft-share-platform-subgraph
...
```

Some workspace scripts rely on this structure and may not work properly when all projects are not placed in the same directory.

## Project setup
`cd nft-share-platform-subgraph`
`npm ci`

## How to run tests

1. Install docker. Check https://github.com/LimeChain/matchstick/blob/main/README.md#docker- if needed
2. Run `npm run docker-build`
3. Make sure that in `package.json` the `test` command has the correct path to your source folder
4. Run `npm run test`

## Disclaimer

This project has received funding from the European Union's Horizon 2020 Research and Innovation Programme under Grant Agreement Nº 964678.