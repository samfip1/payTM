const express = require("express")

const router = express.Router();

module.exports = {router};


router.get('/balance', authMiddleware, async (req,res) => {
    const acc = await User.Account.findOne({
        userId: req.userId
    })
    
    res.json({
        balance: acc.balance
    })

})



router.post('/transfer', authMiddleware, (req,res) => {
    
})