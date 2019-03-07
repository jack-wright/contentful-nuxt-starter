import Vue from 'vue'
import ContentfulService from '@/services/contentful/api'

const state = () => ({
    currentPost: {}
})

const mutations = {
    SET_CURRENT_POST(state, payload) {
        Vue.set(state, 'currentPost', payload)
    },
}

const actions = {
    async GET_POST_BY_SLUG({commit}, payload) {
        const data = await ContentfulService.getPostBySlug(payload)
        commit('SET_CURRENT_POST', data.items[0])
    },
}

export default {
    state,
    mutations,
    actions,
}
