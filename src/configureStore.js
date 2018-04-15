import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import reducer from './reducers'

export default function configureStore(initialState, middlewares = []) {
  const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
  )

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default

      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
