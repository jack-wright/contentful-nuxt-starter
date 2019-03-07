
import YoutubeHandler from '../gtm/youtube-handler'
import defaults from './defaults'
import markup from './markup'
import Helpers from './helpers'

/**
  * Youtube player event and waypoints tracker
  * @author JW - Breakthrough Media
  *
  * @dec creates an embedded youtube player with a custom UI, and fires Google Tag Manager events
  * when users interact with the video as well as tracking video progress by waypoints.
  * The waypoints are defined as an ordered array of strings.
  *
  * The default tickrate is set to 500ms. Tickrate is calculated and sped up for
  * video durations less than 60s. If the video duration is less than 11s the
  * videoPlayedPercent may jump at increments greater than 1%. This may cause
  * tracking waypoints to be missed. It is not recommended using this script to
  * track videos under 11s in durations.
  *
  * @requied gtm-handler-base.js
*/
class YoutubePlayer extends YoutubeHandler {

    /**
    * @param object  config - settings for plugin
    */
    constructor(config) {
        super()
        this.setConfig(config)
        this.init()
        this.wpIndex = 0
        this.totalPlayedDuration = 0
        this.coverIsHidden = !this.config.forceCoverOnTouchDevices && Helpers.isMobile.any() ? true : false

        // Create an array of all youtube player instances
        // on the window object
        if (!window.YTPlayers) {
            window.YTPlayers = []
        }

        window.YTPlayers.push(this)
    }

    /**
     * Create the video player
     */
    init() {
        this.setDomNode()
        this.setVideoId()
        this.setCoverImage()
        this.setMarkup()
        this.createPlayerHtml()
        this.initDataBindings()
        this.setStates()
        // Add listeners
        this.addListeners()
        // Initialise API
        this.loadYoutubeApi();
    }

