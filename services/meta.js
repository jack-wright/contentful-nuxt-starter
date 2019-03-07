'use strict'

// Functions to assist adding meta tags for SEO

import Config from '@/config'
import Helpers from '@/services/helpers'

export default {

    // Take a some body copy html and make the meta description from it
    createMetaDescription(string) {
        if (typeof string == 'string' && string !== '') {
            // Space new lines and paragraphs
            string = string.replace('<br />', ' ')
            string = string.replace('<br/>', ' ')
            string = string.replace('</p>', ' ')
            // Remove HTML tags
            string = string.replace(/<[^>]+>/g, '')
            // Remove trailing spaces from end of the sentence
            string = string.replace(/\s+$/, '')

            // Trim string. Meta descriptions should be 150 chars max, but set as 140 due to trimString() overrun
            return Helpers.trimString(string, 140)
        } else {
            return ''
        }
    },

    getMeta(title, body, image, pageCategory) {
        if (!title) {
            title = Config.defaultTitle
        }

        if (!image) {
            image = Config.defaultCardImage
        }

        if (!pageCategory) {
            pageCategory = Config.defaultPageCategory
        }

        let meta = {
            title,
            titleTemplate: '%s | ' + Config.titleSuffix,
            meta: [
                {
                    hid: 'page_category',
                    name: 'page_category',
                    content: pageCategory
                },
                {
                    hid: 'author',
                    name: 'author',
                    content: Config.shortName
                },
                {
                    hid: 'og:site_name',
                    name: 'og:site_name',
                    content: Config.shortName
                },
                {
                    hid: 'og:title',
                    name: 'og:title',
                    content: title
                },
                {
                    hid: 'og:image',
                    name: 'og:image',
                    content: image
                },
                {
                    hid: 'twitter:title',
                    name: 'twitter:title',
                    content: title
                },
                {
                    hid: 'twitter:image',
                    name: 'twitter:image',
                    content: image
                }
            ]
        }

        // window is only available on the client-side
        if (process.browser) {
            meta.meta.push(
                {
                    hid: 'og:url',
                    name: 'og:url',
                    content: window.location.href
                }
            )
        }

        if (body) {
            meta.meta.push(
                {
                    hid: 'description',
                    name: 'description',
                    content: this.createMetaDescription(body)
                }
            )
            meta.meta.push(
                {
                    hid: 'og:description',
                    name: 'og:description',
                    content: this.createMetaDescription(body)
                }
            )
            meta.meta.push(
                {
                    hid: 'twitter:description',
                    name: 'twitter:description',
                    content: this.createMetaDescription(body)
                }
            )
        }

        return meta
    }
}
