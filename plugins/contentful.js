// @nuxtjs/dotenv plugin not available in nuxt generate command, use webpack require
import env from '../env'

const contentful = require('contentful')
const config = {
    space: env.CONTENTFUL_SPACE_ID,
    accessToken: env.CONTENTFUL_CDA_ACCESS_TOKEN
}

export const createClient = () => {
    return contentful.createClient(config)
}
