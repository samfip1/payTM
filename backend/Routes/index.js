const express = require("express");
const userRouter = require("./user")
const zod = require("zod")
const jwt = require("jsonwebtoken");
const User = require("./../db")
const router = express.Router();
router.use('/user', userRouter)
module.exports = router;
const JWT_SECRET = require('./../config').default
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(8).includes('@#$%^&*()!'),
    firstname: zod.string().trim().min(3),
    lastname: zod.string().min(3)
})


router.post("/signup", async (req, res) => {
    const body = req.body;

    const {success} = signupSchema.safeParse(body);

    //checks if the inputs are valid
    if(!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }


    //checks for a existing user
    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }


    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;


    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })

})






const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})


router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    
    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
    })

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})




const Updateuser = Zod.object({
    username: zod.string().optional().email(),
    password: zod.string().optional(),
    firstName: zod.string().optional()
})
router.put("/userUpdate", async (req, res) => {

    const obj = Updateuser.safeParse(req.body);

    if(!obj.success) {
        return res.json({
            message: "Wrong inputs to update"
        })
    }

    // await User.updateOne({
    //      _id: req.userId 
    // }, req.body);
    /*
    findOneAndUpdate is often preferred over updateOne because it allows you to retrieve and return the updated document directly. 
    Below is how you can use findOneAndUpdate properly for updating a user document: */

    const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },      // Find user by ID (req.userId should be set, e.g., via middleware)
        req.body,                 // Update fields from validated body
        {
            new: true,            // Return the updated document
            runValidators: true,  // Ensure schema validations are applied
        }
    );


    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }


    res.json({
        message: "Updated successfully",
        user: updatedUser,
    });

})






/*
For searhing in nonSQL databases like Mongodb you need to follow this method
https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly
https://stackoverflow.com/questions/3305561/how-to-query-mongodb-with-like
*/
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})