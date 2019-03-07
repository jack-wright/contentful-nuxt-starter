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
        <taxonomy-link-list
            useTaxonomy="category"
            :feedName="feedName"
            :post="post" />
        <p>
            <date :timeStamp="post.fields.assignedPublishedDate" />
        </p>
    </article>
</template>

<script>
import UiImage from '@/components/UI/image'
import Date from '@/components/feed/date'
import TaxonomyLinkList from '@/components/feed/taxonomy-link-list'

export default {
    components: {
        UiImage,
        Date,
        TaxonomyLinkList,
    },

    props: {
        post: {
            type: Object,
            default: null,
        },
        feedName: {
            type: String,
            default: 'news',
        },
    },
}
</script>
