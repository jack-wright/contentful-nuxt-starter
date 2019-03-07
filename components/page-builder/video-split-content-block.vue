<template>
    <div :class="`c-split-content-block ${splitContentBlockClass}`">
        <ui-video
            v-if="fields.youtubeUrl"
            class="c-hero__video c-split-content-block__image"
            :videoSrc="fields.youtubeUrl"
            :youtubeId="videoID"
            :autoplay="false"
            :shade="false" />
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
import UiVideo from '@/components/UI/video'
import Helpers from '@/services/helpers'

export default {
    components: {
        UiVideo
    },
    props: {
        fields: {
            type: Object,
            default: null
        }
    },
    computed: {
        splitContentBlockClass() {
            return `c-split-content-block--${this.fields.videoPosition}`
        },

        videoID() {
            if (Helpers.isYoutubeURLvalid(this.fields.youtubeUrl)) {
                return Helpers.getYoutubeId(this.fields.youtubeUrl)
            } else {
                return null
            }
        },

        externalLink() {
            return Helpers.checkIfRelativeLink(this.fields.buttonLink)
        }
    },
}
</script>
