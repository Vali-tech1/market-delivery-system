class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  getAllProducts(filter) {
    let products = this.repository.getAll();

    if (filter) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return products;
  }

  getProductById(id) {
    return this.repository.getById(id);
  }

  addProduct(product) {
    if (!product.name || product.name.trim() === "") {
      throw new Error("Product name is required");
    }

    if (product.price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    this.repository.add(product);
  }

  updateProduct(id, product) {
    this.repository.update(id, product);
  }

  deleteProduct(id) {
    this.repository.delete(id);
  }
}

module.exports = ProductService;