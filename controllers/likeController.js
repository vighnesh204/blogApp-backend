// import model
const Like = require('../models/likeModel');
const Post = require('../models/postModel');

// business logic
exports.likePost = async (req, res) => {
    try{
        // fetch data from request body
        const { post, user } = req.body;
        // create a like object
        const like = new Like({
            post,
            user
        });
        // save the new like into the database
        const savedLike = await like.save();
        // find the post by Id, and update the likes array add the new like's Id
        const updatedPost = await Post.findByIdAndUpdate(
            post, // post id
            { $push: { likes: savedLike._id } }, // update operation to push the new like's Id into the likes array
            { new: true } // option to return the updated document
        ).populate('likes') // abhi hmare pass likes ki ids pdi hain, mujhe likes ki ids nhi actual documents chahiye, to uske liye populate function use karenge, jisse ki likes field ke andar jo ids hain unki jagah unke corresponding documents aa jayenge.
        .exec(); // execute the query
        // create and send response
        res.status(201).json({
            success: true,
            message: "Like to the post successfully",
            like: savedLike,
            post: updatedPost
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error while liking post",
            error: err.message
        })
    }
}

// Unlike a post
exports.unlikePost = async (req, res) => {
    try{
        // fetch data from request body
        const { post, like } = req.body;

        // find and delete the like collection me se 
        const deletedLike = await Like.findByIdAndDelete({post, _id: like});
        // find the post by Id, and update the likes array remove the like's Id
        const updatedPost = await Post.findByIdAndUpdate(
            post, // post id
            { $pull: { likes: deletedLike._id } }, // update operation to pull the like's Id from the likes array
            { new: true } // option to return the updated document
        ).populate('likes') // abhi hmare pass likes ki ids pdi hain, mujhe likes ki ids nhi actual documents chahiye, to uske liye populate function use karenge, jisse ki likes field ke andar jo ids hain unki jagah unke corresponding documents aa jayenge.
        // create and send response
        res.status(200).json({
            success: true,
            message: "Unlike to the post successfully",
            post: updatedPost
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error while unliking post",
            error: err.message
        })
    }
}



exports.dummyLink = (req, res) => {
    res.send(`<h1>This is dummy page</h1>`);
}