<template>
    <span class="c-date">
        {{formattedDate}}
    </span>
</template>

<script>
import * as dayjs from 'dayjs'

export default {
    props: {
        timeStamp: {
            type: String,
            required: true
        },

        format: {
            type: String,
            default: null
        },
    },

    computed: {
        formattedDate() {
            return dayjs(this.timeStamp).format(this.format || this.$store.state.settings.config.dateFormat)
        },
    },
}
</script>
