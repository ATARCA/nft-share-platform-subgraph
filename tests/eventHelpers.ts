import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { newMockEvent } from "matchstick-as"
import { ShareableERC721ProxyCreated, LikeERC721ProxyCreated } from "../generated/TalkoFactory/TalkoFactory"
import { Like } from "../generated/templates/LikeERC721TemplateDataSource/LikeERC721"
import { Share, Mint, Transfer, RoleGranted, RoleRevoked } from "../generated/templates/ShareableERC721TemplateDataSource/ShareableERC721"
import { shareTokenContractAddress, likeContractAddress, factoryContractAddress } from "./nft-platform.test"

export function createShareEvent(
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
  
  export function createLikeEvent(
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
  
  export function createMintEvent(
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
  
  export function createTransferEvent(
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
  
  export function createShareableERC721ProxyCreatedEvent(
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
  
  export function createLikeERC721ProxyCreatedEvent(
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

  export function createRoleGrantedEvent(
    role: Bytes,
    account: string,
    sender: string,
  ): RoleGranted {
    let mockEvent = newMockEvent()
    let newRoleGrantedEvent = new RoleGranted(
      Address.fromString(shareTokenContractAddress),
      mockEvent.logIndex,
      mockEvent.transactionLogIndex,
      mockEvent.logType,
      mockEvent.block,
      mockEvent.transaction,
      mockEvent.parameters,
      mockEvent.receipt
    )
  
    let roleParam = new ethereum.EventParam('role', ethereum.Value.fromBytes(role))
    let accountParam = new ethereum.EventParam('account', ethereum.Value.fromAddress(Address.fromString(account)))
    let senderParam = new ethereum.EventParam('sender', ethereum.Value.fromString(sender))
  
    newRoleGrantedEvent.parameters.push(roleParam)
    newRoleGrantedEvent.parameters.push(accountParam)
    newRoleGrantedEvent.parameters.push(senderParam)

    return newRoleGrantedEvent
  }

  export function createRoleRevokedEvent(
    role: Bytes,
    account: string,
    sender: string,
  ): RoleRevoked {
    let mockEvent = newMockEvent()
    let newRoleRevokedEvent = new RoleRevoked(
      Address.fromString(shareTokenContractAddress),
      mockEvent.logIndex,
      mockEvent.transactionLogIndex,
      mockEvent.logType,
      mockEvent.block,
      mockEvent.transaction,
      mockEvent.parameters,
      mockEvent.receipt
    )
  
    let roleParam = new ethereum.EventParam('role', ethereum.Value.fromBytes(role))
    let accountParam = new ethereum.EventParam('account', ethereum.Value.fromAddress(Address.fromString(account)))
    let senderParam = new ethereum.EventParam('sender', ethereum.Value.fromString(sender))
  
    newRoleRevokedEvent.parameters.push(roleParam)
    newRoleRevokedEvent.parameters.push(accountParam)
    newRoleRevokedEvent.parameters.push(senderParam)
      
    return newRoleRevokedEvent
  }