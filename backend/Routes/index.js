const express = require("express");
const userRouter = require("./user")
const zod = require("zod")
const jwt = require("jsonwebtoken");
const User = require("./../db")
const router = express.Router();
router.use('/user', userRouter)
module.exports = router;

const signupSchema = zod.object({
    username: zod.string().min(4),
    password: zod.string().min(8).includes('@#$%^&*()!'),
    firstname: zod.string().trim().min(3),
    lastname: zod.string().min(3)
})


router.post("/signup", async (req, res) => {
    const body = req.body;

    const {success} = signupSchema.safeParse(req.body);

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