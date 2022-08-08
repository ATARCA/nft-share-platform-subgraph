import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import {
  Share,
  Mint,
  RoleGranted
} from "../generated/templates/ShareableERC721TemplateDataSource/ShareableERC721"
import { Like, LikeERC721 } from "../generated/templates/LikeERC721TemplateDataSource/LikeERC721"
import { Endorse } from "../generated/templates/EndorseERC721TemplateDataSource/EndorseERC721"
import { EndorseERC721ProxyCreated, LikeERC721ProxyCreated, ShareableERC721ProxyCreated } from "../generated/TalkoFactory/TalkoFactory"
import { ExampleEntity, Project, Token } from "../generated/schema"
import { ShareableERC721TemplateDataSource, LikeERC721TemplateDataSource, EndorseERC721TemplateDataSource } from '../generated/templates'
import { ShareableERC721 } from "../generated/templates/ShareableERC721TemplateDataSource/ShareableERC721"

export function getTokenEntityId(contractAddress: String, tokenId: BigInt): string {
  return `${contractAddress.toLowerCase()}-${tokenId}`
}

export function getTokenEntityIdFromAddress(contractAddress: Address, tokenId: BigInt): string {
  return getTokenEntityId(contractAddress.toHexString(), tokenId)
}

export function handleShareableERC721ContractCreated(event: ShareableERC721ProxyCreated): void {
  const projectName = event.params._name.toString()
  let project = Project.load(projectName)

  if (!project) {
    project = new Project(projectName)
  }

  project.shareableContractAddress = event.params._sproxy
  project.owner = event.params._owner
  project.save()

  ShareableERC721TemplateDataSource.create(event.params._sproxy)

  log.info('Share contract created name {}  {}', [projectName,event.address.toHexString()])

}

export function handleLikeERC721ContractCreated(event: LikeERC721ProxyCreated): void {
  const projectName = event.params._name.toString()

  let project = Project.load(projectName)

  if (!project) {
    project = new Project(projectName)
  }

  project.likeContractAddress = event.params._lproxy
  project.save()

  LikeERC721TemplateDataSource.create(event.params._lproxy)

  log.info('Like contract created name {}  {}', [projectName,event.address.toHexString()])

}

export function handleEndorseERC721ContractCreated(event: EndorseERC721ProxyCreated): void {
  const projectName = event.params._name.toString()

  let project = Project.load(projectName)

  if (!project) {
    project = new Project(projectName)
  }

  project.endorseContractAddress = event.params._eproxy
  project.save()

  EndorseERC721TemplateDataSource.create(event.params._eproxy)

  log.info('Endorse contract created name {}  {}', [projectName,event.address.toHexString()])
}

export function handleShareContractRoleGranted(event: RoleGranted): void {
  const shareContractAddress = event.address
  const shareContract = ShareableERC721.bind(shareContractAddress)
  const project = Project.load(shareContract.name())

  if (!project) {
    log.critical('Project not found name: {} share contract address: {}', [shareContract.name(),shareContractAddress.toHexString()])
    return
  }

  if (event.params.role === shareContract.OPERATOR_ROLE()) {
    const newOperatorAddress = event.params.account
    project.owner = newOperatorAddress
    project.save()
  }
}

//TODO implement burning - transfer to zero address is burning

export function handleShare(event: Share): void {

  const shareContractAddress = event.address
  const shareContract = ShareableERC721.bind(shareContractAddress)
  const project = Project.load(shareContract.name())


  const newTokenEntityId = getTokenEntityIdFromAddress( shareContractAddress, event.params.tokenId)
  const parentTokenEntityId = getTokenEntityIdFromAddress( shareContractAddress, event.params.derivedFromTokenId)
  
  let parentToken = Token.load(parentTokenEntityId)

  if (!parentToken) {
    parentToken = new Token(parentTokenEntityId)
    log.critical('Shared token does not exist. Event address {} params.to {}', [event.address.toHexString(),event.params.to.toHexString()])
  }

  const newToken = new Token(newTokenEntityId)

  newToken.ownerAddress = event.params.to
  newToken.parentTokenId = event.params.derivedFromTokenId
  newToken.parentToken = parentToken.id
  newToken.tokenId = event.params.tokenId
  newToken.isOriginal = false
  newToken.isSharedInstance = true
  newToken.isLikeToken = false
  newToken.contractAddress = shareContractAddress
  newToken.metadataUri = shareContract.tokenURI(event.params.tokenId)

  if (project) newToken.project = project.id
  else log.critical('Project does not exist {}', [shareContract.name()])

  log.info('logging sharedBy event address {} params.to {}', [event.address.toHexString(),event.params.to.toHexString()])
 
  newToken.save()
  parentToken.save()
}

export function handleMint(event: Mint): void {
  const shareContractAddress = event.address
  const shareContract = ShareableERC721.bind(shareContractAddress)
  const project = Project.load(shareContract.name())

  const tokenEntityId = getTokenEntityIdFromAddress(shareContractAddress, event.params.tokenId)

  const token = new Token(tokenEntityId)
  token.ownerAddress = event.params.to
  token.isOriginal = true 
  token.isSharedInstance = false
  token.isLikeToken = false
  token.tokenId = event.params.tokenId
  token.contractAddress = shareContractAddress
  token.metadataUri = shareContract.tokenURI(event.params.tokenId)

  if (project) token.project = project.id
  else log.critical('Project does not exist {}', [shareContract.name()])
  

  token.save()
}

export function handleLike(event: Like): void {

  const likeContractAddress = event.address;
  const likeContract = LikeERC721.bind(likeContractAddress)
  const shareContractAddress = likeContract.getProjectAddress()
  const shareContract = ShareableERC721.bind(shareContractAddress)

  const project = Project.load(shareContract.name())


  const parentTokenEntityId = getTokenEntityIdFromAddress( shareContractAddress, event.params.contributionTokenId)
  let parentToken = Token.load(parentTokenEntityId)

  if (!parentToken) {
    parentToken = new Token(parentTokenEntityId)
    log.critical('Token to be liked does not exist. TokenId {}', [parentTokenEntityId])
  }

  const tokenEntityId = getTokenEntityIdFromAddress(likeContractAddress, event.params.likeTokenId)

  const likeToken = new Token(tokenEntityId)

  likeToken.ownerAddress = event.params.liker
  likeToken.contractAddress = likeContractAddress
  likeToken.isOriginal = false 
  likeToken.isSharedInstance = false
  likeToken.isLikeToken = true

  likeToken.tokenId = event.params.likeTokenId
  likeToken.likedParentToken = parentToken.id
  likeToken.metadataUri = likeContract.tokenURI(event.params.likeTokenId)
  
  if (project) likeToken.project = project.id
  else log.critical('Project does not exist {}', [shareContract.name()])

  likeToken.save()
}

export function handleEndorse(event: Endorse): void {
}
