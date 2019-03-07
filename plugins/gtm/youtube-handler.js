import GtmHandlerBase from './gtm-handler-base'

/**
  * Youtube player event and waypoints tracker
  * @author GW - Breakthrough Media
  *
  * @dec pushes events for the youtube player to the data layer so that GTM can
  * view the data.
  *
  * @requied gtm-handler-base.js
*/
class YoutubeHandler extends GtmHandlerBase {
    /**
    * for videos less than 60s speed up the tickrate so each tick is less than
    * 1% videoPlayedPercent. If not default to a tickrate of 0.5s. The lowest
    * tickrate is 0.1s which means videos should not be shorter than 11s.
    * @return integer
    */
    calculateTickrate() {
        const tr = this.player.getDuration() < 60 ?
            this.tickrate = this.player.getDuration() / 110 * 1000 :
            500
        return tr < 100 ? 100 : tr
    }

    /**
     * Start the progress ticker by calling trackProgress by the defined tickrate
     */
    startProgressTicker() {
        this.ticker = setInterval(() => this.trackProgress(), this.tickrate)
    }

    /**
     * Stop the progress ticker
     */
    stopProgressTicker() {
        clearInterval(this.ticker)
    }

    /**
    * increment the total play duration while also checking if the player's progress
    * is equal to the next waypoint boundary. If it's crossed the waypoint due
    * to a user seek wait for next waypoint to notify gtm.
    */
    trackProgress() {
        this.totalPlayedDuration += this.tickrate / 1000
        this.progress = this.getPlayedPercent()

        if (this.progress === this.config.waypoints[this.wpIndex]) {
            this.notify('progress')
        }

        if (this.progress >= this.config.waypoints[this.wpIndex]) {
            let currentIndex = this.config.waypoints.findIndex((wp) => wp > this.progress)
            this.wpIndex = currentIndex === -1 ? this.config.waypoints.length : currentIndex
        }
    }

    /**
    * calculates video played percent
    * @return boolean
    */
    getPlayedPercent() {
        return Math.round(
            this.player.getCurrentTime()
      / this.player.getDuration()
      * 100
        )
    }

    /**
    * push data to the Google Tag Manager dataLayer if it exists
    */
    notify(status) {
        let data = {
            'event': 'video',
            'videoID': this.config.videoId,
            // manually defined to avoid ?t=integer param in string
            'videoUrl': `https://www.youtube.com/watch?v=${this.config.videoId}`,
            'videoTitle': this.player.getVideoData().title,
            'videoStatus': status,
            'videoDuration': this.player.getDuration(),
            'videoCurrentTime': this.player.getCurrentTime(),
            'videoPercent': this.getPlayedPercent(),
            'videoTotalPlayedDuration': this.totalPlayedDuration,
        }
        this.pushToDataLayer(data)
    }
}

export default YoutubeHandler
