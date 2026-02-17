// import model
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

// business logic

exports.createComment = async (req, res) => { 
    try{
        // fetch data from request body
        const { post, user, body } = req.body;

        // create a comment object
        // save function ko krna hai to pehle comment object create krna hoga, ya phir create function bhi use kr skte the
        const comment = new Comment({
            post,
            user,
            body
        });

        // save the new comment into the database 
        // by default ek new id generate hoti hai jab hum new Comment() se ek comment object create karte hain, aur jab hum save() function call karte hain to wo comment database me save ho jata hai aur usko ek unique id mil jati hai. is id ko hum use karenge post ke comments array me add karne ke liye.    
        // hm create function bhi use kar sakte the
        const savedComment = await comment.save();

        // find the post by Id, and update the comments array add the new comment's Id
        const updatedPost = await Post.findByIdAndUpdate(
            post, // post id
            { $push: { comments: savedComment._id } }, // update operation to push the new comment's Id into the comments array
            { new: true } // option to return the updated document
        ).populate('comments') 
        // abhi hmare pass comments ki ids pdi hain, mujhe comments ki ids nhi actual documents chahiye, to uske liye populate function use karenge, jisse ki comments field ke andar jo ids hain unki jagah unke corresponding documents aa jayenge.
        .exec(); // execute the query

        // create and send response
        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment: savedComment,
            post: updatedPost
        })

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error creating comment",
            error: err.message
        })
    }
}