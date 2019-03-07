import {createClient} from '../../plugins/contentful'

const client = createClient()

const api = {
    async getPage(clientID) {
        try {
            return await client.getEntry(clientID)
        } catch(error) {
            console.log(error)
        }
    },

    async getFeedPostsByPageNumber(
        feedName,
        pageNumber = 1,
        postsPerPage = 10,
        orderBy = '-sys.createdAt',
        query = false,
    ) {
        let args = {
            content_type: feedName,
            order: orderBy,
            skip: (pageNumber - 1) * postsPerPage,
            limit: postsPerPage,
        }

        /**
          * if there's a query object taken from the url's query params, loop
          * over each object of the query to build the contentful api query key
          * value pairs and append them to the args object.
          */
        if (query) {
            for (let key of Object.keys(query)) {
                let obj = {}
                obj[`fields.${key}.sys.contentType.sys.id`] = key
                obj[`fields.${key}.fields.slug[all]`] = query[key]
                args = {...args, ...obj}
            }
        }

        try {
            return await client.getEntries(args)
        } catch(error) {
            console.log(error)
        }
    },

    async getAllFeedPosts(
        feedName,
        orderBy = '-sys.createdAt',
    ) {
        let args = {
            content_type: feedName,
            order: orderBy,
        }

        try {
            return await client.getEntries(args)
        } catch(error) {
            console.log(error)
        }
    },

    async getPostBySlug({feedname, slug}) {
        let args = {
            content_type: feedname,
            'fields.slug[in]': slug,
        }

        try {
            return await client.getEntries(args)
        } catch(error) {
            console.log(error)
        }
    },

    async getAllPages() {
        try {
            return await client.getEntries({})
        } catch(error) {
            console.log(error)
        }
    },

    async getSettings() {
        let args = {
            content_type: 'settings',
            'fields.title': 'Settings'
        }

        try {
            return await client.getEntries(args)
        } catch(error) {
            console.log(error)
        }
    },

    async getNestedEntries(page) {
        let args = {
            'sys.id': page,
            include: 2
        }

        try {
            return await client.getEntries(args)
        } catch(error) {
            console.log(error)
        }
    },
}

export default api
