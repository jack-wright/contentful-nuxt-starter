import ContentfulService from '@/services/contentful/api'

const state = () => ({
    pageData: {},
})

const mutations = {
    SET_PAGE_DATA(state, payload) {
        //TODO: improve page data identifier
        state.pageData[payload.page] = payload.data
    },
}

const actions = {
    async GET_PAGE_DATA({commit}, payload) {
        const data = {}
        data.data = await ContentfulService.getPage(payload.id)
        //TODO: improve page data identifier
        data.page = data.data.fields.slug
        commit('SET_PAGE_DATA', data)
    },

    async GET_ALL_PAGES() {
        await ContentfulService.getAllPages()
    },

    async GET_NESTED_ENTRIES({commit}, payload) {
        let data = {}
        data.result = await ContentfulService.getNestedEntries(payload.id)
        data.data = data.result.items[0]
        data.page = data.data.fields.slug
        commit('SET_PAGE_DATA', data)
    },
}

export default {
    state,
    mutations,
    actions,
}
