import React, { Component } from 'react'
import { BackHandler, AsyncStorage, Alert } from 'react-native'
import { Provider, connect } from 'react-redux'
import { Root } from 'native-base'
import { addNavigationHelpers, NavigationActions } from 'react-navigation'
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers'
import thunk from 'redux-thunk'
import Router from './Router'
import configureStore from './configureStore'
import { verifyToken, getUserInfo, getAccessToken } from './api'

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
)
const addListener = createReduxBoundAddListener('root')

class App extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props
    if (nav.index === 0 && nav.routes[0].index !== 0) {
      dispatch(NavigationActions.back())
      return true
    }
    return false
  }

  render() {
    const { dispatch, nav } = this.props
    return (
      <Router
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener
        })}
      />
    )
  }
}

const mapStateToProps = state => ({
  nav: state.nav
})

const AppWithNavigationState = connect(mapStateToProps)(App)

class AppWrapper extends Component {
  state = {
    loading: false,
    store: configureStore({}, [thunk, middleware])
  }

  // componentWillMount() {
  //   AsyncStorage.multiGet(['isLoggedIn', 'idToken'])
  //     .then(res => {
  //       // Eğer bu veriler varsa kullanıcı daha önceden giriş yapmış ve çıkış yapmamış
  //       if (res[0][1]) {
  //         this.loginUser(res[1][1])
  //       } else {
  //         this.setState({ loading: false })
  //       }
  //     })
  //     .catch(() => this.setState({ loading: false }))
  //     .done()
  // }

  // loginUser(idToken) {
  //   const options = {}
  //   getAccessToken(idToken)
  //     .then(response => {
  //       if (response.status === 200) {
  //         response.json().then(({ token }) => {
  //           getUserInfo(token)
  //             .then(response => {
  //               if (response.status === 200) {
  //                 response.json().then(result => {
  //                   options.user = result.result
  //                   options.auth = { isLoggedIn: true, token }
  //                   // console.log('options', options); // Redux store initial data ile oluşturuluyor
  //                   this.setState({
  //                     loading: false,
  //                     store: configureStore(options, [thunk, middleware])
  //                   })
  //                 })
  //               } else {
  //                 this.setState({ loading: false })
  //               }
  //             })
  //             .catch(() => {
  //               this.setState({ loading: false })
  //             })
  //         })
  //       } else {
  //         this.setState({ loading: false })
  //       }
  //     })
  //     .catch(() => this.setState({ loading: false }))
  // }

  render() {
    if (this.state.loading) {
      return null
    }
    return (
      <Provider store={this.state.store}>
        <Root>
          <AppWithNavigationState />
        </Root>
      </Provider>
    )
  }
}

export default AppWrapper
