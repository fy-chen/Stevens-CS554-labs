const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const blogs = mongoCollections.blogs;
const users = require('./users');

function isAppropriateString (string, name) {
    if(arguments.length !== 2) throw 'string and string should be provided for checking purpose';
    else if(!string) throw `${name} not provided`;
    else if(typeof(string) !== 'string') throw `provided ${name} is not a string`;
    else if(string.trim().length === 0) throw `provided ${name} cannot be an empty string`;
}

async function createBlogs (title, body, userId) {

    isAppropriateString(title, 'title');
    isAppropriateString(body, 'body');
    isAppropriateString(userId, 'userId');

    users.convertObjectId(userId);
    
    let user = await users.getUserById(userId);

    let comments = [];

    let userThatPosted = {
        _id: userId,
        username: user.username
    }

    let newBlog = {
        title: title,
        body: body,
        userThatPosted: userThatPosted,
        comments: comments
    }

    BlogCollection = await blogs();

    const insertInfo = await BlogCollection.insertOne(newBlog);
    if (insertInfo.insertedCount === 0) throw 'Could not add blog';

    let newId = insertInfo.insertedId.toString();
    
    return await this.getBlogById(newId);

}

async function getAllBlogs() {

    if(arguments.length > 0) throw 'There should not be variables provided';
  
    BlogCollection = await blogs();
  
    let bloglist = await BlogCollection.find({}).toArray();
  
    for (let blog of bloglist) {    
        blog._id = blog._id.toString();
        
        for (let comment of blog.comments) {
            comment._id = comment._id.toString();
        }
    }
  
    return bloglist;
  
}

async function getBlogById (id) {

    isAppropriateString(id, 'blogId');

    let parsedId = users.convertObjectId(id);

    BlogCollection = await blogs();

    const blog = await BlogCollection.findOne({ _id: parsedId });

    if(!blog) throw "no blog with that id";

    blog._id = blog._id.toString();

    for (let comment of blog.comments) {
        comment._id = comment._id.toString();
    }

    return blog;

}

async function updateBlogs (blogId, title, body, userId) {

    isAppropriateString(title, 'title');
    isAppropriateString(body, 'body');

    BlogCollection = await blogs();

    await this.checkBlogUserId(blogId, userId);

    let parsedblogId = users.convertObjectId(blogId);

    const updateBlog = {
        title: title,
        body: body
    }

    const updatedInfo = BlogCollection.updateOne(
        { _id: parsedblogId },
        { $set: updateBlog }
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update blog successfully';
    }
  
    return await this.getBlogById(blogId);

}

async function createComments (blogId, userId, comment) {

    isAppropriateString(blogId, 'blogId');
    isAppropriateString(userId, 'userId');
    isAppropriateString(comment, 'comment');

    let parsedblogId = users.convertObjectId(blogId);

    await this.getBlogById(blogId);

    users.convertObjectId(userId);

    let user = await users.getUserById(userId);

    let userThatPostedComment = {
        _id: userId,
        username: user.username
    }

    let newComment = {
        _id: new ObjectId(),
        userThatPostedComment: userThatPostedComment,
        comment: comment
    }

    BlogCollection = await blogs();

    const updatedInfo = await BlogCollection.updateOne({ _id: parsedblogId }, { $addToSet: { comments: newComment } });

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add comment successfully';
    }

    return await this.getBlogById(blogId);

}

async function deleteComments (blogId, commentId, userId) {

    let checkResult = await this.checkCommentUserId(blogId, commentId, userId);

    if(checkResult) {

        BlogCollection = await blogs();

        let parsedblogId = users.convertObjectId(blogId);
        let parsedcommentId = users.convertObjectId(commentId);

        const updatedInfo = await BlogCollection.updateOne({ _id: parsedblogId }, { $pull: { comments: { _id: parsedcommentId } } });

        if (updatedInfo.modifiedCount === 0) {
            throw 'could not remove review successfully';
        }

        return {"commentId": commentId, "deleted": true};
    }

}

async function checkBlogUserId (blogId, userId) {

    isAppropriateString(blogId, 'blogId');
    isAppropriateString(userId, 'userId');

    users.convertObjectId(blogId);

    users.convertObjectId(userId);

    await users.getUserById(userId);

    let blog = await this.getBlogById(blogId);

    if( blog.userThatPosted._id !== userId ) throw "you can update your blogs only";

}

async function checkCommentUserId (blogId, commentId, userId) {

    isAppropriateString(blogId, 'blogId');
    isAppropriateString(userId, 'userId');
    isAppropriateString(commentId, 'commentId');

    users.convertObjectId(blogId);

    users.convertObjectId(commentId);

    users.convertObjectId(userId);

    await users.getUserById(userId);

    let blog = await this.getBlogById(blogId);

    for( let comment of blog.comments){
        if(comment._id === commentId) {
            if(comment.userThatPostedComment._id === userId){
                return true;
            }else{
                throw "you can delete your comments only";
            }
        }
    }

    throw "no comment with that id under this blog";

}

module.exports = {
    firstName: "Feiyu", 
    lastName: "Chen", 
    studentId: "10459464",
    createBlogs,
    getAllBlogs,
    getBlogById,
    updateBlogs,
    createComments,
    deleteComments,
    checkBlogUserId,
    checkCommentUserId,
    isAppropriateString
  };