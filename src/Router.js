import { StackNavigator } from 'react-navigation'
import LoginScreen from './components/auth/Login'
import Main from './components/Main'

const Root = StackNavigator(
  {
    Auth: { screen: LoginScreen },
    Main: { screen: Main }
  },
  {
    title: 'Root',
    headerMode: 'none'
  }
)

export default Root
