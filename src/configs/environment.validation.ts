import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('development'),
  API_VERSION: Joi.string().default('0.0.1'),

  DATABASE_PORT: Joi.number().port().default(3306),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().default(false),
  DATABASE_AUTOLOAD: Joi.boolean().default(false),

  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),

  CLOUDINARY_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),

  VNP_TMN_CODE: Joi.string().required(),
  VNP_HASH_SECRET: Joi.string().required(),
  VNP_URL: Joi.string().uri().required(),
  VNP_RETURN_URL: Joi.string().uri().required(),
  VNP_IPN_URL: Joi.string().uri().required(),
});
