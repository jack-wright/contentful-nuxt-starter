'use strict'

import Config from './config'
import ContentfulService from './services/contentful/api'
const path = require('path')
require('dotenv').config()

export default {
    modules: [
        '@nuxtjs/dotenv',
        '@nuxtjs/pwa',
        [
            '@nuxtjs/google-tag-manager', {
                id: Config.keys.gtm,
                pageTracking: true,
            },
        ],
        '@nuxtjs/sitemap',
    ],

    head: {
        htmlAttrs: {
            lang: Config.language,
        },
        title: Config.title,
        titleTemplate: '%s | ' + Config.shortName,
        meta: [
            {'charset': 'UTF-8'},
            {'name': 'viewport', 'content': 'width=device-width', 'initial-scale': '1.0'},
            {'http-equiv': 'X-UA-Compatible', 'content': 'ie=edge'},
        ],
        script: [
            {
                src: 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit',
                async: true,
                defer: true,
            },
        ]
    },

    manifest: {
        'name': Config.title,
        'short_name': Config.shortName,
        'description': Config.description,
        'theme_color': Config.themeColour,
        'lang': Config.language,
    },

    workbox: {
        runtimeCaching: [
            {
                urlPattern: `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/.*`,
                strategyOptions: {
                    cacheName: Config.cache.name,
                    cacheExpiration: {
                        maxEntries: Config.cache.maxEntries,
                        maxAgeSeconds: Config.cache.maxAgeSeconds
                    }
                }
            }
        ]
    },

    css: [
        '@/src/scss/style.scss',
    ],

    router: {
        linkActiveClass: 'c-nav__link--active',
        middleware: 'youtube-players'
    },

    plugins: [
        '@/plugins/contentful',
        '@/plugins/cookie-consent-bar',
        '@/plugins/directives',
        '@/plugins/social-sharing',
        '@/plugins/svg-sprite-loader',
        '@/plugins/gtm/gtm-helpers',
        '@/plugins/webfonts',
        '@/plugins/modernizr',
        {src: '@/plugins/gtm/scroll-depth-handler', ssr: false},
    ],

    sitemap: {
        hostname: process.env.DOMAIN_NAME,
        generate: true,
        // generate dynamic pages
        async routes() {
            let pageRoutes = []

            for (let feed of Config.feeds) {
                // generate feed root pages
                pageRoutes.push(`/feed/${feed.contentType}`)

                const detailQuery = await ContentfulService.getAllFeedPosts(feed.contentType)

                // generate feed.item detail pages
                for (let page of detailQuery.items) {
                    pageRoutes.push(`/feed/${feed.contentType}/detail/${page.fields.slug}`)
                }
            }

            return pageRoutes
        },
    },

    generate: {
        dir: 'public',

        // generate dynamic pages
        async routes() {
            let pageRoutes = []

            for (let feed of Config.feeds) {
                // generate feed root pages
                pageRoutes.push({
                    route: `/feed/${feed.contentType}`
                })

                const detailQuery = await ContentfulService.getAllFeedPosts(feed.contentType, feed.orderBy)

                // generate feed.item detail pages
                for (let page of detailQuery.items) {
                    pageRoutes.push({
                        route: `/feed/${feed.contentType}/detail/${page.fields.slug}`,
                        payload: page,
                    })
                }
            }

            return pageRoutes
        },
    },

    build: {
        babel: {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        'targets': {
                            'browsers': [
                                'last 1 versions',
                                '> 1%',
                                'maintained node versions',
                                'not dead',
                                'IE 11'
                            ]
                        },
                        'useBuiltIns': 'usage'
                    }
                ]
            ],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-transform-runtime'
            ]
        },
        extend(Config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                Config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/,
                    options : {
                        fix : true
                    }
                })
            }

            // Fix 'Can't resolve 'fs' when bundle with webpack' bug
            Config.node = {fs: 'empty'}

            // SVG support
            Config.module.rules.filter(rule =>
                rule.test.toString().indexOf('svg') > -1
            ).forEach(rule => {
                rule.exclude = /(assets\/svg)/
            })

            Config.module.rules.push(
                {
                    test: /\.svg$/,
                    include: [
                        path.resolve(__dirname, 'assets/svg')
                    ],
                    loader: 'svg-sprite-loader?' + JSON.stringify({
                        name: '[name]',
                        prefixize: false
                    })
                }
            )

            // Scss /**/* glob imports
            Config.module.rules.push(
                {
                    test: /\.scss/,
                    loader: 'import-glob-loader',
                }
            )
        }
    },
}
