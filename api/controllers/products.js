var db = require('./db');
db.initCollection('products');
db.initCollection('transactions');
db.initCollection('users');

module.exports = {
    createProduct: createProduct,
    deleteProduct: deleteProduct,
    getProducts: getProducts,
    findProduct: findProduct,
    placeOrder: placeOrder,
    getTransactions: getTransactions
};

function createProduct(req, res) {
    try {
        var Product = {
            name: req.body.name,
            cost: req.body.cost
        };
        var x = db.createObject('products', Product);
        return res.json(x._id);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
}

function deleteProduct(req, res) {
    try {

        db.deleteObject('products', product);
        var x = db.getObjects('products');
        return res.json(x);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
}

function getProducts(req, res) {
    try {
        var x = db.getObjects('products');
        return res.json(x);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
}

function findProduct(req, res) {
    try {
        var productName = req.params.productName;
        var x = db.getObject('products', productName);
        return res.json(x);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
}

//Transactions
function placeOrder(req, res) {
    try {
        var d = new Date();
        var Order = {
            username: req.body.username,
            product: req.body.product,
        }
        var product = db.getObject('products', { name: Order.product });
        var user = db.getObject('users', { username: Order.username })
        if (product.cost > user.balance) {
            const response = "Not enough money";
            return res.status(400).send(response);
        } else {
            //updating balance for user if enough money
            var updatedUser = {
                username: user.username,
                password: user.password,
                balance: user.balance - product.cost
            };
            db.updateObject('users', { username: user.username }, updatedUser);

            //creating transaction
            var Transaction = {
                username: user.username,
                product: product.name,
                cost: product.cost,
                date: d
            }
            var x = db.createObject('transactions', Transaction)
            var z = db.getObject('transactions', { username: Transaction.username })
            const response = "Succesfully created transaction";
            return res.status(200).json(z);
        }
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
}

function getTransactions(req, res) {
    try {
        var username = req.swagger.params.username.value;
        var z = db.getObjects('transactions', { username: username });

        return res.status(200).json(z);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
}