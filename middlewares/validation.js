const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const { BadRequestError } = require("../utils/errors/BadRequestError");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }

  return helpers.error("string.email");
};

const getStringValidationMessages = (
  name,
  { min, max, required, isUrl, isEmail, isOnly, isHex, length } = {}
) => {
  const messages = {};

  if (required) {
    messages["string.empty"] = `The "${name} field must be filled in`;
  }

  if (min) {
    messages[
      "string.min"
    ] = `The minimum length of the "${name} field is ${min}`;
  }

  if (max) {
    messages[
      "string.max"
    ] = `The maximum length of the "${name} field is ${max}`;
  }

  if (isUrl) {
    messages["string.uri"] = `The ${name} field must be a valid url`;
  }

  if (isEmail) {
    messages[
      "string.email"
    ] = `The ${name} field must be a valid email address`;
  }

  if (isOnly) {
    messages["any.only"] = `Invalid ${name} field`;
  }

  if (isHex) {
    messages["string.hex"] = `The ${name} field must be a hexadecimal value`;
  }

  if (length) {
    messages[
      "string.length"
    ] = `The ${name} field must have a length of ${length} characters`;
  }

  return messages;
};

const validateItemCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages(
        getStringValidationMessages("name", { required: true, min: 2, max: 30 })
      ),
    link: Joi.string()
      .required()
      .custom(validateUrl)
      .messages(
        getStringValidationMessages("link", { required: true, isUrl: true })
      ),
    weather: Joi.string().required().valid("hot", "cold", "warm"),
  }),
});

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages(
        getStringValidationMessages("name", {
          required: true,
          min: 2,
          max: 30,
          isUrl: true,
        })
      ),
    email: Joi.string()
      .required()
      .custom(validateEmail)
      .messages(
        getStringValidationMessages("email", { required: true, isEmail: true })
      ),
    avatar: Joi.string()
      .required()
      .custom(validateUrl)
      .messages(
        getStringValidationMessages("avatar", { required: true, isUrl: true })
      ),
    password: Joi.string()
      .required()
      .messages(getStringValidationMessages("password", { required: true })),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom(validateEmail)
      .messages(
        getStringValidationMessages("email", { required: true, isEmail: true })
      ),
    password: Joi.string()
      .required()
      .messages(getStringValidationMessages("password", { required: true })),
  }),
});

const reqUserSchema = Joi.object()
  .keys({
    _id: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages(
        getStringValidationMessages("user ID", {
          required: true,
          isHex: true,
          length: 24,
        })
      ),
  })
  .unknown(true);

const validateUserId = (req, res, next) => {
  const { _id } = req.user;

  const { error, value } = reqUserSchema.validate(req.user || {}, {
    abortEarly: false,
  });

  if (error) return next(new BadRequestError("Invalid user ID"));

  req.user = value;
  next();
};

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages(
        getStringValidationMessages("Item ID", {
          isHex: true,
          required: true,
          length: 24,
        })
      ),
  }),
});

module.exports = {
  validateItemCreation,
  validateUserCreation,
  validateUserLogin,
  validateUserId,
  validateItemId,
};
