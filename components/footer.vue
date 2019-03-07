<template>
    <footer class="c-footer u-mt-lg">
        <div class="c-nav__brand">
            <nuxt-link
                to="/"
                title="The home page of the site"
                class="c-nav__link"
                exact>
                <img
                    src="/logo.png"
                    class="c-nav__logo"
                    alt="generic brand logo"
                    title="brand logo" />
            </nuxt-link>
        </div>

        <navigation-menu
            class="u-mb-sm"
            :secondary="true" />

        <div class="c-footer__contact-details">
            <p
                v-if="settings.fields"
                class="c-footer__address u-m-none u-mb-sm">
                <span
                    v-for="addressLine in address"
                    :key="addressLine">
                    {{addressLine}}
                </span>
                <span v-if="settings.fields.addressPostcode">
                    {{settings.fields.addressPostcode}}
                </span>
            </p>

            <a
                v-if="settings.fields.email"
                class="c-footer__email-address u-mb-sm"
                :href="`mailto:${settings.fields.email}`">
                {{settings.fields.email}}
            </a>

            <social-links class="c-footer__social-links c-social-links--light" />
        </div>
    </footer>
</template>

<script>
import NavigationMenu from '@/components/nav'
import SocialLinks from '@/components/UI/social-links'

export default {
    components: {
        NavigationMenu,
        SocialLinks,
    },
    computed: {
        settings() {
            return this.$store.state.settings
        },
        address() {
            return [
                this.settings.fields.addressLine1 ? this.settings.fields.addressLine1 : '',
                this.settings.fields.addressLine2 ? this.settings.fields.addressLine2 : '',
                this.settings.fields.addressLine3 ? this.settings.fields.addressLine3 : '',
                this.settings.fields.addressLine4 ? this.settings.fields.addressLine4 : '',
            ]
        },
    },
}
</script>
