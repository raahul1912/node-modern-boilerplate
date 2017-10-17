import * as Joi from 'joi'

export interface IConfig {
  NODE_ENV?: string
  PORT?: number
  JWT_SECRET?: string
  MAILGUN_API_KEY?: string
  MAILGUN_DOMAIN?: string
  EMAIL_FORGOT_SECRET?: string
  EMAIL_VERIFY_SECRET?: string
  DATABASE_HOST?: string
  DATABASE_PORT?: number
  DATABASE_USERNAME?: string
  DATABASE_PASSWORD?: string
  DATABASE_NAME?: string
  AWS_ACCESS_KEY?: string
  AWS_SECRET?: string
  AWS_REGION?: string
}

// require and configure dotenv, will load vars in .env in PROCESS.ENV
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// define validation for all the env vars
const allowedEnvKeys: Joi.SchemaMap = {
  NODE_ENV: Joi.string()
    .valid(['development', 'production', 'test'])
    .required(),
  PORT: Joi.number().default(4040).required(),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MAILGUN_API_KEY: Joi.string().required(),
  MAILGUN_DOMAIN: Joi.string().required(),
  EMAIL_FORGOT_SECRET: Joi.string().required(),
  EMAIL_VERIFY_SECRET: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET: Joi.string().required(),
  AWS_REGION: Joi.string().required()
}

let envVarsSchema = Joi.object(allowedEnvKeys).unknown().required()

if (process.env.NODE_ENV === 'production') {
  const envVarsProduction = Joi.object({

  })

  envVarsSchema = envVarsSchema.concat(envVarsProduction)
}

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const envKeys = Object.keys(allowedEnvKeys)

const config: IConfig = {}

for (const key of envKeys) {
  config[key] = envVars[key]
}

export default config
