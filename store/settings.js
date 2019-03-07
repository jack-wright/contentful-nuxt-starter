import ContentfulService from '@/services/contentful/api'
import Config from '@/config'
import ImageBreakpoints from '@/services/images/breakpoints'

export const state = () => ({
    fields: [],
    config: Config,
    recaptchaSiteKey: process.env.RECAPTCHA_SITEKEY,
    imageBreakpoints: ImageBreakpoints,
})

export const mutations = {
    SET_SITE_SETTINGS(state, payload) {
        state.fields = payload
    }
}

export const actions = {
    async GET_SITE_SETTINGS({commit}) {
        const data = await ContentfulService.getSettings()
        commit('SET_SITE_SETTINGS', data.items[0].fields )
    }
}
