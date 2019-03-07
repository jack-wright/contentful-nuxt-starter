import GtmHandlerBase from './gtm-handler-base';
/**
  * Form submission tracker
  * @author JW
  *
  * Pushes any form submissions to the data layer so that
  * Google tag manager can pick them up
  *
  * @required gtm-handler-base.js
*/


class FormSubmitHandler extends GtmHandlerBase {
    constructor(data, config) {
        super()
        this.config = config
        this.log()
        this.pushToDataLayer(data)
    }
}

export default FormSubmitHandler 