import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import {
  ShareableERC721_Streamr,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Share,
  Transfer
} from "../generated/ShareableERC721_Streamr/ShareableERC721_Streamr"
import { ExampleEntity, ShareableToken } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count.plus( BigInt.fromI32(1))

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function getTokenEntityId(tokenId: BigInt, contractAddress: String): string {
  return `${tokenId}-${contractAddress}`
}


//next- listen to multiple contracts
//next- template for different networks

//steps for project setup for others:
//cd nft-share-platform-ropsten-subgraph
//npm ci
//(to run tests )install docker + https://github.com/LimeChain/matchstick/blob/main/README.md#quick-start-

export function handleShare(event: Share): void {

  const tokenEntityId = getTokenEntityId(event.params.tokenId, event.address.toHex())
  let token = ShareableToken.load(tokenEntityId)

  if (!token) {
    token = new ShareableToken(tokenEntityId)
  }

  log.info('logging sharedBy event address {} params.to {}', [event.address.toHex(),event.params.to.toHex()])
  log.info('sharedByBefore size {}',[token.sharedBy.length.toString()])
  token.owner = event.address

  const sharedBy = token.sharedBy
  sharedBy.push(event.params.to)
  sharedBy.push(event.params.to)

  token.sharedBy = sharedBy
  log.info('sharedByAfter size {}',[token.sharedBy.length.toString()])

  token.save()
}

export function handleTransfer(event: Transfer): void {}

//TODO remove this
//Comment this when deploying graph to hosted service as described in https://thegraph.com/docs/en/developer/matchstick/
//export { runTests } from "../tests/nft-platform.test";
