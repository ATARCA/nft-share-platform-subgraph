import { ethereum } from '@graphprotocol/graph-ts/chain/ethereum'
import { Address, BigInt } from '@graphprotocol/graph-ts/common/numbers'
import { describe, clearStore, test, assert, newMockEvent, createMockedFunction } from 'matchstick-as/assembly/index'
import { Like } from '../generated/templates/LikeERC721TemplateDataSource/LikeERC721'
import { Project, Token } from '../generated/schema'
import { Mint, Share, Transfer } from '../generated/templates/ShareableERC721TemplateDataSource/ShareableERC721'
import { getTokenEntityId, handleLike, handleLikeERC721ContractCreated, handleMint, handleShare, handleShareableERC721ContractCreated, handleTokenTransferred, ZERO_ADDRESS } from '../src/mapping'
import { LikeERC721ProxyCreated, ShareableERC721ProxyCreated } from '../generated/TalkoFactory/TalkoFactory'
import { createMintEvent, createShareEvent, createLikeEvent, createShareableERC721ProxyCreatedEvent, createLikeERC721ProxyCreatedEvent, createTransferEvent } from './eventHelpers'

  export const likeContractAddress = '0xFb6394BC5EeE2F9f00ab9df3c8c489A4647f0Daf'
  export const shareTokenContractAddress = "0xe283Bd7c79188b594e9C19E9032ff365A37Cc4fF".toLowerCase()
  export const factoryContractAddress = "0xdFC209D462Fc1d92C2e6ba64A2BAcc806d75D649".toLowerCase()

  const ownerAddress = '0xE54BB854621E8CA08666082ABE50a9f4316469BB'
  const operatorAddress = "0xA86cb4378Cdbc327eF950789c81BcBcc3aa73D21".toLowerCase()

  const address1 = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
  const address2 = '0x79205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
  const address3 = '0x69205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'


  const mockedTokenUri = 'domain.xyz/'

  const projectName = 'token name'
  const shareTokenSymbol = 'SHARE'
  const likeTokenSymbol = 'LIKE'

  const tokenCategory = "Main category"

  test('can create newly minted token', () => {
    clearStore()
    
    mockDeployShareContract()
    
    mockShareContractTokenUri('1')
  
    const mintEvent = createMintEvent(ownerAddress, address1, 1, tokenCategory)
    handleMint(mintEvent)

    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'ownerAddress', address1.toLowerCase())
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isOriginal', 'true')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isSharedInstance', 'false')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'tokenId', '1')   
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'metadataUri', buildUriForToken(shareTokenContractAddress,'1'))
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isOriginalOrShared', 'true')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isBurned', 'false')
  })

  test('minted token can be shared', () => {
    clearStore()

    mockDeployShareContract()
    mockShareContractTokenUri('1')
    mockShareContractTokenUri('2')
    
    const mintEvent = createMintEvent(ownerAddress, address1, 1, tokenCategory)
    handleMint(mintEvent)

    const shareEvent = createShareEvent(address1, address2, 2, 1)
    handleShare(shareEvent)

    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'ownerAddress', address1.toLowerCase())
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isOriginal', 'true')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isSharedInstance', 'false')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isOriginalOrShared', 'true')

    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'ownerAddress', address2.toLowerCase())
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'isOriginal', 'false')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'isSharedInstance', 'true')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'parentToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ),)
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'isOriginalOrShared', 'true')
  })

  test('minted token can be liked', () => {
    clearStore()

    mockDeployShareContract()
    mockDeployLikeContract()

    mockShareContractTokenUri('1')
    mockLikeContractTokenUri('2')

    const mintEvent = createMintEvent(ownerAddress, address1, 1, tokenCategory)
    handleMint(mintEvent)

    const likeEvent = createLikeEvent(address2, address1, 2, 1)
    handleLike(likeEvent)

    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'ownerAddress', address2.toLowerCase())
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'tokenId', '2')
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'isOriginal', 'false')
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'isSharedInstance', 'false')
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'isLikeToken', 'true')
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'contractAddress', likeContractAddress.toLowerCase())
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'metadataUri', buildUriForToken( likeContractAddress, '2' ))
  })

  test('shared token can be liked', () => {
    clearStore()

    mockDeployShareContract()
    mockDeployLikeContract()

    mockShareContractTokenUri('1')
    mockShareContractTokenUri('2')
    mockLikeContractTokenUri('3')

    const mintEvent = createMintEvent(ownerAddress, address1, 1, tokenCategory)
    handleMint(mintEvent)

    const shareEvent = createShareEvent(address1, address2, 2, 1)
    handleShare(shareEvent)

    const likeEvent = createLikeEvent(address3, address2, 3, 2)
    handleLike(likeEvent)

    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'ownerAddress', address3.toLowerCase())
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'tokenId', '3')
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'isOriginal', 'false')
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'isSharedInstance', 'false')
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'isLikeToken', 'true')
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'contractAddress', likeContractAddress.toLowerCase())
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'likedParentToken', getTokenEntityId( shareTokenContractAddress, bigInt('2') ))
    assert.fieldEquals('Token', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'likedParentToken', getTokenEntityId( shareTokenContractAddress, bigInt('2') ))
  })

  test('token has category', () => {
    clearStore()

    mockDeployShareContract()
    
    mockShareContractTokenUri('1')
  
    const mintEvent = createMintEvent(ownerAddress, address1, 1, tokenCategory)
    handleMint(mintEvent)

    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'category', tokenCategory)
  })

  test('token can be burned', () => {
    clearStore()
    
    mockDeployShareContract()
    
    mockShareContractTokenUri('1')
  
    const mintEvent = createMintEvent(ownerAddress, address1, 1, tokenCategory)
    handleMint(mintEvent)

    burnToken(1)

    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isBurned', 'true')

  })

