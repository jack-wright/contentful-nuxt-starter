<template>
    <div>
        <hero
            v-if="pageData.featuredImage"
            class="u-mb-lg"
            size="small"
            :lazy="false"
            :image="pageData.featuredImage"
            :title="settings.config.titleInHero ? pageData.title : null" />
        <page-builder :blocks="pageData.pageBuilder" />
    </div>
</template>

<script>
import Config from '@/config'
import Hero from '@/components/hero'
import Helpers from '@/services/helpers'
import Meta from '@/services/meta'
import PageBuilder from '@/components/page-builder/page-builder-template'
import { pauseGTMScrollDepthHandler, resumeGTMScrollDepthHandler } from '@/plugins/gtm/gtm-helpers'

const page = 'pageBuilder'

export default {
    head() {
        return Meta.getMeta(this.pageData.title, Helpers.contentDisplay(this.pageData.body), null, this.pageCategory)
    },
    components: {
        PageBuilder,
        Hero,
    },
    computed: {
        pageData() {
            return this.$store.state.page.pageData[Config.pages[page].slug].fields
        },
        settings() {
            return this.$store.state.settings
        },
        pageCategory() {
            return Config.pages[page].category
        }
    },
    async fetch({ store }) {
        if (!store.state.page.pageData.hasOwnProperty(Config.pages[page].slug)) {
            await store.dispatch('page/GET_NESTED_ENTRIES', {id: Config.pages[page].id})
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
