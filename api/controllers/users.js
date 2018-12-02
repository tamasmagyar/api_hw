var db = require('./db');
db.initCollection('users');

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    getUser: getUser,
    getBalance: getBalance,
    updateBalance: updateBalance
};

function createUser(req, res) {
    try {
        var User = {
            username: req.body.username,
            password: req.body.password,
        };
        if(req.body.balance != null || req.body.balance != ""){
            User.balance = req.body.balance;
        }else {
            User.balance = 0;
        }
        var x = db.createObject('users', User);
        return res.json(x._id);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
  }
  
function deleteUser(req, res) {
    try {        
        var x = db.deleteObject('users', {username:req.body.username});
        return res.json(x._id);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
  }
  
function getUser(req, res) {
    try {        
        var x = db.getObjects('users');
        return res.json(x);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
  }
  
function getBalance(req, res) {
    try {        
        var x = db.getObject('users', {username:req.swagger.params.username.value});
        return res.json(x.balance);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
  }
  
function updateBalance(req, res) {
    try {
        var username = req.body.username;
        var amount = req.body.amount;
        
        old_user = db.getObject('users', {username:username});
        
        var User = {
            username: old_user.username,
            password: old_user.password,
            balance: old_user.balance + amount
        };        
        db.updateObject('users',{username:username}, User)
        updated_user = db.getObject('users', {username:username});
        return res.json(updated_user);
    } catch (error) {
        var x = error.message;
        const response = {
            message: x
        }
        return res.status(400).json(response);
    }
  }