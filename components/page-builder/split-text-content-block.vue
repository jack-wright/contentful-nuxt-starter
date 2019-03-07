<template>
<div :class="['l-container--page-builder', {'c-page__divider': fields.dividingLine}]">
    <div :class="`c-split-content-block ${splitContentBlockClass}`">
        <div class="c-split-content-block__copy-container c-split-content-block__featured-text">
            <copy-block :content="fields.featuredText" />
        </div>
        <div class="c-split-content-block__copy-container">
            <div class="c-split-content-block__copy">
                <copy-block :content="fields.nonFeaturedText" />
                <template v-if="fields.buttonLink">
                    <a
                        :href="fields.buttonLink"
                        class="u-button"
                        v-if="externalLink">
                        {{fields.buttonText}}
                    </a>
                    <nuxt-link
                        v-else
                        class="u-button"
                        :to="fields.buttonLink">
                        {{fields.buttonText}}
                    </nuxt-link>
                </template>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Helpers from '@/services/helpers'
import CopyBlock from '@/components/copy-block'

export default {
    components: {
        CopyBlock
    },
    props: {
        fields: {
            type: Object,
            default: null,
            required: true
        }
    },
    computed: {
        splitContentBlockClass() {
            return `c-split-content-block--${this.fields.featuredTextPosition}`
        },

        externalLink() {
            return this.checkIfRelativeLink(this.fields.buttonLink)
        }
    },
    methods: {
        /**
         * Pass through the button link string and check whether it passes
         * the regex, which deciphers whether or not it is a relative or
         * absolute url by checking if contains a protocol/www/or a fullstop
         *
         * @param string - URL that the button links to
         * @return bool - If a relative link, returns true, else returns false
         */
        checkIfRelativeLink(link) {
            let regex = new RegExp('^(https|http):\/\/|(www)|(\\.)', 'i')
            return regex.test(link)
        }
    }
}
</script>
