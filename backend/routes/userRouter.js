const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

router.post('/register', async (req, res) => {
    let {email, password, passwordCheck, displayName} = req.body;

    try { 
        if (!email || !password || !passwordCheck) {
            return res.status(400).json({msg : "Not all field have been entered"})
        }

        if (password.length < 5) {
            return res.status(400).json({msg : "Password must be atleast 5 characters long"})
        }

        if (password !== passwordCheck) {
            return res.status(400).json({msg: "Enter the same password twice for verification"})
        }
        
        const isExist = await User.findOne({email: email})

        if (isExist) {
            return res.status(400).json({msg: "Email is already exist"})
        }

        if (!displayName) {
            displayName = email
        } 

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            email: email,
            password: passwordHash, 
            displayName: displayName
        })

        const savedUser = await newUser.save();
        res.json(savedUser)

    } catch (err) {
        return res.status(500).json({msg: err.message})

    }
})


router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({msg : "Not all field have been entered"}) 
        }

        const user = await User.findOne({email})

        if (!user) { 
            return res.status(400).json({msg: "Account with this email not found"}) 
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({msg: "Password invalid"})
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({
            token: token, 
            user: {
                id: user._id,
                displayName: user.displayName, 
            }
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

})

router.delete('/delete', auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.json(deletedUser)
        
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

})

router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) {
            return res.json(false)
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) {
            return res.json(false)
        }

        const user = await User.findById(verified.id)
        if (!user) {
            return res.json(false)
        } 
        
        return res.json(true)

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user)
    res.json({
        displayName: user.displayName,
        id: user._id 
    })
})
module.exports = router; 