import { createStore } from 'vuex'

export const store = createStore({
  state: () => ({
    isLoading: false
  }),
  mutations: {
    setLoading: (state, newValue) => {
      state.isLoading = newValue
    }
  },
  actions: {
    toggleLoading: ({ commit }, newValue) => {
      commit('setLoading', newValue)
    }
  },
  getters: {
    isLoading: (state) => state.isLoading
  }
})
