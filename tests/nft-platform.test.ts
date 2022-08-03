import { ethereum } from '@graphprotocol/graph-ts/chain/ethereum'
import { Address, BigInt } from '@graphprotocol/graph-ts/common/numbers'
import { clearStore, test, assert, newMockEvent, createMockedFunction } from 'matchstick-as/assembly/index'
import { Like } from '../generated/templates/LikeERC721TemplateDataSource/LikeERC721'
import { ShareableToken } from '../generated/schema'
import { Mint, Share } from '../generated/templates/ShareableERC721TemplateDataSource/ShareableERC721'
import { getTokenEntityId, handleLike, handleMint, handleShare } from '../src/mapping'

  const shareTokenContractAddress = "0xe283Bd7c79188b594e9C19E9032ff365A37Cc4fF".toLowerCase()

  const ownerAddress = '0xA86cb4378Cdbc327eF950789c81BcBcc3aa73D21'

  const address1 = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
  const address2 = '0x79205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
  const address3 = '0x69205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'

  const likeContractAddress = '0xFb6394BC5EeE2F9f00ab9df3c8c489A4647f0Daf'

  test('can create newly minted token', () => {
   
    /*let shareableToken1 = new ShareableToken('id1')
    shareableToken1.ownerAddress = Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7')
    shareableToken1.sharedBy.push(Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'))
    shareableToken1.sharedBy.push(Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'))

    shareableToken1.save()
*/
  
    const mintEvent = createMintEvent(ownerAddress, address1, 1)
    handleMint(mintEvent)

    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'ownerAddress', address1.toLowerCase())
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isOriginal', 'true')
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isSharedInstance', 'false')
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'tokenId', '1')   

    clearStore()
  })

  test('minted token can be shared', () => {
    const mintEvent = createMintEvent(ownerAddress, address1, 1)
    handleMint(mintEvent)

    const shareEvent = createShareEvent(address1, address2, 2, 1)
    handleShare(shareEvent)

    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'ownerAddress', address1.toLowerCase())
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isOriginal', 'true')
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isSharedInstance', 'false')

    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'ownerAddress', address2.toLowerCase())
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'isOriginal', 'false')
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'isSharedInstance', 'true')
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('2') ), 'parentToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ),)

    clearStore()

  })

  test('minted token can be liked', () => {
    mockLikeContractProjectAddress(shareTokenContractAddress)

    const mintEvent = createMintEvent(ownerAddress, address1, 1)
    handleMint(mintEvent)

    const likeEvent = createLikeEvent(address2, address1, 2, 1)
    handleLike(likeEvent)

    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'ownerAddress', address2.toLowerCase())
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'tokenId', '2')
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'isOriginal', 'false')
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'isSharedInstance', 'false')
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'isLikeToken', 'true')
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'contractAddress', likeContractAddress.toLowerCase())
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('2') ), 'likedParentToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ))

    clearStore()
  })

  test('shared token can be liked', () => {
    mockLikeContractProjectAddress(shareTokenContractAddress)

    const mintEvent = createMintEvent(ownerAddress, address1, 1)
    handleMint(mintEvent)

    const shareEvent = createShareEvent(address1, address2, 2, 1)
    handleShare(shareEvent)

    const likeEvent = createLikeEvent(address3, address2, 3, 2)
    handleLike(likeEvent)

    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'ownerAddress', address3.toLowerCase())
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'tokenId', '3')
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'isOriginal', 'false')
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'isSharedInstance', 'false')
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'isLikeToken', 'true')
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'contractAddress', likeContractAddress.toLowerCase())
    assert.fieldEquals('ShareableToken', getTokenEntityId( likeEvent.address.toHexString(), bigInt('3') ), 'likedParentToken', getTokenEntityId( shareEvent.address.toHexString(), bigInt('2') ))
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
    mockEvent.parameters
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
    mockEvent.parameters
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
  tokenId: i32
): Mint {
  let mockEvent = newMockEvent()
  let newMintEvent = new Mint(
    Address.fromString(shareTokenContractAddress),
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  )

  let fromParam = new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.fromString(fromAddress)))
  let toParam = new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(toAddress)))
  let tokenIdParam = new ethereum.EventParam('tokenId', ethereum.Value.fromI32(tokenId))

  newMintEvent.parameters.push(fromParam)
  newMintEvent.parameters.push(toParam)
  newMintEvent.parameters.push(tokenIdParam)

  return newMintEvent
}

function handleShares(events: Share[]): void {
  events.forEach((event) => {
    handleShare(event)
  })
}