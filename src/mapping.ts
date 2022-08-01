import { BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import {
  ShareableERC721,
  Approval,
  ApprovalForAll,
  Share,
  Mint
} from "../generated/ShareableERC721/ShareableERC721"
import { Like } from "../generated/LikeERC721/LikeERC721"
import { EndorseERC721ProxyCreated, LikeERC721ProxyCreated, ShareableERC721ProxyCreated } from "../generated/TalkoFactory/TalkoFactory"
import { ExampleEntity, Project, ShareableToken } from "../generated/schema"


//TODO remove this demo code
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

export function getTokenEntityId(contractAddress: String, tokenId: BigInt): string {
  return `${contractAddress.toLowerCase()}-${tokenId}`
}

export function handleShareableERC721ContractCreated(event: ShareableERC721ProxyCreated): void {
  let project = Project.load(event.params._name.toString())

  if (!project) {
    project = new Project(event.params._name.toString())
  }

  project.shareableContractAddress = event.params._sproxy
  project.owner = event.params._creator
  project.save()
}

export function handleLikeERC721ContractCreated(event: LikeERC721ProxyCreated): void {
  let project = Project.load(event.params._name.toString())

  if (!project) {
    project = new Project(event.params._name.toString())
  }

  project.likeContractAddress = event.params._sproxy
  project.save()
}

export function handleEndorseERC721ContractCreated(event: EndorseERC721ProxyCreated): void {
  let project = Project.load(event.params._name.toString())

  if (!project) {
    project = new Project(event.params._name.toString())
  }

  project.endorseContractAddress = event.params._sproxy
  project.save()
}


//TODO implement burning - transfer to zero address is burning
//TODO add dynamic data sources https://forum.thegraph.com/t/developer-highlights-1-future-proofing-your-subgraph-with-dynamic-data-sources/1821

export function handleShare(event: Share): void {

  const contractAddress = event.address;
  const newTokenEntityId = getTokenEntityId( contractAddress.toHex(), event.params.tokenId)
  const parentTokenEntityId = getTokenEntityId( event.address.toHex(), event.params.derivedFromTokenId)
  
  let parentToken = ShareableToken.load(parentTokenEntityId)

  if (!parentToken) {
    parentToken = new ShareableToken(parentTokenEntityId)
    log.critical('Shared token does not exist. Event address {} params.to {}', [event.address.toHex(),event.params.to.toHex()])
  }

  const newToken = new ShareableToken(newTokenEntityId)

  newToken.ownerAddress = event.params.to
  newToken.parentTokenId = event.params.derivedFromTokenId
  newToken.parentToken = parentToken.id
  newToken.tokenId = event.params.tokenId
  newToken.isOriginal = false
  newToken.isSharedInstance = true
  newToken.isLikeToken = false
  newToken.contractAddress = contractAddress

  log.info('logging sharedBy event address {} params.to {}', [event.address.toHex(),event.params.to.toHex()])
 
  newToken.save()
  parentToken.save()
}

export function handleMint(event: Mint): void {
  const contractAddress = event.address;
  const tokenEntityId = getTokenEntityId(contractAddress.toHex(), event.params.tokenId)

  const token = new ShareableToken(tokenEntityId)
  token.ownerAddress = event.params.to
  token.isOriginal = true 
  token.isSharedInstance = false
  token.isLikeToken = false
  token.tokenId = event.params.tokenId
  token.contractAddress = contractAddress

  token.save()
}

export const shareTokenContractAddress = "0xe283Bd7c79188b594e9C19E9032ff365A37Cc4fF".toLowerCase() //TODO save and load this dynamically

export function handleLike(event: Like): void {
  const parentTokenEntityId = getTokenEntityId( shareTokenContractAddress, event.params.contributionTokenId)
  let parentToken = ShareableToken.load(parentTokenEntityId)

  if (!parentToken) {
    parentToken = new ShareableToken(parentTokenEntityId)
    log.critical('Token to be liked does not exist. TokenId {}', [parentTokenEntityId])
  }

  const contractAddress = event.address;
  const tokenEntityId = getTokenEntityId(contractAddress.toHex(), event.params.likeTokenId)

  const likeToken = new ShareableToken(tokenEntityId)

  likeToken.ownerAddress = event.params.liker
  likeToken.contractAddress = contractAddress
  likeToken.isOriginal = false 
  likeToken.isSharedInstance = false
  likeToken.isLikeToken = true

  likeToken.tokenId = event.params.likeTokenId
  likeToken.likedParentToken = parentToken.id

  likeToken.save()
}
