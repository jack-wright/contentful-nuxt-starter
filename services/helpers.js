import {BLOCKS} from '@contentful/rich-text-types'
import {documentToHtmlString} from '@contentful/rich-text-html-renderer'
import Config from '@/config'
import ImageBreakpoints from '@/services/images/breakpoints'

const helpers = {
    /**
     * This property is used as an optional param for the documentToHtmlString
     * function that is called within contentDisplay method. It defines how we want
     * to handle certain elements returned from Contentful's rich text box.
     */
    options: {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
                const ratio = (node.data.target.fields.file.details.image.height/node.data.target.fields.file.details.image.width*100).toFixed(2)
                let tag = node.data.target.fields.description ? 'figure' : 'div'
                let sourceTags = function(type) {
                    let tags = []
                    let sourceString = ''
                    for (let [key, value] of Object.entries(ImageBreakpoints.standard[type])) {
                        tags.push(value)
                    }

                    for (let i = 0; i < tags.length; i++) {
                        let tag = tags[i]
                        let source = `<source
                            ${type === 'webp' ? `type="image/webp"` : ''}
                            media="${tag.mediaQuery}"
                            data-srcset="${node.data.target.fields.file.url + tag.urlParamsRetina} 2x,
                                ${node.data.target.fields.file.url + tag.urlParams}">`

                        sourceString += source
                    }

                    return sourceString
                }
                let html = `<${tag} class="c-image c-image--has-lazy-loading js-lazy-loading"
                    data-ratio="${ratio}"
                    id="img-${node.data.target.sys.id}">
                        <div class="c-image__container">
                            <svg class="c-image__loading-icon">
                                <use xlink:href='#image'></use>
                            </svg>
                            <picture>
                            ${sourceTags('webp')}
                            ${sourceTags('fallback')}
                            <img
                                class="c-image__img"
                                data-src="${node.data.target.fields.file.url}"
                                data-alt="${node.data.target.fields.description}"
                                data-title="${node.data.target.fields.title}"
                                width="${node.data.target.fields.file.details.image.width}"
                                height="${node.data.target.fields.file.details.image.height}" />
                            </picture>
                        </div>`

                if (node.data.target.fields.description) {
                    html += `<figcaption class="c-image__caption">${node.data.target.fields.description}</figcaption>`
                }

                html += `</${tag}>`

                return html
            },
        }
    },

    /**
     * A method provided by the rich-text-html-renderer package,
     * that converts the contentful rich text box content object into a html string
     * @param {*} body
     */
    contentDisplay(body) {
        return body ? documentToHtmlString(body, this.options) : null
    },

    // Trim a string to a set amount of characters, whilst not chopping the last word in two
    trimString(str, n) {
        return (str.match(RegExp('.{'+n+'}\\S*'))||[str])[0]
    },

    /**
     * Small method to toggle the menu is open class.
     * Called when the hamburger mobile button is clicked
     */
    toggleOpenMenu() {
        let body = document.querySelector('body')
        body.classList.toggle('menu-is-open')
    },

    /**
     * Checks to see whether or not the menu is open class is present.
     * If yes, it removes it. This is used when navigating to a new route
     * as we don't want the menu to remain open when this happens
     */
    closeMenu() {
        let body = document.querySelector('body')
        if (body.classList.contains('menu-is-open')) {
            body.classList.remove('menu-is-open')
        }
    },

    /**
     * Throttle Function
     * @param  {Function} callback
     * @param  {Int}   delay
     * @return {Function}
     */
    throttle(callback, delay) {
        let isThrottled = false;
        let args;
        let context;

        function wrapper() {
            if (isThrottled) {
                args = arguments;
                context = this;
                return;
            }

            isThrottled = true;
            callback.apply(this, arguments);

            setTimeout(() => {
                isThrottled = false;
                if (args) {
                    wrapper.apply(context, args);
                    args = context = null;
                }
            }, delay);
        }

        return wrapper;
    },

    getObjectByName(object, name) {
        return object.find(f => f.name  === name)
    },

    getObjectByContentType(object, contentType) {
        return object.find(f => f.contentType  === contentType)
    },

    getFeedQueryWithoutPageNum(query) {
        let queryParams = {...query}
        delete queryParams['page']
        return queryParams ? queryParams : false
    },

    /**
     * return a collection of nodes as an array
     * @return {[type]} [description]
     */
    getNodes(selector, root = document) {
        return [].slice.call(root.querySelectorAll(selector));
    },

    /**
     * Small method to strip out and return the video ID from the url
     * @param STRING - youtube URL 
     */
    getYoutubeId(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return false;
        }
    },

    /**
     * Pass through the button link string and check whether it passes
     * the regex, which deciphers whether or not it is a relative or
     * absolute url by checking if contains a protocol/www/or a fullstop
     *
     * @param string - URL that the button links to
     * @return bool - If a relative link, returns true, else returns false
     */
    checkIfRelativeLink(link) {
        let regex = new RegExp('^(https|http):\/\/|(www)|(\\.)', 'i')
        return regex.test(link)
    },

    createExcerpt(str, limit){
        return (str.length && str.length > limit) ? str.substr(0, str.lastIndexOf(' ', limit)) + '&hellip;' : str
    },

    getExcerpt(content) {
        return content ? this.createExcerpt(content, Config.excerptLength) : ''
    },

    /**
     * Check to see whether or not the given url is a YouTube url
     * @param String url 
     */
    isYoutubeURLvalid(url) {
        return url.search(/youtube.com/i) && url.search(/watch?v=/i)
    },
}

export default helpers
