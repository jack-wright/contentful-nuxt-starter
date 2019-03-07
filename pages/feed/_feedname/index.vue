<template>
    <div
        class="l-wrapper"
        :class="{
            'l-wrapper--has-floating-header': hasFloatingHeader
        }">
        <hero
            v-if="pageData.featuredImage"
            class="u-mb-lg"
            size="small"
            :lazy="false"
            :image="pageData.featuredImage"
            :title="settings.config.titleInHero ? pageData.title : null" />
        <div class="l-page l-container">
            <copy-block
                v-if="pageData.body"
                class="c-page__section--archive"
                :title="pageData.title"
                :content="pageData.body" />
            <div ref="postScrollAnchor"></div>
            <div class="u-pt-std">
                <div class="c-blog-posts__nav u-mb-std">
                    <taxonomy-nav
                        v-for="(taxonomy, index) in taxonomies"
                        :key="index"
                        :feedName="currentFeed.contentType"
                        :taxonomy="taxonomy" />
                    <div v-if="maxPages">
                        <span class="u-badge--clear">
                            {{pageNumber}}/{{maxPages}}
                        </span>
                    </div>
                </div>
                <div
                    v-if="firstLoad"
                    class="c-blog-posts__section">
                    <post-preview-loading
                        v-for="n in 4"
                        :key="n" />
                </div>
                <template v-else>
                    <transition-group
                        v-if="posts"
                        tag="section"
                        name="fade"
                        class="c-blog-posts__section"
                        :class="{ 'c-blog-posts__section--loading': loading }">
                        <component
                            :is="previewComponent"
                            v-for="post in posts"
                            :key="post.sys.id"
                            :feedName="currentFeed.contentType"
                            :feedTaxonomies="currentFeed.taxonomies"
                            :post="post" />
                    </transition-group>
                    <post-pagination
                        :feedName="currentFeed.contentType"
                        :pageNumber="pageNumber"
                        :maxPages="maxPages" />
                    <h2
                        v-if="!posts && !loading"
                        class="u-mb-xl">
                        {{lang.feed.default.noPosts}}
                    </h2>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
/**
  * Dyanmic feed page
  * @author GW - Breakthrough Media
  *
  * @desc fetches paginated posts from the contentful API by URL params and URL
  * query strings. This page relies heavily on the settings in config.js, see
  * readme.md for more information regarding configuring custom post templates,
  * postsPerPage count and post taxonomy settings.
  *
  * @requied store/feeds.js
  * @requied services/helpers.js
*/
import Config from '@/config'
import PostPagination from '@/components/feed/post-pagination'
import TaxonomyNav from '@/components/feed/taxonomy-nav'
import CopyBlock from '@/components/copy-block'
import Hero from '@/components/hero'
import PostPreviewLoading from '@/components/feed/post-preview-loading'
import Helpers from '@/services/helpers'
import Meta from '@/services/meta'
import animateScrollTo from 'animated-scroll-to'
import {pauseGTMScrollDepthHandler, resumeGTMScrollDepthHandler} from '@/plugins/gtm/gtm-helpers'

