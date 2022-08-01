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

export class ExampleEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("count", Value.fromBigInt(BigInt.zero()));
    this.set("owner", Value.fromBytes(Bytes.empty()));
    this.set("approved", Value.fromBytes(Bytes.empty()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ExampleEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ExampleEntity entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ExampleEntity", id.toString(), this);
    }
  }

  static load(id: string): ExampleEntity | null {
    return changetype<ExampleEntity | null>(store.get("ExampleEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get count(): BigInt {
    let value = this.get("count");
    return value!.toBigInt();
  }

  set count(value: BigInt) {
    this.set("count", Value.fromBigInt(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    return value!.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get approved(): Bytes {
    let value = this.get("approved");
    return value!.toBytes();
  }

  set approved(value: Bytes) {
    this.set("approved", Value.fromBytes(value));
  }
}

export class Project extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("owner", Value.fromBytes(Bytes.empty()));
    this.set("shareableContractAddress", Value.fromBytes(Bytes.empty()));
    this.set("likeContractAddress", Value.fromBytes(Bytes.empty()));
    this.set("endorseContractAddress", Value.fromBytes(Bytes.empty()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Project entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Project entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
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

  get owner(): Bytes {
    let value = this.get("owner");
    return value!.toBytes();
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get shareableContractAddress(): Bytes {
    let value = this.get("shareableContractAddress");
    return value!.toBytes();
  }

  set shareableContractAddress(value: Bytes) {
    this.set("shareableContractAddress", Value.fromBytes(value));
  }

  get likeContractAddress(): Bytes {
    let value = this.get("likeContractAddress");
    return value!.toBytes();
  }

  set likeContractAddress(value: Bytes) {
    this.set("likeContractAddress", Value.fromBytes(value));
  }

  get endorseContractAddress(): Bytes {
    let value = this.get("endorseContractAddress");
    return value!.toBytes();
  }

  set endorseContractAddress(value: Bytes) {
    this.set("endorseContractAddress", Value.fromBytes(value));
  }
}

export class ShareableToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("ownerAddress", Value.fromBytes(Bytes.empty()));
    this.set("contractAddress", Value.fromBytes(Bytes.empty()));
    this.set("isOriginal", Value.fromBoolean(false));
    this.set("isSharedInstance", Value.fromBoolean(false));
    this.set("isLikeToken", Value.fromBoolean(false));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ShareableToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ShareableToken entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ShareableToken", id.toString(), this);
    }
  }

  static load(id: string): ShareableToken | null {
    return changetype<ShareableToken | null>(store.get("ShareableToken", id));
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

  get isLikeToken(): boolean {
    let value = this.get("isLikeToken");
    return value!.toBoolean();
  }

  set isLikeToken(value: boolean) {
    this.set("isLikeToken", Value.fromBoolean(value));
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
}
