<template>
    <section class="c-featured-items u-mb-xl">
        <h1 class="c-featured-items__heading u-mb-std">{{title}}</h1>
        <p class="c-featured-items__subtitle"
            v-if="subtitle">{{subtitle}}</p>
        <div class="l-featured__container u-mt-sm"
            :class="['l-featured__container--columns-' + columns]">
            <article
                v-for="(post, index) in posts"
                :key="index">
                <nuxt-link
                    class="c-featured-items__item-link"
                    :to="getURL(post)">
                    <ui-image
                        class="c-featured-items__item-image u-mb-sm"
                        purpose="thumbnail"
                        :image="post.fields.featuredImage" />
                </nuxt-link>

                <h3 class="c-featured-items__item-title u-m-none">
                    <nuxt-link :to="getURL(post)">
                        {{post.fields.title}}
                    </nuxt-link>
                </h3>

                <p v-if="showExcerpt">
                    <nuxt-link
                        :to="getURL(post)"
                        v-html="getExcerpt(post)" />
                </p>

                <nuxt-link
                    :to="getURL(post)"
                    v-if="cta">
                    <div class="c-featured-items__item-cta">
                        {{ctaText}}
                        <svg class="c-featured-items__item-cta-icon">
                            <use xlink:href="#chevron-right" />
                        </svg>
                    </div>
                </nuxt-link>
            </article>
        </div>
    </section>
</template>

<script>
import UiImage from '@/components/UI/image'
import Helpers from '@/services/helpers'

export default {
    components: {
        UiImage
    },

    props: {
        posts: {
            type: Array,
            default: null,
        },
        title: {
            type: String,
            default: null
        },
        subtitle: {
            type: String,
            default: null
        },
        showExcerpt: {
            type: Boolean,
            default: false
        },
        cta: {
            type: Boolean,
            default: false
        },
        ctaText: {
            type: String,
            default: 'Read more'
        },
        columns: {
            type: Number,
            default: 3,
            validator(value) {
                return value >= 1 && value <= 5
            }
        }
    },
    methods: {
        getExcerpt(post) {
            return post ? Helpers.getExcerpt(post.fields.body.content[0].content[0].value) : null
        },
        getURL(post) {
            return `/feed/${post.sys.contentType.sys.id}/detail/${post.fields.slug}`
        }
    }
}
</script>
