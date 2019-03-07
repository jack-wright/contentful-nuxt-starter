<template>
    <div
        class="c-video u-video-aspect-ratio"
        :class="{
            'c-video--has-shade': shade
        }">
        <div
            v-if="youtubeId"
            ref="youtubeElem"
            class="c-video__youtube"></div>
        <video
            v-else-if="videoSrc"
            class="c-video__video"
            ref="videoRef"
            :poster="poster"
            :src="embedUrl"
            muted
            loop
            webkit-playsinline
            playsinline></video>
    </div>
</template>

<script>
import YoutubePlayer from '@/plugins/youtube-player/youtube-player'
import Helpers from '@/services/helpers'

/**
 * @desc This component can accept EITHER:
 * youtubeId: ID of a Youtube video. If filled, the video's play state will be
 * tracked by GTM.
 * OR
 * videoSrc: URL of a video for the src attribute of the <video> component. The
 * 'poster' prop should also be set, with the path of the poster image to use.
 */
export default {
    props: {
        youtubeId: {
            type: String,
            default: null,
        },
        videoSrc: {
            type: String,
            default: null,
        },
        poster: {
            type: String,
            default: null,
        },
        autoplay: {
            type: Boolean,
            default: false,
        },
        shade: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            player: null
        }
    },

    computed: {
        embedUrl() {
            if (this.videoSrc.search(/youtube.com/i) && this.videoSrc.search(/watch?v=/i)) {
                let id = Helpers.getYoutubeId(this.videoSrc)
                return id ? this.getYoutubeEmbedUrl(id) : this.videoSrc

            } else {
                return this.videoSrc
            }
        }
    },

    mounted() {
        if (this.youtubeId) {
            this.player = new YoutubePlayer({
                element: this.$refs.youtubeElem,
                videoId: this.youtubeId,
                waypoints: [10, 20, 40, 60, 80, 95],
                debug: false,
            })
        } else if (this.videoSrc) {
            if (this.autoplay) {
                this.playHtml5Video(this.$refs.videoRef)
            }
        }
    },

    beforeDestroy() {
        if (this.player) {
            this.player.destroy()
        }
    },

    methods: {
        async playHtml5Video(videoElem) {
            try {
                await videoElem.play()
            } catch(error) {
                console.log(error);
            }
        },

        getYoutubeEmbedUrl(id) {
            return '//www.youtube.com/embed/' + id
        }
    },
}
</script>
