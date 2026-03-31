
const express = require("express");
const FileRepository = require("./Data/FileRepository");
const ProductService = require("./Services/ProductService");

const app = express();
app.use(express.json());

const repo = new FileRepository("products.csv");
const service = new ProductService(repo);

// GET all
app.get("/products", (req, res) => {
  const filter = req.query.search;
  res.json(service.getAllProducts(filter));
});

// GET by id
app.get("/products/:id", (req, res) => {
  res.json(service.getProductById(req.params.id));
});

// POST
app.post("/products", (req, res) => {
  try {
    service.addProduct(req.body);
    res.send("Product added");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// PUT
app.put("/products/:id", (req, res) => {
  service.updateProduct(req.params.id, req.body);
  res.send("Product updated");
});

// DELETE
app.delete("/products/:id", (req, res) => {
  service.deleteProduct(req.params.id);
  res.send("Product deleted");
});

app.listen(3000, () => console.log("Server running"));

app.set("view engine", "ejs");

app.get("/web/products", (req, res) => {
  const products = service.getAllProducts(req.query.search);
  res.render("products", { products });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
