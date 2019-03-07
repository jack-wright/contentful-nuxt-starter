<template>
    <div class="l-page-builder__module--image">
        <ui-image
            v-if="fields.image"
            purpose="hero"
            :image="fields.image" />
    </div>
</template>

<script>
import UiImage from '@/components/UI/image'

export default {
    components: {
        UiImage
    },
    props: {
        fields: {
            type: Object,
            default: null
        }
    },
    computed: {

    },
    methods: {

    }
}
</script>
