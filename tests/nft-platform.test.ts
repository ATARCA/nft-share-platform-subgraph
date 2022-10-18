import { ethereum } from '@graphprotocol/graph-ts/chain/ethereum'
import { Address, BigInt } from '@graphprotocol/graph-ts/common/numbers'
import { clearStore, test, assert, newMockEvent, createMockedFunction } from 'matchstick-as/assembly/index'
import { Like } from '../generated/templates/LikeERC721TemplateDataSource/LikeERC721'
import { Project, Token } from '../generated/schema'
import { Mint, Share, Transfer } from '../generated/templates/ShareableERC721TemplateDataSource/ShareableERC721'
import { getTokenEntityId, handleLike, handleLikeERC721ContractCreated, handleMint, handleShare, handleShareableERC721ContractCreated } from '../src/mapping'
import { LikeERC721ProxyCreated, ShareableERC721ProxyCreated } from '../generated/TalkoFactory/TalkoFactory'

  const likeContractAddress = '0xFb6394BC5EeE2F9f00ab9df3c8c489A4647f0Daf'
  const shareTokenContractAddress = "0xe283Bd7c79188b594e9C19E9032ff365A37Cc4fF".toLowerCase()
  const factoryContractAddress = "0xdFC209D462Fc1d92C2e6ba64A2BAcc806d75D649".toLowerCase()

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
    mockDeployShareContract()
    
    mockShareContractTokenUri('1')
  
    const mintEvent = createMintEvent(ownerAddress, address1, 1, tokenCategory)
    handleMint(mintEvent)

    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'ownerAddress', address1.toLowerCase())
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isOriginal', 'true')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isSharedInstance', 'false')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'tokenId', '1')   
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'metadataUri', buildUriForToken(shareTokenContractAddress,'1'))

    clearStore()
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

    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'ownerAddress', address2.toLowerCase())
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'isOriginal', 'false')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'isSharedInstance', 'true')
    assert.fieldEquals('Token', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'parentToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ),)

    clearStore()

  })

  test('minted token can be liked', () => {

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

    clearStore()
  })

  test('shared token can be liked', () => {

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
    clearStore()

  })

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

function createShareEvent(
  fromAddress: string,
  toAddress: string,
  tokenId: i32,
  derivedFromTokenId: i32
): Share {
  let mockEvent = newMockEvent()
  let newShareEvent = new Share(
    Address.fromString(shareTokenContractAddress),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  )

  let fromParam = new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.fromString(fromAddress)))
  let toParam = new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(toAddress)))
  let tokenIdParam = new ethereum.EventParam('tokenId', ethereum.Value.fromI32(tokenId))
  let derivedFromTokenIdParam = new ethereum.EventParam('derivedFromTokenId', ethereum.Value.fromI32(derivedFromTokenId))

  newShareEvent.parameters.push(fromParam)
  newShareEvent.parameters.push(toParam)
  newShareEvent.parameters.push(tokenIdParam)
  newShareEvent.parameters.push(derivedFromTokenIdParam)

  return newShareEvent
}

function createLikeEvent(
  likerAddress: string,
  likeeAddress: string,
  likeTokenId: i32,
  contributionTokenId: i32
): Like {
  let mockEvent = newMockEvent()
  let newShareEvent = new Like(
    Address.fromString(likeContractAddress),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  )

  let likerParam = new ethereum.EventParam('liker', ethereum.Value.fromAddress(Address.fromString(likerAddress)))
  let likeeParam = new ethereum.EventParam('likee', ethereum.Value.fromAddress(Address.fromString(likeeAddress)))
  let likeTokenIdParam = new ethereum.EventParam('likeTokenId', ethereum.Value.fromI32(likeTokenId))
  let contributionTokenIdParam = new ethereum.EventParam('contributionTokenId', ethereum.Value.fromI32(contributionTokenId))

  newShareEvent.parameters.push(likerParam)
  newShareEvent.parameters.push(likeeParam)
  newShareEvent.parameters.push(likeTokenIdParam)
  newShareEvent.parameters.push(contributionTokenIdParam)

  return newShareEvent
}

