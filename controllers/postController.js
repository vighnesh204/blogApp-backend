// import models
const Post = require('../models/postModel')

// business logic

exports.createPost = async (req, res) => {
    try{
        // fetch data from request body
        const { title, body } = req.body;

        // create a new post object
        const post = new Post({
            title,
            body
        });

        // save the new post to the database
        const savedPost = await post.save();

        // send response
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: savedPost
        })

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error creating post",
            error: err.message
        })
    }
}

exports.getAllPosts = async (req, res) => {
    try{
        // fetch all posts from the database
        const posts = await Post.find().populate('comments').exec();
        res.status(200).json({
            success: true,
            posts: posts
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error fetching posts",
            error: err.message
        })
    }
}