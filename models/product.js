const fs = require('fs');
const path = require('path');
const { title } = require('process');

const p = path.join(
    path.dirname(require.main.filename), 
    'data', 
    'products.json');

const getProductsFromFile = cb => {
    fs.readFile(p, (error, fileContent) => {
        if(error){
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        this.id = Math.random().toString(); //AAAAAAAAAA ugly
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
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