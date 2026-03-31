const fs = require("fs");
const path = require("path");

class FileRepository {
  constructor(fileName) {
    this.filePath = path.join(__dirname, fileName);
  }

  readData() {
    const data = fs.readFileSync(this.filePath, "utf8").trim();
    const lines = data.split("\n");
    const headers = lines[0].split(",");

    return lines.slice(1).map(line => {
      const values = line.split(",");
      let obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i];
      });
      return obj;
    });
  }

  writeData(data) {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(h => obj[h]).join(","));
    const csv = [headers.join(","), ...rows].join("\n");

    fs.writeFileSync(this.filePath, csv);
  }

  getAll() {
    return this.readData();
  }

  getById(id) {
    return this.readData().find(p => p.id == id);
  }

  add(item) {
    const data = this.readData();
    data.push(item);
    this.writeData(data);
  }

  update(id, updatedItem) {
    let data = this.readData();
    data = data.map(p => (p.id == id ? updatedItem : p));
    this.writeData(data);
  }

  delete(id) {
    let data = this.readData();
    data = data.filter(p => p.id != id);
    this.writeData(data);
  }
}

module.exports = FileRepository;