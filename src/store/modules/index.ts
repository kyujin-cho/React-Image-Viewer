import { combineReducers } from 'redux'
import { pageInfo } from './pageInfo'

console.log(pageInfo)

export const rootReducer = combineReducers({
  pageInfo,
})

export type RootState = ReturnType<typeof rootReducer>
