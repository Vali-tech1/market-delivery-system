const { hashPassword } = require("../src/services/passwordService");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hashPassword.js <password>");
  process.exit(1);
}

hashPassword(password)
  .then((hash) => {
    console.log(hash);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