    /**
     * Create youtube api script
     */
    loadYoutubeApi() {
        let tag;

        if (!window.iframeApiCreated) {
            tag = document.createElement('script')
            tag.src = 'https://www.youtube.com/iframe_api'
            document.body.appendChild(tag)
            window.iframeApiCreated = true
        }

        if (window.YT) {
            this.onYouTubeIframeAPIReady()
        } else {
            window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this)
        }
    }

    /**
     * Callback function once the iframe api is loaded
     */
    onYouTubeIframeAPIReady() {
        window.YTPlayers.forEach((player) => {
            player.apiIsLoaded = true
            if (!this.config.forceCoverOnTouchDevices && Helpers.isMobile.any()) {
                player.initialisePlayer()
            }
        });
    }

    /**
     * Merge the config argument passed to the class when instantiated
     * @param Object config 
     */
    setConfig(config) {
        this.config = {
            ...defaults,
            ...config
        }
    }
    
    setDomNode() {
        this.domNode = this.config.element
    }

    /**
     * Set the cover image if it's passed as an option
     * otherwise fetch the image from youtube based on id and size
     */
    async setCoverImage() {
        if (this.domNode.hasAttribute('data-cover-image')) {
            this.config.coverImageSrc = this.domNode.getAttribute('data-cover-image')
        }

        if (this.config.coverImageSrc) {
            try {
                await this.loadImage(this.config.coverImageSrc)
                this.config.coverImage = `background-image: url(${this.config.coverImageSrc}`
            } catch (error) {
                throw new Error(`Image with src ${this.config.coverImageSrc} could not be loaded`)
            }
        } else {
            let imageSize

            switch (this.config.coverImageSize) {
            case 'medium':
                imageSize = 'mqdefault'
                break
            case 'high':
                imageSize = '0'
                break
            case 'sd':
                imageSize = 'sddefault'
                break;
            case 'maximum':
                imageSize = 'maxresdefault'
                break
            }

            let img = await this.loadImage(`https://img.youtube.com/vi/${this.config.videoId}/${imageSize}.jpg`)
            let srcName = img.width > 150 ? imageSize : '0'
            this.config.coverImageSrc = `https://img.youtube.com/vi/${this.config.videoId}/${srcName}.jpg`
            this.config.coverImage = `background-image: url(${this.config.coverImageSrc})`
        }
    }

    /**
     * Create a new image element
     * @param String src 
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = (e) => resolve(e.target)
            img.onerror = reject
            img.src = src
        });
    }

    /**
     * Define the custom video player markup
     */
    setMarkup() {
        this.markup = markup(this.config)
    }

    /**
     * attach initial markup to the main domNode
     */
    createPlayerHtml() {
        this.domNode.innerHTML = this.markup

        // Change the initial dom node to first child
        this.domNode = this.domNode.firstChild
    }

    /**
     * Set all the data bindings
     */
    initDataBindings() {
        let wrapper = this.config.cssClasses.wrapper
        this.bindClassToProperty(this, 
            this.domNode, 
            `${wrapper}--is-loading`, 
            'isLoading'
        )
        this.bindClassToProperty(this, 
            this.domNode, 
            `${wrapper}--cover-is-hidden`, 
            'coverIsHidden'
        )
        this.bindClassToProperty(this,
            this.domNode, 
            `${wrapper}--is-ready`, 
            'apiIsLoaded'
        )
        this.bindAttrToProperty(this.config,
            this.domNode.querySelector('.' + this.config.cssClasses.cover),
            'style',
            'coverImage'
        )
    }


    /*
    * Bind an element's class name to an object's property
    * @param  {obj} obj
    * @param  {obj} node
    * @param  {string} className
    * @param  {string} prop
    */
    bindClassToProperty(obj, node, className, prop) {
        Object.defineProperty(obj, prop, {
            set (value) {
                value ? node.classList.add(className) : node.classList.remove(className)
            }
        });
    }

    /**
    * Bind an element attribute to an objec's property
    * @param  {obj} obj
    * @param  {obj} node
    * @param  {string} attr
    * @param  {string} prop
    */
    bindAttrToProperty(obj, node, attr, prop) {
        Object.defineProperty(obj, prop, {
            set (value) {
                if (value) {
                    node.setAttribute(attr, value)
                }
            }
        });
    }

    /**
     * Set initial states
     */
    setStates() {
        this.isLoading = false
        this.playerCreated = false
        this.videoStarted = false
    }

    /**
     * Add click listener to video cover
     */
    addListeners() {
        // Add click listener to video cover
        this.domNode.querySelector('.' + this.config.cssClasses.cover)
            .addEventListener('click', () => this.initialisePlayer())
    }

    /**
     * handle click on cover video
     */
    initialisePlayer() {
        // Turn off custom loader on mobile and touch devices
        // since autoplay is not allowed on these devices
        if (Helpers.isMobile.any()) {
            this.coverIsHidden = true
        } else {
            this.isLoading = true
        }

        // Create the player
        if (this.playerCreated) {
            this.player.playVideo()
        } else {
            this.createPlayer()
        }

        this.pauseOtherVideos();
    }

    /**
     * Create youtube player and attach it to the class instance
     */
    createPlayer() {
        this.player = new YT.Player(this.config.videoId, {
            videoId: this.config.videoId,
            playerVars: this.config.playerVars,
            events: {
                'onReady': (d) => this.onReady(d),
                'onStateChange': (d) => this.onPlayerStateChange(d),
            }
        })        
    }

    /**
     * Set video id from data attributes or video url
     */
    setVideoId() {
        if (this.domNode.hasAttribute('data-youtube-id')) {
            this.config.videoId = this.domNode.getAttribute('data-youtube-id')
        }

        if (this.domNode.hasAttribute('data-youtube-url')) {
            this.config.videoUrl = this.domNode.getAttribute('data-youtube-url')
        }

        if (this.config.videoUrl && !this.config.videoId) {
            this.config.videoId = this.extractVideoIdfromUrl(this.config.videoUrl)
        }
    }

    /**
    * handles Youtube api player onReady method
    */
    onReady() {
        this.player.stopVideo()
        this.player.playVideo()
        this.playerCreated = true
        this.tickrate = this.calculateTickrate(this.player)
    }

    /**
     * Pause other videos on the same page
     */
    pauseOtherVideos() {
        let instances = window.YTPlayers

        instances.forEach((instance) => {
            if (instance.player && instance.player !== this.player) {
                instance.player.pauseVideo()
            }
        });
    }

    /**
     * Custom cover image and spinner based on player state
     * @param {object} e event object from iframe api
     */
    onPlayerStateChange(e) {
        let state = e.data

        switch (state) {
        // Unstarted
        case -1:
            this.videoStarted = true
            break
            
        // Ended
        case 0:
            this.coverIsHidden = false
            this.isLoading = false
            this.videoStarted = false
            this.stopProgressTicker()
            this.notify('end')
            this.wpIndex = 0
            break;

        // Playing
        case 1:
            this.coverIsHidden = true
            this.isLoading = false
            this.startProgressTicker()
            this.playing ? null : this.notify('play')
            this.pauseOtherVideos();
            break

        /**
        * paused
        * debounce to avoid user seekTo events
        */
        case 2:
            this.debounce(() => {
                if (this.player.getPlayerState() === 2) {
                    this.playing = false
                    this.notify('pause')
                }
            }, 1000)
            break;

        // Buffering
        case 3:
            if (!this.videoStarted) {
                this.coverIsHidden = false
                this.isLoading = true
            }
            break;
        }
    }

    /**
    * destroys the player instance the Youtube way
    */
    destroy() {
        this.player ? this.player.destroy() : null
    }
}

export default YoutubePlayer
