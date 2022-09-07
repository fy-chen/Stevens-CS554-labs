const bcrypt = require('bcrypt');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const saltRounds = 16;

let areAppropriateParameters = (username, password) => {

    if(!username){
        throw "username not provided";
    }else if(typeof(username) !== 'string'){
        throw "provided username is not a string";
    }else if(username.trim().length === 0){
        throw "username cannot be empty";
    }
    
    if(!password){
        throw "password not provided";
    }else if(typeof(password) !== 'string'){
        throw "provided password is not a string";
    }else if(password.trim().length === 0){
        throw "password cannot be empty";
    }
    if(username.trim().indexOf(" ") !== -1){
        throw "username cannot have spaces";
    }
    for(let i = 0; i < username.trim().length; i++){
        if(username.trim().charAt(i) >= 'A' && username.trim().charAt(i) <= 'Z'){
            continue;
        }else if(username.trim().charAt(i) >= 'a' && username.trim().charAt(i) <= 'z'){
            continue;
        }else if(username.trim().charAt(i) >= 0 && username.trim().charAt(i) <= 9){
            continue;
        }else{
            throw "username must contain only alphanumeric characters";
        }
    }
    if(password.indexOf(" ") !== -1){
        throw "password cannot have spaces";
    }
    if(username.trim().length < 4){
        throw "username must be at least 4 characters long";
    }
    if(password.length < 6){
        throw "password must be at least 6 characters long";
    }
}

let convertObjectId = (id) => {

    let parsedId = id;
  
    try{
      parsedId = ObjectId(id);
    }catch(e){
      throw 'provided id is not a valid ObjectId , id must be a single String of 12 bytes or a string of 24 hex characters';
    }
  
    return parsedId;
}

async function createUser(name, username, password) {

    areAppropriateParameters(username, password);

    if(!name){
        throw "name not provided";
    }else if(typeof(name) !== 'string'){
        throw "provided name is not a string";
    }else if(name.trim().length === 0){
        throw "provided name cannot be empty";
    }
    
    const hash = await bcrypt.hash(password, saltRounds);

    let regex = new RegExp(["^", username.toLowerCase(), "$"].join(""), "i");

    UsersCollection = await users();

    let user = await UsersCollection.findOne({ username: regex });
    
    if (user !== null) throw 'Already have user with that username';

    let newUser = {
        name: name,
        username: username,
        password: hash
    }

    const insertInfo = await UsersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not add user';

    let newId = insertInfo.insertedId.toString();
    
    return await this.getUserById(newId);
}

async function checkUser(username, password) {

    areAppropriateParameters(username, password);

    const hash = await bcrypt.hash(password, saltRounds);

    let regex = new RegExp(["^", username.toLowerCase(), "$"].join(""), "i");

    UsersCollection = await users();

    let user = await UsersCollection.findOne({ username: regex });
    
    if (user === null) throw 'Either the username or password is invalid';

    compareResult = await bcrypt.compare(password, user.password);

    if(!compareResult) throw 'Either the username or password is invalid';

    delete user.password;
    
    return user;

}

async function getUserById (id) {

    if(!id){
        throw "userId not provided";
    }else if(typeof(id) !== 'string'){
        throw "provided userId is not a string";
    }else if(id.trim().length === 0){
        throw "provided userId cannot be empty";
    }

    let parsedId = convertObjectId(id);

    UsersCollection = await users();

    const user = await UsersCollection.findOne({ _id: parsedId });

    if(!user) throw "no user with that id";

    user._id = user._id.toString();

    delete user.password;

    return user;

}

module.exports = {
    convertObjectId,
    createUser,
    checkUser,
    getUserById,
    areAppropriateParameters
};