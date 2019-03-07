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
            :image="pageData.featuredImage">
            <div class="c-page__introduction">
                <img
                    v-if="pageData.brandLogo"
                    class="c-page__brand-logo"
                    :src="pageData.brandLogo.fields.file.url"
                    :alt="pageData.brandLogo.fields.description"
                    :title="pageData.brandLogo.fields.title" />
                <h1
                    v-if="pageData.introductionMessage"
                    class="c-page__heading u-m-none t-heading-2">
                    {{pageData.introductionMessage}}
                </h1>
            </div>
        </hero>
        <div class="l-page l-container">
            <copy-block
                :content="pageData.body" />
            <featured-items
                title="Featured Posts"
                subtitle="Lorem ipsum dolor sit amet"
                :posts="pageData.featuredPosts"
                :showExcerpt="true"
                :cta="true" />
        </div>
    </div>
</template>

<script>
import Config from '@/config'
import CopyBlock from '@/components/copy-block'
import Helpers from '@/services/helpers'
import Meta from '@/services/meta'
import FeaturedItems from '@/components/featured-items'
import Hero from '@/components/hero'
import {pauseGTMScrollDepthHandler, resumeGTMScrollDepthHandler} from '@/plugins/gtm/gtm-helpers'

const page = 'home'

export default {
    head() {
        return Meta.getMeta(this.title, Helpers.contentDisplay(this.pageData.body), this.pageData.featuredImage.fields.file.url, this.pageCategory)
    },

    components: {
        CopyBlock,
        FeaturedItems,
        Hero,
    },

    data() {
        return {
            title: 'Home'
        }
    },

    computed: {
        pageData() {
            return this.$store.state.page.pageData[Config.pages[page].slug].fields
        },
        settings() {
            return this.$store.state.settings
        },
        hasFloatingHeader() {
            return this.settings.config.header.floating
        },
        pageCategory() {
            return Config.pages[page].category
        }
    },

    async fetch({store}) {
        if (!store.state.page.pageData.hasOwnProperty(Config.pages[page].slug)) {
            await store.dispatch('page/GET_PAGE_DATA', {id: Config.pages[page].id})
        }

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
