const express = require('express');
const app = express();

require('dotenv').config();
const { Client } = require("@notionhq/client")

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // In production, replace '*' with your extension's ID
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

async function getPage(pageId) {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error.body);
  }
}

app.get('/data', (req, res) => {
  console.log("NOTION_TOKEN:", process.env.NOTION_TOKEN)
  const notionResponse = getPage("...").then((data) => {
    console.log("data:", data)
    res.json(data);
  })
});

app.listen(3000, () => console.log('Server listening on port 3000'));
