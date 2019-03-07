<template>
    <div
        v-if="taxonomy && taxonomy.data"
        class="c-taxonomy-nav">
        <ul class="u-list--inline-floated">
            <li>
                {{taxonomy.name}}:
            </li>
            <li>
                <router-link
                    :to="`/feed/${feedName}/`"
                    class="u-badge--secondary">
                    {{lang.feed.taxonomyNav.all}}
                </router-link>
            </li>
            <li
                v-for="(taxonomyItem, index) in taxonomy.data.items"
                :key="index">
                <router-link
                    :to="`/feed/${feedName}/?${taxonomy.contentType}=${taxonomyItem.fields.slug}`"
                    :class="isActive(taxonomy.contentType, taxonomyItem.fields.slug)">
                    {{taxonomyItem.fields.title}}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        feedName: {
            type: String,
            required: true,
        },

        taxonomy: {
            type: Object,
            required: true
        },
    },

    computed: {
        lang() {
            return this.$store.state.lang
        },
    },

    methods: {
        isActive(taxonomyRef, val) {
            return this.$route.query[taxonomyRef] &&
                   this.$route.query[taxonomyRef] === val ?
                'c-taxonomy-nav-link--active u-badge--primary' :
                'u-badge--primary'
        },
    },
}
</script>
