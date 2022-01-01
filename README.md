# Notion to markdown blog

## Install

```bash
npm install notion2mdblog
```

```bash
yarn add notion2mdblog
```

## Usage

```typescript
// Client is extended from @notionhq/client
import { Client } from "notion2mdblog";
import fs from "node:fs";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_KEY,
});

async function main() {
  const blogPages = await notion.markdown.db2md({
    database_id: NOTION_DATABASE_ID,
  });
  blogPages.map((blogPage) => {
    fs.writeFileSync(`blogs/${blogPage.title}`, blogPage.content);
  });
}
main();
```
