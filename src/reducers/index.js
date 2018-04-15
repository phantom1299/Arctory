import { combineReducers } from 'redux'
import { reducer as FormReducer } from 'redux-form'
import AuthReducer from './AuthReducer'
import NavReducer from './NavReducer'
import UserReducer from './UserReducer'

export default combineReducers({
  nav: NavReducer,
  form: FormReducer,
  auth: AuthReducer,
  user: UserReducer
})
