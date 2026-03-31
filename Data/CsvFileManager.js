const fs = require("fs");

class CsvFileManager {
  static read(filePath) {
    if (!fs.existsSync(filePath)) return [];

    const data = fs.readFileSync(filePath, "utf8");
    const lines = data.split("\n").filter(line => line);

    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
      const values = line.split(",");
      let obj = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = values[i].trim();
      });
      return obj;
    });
  }
}

module.exports = CsvFileManager;