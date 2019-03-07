<template>
    <div class="l-page-builder__module--post">
        <h2 v-if="fields.showTitle"
            class="l-page-builder__module-title t-heading-1">{{fields.title}}</h2>
        <div class="c-blog-posts__section">
            <post-preview-default
                v-for="post in fields.posts"
                :key="post.id"
                :post="post"
                :feedName="post.sys.contentType.sys.id" />
        </div>
    </div>
</template>

<script>
import PostPreviewDefault from '@/components/feed/defaults/post-preview-default'

export default {
    props: {
        fields: {
            type: Object,
            default: null
        }
    },

    components: {
        PostPreviewDefault
    },
}
</script>
