import { ITag } from '@fluentui/react/lib/Pickers'

import * as Types from '../../types'

export const setNameFilter = (
  nameFilter: string
): Types.SetNameFilterAction => ({
  type: Types.SET_NAME_FILTER,
  nameFilter,
})
export const setTagFilter = (tags: ITag[]): Types.SetTagFilterAction => ({
  type: Types.SET_TAG_FILTER,
  tags,
})
export const setModelFilter = (models: ITag[]): Types.SetModelFilterAction => ({
  type: Types.SET_MODEL_FILTER,
  models,
})
export const setPageNumber = (pageNo: number): Types.SetPageNoAction => ({
  type: Types.SET_PAGE,
  pageNo,
})
export const toggleThumbnailVisibility = (
  isVisible: boolean
): Types.ToggleThumbnailVisibilityAction => ({
  type: Types.TOGGLE_TN,
  isVisible,
})

const initialState: Types.PageInfoState = {
  nameFilter: '',
  models: [],
  pageNo: 1,
  tags: [],
  isVisible: false,
}

export const pageInfo = (
  state = initialState,
  action: Types.PageInfoActionTypes
): Types.PageInfoState => {
  switch (action.type) {
    case Types.SET_NAME_FILTER:
      return {
        ...state,
        nameFilter: action.nameFilter,
      }
    case Types.SET_MODEL_FILTER:
      return {
        ...state,
        models: action.models,
      }
    case Types.SET_TAG_FILTER:
      return {
        ...state,
        tags: action.tags,
      }
    case Types.SET_PAGE:
      return {
        ...state,
        pageNo: action.pageNo,
      }
    case Types.TOGGLE_TN:
      return {
        ...state,
        isVisible: action.isVisible,
      }
    default:
      return { ...state }
  }
}
