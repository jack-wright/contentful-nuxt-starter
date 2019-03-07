<template>
    <div class="l-page-builder__module--video">
        <ui-video
            v-if="fields.url"
            class="c-hero__video"
            :poster="fields.poster"
            :videoSrc="fields.url"
            :youtubeId="videoID"
            :autoplay="false"
            :shade="false" />
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
        videoID() {
            if (Helpers.isYoutubeURLvalid(this.fields.url)) {
                return Helpers.getYoutubeId(this.fields.url)
            } else {
                return null
            }
        },
    },
}
</script>
