import { AsyncStorage } from 'react-native'
import { USER_LOGGED_IN, USER_LOGGED_OUT, USER_DATA_FETCHED } from './types'
import { login, getUserInfo, getAccessToken } from '../api'

const userLoggedIn = (idToken, token, dispatch) => {
  return new Promise((resolve, reject) => {
    getUserInfo(token)
      .then(response => {
        // console.log(token, response)
        if (response.ok) {
          response.json().then(result => {
            dispatch({ type: USER_DATA_FETCHED, payload: result.result })
            try {
              AsyncStorage.multiSet([['idToken', idToken], ['isLoggedIn', 'true']])
              dispatch({ type: USER_LOGGED_IN, payload: { token } })
              resolve()
            } catch (error) {
              reject(error)
            }
          })
        } else reject()
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const onLogin = (credentials = {}) => {
  let tIdToken = ''
  return dispatch =>
    login(credentials)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else if (response.status === 401) {
          return Promise.reject(new Error('Email veya şifre hatalı.'))
        }

        return Promise.reject(new Error('Sunucuya erişilemedi.'))
      })
      .then(({ idToken }) => {
        tIdToken = idToken
        return getAccessToken(tIdToken)
      })
      .then(response => response.json())
      .then(({ token }) => userLoggedIn(tIdToken, token, dispatch))
}

export const userLoggedOut = () => {
  return dispatch => {
    try {
      AsyncStorage.multiRemove(['idToken', 'isLoggedIn'])
      dispatch({ type: USER_LOGGED_OUT })
    } catch (error) {
      // console.log(error)
    }
  }
}
