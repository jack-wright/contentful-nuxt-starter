<template>
    <div class="c-page__section l-container l-404">
        <section class="s-page">
            <h1 v-if="error.statusCode === 404">
                {{lang.pages.error.fourOhFour}}
            </h1>
            <h1 v-else>
                {{lang.pages.error.other}}
            </h1>
            <p>
                {{lang.pages.error.back}} <nuxt-link to="/">
                    {{lang.pages.error.backPage}}
                </nuxt-link>
            </p>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        error: {
            type: Object,
            default: null,
        }
    },
    layout: 'blog', // you can set a custom layout for the error page
    computed: {
        lang() {
            return this.$store.state.lang
        },
    }
}
</script>
