export const state = () => ({
  user: null,
  accessToken: null
})

export const getters = {
  getUser: (state) => {
    return state.user
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
  }
}

export const actions = {
  async login({ commit }, { email, password }) {
    try {
      const { accessToken, user } = await this.$axios.$post('/auth/login', {
        username: email,
        password
      })

      if (!user) {
        return Promise.reject(new Error('Invalid user'))
      }

      this.$axios.setToken(accessToken, 'Bearer')
      commit('setUser', user)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  logout({ commit }) {
    this.$axios.setToken(false)
    commit('setUser', null)
  },
  async register(
    { dispatch },
    { username, email, password, firstName, lastName }
  ) {
    try {
      await this.$axios.$post('/auth/signup', {
        username,
        email,
        password,
        firstName,
        lastName
      })

      await dispatch('login', { email, password })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async deleteAccount({ commit, dispatch }) {
    try {
      await this.$axios.$delete('/auth/delete', {
        username: this.state.auth.user.username
      })

      dispatch('logout')

      this.$axios.setToken(false)
      commit('setUser', null)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
