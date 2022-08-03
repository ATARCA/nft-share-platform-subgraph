import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  Share,
  Mint
} from "../generated/templates/ShareableERC721TemplateDataSource/ShareableERC721"
import { Like, LikeERC721 } from "../generated/templates/LikeERC721TemplateDataSource/LikeERC721"
import { Endorse } from "../generated/templates/EndorseERC721TemplateDataSource/EndorseERC721"
import { EndorseERC721ProxyCreated, LikeERC721ProxyCreated, ShareableERC721ProxyCreated } from "../generated/TalkoFactory/TalkoFactory"
import { ExampleEntity, Project, ShareableToken } from "../generated/schema"
import { ShareableERC721TemplateDataSource, LikeERC721TemplateDataSource, EndorseERC721TemplateDataSource } from '../generated/templates'

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

export function getTokenEntityIdFromAddress(contractAddress: Address, tokenId: BigInt): string {
  return getTokenEntityId(contractAddress.toHex(), tokenId)
}

export function handleShareableERC721ContractCreated(event: ShareableERC721ProxyCreated): void {
  const projectName = event.params._name.toString()
  let project = Project.load(projectName)

  if (!project) {
    project = new Project(projectName)
  }

  project.shareableContractAddress = event.params._sproxy
  project.owner = event.params._creator
  project.save()

  ShareableERC721TemplateDataSource.create(event.params._sproxy)
}

export function handleLikeERC721ContractCreated(event: LikeERC721ProxyCreated): void {
  const projectName = event.params._name.toString()

  let project = Project.load(projectName)

  if (!project) {
    project = new Project(projectName)
  }

  project.likeContractAddress = event.params._sproxy
  project.save()

  LikeERC721TemplateDataSource.create(event.params._sproxy)
}

export function handleEndorseERC721ContractCreated(event: EndorseERC721ProxyCreated): void {
  const projectName = event.params._name.toString()

  let project = Project.load(projectName)

  if (!project) {
    project = new Project(projectName)
  }

  project.endorseContractAddress = event.params._sproxy
  project.save()

  EndorseERC721TemplateDataSource.create(event.params._sproxy)
}

//TODO implement burning - transfer to zero address is burning

export function handleShare(event: Share): void {

  const shareContractAddress = event.address;
  
  const newTokenEntityId = getTokenEntityIdFromAddress( shareContractAddress, event.params.tokenId)
  const parentTokenEntityId = getTokenEntityIdFromAddress( shareContractAddress, event.params.derivedFromTokenId)
  
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
  newToken.contractAddress = shareContractAddress

  log.info('logging sharedBy event address {} params.to {}', [event.address.toHex(),event.params.to.toHex()])
 
  newToken.save()
  parentToken.save()
}

export function handleMint(event: Mint): void {
  const shareContractAddress = event.address;
  const tokenEntityId = getTokenEntityIdFromAddress(shareContractAddress, event.params.tokenId)

  const token = new ShareableToken(tokenEntityId)
  token.ownerAddress = event.params.to
  token.isOriginal = true 
  token.isSharedInstance = false
  token.isLikeToken = false
  token.tokenId = event.params.tokenId
  token.contractAddress = shareContractAddress

  token.save()
}

export function handleLike(event: Like): void {

  const likeContractAddress = event.address;
  const likeContract = LikeERC721.bind(likeContractAddress)
  const shareContractAddress = likeContract.getProjectAddress()

  const parentTokenEntityId = getTokenEntityIdFromAddress( shareContractAddress, event.params.contributionTokenId)
  let parentToken = ShareableToken.load(parentTokenEntityId)

  if (!parentToken) {
    parentToken = new ShareableToken(parentTokenEntityId)
    log.critical('Token to be liked does not exist. TokenId {}', [parentTokenEntityId])
  }

  const tokenEntityId = getTokenEntityIdFromAddress(likeContractAddress, event.params.likeTokenId)

  const likeToken = new ShareableToken(tokenEntityId)

  likeToken.ownerAddress = event.params.liker
  likeToken.contractAddress = likeContractAddress
  likeToken.isOriginal = false 
  likeToken.isSharedInstance = false
  likeToken.isLikeToken = true

  likeToken.tokenId = event.params.likeTokenId
  likeToken.likedParentToken = parentToken.id

  likeToken.save()
}

export function handleEndorse(event: Endorse): void {
}
