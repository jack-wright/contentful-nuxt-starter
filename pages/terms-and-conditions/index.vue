<template>
    <div
        class="l-wrapper"
        :class="{
            'l-wrapper--has-floating-header': hasFloatingHeader
        }">
        <hero
            v-if="pageData.featuredImage"
            class="u-mb-lg"
            :image="pageData.featuredImage"
            :title="settings.config.titleInHero ? pageData.title : null" />
        <div class="l-page l-container">
            <copy-block
                :title="pageData.title"
                :content="pageData.body" />
        </div>
    </div>
</template>

<script>
import Config from '@/config'
import Helpers from '@/services/helpers'
import Meta from '@/services/meta'
import CopyBlock from '@/components/copy-block'
import Hero from '@/components/hero'
import {pauseGTMScrollDepthHandler, resumeGTMScrollDepthHandler} from '@/plugins/gtm/gtm-helpers'

const page = 'terms'

export default {
    head() {
        return Meta.getMeta(this.pageData.title, Helpers.contentDisplay(this.pageData.body), null, this.pageCategory)
    },
    components: {
        CopyBlock,
        Hero,
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
