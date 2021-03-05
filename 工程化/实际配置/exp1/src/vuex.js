import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        progressScorll: 0
    },
    mutations: {
        setProgressScroll(state, payload) {
            state.progressScorll = payload
        }
    }
})