<template>
    <ul class="u-list--inline-floated">
        <li>
            <router-link
                v-if="post.fields[useTaxonomy] && post.fields[useTaxonomy].fields"
                class="u-badge--primary"
                :to="`/feed/${feedName}/?${useTaxonomy}=${post.fields[useTaxonomy].fields.slug}`">
                {{post.fields[useTaxonomy].fields.title}}
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        useTaxonomy: {
            type: String,
            required: true,
        },

        post: {
            type: Object,
            required: true,
        },

        feedName: {
            type: String,
            required: true,
        },
    },
}
</script>
