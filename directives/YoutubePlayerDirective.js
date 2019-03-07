import YoutubePlayer from '@/plugins/youtube-player/youtube-player'

export default {
    inserted: (el, videoId) => {
        if (videoId) {
            el.innerHTML = '<div class="c-video u-video-aspect-ratio"></div>'
            new YoutubePlayer({
                element: el.childNodes[0],
                videoId: videoId,
                waypoints: [10, 20, 40, 60, 80, 95],
                debug: false,
            })
        }
    },
}
