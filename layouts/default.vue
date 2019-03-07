<template>
    <div>
        <header-section />
        <main>
            <nuxt />
        </main>
        <footer-section />
        <contact-popup
            v-if="settings.config.contactPopup && $route.name !== 'contact'"
            buttonType="tab"
            :popupTitle="lang.contactPopup.popupTitle"
            :buttonTitle="lang.contactPopup.buttonTitle" />
    </div>
</template>

<script>
import ContactPopup from '@/components/UI/contact-popup'
import HeaderSection from '@/components/header'
import FooterSection from '@/components/footer'

export default {
    components: {
        HeaderSection,
        FooterSection,
        ContactPopup,
    },

    computed: {
        lang() {
            return this.$store.state.lang
        },
        settings() {
            return this.$store.state.settings
        },
    },

}
</script>
