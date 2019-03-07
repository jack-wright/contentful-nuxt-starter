<template>
    <div class="c-print"
        @click="handlePrint">
        <svg class="c-print__icon">
            <use xlink:href="#print" />
        </svg>
        <div class="c-print__title">{{title}}</div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: 'Print'
        },
    },

    methods: {
        handlePrint() {
            window.print()
        }
    }
}
</script>
