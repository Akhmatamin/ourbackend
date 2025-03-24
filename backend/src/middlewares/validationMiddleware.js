const Joi = require("joi");

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(1).max(30).required(),
    password: Joi.string().min(1).required(),
    confirmPassword: Joi.string().min(1).required(), 
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: error.details[0].message }));
  }

  // Проверка совпадения паролей
  if (req.body.password !== req.body.confirmPassword) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Passwords do not match" }));
  }

  next();
};

module.exports = { validateRegister };
