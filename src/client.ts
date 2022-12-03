import { Client } from "@notionhq/client";
import { ClientOptions } from "@notionhq/client/build/src/Client";
import json2md from "json2md";
import { block2markdown } from "./convert";

export class Notion2markdownClient extends Client {
  constructor(options?: ClientOptions) {
    super(options);
  }
  private getBlocks = async ({ block_id }: { block_id: string }) => {
    const blocks = await this.blocks.children.list({ block_id });
    return blocks.results;
  };
  private getPageBlocks = async ({ page_id }: { page_id: string }) => {
    const pageBlocks = await this.getBlocks({ block_id: page_id });
    return pageBlocks;
  };
  private page2md = async ({ page_id }: { page_id: string }) => {
    const pageBlocks = await this.getPageBlocks({ page_id });
    const jsonDataObject = block2markdown(pageBlocks);
    return json2md(jsonDataObject);
  };
  private db2md = async ({ database_id }: { database_id: string }) => {
    const pages = await this.databases.query({ database_id });
    return await Promise.all(
      pages.results.map((page) => this.page2md({ page_id: page.id }))
    );
  };
  readonly markdown = {
    page2md: this.page2md,
    db2md: this.db2md,
  };
}
