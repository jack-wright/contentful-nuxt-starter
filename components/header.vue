<template>
    <header
        class="c-header"
        :class="{
            'c-header--floating': hasFloatingHeader,
            'c-header--transparent': hasTransparentHeader,
        }">
        <div class="c-nav__brand">
            <img
                src="/logo.png"
                class="c-nav__logo"
                :alt="settings.config.shortName + ' logo'"
                :title="settings.config.shortName"
                @click="toHomePage" />
        </div>
        <navigation-menu :header="true" />
        <div
            class="c-hamburger"
            @click="openMenu">
            <div class="c-hamburger__bar"></div>
        </div>
    </header>
</template>

<script>
import Helpers from '@/services/helpers'
import NavigationMenu from '@/components/nav'

export default {
    components: {
        NavigationMenu
    },

    computed: {
        settings() {
            return this.$store.state.settings
        },
        hasFloatingHeader() {
            return this.settings.config.header.floating
        },
        hasTransparentHeader() {
            return this.settings.config.header.transparent
        },
    },

    watch: {
        '$route': () => {
            Helpers.closeMenu()
        }
    },

    methods: {
        openMenu() {
            Helpers.toggleOpenMenu()
        },

        toHomePage() {
            this.$router.push('/')
        }
    }
}
</script>
