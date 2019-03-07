<template>
    <component
        :is="dynamicDetailComponent"
        :post="post" />
</template>

<script>
import Helpers from '@/services/helpers'
import Meta from '@/services/meta'
import {pauseGTMScrollDepthHandler, resumeGTMScrollDepthHandler} from '@/plugins/gtm/gtm-helpers'

export default {
    head() {
        const image = this.post.fields.featuredImage ? this.post.fields.featuredImage.fields.file.url : undefined
        return Meta.getMeta(this.post.fields.title, this.post.fields.body, image, this.pageCategory)
    },

    computed: {
        post() {
            return this.$store.state.post.currentPost
        },

        feedName() {
            return this.$route.params.feedname
        },

        feed() {
            return Helpers.getObjectByContentType(this.$store.state.settings.config.feeds, this.feedName)
        },

        dynamicDetailComponent() {
            const c = this.feed.detailComponent ?
                `custom/${this.feed.detailComponent}` :
                'defaults/post-detail-default'

            return () => import(`@/components/feed/${c}`)
        },

        pageCategory() {
            return this.feed.detailCategory
        }
    },

    async fetch({store, params}) {
        await store.dispatch('post/GET_POST_BY_SLUG', params)

        if (!store.state.settings.fields.length) {
            await store.dispatch('settings/GET_SITE_SETTINGS')
        }
    },

    beforeRouteEnter(to, from, next) {
        pauseGTMScrollDepthHandler()
        next(resumeGTMScrollDepthHandler)
    },
}
</script>
