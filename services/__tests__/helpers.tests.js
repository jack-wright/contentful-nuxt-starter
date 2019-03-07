import Helpers from '../helpers'

describe('Helper methods', () => {
    let testObject = [
        {
            contentType: 'test content',
            name: 'content 1'
        },
        {
            contentType: 'another test content',
            name: 'content 2'
        }
    ]

    /**
     * Test for getObjectByContentType(Object, String) - Check that the content type
     * value returned matches the string argument
     */
    it('Get object by content type', () => {
        expect(Helpers.getObjectByContentType(testObject, 'test content')).toEqual({
            'contentType': 'test content',
            'name': 'content 1'
        })
    })

    /**
     * Test for getObjectByName(Object, String) - Check that the name value returned
     * matches the string argument
     */
    it('Get object by name', () => {
        expect(Helpers.getObjectByName(testObject, 'content 2')).toEqual({
            'contentType': 'another test content',
            'name': 'content 2'
        })
    })

    /**
     * Test for trimString(String) - Check both the last word is always returned,
     * but also that the string limit works
     */
    it('Trim string to match regex, but don\'t break last word', () => {
        expect(Helpers.trimString('Hello, world!', 8)).toEqual('Hello, world!')
        expect(Helpers.trimString('This is a sentence', 9)).toEqual('This is a')
    })

    /**
     * Test for getFeedQueryWithoutPageNum(Object) - Check that the return does
     * not contain the page property
     */
    it('Return the query of the feed, without the page number property', () => {
        expect(Helpers.getFeedQueryWithoutPageNum({page: 2})).toEqual({})
        expect(Helpers.getFeedQueryWithoutPageNum({page: 2, category: 'Sport'})).toEqual({category: 'Sport'})
    })

    /**
     * Test for contentDisplay(Object) when Object is null
     */
    it('When null is passed in, to contentDisplay, null should be returned', () => {
        expect(Helpers.contentDisplay(null)).toBeNull()
    })

    /**
     * Test for toggleOpenMenu() - create a dom instance and manipulate within
     * the test
     */
    it('When button is clicked, the class should be toggled', () => {
        document.documentElement.innerHTML =
            '<head></head>' +
            '<body>' +
            '  <button id="button">Click me</button>' +
            '</body>'

        const button = document.querySelector('#button')

        button.addEventListener('click', Helpers.toggleOpenMenu)
        button.click()
    
        expect(document.documentElement.innerHTML).toEqual(
            '<head></head>' +
            '<body class="menu-is-open">' +
            '  <button id="button">Click me</button>' +
            '</body>'
        )
    })
    
    /**
     * Test for closeMenu() - create a dom instance and manipulate within the test
     */
    it('When route changes, if the menu is open close it', () => {
        document.documentElement.innerHTML =
            '<head></head>' +
            '<body class="menu-is-open">' +
            '</body>'
        
        Helpers.closeMenu()

        expect(document.documentElement.innerHTML).toEqual(
            '<head></head>' +
            '<body class="">' +
            '</body>'
        )

        document.documentElement.innerHTML =
            '<head></head>' +
            '<body>' +
            '</body>'
        
        Helpers.closeMenu()

        expect(document.documentElement.innerHTML).toEqual(
            '<head></head>' +
            '<body>' +
            '</body>'
        )
    })
})

