<template>
    <nav
        class="c-nav"
        role="navigation">
        <ul
            class="c-nav__menu u-list--unstyled">
            <li
                v-for="item in primaryNavItems"
                :key="item.name"
                class="c-nav__item">
                <nuxt-link
                    :to="item.route"
                    :title="item.title"
                    class="c-nav__link"
                    :exact="item.exact">
                    {{item.name}}
                </nuxt-link>
            </li>
        </ul>
        <ul
            v-if="secondary"
            class="c-nav__legal u-list--unstyled">
            <li
                v-for="item in secondaryNavItems"
                :key="item.name"
                class="c-nav__item">
                <nuxt-link
                    :to="item.route"
                    :title="item.title"
                    class="c-nav__link"
                    :exact="item.exact">
                    {{item.name}}
                </nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        secondary: {
            type: Boolean,
            default: null,
        }
    },
    computed: {
        settings() {
            return this.$store.state.settings
        },
        primaryNavItems() {
            return this.settings.config.nav.primary
        },
        secondaryNavItems() {
            return this.settings.config.nav.secondary
        }
    }
}
</script>
