<template>
    <div class="c-blog-posts__preview">
        <ui-image
            v-if="post.fields.featuredImage"
            :image="post.fields.featuredImage" />

        <div class="l-container">
            <h1>{{post.fields.title}}</h1>

            <copy-block
                v-if="post.fields.body"
                class="u-mb-lg"
                :content="post.fields.body" />

            <ui-share
                :description="description"
                :postTitle="post.fields.title"
                :url="url"
                class="u-mb-lg" />

            <feed-form
                v-if="feedConfig.form"
                :type="feedConfig.form"
                :eventName="post.fields.title"
                :title="lang.feed.events.register" />

            <nuxt-link
                class="c-blog-posts__back"
                :to="`/feed/${feedName}`">
                {{lang.feed.events.back}}
            </nuxt-link>
        </div>
    </div>
</template>

<script>
import Helpers from '@/services/helpers'
import meta from '@/services/meta'
import UiImage from '@/components/UI/image'
import UiShare from '@/components/UI/share'
import CopyBlock from '@/components/copy-block'
import FeedForm from '@/components/feed/feed-form'

export default {

    components: {
        UiImage,
        UiShare,
        CopyBlock,
        FeedForm,
    },

    props: {
        post: {
            type: Object,
            default: null,
        }
    },

    computed: {
        lang() {
            return this.$store.state.lang
        },
        feedConfig() {
            return Helpers.getObjectByContentType(
                this.$store.state.settings.config.feeds,
                this.$route.params.feedname,
            )
        },
        feedName() {
            return this.$route.params.feedname
        },
        description() {
            return meta.createMetaDescription(this.post.fields.body)
        },
        url() {
            if (process.browser) {
                return window.location.href
            }
            return ''
        },
    }
}
</script>
