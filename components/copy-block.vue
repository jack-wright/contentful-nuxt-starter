<template>
    <section class="s-page">
        <h1 v-if="title && !settings.config.titleInHero">
            {{title}}
        </h1>
        <div :class="['l-page', {'l-page--contact': form}]">
            <div
                ref="bodyContentContainer"
                v-html="bodyContent"></div>
            <form-block
                v-if="form"
                :type="form" />
        </div>
        <nuxt-link
            v-if="backLink"
            :to="backLink"
            class="u-button">
            {{lang.copyBlock.back}}
        </nuxt-link>
        <style v-if="css">
            {{css}}
        </style>
    </section>
</template>

<script>
import LazyLoadDirective from '@/directives/LazyLoadDirective'
import YtPlayerDirective from '@/directives/YoutubePlayerDirective'
import Helpers from '@/services/helpers'
import FormBlock from '@/components/form'

export default {
    components: {
        FormBlock,
    },

    props: {
        title: {
            type: String,
            default: null
        },
        content: {
            type: Object,
            default: null
        },
        backLink: {
            type: Boolean,
            default: false
        },
        form: {
            type: String,
            default: null
        },
        share: {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            css: ''
        }
    },

    computed: {
        bodyContent() {
            return Helpers.contentDisplay(this.content)
        },
        lang() {
            return this.$store.state.lang
        },
        settings() {
            return this.$store.state.settings
        },
    },

    mounted() {
        this.setupLazyImages()
        this.setupYtPlayers()
    },

    methods: {
        /**
         * Loop through each image, applying the directive to it
         */
        setupLazyImages() {
            let images = this.$refs.bodyContentContainer.querySelectorAll('.js-lazy-loading')
            let imageData = []

            if (images) {
                for (let i = 0; i < images.length; i++) {
                    let el = images[i]
                    el.lazy = true
                    LazyLoadDirective.inserted(el)
                    let img = el.querySelector('img')
                    imageData.push({
                        id: el.id,
                        ratio: el.dataset.ratio,
                        width: img.getAttribute('width')
                    })
                }
            }

            this.createImageCSS(imageData)
        },

        createImageCSS(images) {
            let html = ''

            for (let i = 0; i < images.length; i++) {
                let image = images[i]
                if (image.id) {
                    if (image.width) {
                        html += `#${image.id} {`
                            + `    max-width: ${image.width}px;`
                            + '} '
                    }
                    if (image.ratio) {
                        html += `#${image.id} .c-image__container::before {`
                            + `    padding-bottom: ${image.ratio}%;`
                            + '} '
                    }
                }
            }

            this.css = html
        },

        setupYtPlayers() {
            let nodes = this.$refs.bodyContentContainer.childNodes

            for (let i = 0; i < nodes.length; i++) {
                let el = nodes[i]
                let match = el.innerText.match('^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?\.com|youtu\.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)')
                if (match){
                    YtPlayerDirective.inserted(el, match[1])
                }
            }
        },
    },
}
</script>