function burnToken(tokenId: i32): void {
  const burnEvent = createTransferEvent(ownerAddress, ZERO_ADDRESS, tokenId)
  handleTokenTransferred(burnEvent)
}



function bigInt(i: string): BigInt {
  return BigInt.fromString(i);
}

function mockLikeContractProjectAddress(projectAddress: string): void {
  createMockedFunction(Address.fromString(likeContractAddress),"getProjectAddress",
  "getProjectAddress():(address)")
  .returns([ethereum.Value.fromAddress(Address.fromString(shareTokenContractAddress))])
}

function mockShareContractTokenUri(tokenId: string): void {
  createMockedFunction(Address.fromString(shareTokenContractAddress),"tokenURI", "tokenURI(uint256):(string)")
  .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))])
  .returns([ethereum.Value.fromString(buildUriForToken(shareTokenContractAddress,tokenId))])
}

function mockLikeContractTokenUri(tokenId: string): void {
  createMockedFunction(Address.fromString(likeContractAddress),"tokenURI", "tokenURI(uint256):(string)")
  .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))])
  .returns([ethereum.Value.fromString(buildUriForToken(likeContractAddress,tokenId))])
}

function mockShareContractName(): void {
  createMockedFunction(Address.fromString(shareTokenContractAddress),"name", "name():(string)")
  .returns([ethereum.Value.fromString(projectName)])
}

function buildUriForToken(contractAddress: string, tokenId: string): string {
  return mockedTokenUri+shareTokenContractAddress+'-'+tokenId
}

function createMockProject(): void {
  let project = new Project(projectName)
  project.save()
}

function mockDeployShareContract(): void {
  mockShareContractName()

  const shareContractDeployedEvent = createShareableERC721ProxyCreatedEvent(shareTokenContractAddress, 
    operatorAddress, 
    projectName, 
    shareTokenSymbol)

  handleShareableERC721ContractCreated(shareContractDeployedEvent)
}

function mockDeployLikeContract(): void {
  mockLikeContractProjectAddress(shareTokenContractAddress)

  const likeContractDeployedEvent = createLikeERC721ProxyCreatedEvent(likeContractAddress, 
    operatorAddress, 
    projectName, 
    likeContractAddress)

  handleLikeERC721ContractCreated(likeContractDeployedEvent)
}


function handleShares(events: Share[]): void {
  events.forEach((event) => {
    handleShare(event)
  })
}

