<template>
    <div :class="`c-split-content-block ${splitContentBlockClass}`">
        <ui-image
            v-if="fields.featuredImage"
            class="c-split-content-block__image"
            purpose="hero"
            :image="fields.featuredImage" />
        <div
            v-if="!fields.featuredImage"
            class="c-split-content-block__background"></div>
        <div class="c-split-content-block__copy-container">
            <div class="c-split-content-block__copy">
                <h2 class="c-split-content-block__heading t-heading-1">{{fields.heading}}</h2>
                <p class="c-split-content-block__text">{{fields.text}}</p>
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
</template>

<script>
import UiImage from '@/components/UI/image'

export default {
    components: {
        UiImage
    },
    props: {
        fields: {
            type: Object,
            default: null
        }
    },
    computed: {
        splitContentBlockClass() {
            return `c-split-content-block--${this.fields.imagePosition}`
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
