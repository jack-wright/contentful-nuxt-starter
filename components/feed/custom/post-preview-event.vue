<template>
    <article class="c-blog-posts__preview">
        <nuxt-link
            class="c-blog-posts__preview-link"
            :to="`/feed/${feedName}/detail/${post.fields.slug}`">
            <ui-image
                v-if="post.fields.featuredImage"
                :key="post.fields.featuredImage.sys.id"
                class="c-blog-posts__preview-image u-mb-sm"
                :image="post.fields.featuredImage"
                purpose="postPreview" />
            <h3 class="c-blog-posts__preview-title">
                {{post.fields.title}}
            </h3>
        </nuxt-link>
        <p>
            <date :timeStamp="post.sys.createdAt" />
        </p>
    </article>
</template>

<script>
import UiImage from '@/components/UI/image'
import Date from '@/components/feed/date'

export default {
    components: {
        UiImage,
        Date,
    },

    props: {
        post: {
            type: Object,
            default: null,
        },
        feedName: {
            type: String,
            default: null
        }
    }
}
</script>
