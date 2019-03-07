'use strict'
import env from './env'

export default {
    contactPopup: false,
    defaultTitle: 'Nuxt Starter page',
    defaultCardImage: '/static/card.png',
    defaultPageCategory: 'default',
    dateFormat: 'DD MMM YYYY',
    dataSource: 'contentful',
    description: 'A basic Nuxt starter template',
    excerptLength: 60,
    header: {
        floating: false,
        transparent: false,                                // transparent and floating should not be both true simultaneously
    },
    keys: {
        gtm: env.GTM_TRACKING_ID,
    },
    language: 'en-GB',
    shortName: 'Nuxt Starter',
    themeColour: '#333',
    title: 'Site name',
    titleInHero: false,
    titleSuffix: 'A basic Nuxt starter',
    feeds: [
        {
            contentType: 'blogPost',                      // required: contentful contentType of feed
            category: 'nav',
            postsPerPage: 4,                              // optional: default = 10
            parent: {                                     // optional: sets and fetches page metadata and content from an id
                ref: 'news',                              // required if parent is defined
                id: '2nwmrQwdJOq46sYAQOEWug',             // required if parent is defined
            },
            orderBy: '-fields.assignedPublishedDate',     // optional: default = -sys.createdAt
            taxonomies: [                                 // optional: fetches taxonomy lists to filter feed
                {
                    name: 'Categories',                   // taxonomoyName
                    contentType: 'category',              // contenful contentType identifier, usually camel cased
                },
            ],
            detailCategory: 'post',
        },
        {
            contentType: 'eventPost',
            category: 'nav',
            postsPerPage: 4,
            previewComponent: 'post-preview-event',     // optional: default = post-preview-default.vue
            detailComponent: 'post-detail-event',       // optional: default = post-detail-default.vue
            detailCategory: 'event',
            form: 'eventRegistration',
        },
    ],
    nav: {
        primary: [
            {
                name: 'Home',
                title: 'The home page of the site',
                route: '/',
                exact: true
            },
            {
                name: 'News',
                title: 'The latest news for the site',
                route: '/feed/blogPost'
            },
            {
                name: 'Events',
                title: 'The events for the site',
                route: '/feed/eventPost'
            },
            {
                name: 'Contact',
                title: 'Contact the site for any enquiries',
                route: '/contact'
            },
            {
                name: 'Page Builder',
                title: 'Test page for the page builder',
                route: '/page-builder'
            }
        ],
        secondary: [
            {
                name: 'Privacy policy',
                title: 'Privacy policy document for this site',
                route: '/privacy-policy'
            },
            {
                name: 'Terms & conditions',
                title: 'Terms and conditions for using this site',
                route: '/terms-and-conditions'
            },
            {
                name: 'FAQ\'s',
                title: 'Frequently asked questions',
                route: 'faq'
            }
        ]
    },
    cache: {
        name: 'Nuxt Starter cache',
        maxEntries: 10,
        maxAgeSeconds: 300,
    },
    pages: {
        home: {
            slug: 'home',
            id: '4ix0SohEOIU0EOAKuQSusY',
            category: 'nav',
        },
        contact: {
            slug: 'contact',
            id: '2Znj4QVQz68Ioi0oSAOesM',
            category: 'content',
        },
        faq: {
            slug: 'frequently-asked-questions',
            id: '6pEA6uXn6hkrQWixdaDYpS',
            category: 'support',
        },
        terms: {
            slug: 'terms-and-conditions',
            id: '2jPimAoKFeComMC4OGyM6e',
            category: 'support',
        },
        privacy: {
            slug: 'privacy-policy',
            id: '5ZhxgB8GvSi44e2iGO2ioW',
            category: 'support',
        },
        pageBuilder: {
            slug: 'test-page',
            id: '6nABoTe0Wk6qecm82MqAic',
            category: 'nav',
        },
    }
}
