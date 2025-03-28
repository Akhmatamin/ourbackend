const Joi = require("joi");

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(1).max(30).required(),
    password: Joi.string().min(1).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: error.details[0].message }));
  }

  next();
};

module.exports = { validateRegister };
