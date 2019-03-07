<template>
    <p class="c-date">
        {{formattedDate}}
    </p>
</template>

<script>
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
    props: {
        timeStamp: {
            type: String,
            required: true,
        },
    },

    computed: {
        formattedDate() {
            return dayjs(this.timeStamp).fromNow()
        },
    },
}
</script>