export default {
    head() {
        return this.pageData ?
            Meta.getMeta(this.pageData.title, Helpers.contentDisplay(this.pageData.body), this.pageData.featuredImage.fields.file.url, this.pageCategory) :
            {title: 'Feed', titleTemplate: '%s | ' + this.$store.state.settings.config.titleSuffix}
    },

    components: {
        CopyBlock,
        Hero,
        PostPagination,
        TaxonomyNav,
        PostPreviewLoading,
    },

    data() {
        return {
            firstLoad: true,
            loading: true,
            /**
          * if the feed is configured to use a custom template use it instead
          * of the c-post-preview-default. See readme.me for more info
          * @return imported vue component
        */
            previewComponent: () => {
                const c = this.currentFeed.previewComponent ?
                    `custom/${this.currentFeed.previewComponent}` :
                    'defaults/post-preview-default'
                return import(`@/components/feed/${c}`)

            },
        }
    },

    computed: {
        /*
         * gets the parent page data from the store by name
         * @return object
        */
        pageData() {
            return this.currentFeed.parent ?
                this.$store.state.page.pageData[this.currentFeed.parent.ref].fields :
                false
        },

        /*
         * gets the current feed object from the data store
         * @return object
        */
        currentFeed() {
            return Helpers.getObjectByContentType(
                this.$store.state.feeds.feedList,
                this.$route.params.feedname,
            )
        },


        /*
         * gets the current page number from the route
         * @return integer
        */
        pageNumber() {
            return Number(this.$route.query.page) || 1
        },

        /*
         * calculates the maximum number of possible pages from the data store
         * total post count and the feed.config postPerPage property
         * @return integer
        */
        maxPages() {
            const limit = this.currentFeed.postsPerPage || 10
            return this.currentFeed.data && this.currentFeed.data.items ?
                Math.ceil(this.currentFeed.data.total / limit) :
                0
        },

        /*
         * gets the current page's posts from the data store
         * @return array of posts - [post, post] or []
        */
        posts() {
            return this.currentFeed.data.items
        },

        /**
          * if the feed is configured to use a taxonomies get them from the
          * current feed object
          * @return array of taxonomies or []
        */
        taxonomies() {
            return this.currentFeed.taxonomies ?
                this.currentFeed.taxonomies :
                []
        },

        /**
          * gets the settings from the store
          * @return object
        */
        settings() {
            return this.$store.state.settings
        },

        hasFloatingHeader() {
            return this.settings.config.header.floating
        },

        lang() {
            return this.$store.state.lang
        },

        pageCategory() {
            return this.currentFeed.category
        }
    },

    /**
      * vue setting to listen for query string changes
    */
    watch: {
        '$route.query': 'pageChanged',
    },

    /**
      * fetch feed posts on mount based on query params. Posts cannot be loaded
      * in the async fetch() method otherwise we'll be making two requests
    */
    mounted() {
        this.pageChanged()
    },

    async fetch({store, params, redirect}) {
        /**
          * if no URL feedname param is provided redirect to the site's homepage
        */
        if (!params.feedname){
            redirect('/')
        }

        /**
          * fetch the config settings from the store
        */
        if (!store.state.settings.fields.length) {
            await store.dispatch('settings/GET_SITE_SETTINGS')
        }

        /**
          * select the correct feed from the store by URL param
          * eg: /feed/blog/
        */
        let feed = Helpers.getObjectByContentType(
            store.state.settings.config.feeds,
            params.feedname,
        )

        /**
          * if the feed has a parent page setting configured query it to get
          * content for the feed page
        */
        if (feed.parent){
            await store.dispatch('page/GET_PAGE_DATA', {
                id: feed.parent.id,
            }
            )
        }

        /**
          * if the feed has taxonomy settings configured query the taxonomies to
          * get the content for each taxonomy
        */
        if (feed.taxonomies){
            await store.dispatch('feeds/GET_FEED_TAXONOMY_DATA', {
                feedName: params.feedname,
                taxonomies: feed.taxonomies,
            })
        }
    },

    methods: {
        pageChanged() {
            /**
              * on this template on every page change we need to pause the
              * google tag manager scroll depth listener to prevent scroll
              * events firing if the window scroll position is altered
              * between pages
            */
            pauseGTMScrollDepthHandler()
            this.loading = true

            if (this.firstLoad) {
                this.fetchPosts()
            } else {
                /*
                 * we can't use element.scrollIntoView() due to it being
                 * inconsistent and buggy with this page. Also we need a callback
                 * to be able to delay the data request and re-enable the gtm scroll handler
                */
                animateScrollTo(
                    this.$refs.postScrollAnchor, {
                        maxDuration: 400,
                        minDuration: 400,
                        onComplete: async () => {
                            this.fetchPosts()
                        }
                    }
                )
            }

        },

        async fetchPosts() {
            await this.$store.dispatch('feeds/GET_FEED_DATA', {
                feedName: this.currentFeed.contentType,
                pageNumber: this.pageNumber,
                orderBy: this.currentFeed.orderBy,
                query: Helpers.getFeedQueryWithoutPageNum(this.$route.query),
            }
            )
            this.firstLoad = false
            this.loading = false
            /**
              * restart the google tag manager scrolldepth listener
              * after short timeout
            */
            setTimeout(resumeGTMScrollDepthHandler(), 500)
        },
    },

    /**
      * currently on every template we need to pause the google tag manager
      * scroll deoth listener to prevent scroll events firing if the window
      * scroll position is altered between pages
    */
    beforeRouteEnter(to, from, next) {
        pauseGTMScrollDepthHandler()
        next(resumeGTMScrollDepthHandler)
    },
}
</script>
