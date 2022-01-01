// @ts-nocheck
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

let BLOCK_TYPES = {
  paragraph: {
    key: "p",
    format: (paragraphs) =>
      paragraphs
        .map((para) => para.text?.map((block) => block.plain_text))
        .flat(),
    join: true,
  },
  heading_1: {
    key: "h1",
    format: (heading) =>
      heading.text.map((block) => block.plain_text)?.join(""),
  },
  heading_2: {
    key: "h2",
    format: (heading) =>
      heading.text.map((block) => block.plain_text)?.join(""),
  },
  heading_3: {
    key: "h3",
    format: (heading) =>
      heading.text.map((block) => block.plain_text)?.join(""),
  },
  bulleted_list_item: {
    key: "ul",
    format: (items) =>
      items.map((item) =>
        item.text.map((itemText) => itemText.plain_text)?.join("")
      ),
    join: true,
  },
  numbered_list_item: {
    key: "ol",
    format: (items) =>
      items.map((item) =>
        item.text.map((itemText) => itemText.plain_text)?.join("")
      ),
    join: true,
  },
  code: {
    key: "code",
    format: (snippet) => ({
      language: snippet.language,
      content: snippet?.text?.map((line) => line?.plain_text),
    }),
  },
  image: {
    key: "img",
    format: (image) => ({
      title: "My image title",
      source: image[image.type].url,
      alt: "My image alt",
    }),
  },
  // to_do: { key: "" },
  // toggle: { key: "" },
  // child_page: { key: "" },
  // child_database: { key: "" },
  // embed: { key: "" },
  // video: { key: "" },
  // file: { key: "" },
  // pdf: { key: "" },
  // bookmark: { key: "" },
  // callout: { key: "" },
  // quote: { key: "" },
  // equation: { key: "" },
  // divider: { key: "" },
  // table_of_contents: { key: "" },
  // column: { key: "" },
  // column_list: { key: "" },
  // link_preview: { key: "" },
  // unsupported: { key: "" },
};

export const block2markdown = (
  blockResponse: ListBlockChildrenResponse["results"]
) => {
  return blockResponse
    .map((block) => {
      const blockType = block["type"];
      const param = BLOCK_TYPES[blockType];
      if (!param?.key) return null;
      return {
        child: block[blockType],
        ...param,
      };
    })
    .filter(Boolean)
    .reduce((blockArray, currBlock) => {
      const prevBlock = blockArray.pop();
      if (!prevBlock) return [currBlock];
      if (prevBlock.key === currBlock.key && currBlock.join) {
        if (!Array.isArray(prevBlock.child)) {
          prevBlock.child = [prevBlock.child];
        }
        blockArray.push({
          ...currBlock,
          child: [...prevBlock.child, currBlock.child],
        });
      } else {
        blockArray.push(prevBlock, currBlock);
      }
      return blockArray;
    }, [])
    .map((block) => ({
      [block.key]: block?.format?.(block.child) || block.child,
    }));
};
