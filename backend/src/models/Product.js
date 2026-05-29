class Product {
  constructor(id, name, description, price, stock, category_id, image_url = null) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category_id = category_id;
    this.image_url = image_url;
  }
}

module.exports = Product;
