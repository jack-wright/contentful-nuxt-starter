<template>
    <div class="c-hero">
        <div class="c-hero__content">
            <div
                v-if="title"
                class="c-hero__title t-heading-1">
                {{title}}
            </div>
            <slot v-if="!title"></slot>
        </div>
        <ui-image
            v-if="image && !video"
            class="c-hero__image"
            :size="size"
            :hideIcon="hasSlotContent"
            :lazy="lazy"
            :image="image" />
        <ui-video
            v-if="video"
            class="c-hero__video"
            :poster="image.fields.file.url"
            :videoSrc="video"
            :autoplay="true"
            :shade="true" />
    </div>
</template>

<script>
import UiImage from '@/components/UI/image'
import UiVideo from '@/components/UI/video'

export default {
    components: {
        UiImage,
        UiVideo,
    },
    props: {
        image: {
            type: Object,
            default: null,
        },
        lazy: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: null,
        },
        title: {
            type: String,
            default: null,
        },
        video: {
            type: String,
            default: null,
        }
    },

    computed: {
        hasSlotContent() {
            return Boolean(this.$slots.default)
        }
    }
}
</script>
