# Notion to markdown blog

```typescript
import { Client } from "notion2mdblog";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_KEY,
});

(async () => {
  const blogPageMD = await notion.markdown.page2md({ page_id: NOTION_PAGE_ID });
  console.log(blogPageMD);
})();
```
