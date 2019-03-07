import Meta from '../meta'

describe('Meta methods', () => {
    /**
     * Test for createMetaDescription(String) - Check that the returned value is a string
     * with HTML tags stripped, or an empty string if empty argument is passed
     */
    it('Take body copy from the HTML and create a meta description from it', () => {
        expect(Meta.createMetaDescription('<p>Hello,<br />world!</p>')).toEqual('Hello, world!')
        expect(Meta.createMetaDescription('')).toEqual('')
    })

    /**
     * Test for getMeta(String, String, String) - Check to see if meta object returns is what we expect
     * Check if Object returns what is expected when arguments are passed, and also when null/empty string
     * is passed as the argument
     */
    it('Get Meta tag information for the current page', () => {
        // First test the process.browser is set to true
        process.browser = true;

        expect(Meta.getMeta('Test page',
            '<p>This is a test description</p>',
            '//images.ctfassets.net/qwe0lo3etq8c/5gn9Z0iKk8iuUu8ieMmeSy/a4d627df461e1cafd31f579aada1ab91/sebastian-unrau-47679-unsplash__1_.jpg')).toEqual(
            {
                'meta': [
                    {
                        'content': 'Nuxt Starter',
                        'hid': 'author',
                        'name': 'author'
                    },
                    {
                        'content': 'Nuxt Starter',
                        'hid': 'og:site_name',
                        'name': 'og:site_name'
                    },
                    {
                        'content': 'Test page',
                        'hid': 'og:title',
                        'name': 'og:title'
                    },
                    {
                        'content': '//images.ctfassets.net/qwe0lo3etq8c/5gn9Z0iKk8iuUu8ieMmeSy/a4d627df461e1cafd31f579aada1ab91/sebastian-unrau-47679-unsplash__1_.jpg',
                        'hid': 'og:image',
                        'name':
                        'og:image'
                    },
                    {
                        'content': 'Test page',
                        'hid': 'twitter:title',
                        'name': 'twitter:title'
                    },
                    {
                        'content': '//images.ctfassets.net/qwe0lo3etq8c/5gn9Z0iKk8iuUu8ieMmeSy/a4d627df461e1cafd31f579aada1ab91/sebastian-unrau-47679-unsplash__1_.jpg',
                        'hid': 'twitter:image',
                        'name': 'twitter:image'
                    },
                    {
                        'content': 'http://localhost/',
                        'hid': 'og:url',
                        'name': 'og:url',
                    },
                    {
                        'content': 'This is a test description',
                        'hid': 'description',
                        'name': 'description'
                    },
                    {
                        'content': 'This is a test description',
                        'hid': 'og:description',
                        'name': 'og:description'
                    },
                    {
                        'content': 'This is a test description',
                        'hid': 'twitter:description',
                        'name': 'twitter:description'
                    }
                ],
                'title': 'Test page',
                'titleTemplate': '%s | A basic Nuxt starter'
            }
        )
        
        // Testing with the process.browser set to false
        process.browser = false;

        expect(Meta.getMeta(null,
            null,
            null)).toEqual(
            {
                'meta': [
                    {
                        'content': 'Nuxt Starter',
                        'hid': 'author', 
                        'name': 'author'
                    }, 
                    {
                        'content': 'Nuxt Starter', 
                        'hid': 'og:site_name', 
                        'name': 'og:site_name'
                    }, 
                    {
                        'content': 'Nuxt Starter page', 
                        'hid': 'og:title', 
                        'name': 'og:title'
                    }, 
                    {
                        'content': '/static/card.png', 
                        'hid': 'og:image', 
                        'name': 'og:image'
                    }, 
                    {
                        'content': 'Nuxt Starter page', 
                        'hid': 'twitter:title', 
                        'name': 'twitter:title'
                    }, 
                    {
                        'content': '/static/card.png', 
                        'hid': 'twitter:image', 
                        'name': 'twitter:image'
                    }
                ], 
                'title': 'Nuxt Starter page', 
                'titleTemplate': '%s | A basic Nuxt starter'
            }
        )
       
    })
})