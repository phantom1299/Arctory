import { USER_LOGGED_IN, USER_LOGGED_OUT } from '../actions/types'

const INITIAL_STATE = {
  token: '',
  isLoggedIn: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true
      }

    case USER_LOGGED_OUT:
      return {
        ...state,
        ...INITIAL_STATE
      }

    default:
      return state
  }
}
