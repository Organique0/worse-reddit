const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

//load json data from file and insert the values in the database
//script: npm run seed

const load = async () => {
  const filePath = path.join(__dirname, "MOCK_DATA.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  const posts = JSON.parse(jsonData);

  posts.map(async (post) => {
    console.log(post);
    await prisma.$executeRaw`insert into Post (title, text, userId) values (${post.title}, ${post.text}, ${post.userId})`;
  });

  try {
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

load();
