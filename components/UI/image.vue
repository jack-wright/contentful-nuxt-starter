<template>
    <div
        v-lazyload="lazy"
        :class="[
            'c-image',
            { 'c-image--has-lazy-loading': lazy }
        ]">
        <div
            :class="`c-image__container c-image__container--${size}`"
            ref="imageContainer" >
            <svg
                v-if="!hideIcon"
                class="c-image__loading-icon">
                <use xlink:href="#image" />
            </svg>
            <picture v-if="image">
                <!-- Webp image sources-->
                <source
                    v-for="(source, index) in imageBreakpoints[purpose].webp"
                    :key="`webp-${index}`"
                    type="image/webp"
                    :media="source.mediaQuery"
                    :data-srcset="lazy ? `${image.fields.file.url + source.urlParamsRetina} 2x,
                        ${image.fields.file.url + source.urlParams}` : false"
                    :srcset="!lazy ? `${image.fields.file.url + source.urlParamsRetina} 2x,
                        ${image.fields.file.url + source.urlParams}` : false" />

                <!-- When browser doesn't support webp -->
                <source
                    v-for="(source, index) in imageBreakpoints[purpose].fallback"
                    :key="`fallback-${index}`"
                    :media="source.mediaQuery"
                    :data-srcset="lazy ? `${image.fields.file.url + source.urlParamsRetina} 2x,
                        ${image.fields.file.url + source.urlParams}` : false"
                    :srcset="!lazy ? `${image.fields.file.url + source.urlParamsRetina} 2x,
                        ${image.fields.file.url + source.urlParams}` : false" />

                <img
                    v-if="image && !lazy"
                    class="c-image__img"
                    :alt="image.fields.description"
                    :src="`${image.fields.file.url}?w=575`"
                    :title="image.fields.title"
                    ref="image" />
                <img
                    v-if="image && lazy"
                    class="c-image__img"
                    :data-alt="image.fields.description"
                    :data-src="`${image.fields.file.url}?w=575`"
                    :data-title="image.fields.title"
                    ref="image" />
            </picture>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        image: {
            type: Object,
            default: null,
            required: true
        },

        lazy: {
            type: Boolean,
            default: true,
        },

        hideIcon: {
            type: Boolean,
            default: false,
        },

        size: {
            type: String,
            default: '16-9',
            validator(value) {
                return [
                    'small',
                    'large',
                    '4-3',
                    '3-2',
                    '16-9',
                    'square',
                    'fullscreen'
                ].indexOf(value) !== -1
            },
        },

        purpose: {
            type: String,
            default: 'hero'
        }
    },

    computed: {
        imageBreakpoints() {
            return this.$store.state.settings.imageBreakpoints
        },
    },

    mounted() {
        if (!Modernizr['object-fit'] && this.$refs.imageContainer) {
            let container = this.$refs.imageContainer

            if (this.$refs.image.getAttribute('src') || this.$refs.image.getAttribute('data-src')) {
                container.style.backgroundImage = `url(${this.image.fields.file.url})`
                container.classList.add('u-ie-object-fit')
            }
        }
    },
}
</script>
