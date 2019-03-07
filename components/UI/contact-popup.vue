<template>
    <div
        class="c-contact-popup"
        :class="{
            'c-contact-popup--is-open': open
        }">
        <transition name="slide-up-fade">
            <div
                v-if="open"
                class="c-contact-popup__popup">
                <div class="c-contact-popup__popup-header">
                    {{popupTitle}}
                </div>
                <div class="c-contact-popup__popup-contents">
                    <form-block
                        :type="form"
                        :labels="false" />
                </div>
            </div>
        </transition>

        <div
            v-if="buttonType == 'button'"
            class="c-contact-popup__button"
            @click="open = !open">
            <svg
                v-if="open"
                class="c-contact-popup__button-icon">
                <use xlink:href="#contact-menu-close" />
            </svg>
            <svg
                v-if="!open"
                class="c-contact-popup__button-icon">
                <use xlink:href="#contact-menu-open" />
            </svg>
        </div>

        <div
            v-if="buttonType == 'tab'"
            class="c-contact-popup__tab"
            @click="open = !open">
            {{buttonTitle}}
            <svg
                v-if="open"
                class="c-contact-popup__tab-icon">
                <use xlink:href="#contact-menu-close" />
            </svg>
        </div>
    </div>
</template>

<script>
import FormBlock from '@/components/form'

export default {
    components: {
        FormBlock,
    },

    props: {
        popupTitle: {
            type: String,
            default: 'Contact'
        },
        buttonTitle: {
            type: String,
            default: 'Contact us'
        },
        buttonType: {
            type: String,
            default: 'tab'  // tab or button
        },
        form: {
            type: String,
            default: 'contact'
        }
    },

    data() {
        return {
            open: false
        }
    },
}
</script>
