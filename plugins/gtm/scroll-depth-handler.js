import GtmHandlerBase from './gtm-handler-base'

/**
  * Scrolldepth waypoints tracker
  * @author GW - Breakthrough Media
  *
  * @dec fires Google Tag Manager events when user traverses pageY percentage
  * scrolled waypoints. The waypoints are defined as an ordered array of strings.
  *
  * For SPAs you may need to pause and unpause the scroll handler on route
  * changes due to scroll positions persisting on history push and popstates.
  * Use window.scrollDepthHandler.pause() and window.scrollDepthHandler.resume*()
  *
  * @requied gtm-handler-base.js
*/
class ScrollDepthHandler extends GtmHandlerBase {

    /**
    * @param object  config - settings for plugin
    * @param array   config.waypoints - ordered array of integers eg: [20, 40, 60, 80, 100]
    * @param integer config.debounce - optional, adds a debounce to scroll event
    * @param boolean config.debug - optional, enables event logging in the console
    */
    constructor(config) {
        super()
        this.config = config

        /**
        * on window push and pop states the page may already be scrolled. We
        * need to check this
        */
        this.last = window.scrollY
        this.dir = 1
        this.setWaypoint()

        /**
        * if debounce is defined delay firing of events until scroll is complete
        */
        let fn = () => this.scrollHandler()
        this.listener = config.debounce ?
            window.addEventListener('scroll', this.debounce(fn, this.config.debounce)) :
            window.addEventListener('scroll', fn)
    }

    /**
    * helpers to pause the gtm dataLayer pushes but still tracks waypoints.
    * On SPAs scrolling may occur between route changes, push and pop states and
    * pagination updates.
    */
    pause() {
        this.log('scrollDepthHandler paused')
        this.paused = true
    }

    resume() {
        this.log('scrollDepthHandler resumed')
        this.setWaypoint()
        this.paused = false
    }

    /**
    * sets a current waypoint object which contains references to the previous
    * and next waypoints as well as the index of the current waypoint.
    */
    setWaypoint() {
        this.previousWaypoint = this.currentWaypoint
        let scrolled = this.getScrollPercent()
        let currentWpIndex = this.config.waypoints.findIndex((wp) => wp > scrolled)
        let wpindex = currentWpIndex === -1 ? this.config.waypoints.length : currentWpIndex

        this.currentWaypoint = {
            prev: this.config.waypoints[wpindex -1],
            next: this.config.waypoints[wpindex],
            position: wpindex,
        }
    }

    /**
    * calculates pageY scroll as a percentage
    * @return integer
    */
    getScrollPercent() {
        let ws = window.scrollY
        let wh = window.innerHeight
        let dh = document.body.getBoundingClientRect().height
        let sp = ( ws / (dh - wh)) * 100
        return !isNaN(sp) ? Math.round(sp * 10) / 10 : 0
    }

    /**
    * handle window pageY scroll events
    */
    scrollHandler() {
        let scrolled = this.getScrollPercent()
        this.dir = scrolled > this.last ? 1 : -1

        /**
      * window is scrolling down
    */
        if (this.dir > 0) {
            if (scrolled >= this.currentWaypoint.next) {
                this.setWaypoint()
                this.notify(
                    this.previousWaypoint.position,
                    this.currentWaypoint.position,
                )
            }
            /**
        * window is scrolling up
      */
        } else {
            if (scrolled < this.currentWaypoint.prev) {
                this.setWaypoint()
                this.notify(
                    this.currentWaypoint.position,
                    this.previousWaypoint.position,
                )
            }
        }

        this.last = scrolled
    }

    /**
    * push data to the Google Tag Manager dataLayer if it exists
    * @param integer  from - the waypoint index pageY scrolled from
    * @param integer  to - the waypoint index pageY scrolled to
    */
    notify(from, to) {
        let arr = this.config.waypoints.slice(from, to)
        this.dir < 0 ? arr = arr.reverse() : null
        for (let i = 0; i < arr.length; i++) {
            let wp = arr[i]
            let data = {
                'event': 'scrollDepth',
                'scrollThreshold': wp,
                'scrollUnits': 'percent',
                'scrollDirection': this.dir > 0 ? 'down' : 'up',
            }
            this.paused ?
                this.log(`scrollDepthHandler is paused, no gtm push at waypoint ${wp}`) :
                this.pushToDataLayer(data)
        }
    }
}

const config = {
    waypoints: [20, 40, 60, 80, 100],
    debounce: 50,
    debug: false,
}

window.scrollDepthHandler = new ScrollDepthHandler(config)
