import { USER_DATA_FETCHED } from '../actions/types'

const INITIAL_STATE = {
  _id: '',
  tenantId: '5ad20dcca7b49509952d9a9f',
  email: '',
  name: '',
  userName: '',
  title: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_DATA_FETCHED:
      return {
        ...action.payload
      }

    default:
      return state
  }
}
