import Joi from 'joi'

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

// export const registerSchema = Joi.object({
//     username: Joi.string().min(2).max(32).required(),
//     password: Joi.string().min(8).required(),
//     repeat_password: Joi.ref('password'),
//     contact: Joi.string().min(12).required(),
//     gender: Joi.valid("male", "female").required()
// })