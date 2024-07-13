const model = require('../models');

const userModel = model.users;

const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().max(50).required(),
    role: Joi.string().valid("admin", "user").required(),
    phone_number: Joi.string().max(50).required(),
    password: Joi.string().required()
    // addresses: Joi.array().items(Joi.object({
    //     id: Joi.number().optional(),
    //     addressLine1: Joi.string().max(100).required(),
    //     addressLine2: Joi.string().max(100).optional(),
    //     city: Joi.string().max(50).required(),
    //     state: Joi.string().max(50).optional(),
    //     country: Joi.string().max(50).required(),
    // }
    // )).required().min(1)

})

//Signup Function
function signUp(req, res) {
    userModel.findOne({ where: { email: req.body.email } }).then(result => {
        if (result) {
            res.status(409).json({
                msg: "User already exists!",
            })
        } else {
            const { error } = validateBody(req.body)
            if (error) return res.status(400).json({ msg: error.details[0].msg, status: 400 })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password || "123456", salt, (err, hash) => {
                    //user obj
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        role: req.body.role,
                        phone_number: req.body.phone_number,
                        password: hash,
                    }
                    userModel.create(user).then(result => {
                        return res.status(201).json({
                            msg: "User registered successfully",
                            post: result
                        });
                    }).catch(error => {
                        return res.status(500).json({
                            msg: "Internal server error",
                        })

                    });

                });

            });

        }

    }).catch(error => {
        return res.status(500).json({
            msg: "Internal server error",
        });

    });

}

const logIn = async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { email: req.body.email } })
        if (user === null) {
            return res.status(400).json({
                msg: "Invalid Credentials!",
            });

        } else {
            bcrypt.compare(req.body.password, user.password, async (err, result) => {

                if (result) {
                    jwt.sign({ email: user.email, user_id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" },
                        async (err, token) => {
                            return res.status(200).json({
                                msg: "Logged-In Successfully!",
                                token: token,
                                status: 200
                            });

                        });
                } else {
                    console.log(err)
                    return res.status(200).json({
                        msg: "Invalid Credentials!"
                    });
                }
            });
        }
    }
    catch (error) {
        // console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error",
        });
    }
}
const authorization = (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split("Bearer ")[1]
        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_KEY || "the_super_secret_key")
            const role = jwt.decode(token).role
            if (role == 'admin')
                next()
            else
                return res.status(403).send("Unauthorized to perform actions")
        }
        else {
            return res.status(403).send("Unauthenticated user")
        }
    } catch (err) {
        return res.status(403).send("Unauthenticated user")
    }
}
const validateBody = (body) => schema.validate(body)

module.exports = {
    signUp,
    logIn,
    authorization
}