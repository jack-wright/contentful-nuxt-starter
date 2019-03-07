<template>
    <div class="l-page-builder">
        <div
            v-for="(block, index) in blocks"
            :key="index"
            :class="['l-page-builder__module', 
                {'l-page-builder__module--no-margin': block.fields.hasOwnProperty('marginBottom') && !block.fields.marginBottom}]">

            <div
                class="c-page__section l-container--page-builder"
                v-if="block.sys && block.sys.contentType.sys.id === 'bodyText'">
                <copy-block :content="block.fields.copy" />
            </div>

            <div
                class="c-page__section l-container--page-builder"
                v-if="block.sys && block.sys.contentType.sys.id === 'form'">
                <form-block />
            </div>

            <div
                class="c-page__section l-container--page-builder"
                v-if="block.sys && block.sys.contentType.sys.id === 'splitContentBlock'">
                <split-content-block :fields="block.fields" />
            </div>

            <div
                class="c-page__section l-container--page-builder"
                v-if="block.sys && block.sys.contentType.sys.id === 'videoSplitContentBlock'">
                <video-split-content-block :fields="block.fields" />
            </div>

            <div
                :class="['c-page__section', {'c-page__section--colored': block.fields.colouredBackground }]"
                v-if="block.sys && block.sys.contentType.sys.id === 'splitTextModule'">
                <split-text-content-block :fields="block.fields" />
            </div>

            <div
                class="c-page__section l-container--page-builder"
                v-if="block.sys && block.sys.contentType.sys.id === 'videoBlock' && block.fields.size === 'container'">
                <video-block :fields="block.fields" />
            </div>

            <video-block
                v-else-if="block.sys && block.sys.contentType.sys.id === 'videoBlock' && block.fields.size === 'full'"
                :fields="block.fields" />

            <div
                class="c-page__section l-container--page-builder"
                v-if="block.sys && block.sys.contentType.sys.id === 'imageBlock' && block.fields.size === 'container'">
                <image-block :fields="block.fields" />
            </div>

            <div
                class="c-page__section l-container--page-builder"
                v-if="block.sys && block.sys.contentType.sys.id === 'postBlock'">
                <post-block :fields="block.fields" />
            </div>

            <image-block
                v-else-if="block.sys && block.sys.contentType.sys.id === 'imageBlock' && block.fields.size === 'full'"
                :fields="block.fields" />

            <featured-text-block
                v-if="block.sys && block.sys.contentType.sys.id === 'featuredTextBlock'"
                :fields="block.fields" />
        </div>
    </div>
</template>

<script>
import CopyBlock from '@/components/copy-block'
import FeaturedTextBlock from '@/components/page-builder/featured-text-block'
import FormBlock from '@/components/form'
import ImageBlock from '@/components/page-builder/image-block'
import PostBlock from '@/components/page-builder/post-block'
import SplitContentBlock from '@/components/page-builder/split-content-block'
import SplitTextContentBlock from '@/components/page-builder/split-text-content-block'
import VideoBlock from '@/components/page-builder/video-block'
import VideoSplitContentBlock from '@/components/page-builder/video-split-content-block'

export default {
    components: {
        CopyBlock,
        FeaturedTextBlock,
        FormBlock,
        ImageBlock,
        PostBlock,
        SplitContentBlock,
        SplitTextContentBlock,
        VideoBlock,
        VideoSplitContentBlock
    },
    props: {
        blocks: {
            type: Array,
            default: null
        }
    }
}
</script>
