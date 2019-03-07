/**
  * Base class for Google Tag Manager handlers
  * @author GW - Breakthrough Media
  *
  * @dec provides helper methods for handler classes
*/
class GtmHandlerBase {

    /**
    * debounce method taken from underscore.js
  */
    debounce(func, wait, immediate) {
        let timeout
        return () => {
            let context = this
            let args = arguments
            let later = () => {
                timeout = null
                if (!immediate) func.apply(context, args)
            }
            let callNow = immediate && !timeout
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
            if (callNow) func.apply(context, args)
        }
    }

    /**
    * console.log messages if config.debug is true
    * @param string  message - message to show in javascript console
  */
    log(message) {
        this.config.debug ? console.log(message) : null
    }

    /**
    * handles pushing of data to gtm dataLayer and logging the output if debug is true
    * @param object  data - data to be pushed to the gtm dataLayer
  */
    pushToDataLayer(data) {
        this.log(data)
        window.dataLayer ? window.dataLayer.push(data) : null
    }

}

export default GtmHandlerBase
