import { ethereum } from '@graphprotocol/graph-ts/chain/ethereum'
import { Address, BigInt } from '@graphprotocol/graph-ts/common/numbers'
import { clearStore, test, assert, newMockEvent } from 'matchstick-as/assembly/index'
import { ShareableToken } from '../generated/schema'
import { Share } from '../generated/ShareableERC721_Streamr/ShareableERC721_Streamr'
import { getTokenEntityId, handleShare } from '../src/mapping'

  test('Can call mappings with custom events', () => {
    // Initialise
    let shareableToken1 = new ShareableToken('id1')
    shareableToken1.owner = Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7')
    shareableToken1.sharedBy.push(Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'))
    shareableToken1.sharedBy.push(Address.fromString('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'))

    shareableToken1.save()

    // Call mappings
    let shareEvent1 = createNewShareEvent('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 1)

    let shareEvent2 = createNewShareEvent('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 2)

    handleShares([shareEvent1, shareEvent2])

    assert.fieldEquals('ShareableToken', 'id1', 'owner', '0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7')
    assert.fieldEquals('ShareableToken', getTokenEntityId( bigInt('1'),shareEvent1.address.toHexString()), 'sharedBy', '[0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7]')
    assert.fieldEquals('ShareableToken', getTokenEntityId( bigInt('1'),shareEvent1.address.toHexString()), 'owner', shareEvent1.address.toHexString())
    assert.fieldEquals('ShareableToken', getTokenEntityId( bigInt('2'),shareEvent2.address.toHexString()), 'owner', shareEvent2.address.toHexString())

    clearStore()
  })

  test('Next test', () => {
    //...
  })


function bigInt(i: string): BigInt {
  return BigInt.fromString(i);
}

function createNewShareEvent(
  fromAddress: string,
  toAddress: string,
  tokenId: i32
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
  let toParam = new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(fromAddress)))
  let tokenIdParam = new ethereum.EventParam('tokenId', ethereum.Value.fromI32(tokenId))

  newShareEvent.parameters.push(fromParam)
  newShareEvent.parameters.push(toParam)
  newShareEvent.parameters.push(tokenIdParam)

  return newShareEvent
}

function handleShares(events: Share[]): void {
  events.forEach((event) => {
    handleShare(event)
  })
}