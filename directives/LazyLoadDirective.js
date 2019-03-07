const loadedClass = 'c-image--is-loaded'

export default {

    /*
    This directive adds lazy-loading to any image component with the 'v-lazyload="true"' attribute added
    @link https://www.netguru.co/codestories/lazy-loading-images-with-vue.js-directives-andintersectionobserver
    */
    inserted: el => {
        function loadImage(el) {
            const pictureElement = el.querySelector('picture')
            const imageElement = el.querySelector('img')

            new Promise(resolve => {
                if (!pictureElement) {
                    console.log('Picture not found')
                } else {
                    let sourceElement = pictureElement.querySelectorAll('source')

                    for (let i = 0; i < sourceElement.length; i++) {
                        let source = sourceElement[i]
                        source.addEventListener('error', (test) => console.log('error', test))
                        source.srcset = source.dataset.srcset
                    }

                    resolve('done')
                }
            }).then(() => {
                if (!imageElement) {
                    console.log('Image not found')
                } else {
                    imageElement.addEventListener('load', () => {
                        setTimeout(() => el.classList.add(loadedClass), 100)
                    })
    
                    imageElement.addEventListener('error', (test) => console.log('error', test))
                    imageElement.src = imageElement.dataset.src
    
                    if (imageElement.dataset.alt) {
                        imageElement.alt = imageElement.dataset.alt
                    }
    
                    if (imageElement.dataset.title) {
                        imageElement.title = imageElement.dataset.title
                    }
                }
            }).catch(error => {
                console.log(error);
            })
        }

        function handleIntersect(entries, observer) {
            for (let i = 0; i < entries.length; i++) {
                let entry = entries[i]
                
                if (!entry.isIntersecting) {
                    return
                } else {
                    loadImage(entry.target)
                    observer.unobserve(entry.target)
                }
            }
        }

        function createObserver(el) {
            const options = {
                // circumstances under which the observer's callback is invoked
                root: null, // defaults to the browser viewport if not specified or if null
                threshold: '0' // the degree of intersection between the target element and its root (0 - 1)
                // threshold of 1.0 means that when 100% of the target is visible within
                //the element specified by the root option, the callback is invoked
            }

            if (window && !window.observer) {
                window.observer = new IntersectionObserver(handleIntersect, options)
            }

            window.observer.observe(el)
        }

        // Only apply lazy loading when the 'lazy' flag is true
        if (el.lazy) {
            // If the browser has IntersectionObserver capabilities, initialise lazy-loading. Otherwise, just load the image.
            if (!window['IntersectionObserver']) {
                loadImage(el)
            } else {
                createObserver(el)
            }
        }
    },

    // We bind this directive only when the 'v-lazyload="true"' attribute is set
    // Set the flag 'lazy' to true so we can test for this inside inserted()
    bind(el, binding) {
        if (binding.value) {
            el.lazy = true
        }
    }
}
