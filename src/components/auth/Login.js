import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, View } from 'native-base'
import { MyText as Text } from '../common'
import { onLogin } from '../../actions'

class Login extends Component {
  componentWillMount() {
    if (this.props.isLoggedIn) {
      this.props.navigation.navigate('Main')
    }
  }

  onLoginAdmin = () => {
    this.props.navigation.navigate('Main', { title: 'Admin' })
  }

  onLoginUser = () => {
    this.props.navigation.navigate('Main', { title: 'Personel' })
    // this.props.onLogin()
  }

  render = () => (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: '10%' }}>
      <Button full onPress={this.onLoginAdmin} info>
        <Text white>ADMIN</Text>
      </Button>
      <View style={{ height: '5%' }} />
      <Button full onPress={this.onLoginUser} success>
        <Text white>PERSONEL</Text>
      </Button>
    </View>
  )
}

const mapStateToProps = ({ auth: { isLoggedIn } }) => {
  return { isLoggedIn }
}

export default connect(mapStateToProps, { onLogin })(Login)
