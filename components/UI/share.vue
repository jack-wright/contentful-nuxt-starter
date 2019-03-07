<template>
    <div class="c-share">
        <h4 class="c-share__text">
            {{title}}
        </h4>
        <social-sharing
            :title="postTitle"
            :description="description"
            :url="url"
            inline-template>
            <div class="c-share__links">
                <network
                    network="facebook"
                    class="u-social-link">
                    <svg class="u-social-link__svg">
                        <use xlink:href="#facebook-square" />
                    </svg>
                </network>
                <network
                    network="twitter"
                    class="u-social-link">
                    <svg class="u-social-link__svg">
                        <use xlink:href="#twitter-square" />
                    </svg>
                </network>
                <network
                    network="googleplus"
                    class="u-social-link">
                    <svg class="u-social-link__svg">
                        <use xlink:href="#googleplus-square" />
                    </svg>
                </network>
            </div>
        </social-sharing>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: 'Share'
        },
        description: {
            type: String,
            default: null,
            required: true,
        },
        postTitle: {
            type: String,
            default: null,
            required: true,
        },
        url: {
            type: String,
            default: null,
            required: true,
        },
    }
}
</script>