function createMintEvent(
  fromAddress: string,
  toAddress: string,
  tokenId: i32,
  category: string
): Mint {
  let mockEvent = newMockEvent()
  let newMintEvent = new Mint(
    Address.fromString(shareTokenContractAddress),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  )

  let fromParam = new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.fromString(fromAddress)))
  let toParam = new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(toAddress)))
  let tokenIdParam = new ethereum.EventParam('tokenId', ethereum.Value.fromI32(tokenId))
  let categoryParam = new ethereum.EventParam('category', ethereum.Value.fromString(category))

  newMintEvent.parameters.push(fromParam)
  newMintEvent.parameters.push(toParam)
  newMintEvent.parameters.push(tokenIdParam)
  newMintEvent.parameters.push(categoryParam)

  return newMintEvent
}

function createTransferEvent(
  fromAddress: string,
  toAddress: string,
  tokenId: i32
): Transfer {
  let mockEvent = newMockEvent()
  let newTransferEvent = new Transfer(
    Address.fromString(shareTokenContractAddress),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  )

  let fromParam = new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.fromString(fromAddress)))
  let toParam = new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(toAddress)))
  let tokenIdParam = new ethereum.EventParam('tokenId', ethereum.Value.fromI32(tokenId))

  newTransferEvent.parameters.push(fromParam)
  newTransferEvent.parameters.push(toParam)
  newTransferEvent.parameters.push(tokenIdParam)

  return newTransferEvent
}

function createShareableERC721ProxyCreatedEvent(
  _sproxy: string,
  _owner: string,
  _name: string,
  _symbol: string
): ShareableERC721ProxyCreated {
  let mockEvent = newMockEvent()
  let newDeployEvent = new ShareableERC721ProxyCreated(
    Address.fromString(factoryContractAddress),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  )

  let _sproxyParam = new ethereum.EventParam('_sproxy', ethereum.Value.fromAddress(Address.fromString(_sproxy)))
  let _ownerParam = new ethereum.EventParam('_owner', ethereum.Value.fromAddress(Address.fromString(_owner)))
  let _nameParam = new ethereum.EventParam('_name', ethereum.Value.fromString(_name))
  let _symbolParam = new ethereum.EventParam('_symbol', ethereum.Value.fromString(_symbol))

  newDeployEvent.parameters.push(_sproxyParam)
  newDeployEvent.parameters.push(_ownerParam)
  newDeployEvent.parameters.push(_nameParam)
  newDeployEvent.parameters.push(_symbolParam)

  return newDeployEvent
}

function createLikeERC721ProxyCreatedEvent(
  _lproxy: string,
  _owner: string,
  _name: string,
  _symbol: string
): LikeERC721ProxyCreated {
  let mockEvent = newMockEvent()
  let newDeployEvent = new LikeERC721ProxyCreated(
    Address.fromString(factoryContractAddress),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  )

  let _lproxyParam = new ethereum.EventParam('_lproxy', ethereum.Value.fromAddress(Address.fromString(_lproxy)))
  let _ownerParam = new ethereum.EventParam('_owner', ethereum.Value.fromAddress(Address.fromString(_owner)))
  let _nameParam = new ethereum.EventParam('_name', ethereum.Value.fromString(_name))
  let _symbolParam = new ethereum.EventParam('_symbol', ethereum.Value.fromString(_symbol))

  newDeployEvent.parameters.push(_lproxyParam)
  newDeployEvent.parameters.push(_ownerParam)
  newDeployEvent.parameters.push(_nameParam)
  newDeployEvent.parameters.push(_symbolParam)

  return newDeployEvent
}

function handleShares(events: Share[]): void {
  events.forEach((event) => {
    handleShare(event)
  })
}

