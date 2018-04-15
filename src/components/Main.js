import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { StackNavigator, NavigationActions } from 'react-navigation'
import PersonelTabs from './personel/Tabs'
import AdminTabs from './admin/Tabs'
// import AdminHome from './admin/Home'
import { userLoggedOut } from '../actions'

class Main extends Component {
  constructor(props) {
    super(props)
    this.onLogout = this.onLogout.bind(this)
  }

  onLogout() {
    this.props.userLoggedOut()
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      key: null, // black magic
      actions: [NavigationActions.navigate({ routeName: 'Auth' })]
    })
    this.props.navigation.dispatch(actionToDispatch)
  }

  render() {
    const { title } = this.props.navigation.state.params
    if (title === 'Personel') {
      const PersonelStack = StackNavigator(
        {
          PersonelTabs: { screen: PersonelTabs }
        },
        {
          title: 'Main',
          headerMode: 'none'
        }
      )
      return (
        <PersonelStack
          screenProps={{
            onLogout: this.onLogout
          }}
        />
      )
    }
    if (title === 'Admin') {
      const AdminStack = StackNavigator(
        {
          AdminTabs: { screen: AdminTabs }
        },
        {
          title: 'Main',
          headerMode: 'none'
        }
      )
      return (
        <AdminStack
          screenProps={{
            onLogout: this.onLogout
          }}
        />
      )
    }
    return (
      <View>
        <Text>Hey</Text>
      </View>
    )
  }
}

const mapStateToProps = ({ user }) => {
  const { title } = user
  return { title }
}

export default connect(mapStateToProps, { userLoggedOut })(Main)
