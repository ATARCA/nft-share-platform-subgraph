// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Project extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Project entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Project must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Project", id.toString(), this);
    }
  }

  static load(id: string): Project | null {
    return changetype<Project | null>(store.get("Project", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get operators(): Array<Bytes> {
    let value = this.get("operators");
    return value!.toBytesArray();
  }

  set operators(value: Array<Bytes>) {
    this.set("operators", Value.fromBytesArray(value));
  }

  get shareableContractAddress(): Bytes | null {
    let value = this.get("shareableContractAddress");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set shareableContractAddress(value: Bytes | null) {
    if (!value) {
      this.unset("shareableContractAddress");
    } else {
      this.set("shareableContractAddress", Value.fromBytes(<Bytes>value));
    }
  }

  get likeContractAddress(): Bytes | null {
    let value = this.get("likeContractAddress");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set likeContractAddress(value: Bytes | null) {
    if (!value) {
      this.unset("likeContractAddress");
    } else {
      this.set("likeContractAddress", Value.fromBytes(<Bytes>value));
    }
  }

  get endorseContractAddress(): Bytes | null {
    let value = this.get("endorseContractAddress");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set endorseContractAddress(value: Bytes | null) {
    if (!value) {
      this.unset("endorseContractAddress");
    } else {
      this.set("endorseContractAddress", Value.fromBytes(<Bytes>value));
    }
  }

  get categories(): Array<string> {
    let value = this.get("categories");
    return value!.toStringArray();
  }

  set categories(value: Array<string>) {
    this.set("categories", Value.fromStringArray(value));
  }
}

export class Category extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Category entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Category must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Category", id.toString(), this);
    }
  }

  static load(id: string): Category | null {
    return changetype<Category | null>(store.get("Category", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Token entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Token must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Token", id.toString(), this);
    }
  }

  static load(id: string): Token | null {
    return changetype<Token | null>(store.get("Token", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get ownerAddress(): Bytes {
    let value = this.get("ownerAddress");
    return value!.toBytes();
  }

  set ownerAddress(value: Bytes) {
    this.set("ownerAddress", Value.fromBytes(value));
  }

  get contractAddress(): Bytes {
    let value = this.get("contractAddress");
    return value!.toBytes();
  }

  set contractAddress(value: Bytes) {
    this.set("contractAddress", Value.fromBytes(value));
  }

  get metadataUri(): string | null {
    let value = this.get("metadataUri");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set metadataUri(value: string | null) {
    if (!value) {
      this.unset("metadataUri");
    } else {
      this.set("metadataUri", Value.fromString(<string>value));
    }
  }

  get project(): string {
    let value = this.get("project");
    return value!.toString();
  }

  set project(value: string) {
    this.set("project", Value.fromString(value));
  }

  get isOriginal(): boolean {
    let value = this.get("isOriginal");
    return value!.toBoolean();
  }

  set isOriginal(value: boolean) {
    this.set("isOriginal", Value.fromBoolean(value));
  }

  get isSharedInstance(): boolean {
    let value = this.get("isSharedInstance");
    return value!.toBoolean();
  }

  set isSharedInstance(value: boolean) {
    this.set("isSharedInstance", Value.fromBoolean(value));
  }

  get isOriginalOrShared(): boolean {
    let value = this.get("isOriginalOrShared");
    return value!.toBoolean();
  }

  set isOriginalOrShared(value: boolean) {
    this.set("isOriginalOrShared", Value.fromBoolean(value));
  }

  get isLikeToken(): boolean {
    let value = this.get("isLikeToken");
    return value!.toBoolean();
  }

  set isLikeToken(value: boolean) {
    this.set("isLikeToken", Value.fromBoolean(value));
  }

  get isEndorseToken(): boolean {
    let value = this.get("isEndorseToken");
    return value!.toBoolean();
  }

  set isEndorseToken(value: boolean) {
    this.set("isEndorseToken", Value.fromBoolean(value));
  }

  get tokenId(): BigInt | null {
    let value = this.get("tokenId");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set tokenId(value: BigInt | null) {
    if (!value) {
      this.unset("tokenId");
    } else {
      this.set("tokenId", Value.fromBigInt(<BigInt>value));
    }
  }

  get parentTokenId(): BigInt | null {
    let value = this.get("parentTokenId");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set parentTokenId(value: BigInt | null) {
    if (!value) {
      this.unset("parentTokenId");
    } else {
      this.set("parentTokenId", Value.fromBigInt(<BigInt>value));
    }
  }

  get parentToken(): string | null {
    let value = this.get("parentToken");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set parentToken(value: string | null) {
    if (!value) {
      this.unset("parentToken");
    } else {
      this.set("parentToken", Value.fromString(<string>value));
    }
  }

  get sharedChildTokens(): Array<string> {
    let value = this.get("sharedChildTokens");
    return value!.toStringArray();
  }

  set sharedChildTokens(value: Array<string>) {
    this.set("sharedChildTokens", Value.fromStringArray(value));
  }

  get likedParentToken(): string | null {
    let value = this.get("likedParentToken");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set likedParentToken(value: string | null) {
    if (!value) {
      this.unset("likedParentToken");
    } else {
      this.set("likedParentToken", Value.fromString(<string>value));
    }
  }

  get likeTokens(): Array<string> {
    let value = this.get("likeTokens");
    return value!.toStringArray();
  }

  set likeTokens(value: Array<string>) {
    this.set("likeTokens", Value.fromStringArray(value));
  }

  get endorsedParentToken(): string | null {
    let value = this.get("endorsedParentToken");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set endorsedParentToken(value: string | null) {
    if (!value) {
      this.unset("endorsedParentToken");
    } else {
      this.set("endorsedParentToken", Value.fromString(<string>value));
    }
  }

  get endorseTokens(): Array<string> {
    let value = this.get("endorseTokens");
    return value!.toStringArray();
  }

  set endorseTokens(value: Array<string>) {
    this.set("endorseTokens", Value.fromStringArray(value));
  }

  get endorseTokenReceiverAddress(): Bytes | null {
    let value = this.get("endorseTokenReceiverAddress");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set endorseTokenReceiverAddress(value: Bytes | null) {
    if (!value) {
      this.unset("endorseTokenReceiverAddress");
    } else {
      this.set("endorseTokenReceiverAddress", Value.fromBytes(<Bytes>value));
    }
  }

  get category(): string {
    let value = this.get("category");
    return value!.toString();
  }

  set category(value: string) {
    this.set("category", Value.fromString(value));
  }

  get isBurned(): boolean {
    let value = this.get("isBurned");
    return value!.toBoolean();
  }

  set isBurned(value: boolean) {
    this.set("isBurned", Value.fromBoolean(value));
  }

  get mintBlock(): BigInt {
    let value = this.get("mintBlock");
    return value!.toBigInt();
  }

  set mintBlock(value: BigInt) {
    this.set("mintBlock", Value.fromBigInt(value));
  }
}
