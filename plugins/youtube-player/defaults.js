export default {
    coverImageSize: 'high',
    coverImageSrc: '',
    cssClasses: {
        cover: 'c-youtube-player__cover',
        customText: 'c-youtube-player__custom-text',
        icons: 'c-youtube-player__icons',
        playButtonWrapper: 'c-youtube-player__play-button-wrapper',
        spinnerWrapper: 'c-youtube-player__spinner-wrapper',
        video: 'c-youtube-player__video',
        wrapper: 'c-youtube-player',
        wrapperInner: 'c-youtube-player__inner',
    },
    customText: 'Play this video',
    element: null,
    forceCoverOnTouchDevices: false,
    playIcon: '<svg class="c-youtube-player__play-button" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 300 300" xml:space="preserve"><path d="M281.9,144.5L24.5,1.4c-3-1.7-5.5-1.9-7.7-0.6c-2.1,1.3-3.2,3.6-3.2,7v285.3c0,3.4,1.1,5.7,3.2,7c2.1,1.3,4.7,1.1,7.7-0.6l257.4-143c3-1.7,4.5-3.7,4.5-6C286.3,148.1,284.9,146.1,281.9,144.5L281.9,144.5z"></path></svg>',
    spinnerIcon: '<div class="c-youtube-player__spinner"></div>',
    playerVars: {
        color: 'white',
        disablekb: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
    },
    videoId: '',
    videoUrl: '',
};
