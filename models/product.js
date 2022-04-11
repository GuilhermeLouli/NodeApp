const fs = require('fs');
const path = require('path');
const { title } = require('process');

const filePath = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json');

const getProductsFromFile = cb => {
  fs.readFile(filePath, (error, fileContent) => {
    if (error) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString(); //AAAAAAAAAA ugly
        products.push(this);
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const updatedProducts = products.filter(p => p.id !== id);
      fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {
        if(!err){

        }
      });
    });

  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    })
  }
}