<template>
    <ul
        v-if="socialNetworks"
        class="c-social-links u-list--inline">
        <li
            v-for="(value, key) in socialNetworks"
            :key="key"
            class="c-social-links__link">
            <a
                class="u-social-link"
                :href="value"
                target="_blank"
                rel="nofollow">
                <svg class="u-social-link__svg">
                    <use :xlink:href="`#${key}-square`" />
                </svg>
            </a>
        </li>
    </ul>
</template>

<script>
export default {
    computed: {
        socialNetworks() {
            return {
                instagram: this.$store.state.settings.fields.instagramUrl ? this.$store.state.settings.fields.instagramUrl : null,
                facebook: this.$store.state.settings.fields.facebookUrl ? this.$store.state.settings.fields.facebookUrl : null,
                twitter: this.$store.state.settings.fields.twitterUrl ? this.$store.state.settings.fields.twitterUrl : null,
                linkedin: this.$store.state.settings.fields.linkedInUrl ? this.$store.state.settings.fields.linkedInUrl : null,
            }
        },
    },
}
</script>
