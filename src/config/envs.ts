import * as env from 'env-var'
import 'dotenv/config'; //Carga las variables del archivo .env antes de leerlas

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),

    MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
    MAILER_USER: env.get('MAILER_USER').required().asString(),
    MAILER_PASSWORD: env.get('MAILER_PASSWORD').required().asString(),
    MAPBOX_TOKEN: env.get('MAPBOX_TOKEN').required().asString(),

    DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
    DB_NAME: env.get('DB_NAME').required().asString(),
    DB_USER: env.get('DB_USER').required().asString(),
    DB_HOST: env.get('DB_HOST').required().asString(),
    DB_PORT: env.get('DB_PORT').required().asPortNumber(),
    DB_TYPE: env.get('DB_TYPE').required().asString(),
    
}