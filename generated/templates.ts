// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Address,
  DataSourceTemplate,
  DataSourceContext
} from "@graphprotocol/graph-ts";

export class ShareableERC721TemplateDataSource extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("ShareableERC721TemplateDataSource", [
      address.toHex()
    ]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "ShareableERC721TemplateDataSource",
      [address.toHex()],
      context
    );
  }
}

export class LikeERC721TemplateDataSource extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("LikeERC721TemplateDataSource", [
      address.toHex()
    ]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "LikeERC721TemplateDataSource",
      [address.toHex()],
      context
    );
  }
}

export class EndorseERC721TemplateDataSource extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("EndorseERC721TemplateDataSource", [
      address.toHex()
    ]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "EndorseERC721TemplateDataSource",
      [address.toHex()],
      context
    );
  }
}