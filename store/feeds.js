/**
  * Feed data store
  * @author GW - Breakthrough Media
  *
  * @desc stores paginated feed posts and post taxonomy categories. The store's
  * feedList is created from config.js as well as the feed taxonomies. See
  * readme.md for configuration options.
  *
  * Note that the store only stores one page of posts per feed. Each pagination
  * or taxonomy page request overwrites the feed's store data.
  *
  * @requied config.js
  * @requied services/contentful/api.js
  * @requied services/helpers.js
*/
import Vue from 'vue'
import Helpers from '@/services/helpers'
import Config from '@/config'
import ContentfulService from '@/services/contentful/api'

/**
  * initialise the feedList state from config.js. data props need to be set
  * otherwise we can't use Vue.set() in our mutations.
  */
const state = () => {
    const state = {
        feedList: Config.feeds
    }

    for (let i = 0; i < state.feedList.length; i++) {
        let feed = state.feedList[i]

        feed.data = {}

        if (feed.taxonomies) {
            for (let x = 0; x < feed.taxonomies.length; x++) {
                feed.taxonomies[i].data = {}
            }
        }
    }

    return state
}

const mutations = {
    /**
      * @param string payload.feedName - name of feed in the store to mutate data on
      * @param object payload.data - data from contentful to be added to the feed object
      */
    SET_POST_DATA(state, payload) {
        const feed = Helpers.getObjectByContentType(state.feedList, payload.feedName)
        if (feed) {
            Vue.set(feed, 'data', payload.data)
        }
    },

    /**
      * @param string payload.feedName - name of feed in the store to mutate data on
      * @param string payload.taxonomyName - name of feed's taxonomy list to mutate data on
      * @param object payload.data - data from contentful to be added to the feed's taxonomy list
      */
    SET_TAXONOMY_DATA(state, payload) {
        const feed = Helpers.getObjectByContentType(state.feedList, payload.feedName)
        if (feed && feed.taxonomies) {
            let taxonomy = Helpers.getObjectByName(feed.taxonomies, payload.taxonomyName)
            if (taxonomy) {
                Vue.set(taxonomy, 'data', payload.data)
            }
        }
    },
}

const actions = {
    /**
      * gets feed data from the contenful api, the defaults are overriden in config.js, see readme.md
      * @param string feedName - contentful 'content_type' to query
      * @param integer pageNumber - used to offset and limit posts to create post pages
      * @param string orderBy - contentful sorting order
      * @param object query - taken from the url query paramater, used to query taxonomies
      */
    async GET_FEED_DATA({
        commit,
        state,
    }, {
        feedName,
        pageNumber = 1,
        orderBy = '-sys.createdAt',
        query = false,
    }) {
        const feed = Helpers.getObjectByContentType(state.feedList, feedName)
        const data = await ContentfulService.getFeedPostsByPageNumber(
            feedName,
            pageNumber,
            feed.postsPerPage,
            orderBy,
            query,
        )
        commit('SET_POST_DATA', {feedName: feedName, data: data})
    },

    /**
      * gets all feed taxonomy data from the contenful api, see readme.md
      * @param array taxonomies - array of contentful 'content_type's to query
      * @param string feedName - the feedname in the store to set the taxonomy data on
      */
    async GET_FEED_TAXONOMY_DATA({
        commit,
    }, {
        taxonomies,
        feedName,
    }) {
        for (let taxonomy of taxonomies) {
            const data = await ContentfulService.getAllFeedPosts(taxonomy.contentType, 'fields.title')
            commit('SET_TAXONOMY_DATA', {feedName: feedName, taxonomyName: taxonomy.name, data: data})
        }
    },
}

export default {
    state,
    mutations,
    actions,
}
