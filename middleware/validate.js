const Joi = require('joi');

const schemas = {
    register: Joi.object({
        name: Joi.string().min(2).max(50).required().messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email',
            'string.empty': 'Email is required'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters',
            'string.empty': 'Password is required'
        })
    }),

    login: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email',
            'string.empty': 'Email is required'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required'
        })
    }),

    event: Joi.object({
        title: Joi.string().min(1).max(200).required().messages({
            'string.empty': 'Title is required'
        }),
        date: Joi.date().required().messages({
            'date.base': 'Please provide a valid date',
            'any.required': 'Date is required'
        }),
        location: Joi.string().allow('').max(200).optional(),
        description: Joi.string().allow('').max(1000).optional()
    }),

    updateProfile: Joi.object({
        name: Joi.string().min(2).max(50).optional(),
        email: Joi.string().email().optional()
    })
};

const validate = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) return next();

        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const messages = error.details.map(d => d.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        next();
    };
};

module.exports = validate;
