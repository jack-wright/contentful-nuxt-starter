<template>
    <div class="l-container">
        <h1>{{pageData.title}}</h1>
		<copy-block :content="pageData.introduction"/>
		<faq-block :sections="pageData.sections" />
    </div>
</template>

<script>
import CopyBlock from '@/components/copy-block'
import FaqBlock from '@/components/faq/faq-block'
import Helpers from '@/services/helpers'
import Config from '@/config'
import Meta from '@/services/meta'
import { pauseGTMScrollDepthHandler, resumeGTMScrollDepthHandler } from '@/plugins/gtm/gtm-helpers'

const page = 'faq'

export default {
    head() {
        return Meta.getMeta(this.pageData.title, Helpers.contentDisplay(this.pageData.introduction), null, this.pageCategory)
    },
	components: {
		CopyBlock,
		FaqBlock
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
