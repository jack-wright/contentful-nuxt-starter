<template>
    <div
        v-if="type"
        class="l-feed__form u-mb-lg">
        <h2
            v-if="title"
            class="l-feed__form-title">
            {{title}}
        </h2>

        <form-block
            :type="type"
            :eventName="type == 'eventRegistration' ? eventName : null" />
    </div>
</template>

<script>
import FormBlock from '@/components/form'

export default {

    components: {
        FormBlock,
    },

    props: {
        type: {
            type: String,
            default: null,
        },
        eventName: {
            type: String,
            default: null,
        },
        title: {
            type: String,
            default: null,
        }
    }
}
</script>
