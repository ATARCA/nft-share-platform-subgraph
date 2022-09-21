import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import {
  Share,
  Mint,
  RoleGranted,
  Transfer
} from "../generated/templates/ShareableERC721TemplateDataSource/ShareableERC721"
import { Like, LikeERC721 } from "../generated/templates/LikeERC721TemplateDataSource/LikeERC721"
import { Endorse } from "../generated/templates/EndorseERC721TemplateDataSource/EndorseERC721"
import { EndorseERC721ProxyCreated, LikeERC721ProxyCreated, RoleRevoked, ShareableERC721ProxyCreated } from "../generated/TalkoFactory/TalkoFactory"
import { Category, Project, Token } from "../generated/schema"
import { ShareableERC721TemplateDataSource, LikeERC721TemplateDataSource, EndorseERC721TemplateDataSource } from '../generated/templates'
import { ShareableERC721 } from "../generated/templates/ShareableERC721TemplateDataSource/ShareableERC721"

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

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
    project = createProject(projectName)
  }

  project.shareableContractAddress = event.params._sproxy
  const operators = project.operators 
  operators.push( event.params._owner )
  project.operators = operators
  project.save()

  ShareableERC721TemplateDataSource.create(event.params._sproxy)

  log.info('Share contract created name {}  {}', [projectName,event.address.toHexString()])

}

function createProject(projectName: string): Project {
  const project = new Project(projectName)
  project.categories = []
  project.operators = []
  return project
}

export function handleLikeERC721ContractCreated(event: LikeERC721ProxyCreated): void {
  const projectName = event.params._name.toString()

  let project = Project.load(projectName)

  if (!project) {
    project = createProject(projectName)
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
    project = createProject(projectName)
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

  if (event.params.role == shareContract.OPERATOR_ROLE()) {
    const newOperatorAddress = event.params.account
    const operators = project.operators
    operators.push(newOperatorAddress)
    project.operators = operators
    project.save()
    log.info('Adding operator for {} {}', [shareContract.name(), newOperatorAddress.toHexString()])

  }
}

export function handleShareContractRoleRevoked(event: RoleRevoked): void {
  const shareContractAddress = event.address
  const shareContract = ShareableERC721.bind(shareContractAddress)
  const project = Project.load(shareContract.name())

  if (!project) {
    log.critical('Project not found name: {} share contract address: {} ', [shareContract.name(),shareContractAddress.toHexString()])
    return
  }

  if (event.params.role == shareContract.OPERATOR_ROLE()) {
    const revokedOperatorAddress = event.params.account
    const newOperators:Bytes[] = []
    const operators = project.operators

    for (let i: i32 = 0; i<operators.length; i++) {
      if (Address.fromBytes(operators[i]) != revokedOperatorAddress) {
        newOperators.push(operators[i])
      }
      else {
        log.info('Revoking operator for {} {}', [shareContract.name(), operators[i].toHexString()])

      }
    }

    project.operators = newOperators
    project.save()
  }
}

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
  newToken.isOriginalOrShared = true
  newToken.isLikeToken = false
  newToken.contractAddress = shareContractAddress
  newToken.metadataUri = shareContract.tokenURI(event.params.tokenId)
  newToken.category = parentToken.category
  newToken.isBurned = false

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

  const tokenCategoryId = event.params.category

  const category = getOrCreateCategory(tokenCategoryId)

  if (project && !project.categories.includes(category.id)) {
    const categories = project.categories
    categories.push(category.id)
    project.categories = categories
    project.save()
  }
  
  const token = new Token(tokenEntityId)
  token.ownerAddress = event.params.to
  token.isOriginal = true 
  token.isSharedInstance = false
  token.isOriginalOrShared = true
  token.isLikeToken = false
  token.tokenId = event.params.tokenId
  token.contractAddress = shareContractAddress
  token.metadataUri = shareContract.tokenURI(event.params.tokenId)
  token.category = category.id
  token.isBurned = false

  if (project) token.project = project.id
  else log.critical('Project does not exist {}', [shareContract.name()])

  token.save()
}

function getOrCreateCategory(categoryId: string): Category {
  let category = Category.load(categoryId)
  if (!category) {
    category = new Category(categoryId)
    category.save()
  }

  return category
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
//TODO update and fix tests
  likeToken.ownerAddress = event.params.liker
  likeToken.contractAddress = likeContractAddress
  likeToken.isOriginal = false 
  likeToken.isSharedInstance = false
  likeToken.isOriginalOrShared = false
  likeToken.isLikeToken = true

  likeToken.tokenId = event.params.likeTokenId
  likeToken.likedParentToken = parentToken.id
  likeToken.metadataUri = likeContract.tokenURI(event.params.likeTokenId)
  likeToken.category = parentToken.category
  likeToken.isBurned = false

  if (project) likeToken.project = project.id
  else log.critical('Project does not exist {}', [shareContract.name()])

  likeToken.save()
}

export function handleEndorse(event: Endorse): void {
}

export function handleShareTokenTransferred(event: Transfer): void {
  handleTokenTransferred(event)
}

export function handleLikeTokenTransferred(event: Transfer): void {
  handleTokenTransferred(event)
}

function handleTokenTransferred(event: Transfer): void {
  if (event.params.to.toHexString() == ZERO_ADDRESS) {
    handleTokenBurned(event)
  }
}

function handleTokenBurned(event: Transfer): void {
  const contractAddress = event.address
  const burnedTokenEntityId = getTokenEntityIdFromAddress(contractAddress, event.params.tokenId)

  let burnedToken = Token.load(burnedTokenEntityId)

  if (!burnedToken) {
    log.critical('Token to be burned not found. Event address {} params.tokenId {}', [event.address.toHexString(),event.params.tokenId.toString()])
  } else {
    burnedToken.isBurned = true
    burnedToken.save()
  }
}

