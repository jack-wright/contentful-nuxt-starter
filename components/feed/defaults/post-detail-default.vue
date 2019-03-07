<template>
    <div class="c-blog-posts__preview">
        <ui-image :image="post.fields.featuredImage" />

        <div class="l-container">
            <h1 class="t-heading-1">
                {{post.fields.title}}
            </h1>

            <date :timeStamp="post.fields.assignedPublishedDate" />

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
                :title="lang.feed.default.contactTitle" />

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
import Date from '@/components/feed/date'

export default {
    components: {
        UiImage,
        UiShare,
        CopyBlock,
        FeedForm,
        Date,
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
            let feedname = this.$route.params.feedname
            return Helpers.getObjectByContentType(this.$store.state.settings.config.feeds, feedname)
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
