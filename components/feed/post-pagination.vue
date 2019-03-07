<template>
    <ul
        v-if="maxPages > 1"
        class="c-post-pagination u-mt-std u-list--inline">
        <li class="c-post-pagination__item">
            <router-link
                v-if="pageNumber > 1"
                :to="buildQuery(-1)">
                {{lang.feed.pagination.prev}}
            </router-link>
            <a
                v-else
                class="c-post-pagination__item--disabled">
                {{lang.feed.pagination.prev}}
            </a>
        </li>
        <li class="c-post-pagination__item">
            <span>
                {{pageNumber}}/{{maxPages}}
            </span>
        </li>
        <li class="c-post-pagination__item">
            <router-link
                v-if="hasMorePages"
                :to="buildQuery(1)">
                {{lang.feed.pagination.next}}
            </router-link>
            <a
                v-else
                class="c-post-pagination__item--disabled">
                {{lang.feed.pagination.next}}
            </a>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        feedName: {
            type: String,
            required: true,
        },

        pageNumber: {
            type: Number,
            required: true,
        },

        maxPages: {
            type: Number,
            required: true,
        },
    },

    computed: {
        hasMorePages() {
            return this.pageNumber < this.maxPages
        },
        lang() {
            return this.$store.state.lang
        },
    },

    methods: {
        buildQuery(i) {
            let queryParams = {...this.$route.query}
            queryParams.page = this.pageNumber + i
            return {query: queryParams}
        },
    },
}
</script>
