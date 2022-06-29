import { ethereum } from '@graphprotocol/graph-ts/chain/ethereum'
import { Address, BigInt } from '@graphprotocol/graph-ts/common/numbers'
import { clearStore, test, assert, newMockEvent } from 'matchstick-as/assembly/index'
import { ShareableToken } from '../generated/schema'
import { Mint, Share } from '../generated/ShareableERC721/ShareableERC721'
import { getTokenEntityId, handleMint, handleShare } from '../src/mapping'


  const address1 = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
  const address2 = '0x79205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'

  test('can create newly minted token', () => {
   
    /*let shareableToken1 = new ShareableToken('id1')
    shareableToken1.ownerAddress = Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7')
    shareableToken1.sharedBy.push(Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'))
    shareableToken1.sharedBy.push(Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'))

    shareableToken1.save()
*/
  
    const mintEvent = createMintEvent(address1, 1)
    handleMint(mintEvent)

    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'ownerAddress', address1.toLowerCase())
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isOriginal', 'true')
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'isSharedInstance', 'false')
    assert.fieldEquals('ShareableToken', getTokenEntityId( mintEvent.address.toHexString(), bigInt('1') ), 'tokenId', '1')   

    clearStore()
  })

  test('minted token can be shared', () => {
    const mintEvent = createMintEvent(address1, 1)
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

function bigInt(i: string): BigInt {
  return BigInt.fromString(i);
}

function createShareEvent(
  fromAddress: string,
  toAddress: string,
  tokenId: i32,
  derivedFromTokenId: i32
): Share {
  let mockEvent = newMockEvent()
  let newShareEvent = new Share(
    mockEvent.address,
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

function createMintEvent(
  toAddress: string,
  tokenId: i32
): Mint {
  let mockEvent = newMockEvent()
  let newMintEvent = new Mint(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  )

  let toParam = new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(toAddress)))
  let tokenIdParam = new ethereum.EventParam('tokenId', ethereum.Value.fromI32(tokenId))

  newMintEvent.parameters.push(toParam)
  newMintEvent.parameters.push(tokenIdParam)

  return newMintEvent
}

function handleShares(events: Share[]): void {
  events.forEach((event) => {
    handleShare(event)
  })
}