const Joi = require('joi');

const db = require('../models');

const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().max(50).required(),
    role: Joi.string().valid("admin", "user").required(),
    phone_number: Joi.string().max(50).required(),
    addresses: Joi.array().items(Joi.object({
        id: Joi.number().optional(),
        addressLine1: Joi.string().max(100).required(),
        addressLine2: Joi.string().max(100).optional(),
        city: Joi.string().max(50).required(),
        state: Joi.string().max(50).optional(),
        country: Joi.string().max(50).required(),
    }
    )).min(1).required()

})

const getAllUsers = async (req, res) => {
    const { page, limit } = req.query
    const offset = (page - 1) * limit
    try {
        const users = await db.users.findAll({
            attributes: ['id', 'name', 'role', 'email', 'phone_number'],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        return res.status(200).json({ response: users, msg: "Users fetched successfully", status: 200, })
    } catch (err) {
        console.log("Error fetching users", err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

const getSingleUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await db.users.findOne({
            include: [db.addresses],
            where: { id: id },
            attributes: {
                exclude: ['password']
            }
        })
        return res.status(200).json({ response: user, msg: "Users fetched successfully", status: 200 })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

const createUser = async (req, res) => {
    const { error } = validateUserBody(req.body)
    try {
        if (error) return res.status(400).json(error.details[0].message)
        const password = "$2y$10$fAvApDtoKSbpIAN.nzsnQu6vIirHp6UtjSl2x0R2nFfm2.pohvJom"
        const obj = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            phone_number: req.body.phone_number,
            password,
        }
        const user = await user.create(obj)
        if (req.body.addresses.length > 0) {
            const addressArr = req.body.addresses.map(item => ({ ...item, user_id: user.id }))
            await db.users.bulkCreate(addressArr)
        }
        return res.status(201).json({ msg: "User added successfully", status: 201 })
    } catch (err) {
        return res.status(500).json({
            msg: "Internal Server Error",
        })

    }
}

const updateUser = async (req, res) => {
    const { id } = req.params
    try {
        console.log('body here', req.body)
        const { error } = validateUserBody(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        await db.users.update({ ...req.body }, { where: { id } })

        if (users.addresses.length > 0) {
            try {
                await db.addresses.destroy({ where: { user_id: id } })
                const addressArr = req.body.addresses.map(item => ({ ...item, user_id: user.id }))
                await db.users.bulkCreate(addressArr)
            } catch (err) {
                console.log("Failed to udpate addresses")
            }
        }
        else {
            await db.addresses.destroy({ where: { user_id: id } })
        }

        return res.status(200).json({ msg: "User has been udpated successfully", status: 200, })

    } catch (err) {
        return res.status(500).json({ msg: "Internal Server Error" })
    }

}

const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        await db.users.destroy({ where: { id } })
        await db.addresses.destroy({ where: { user_id: id } })
        return res.status(204).json({ msg: "User deleted successfully", status: 204 })
    } catch (err) {
        return res.status(500).json({ msg: "Internal Server Error", status: 500 })
    }
}

const validateUserBody = (body) => {
    return schema.validate(body)
}
module.exports = { getAllUsers, getSingleUser, createUser, updateUser, deleteUser }