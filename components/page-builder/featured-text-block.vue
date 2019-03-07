<template>
    <div class="c-featured-text-block">
        <div class="c-featured-text-block__content-container">
            <div class="c-featured-text-block__content l-container l-container--no-padding">
                <copy-block
                    class="c-featured-text-block__text"
                    :content="fields.featuredText" />
                <template v-if="fields.buttonLink">
                    <a
                        :href="fields.buttonLink"
                        class="u-button u-button--cta"
                        v-if="externalLink">
                        {{fields.buttonText}}
                    </a>
                    <nuxt-link
                        v-else
                        class="u-button u-button--cta"
                        :to="fields.buttonLink">
                        {{fields.buttonText}}
                    </nuxt-link>
                </template>
            </div>
        </div>
        <ui-image
            v-if="fields.backgroundImage"
            :class="`c-featured-text-block__background-image ${backgroundImageSizeClass}`"
            purpose="hero"
            :image="fields.backgroundImage" />
        <div
            v-if="!fields.backgroundImage"
            :class="`c-featured-text-block__background ${backgroundSizeClass}`" />
    </div>
</template>

<script>
import CopyBlock from '@/components/copy-block'
import UiImage from '@/components/UI/image'

export default {
    components: {
        CopyBlock,
        UiImage
    },
    props: {
        fields: {
            type: Object,
            default: null
        }
    },
    computed: {
        backgroundImageSizeClass() {
            return `c-featured-text-block__background-image--${this.fields.backgroundSize.toLowerCase()}`
        },

        backgroundSizeClass() {
            return `c-featured-text-block__background--${this.fields.backgroundSize.toLowerCase()}`
        },

        externalLink() {
            return this.isRelativeLink(this.fields.buttonLink)
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
        isRelativeLink(link) {
            let regex = new RegExp('^(https|http):\/\/|(www)|(\\.)', 'i')

            return regex.test(link)
        }
    }
}
</script>
