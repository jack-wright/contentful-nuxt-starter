/**
  * Google Tag Manager helpers
  * @author GW - Breakthrough Media
  *
  * @desc helpers which can be imported and used to provide access to useful
  * methods on gtm plugins if they're running.
*/


const hasGTMScrollDepthHandler = () => {
    return typeof window !== 'undefined' && window.scrollDepthHandler
}

const pauseGTMScrollDepthHandler = () => {
    if (hasGTMScrollDepthHandler()) {
        window.scrollDepthHandler.pause()
    }
}

const resumeGTMScrollDepthHandler = () => {
    if (hasGTMScrollDepthHandler()) {
        window.scrollDepthHandler.resume()
    }
}

export {
    hasGTMScrollDepthHandler,
    pauseGTMScrollDepthHandler,
    resumeGTMScrollDepthHandler,
}
