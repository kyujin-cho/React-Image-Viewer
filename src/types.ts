import { ITag } from '@fluentui/react/lib/Pickers'

export const SET_NAME_FILTER = 'pageInfo/NAME'
export const SET_TAG_FILTER = 'pageInfo/TAG'
export const SET_MODEL_FILTER = 'pageInfo/MODEL'
export const SET_PAGE = 'pageInfo/PAGE_NUMBER'
export const TOGGLE_TN = 'pageInfo/THUMBNAIL_VISIBILITY'

export type SetNameFilterAction = {
  type: typeof SET_NAME_FILTER
  nameFilter: string
}
export type SetModelFilterAction = {
  type: typeof SET_MODEL_FILTER
  models: ITag[]
}
export type SetTagFilterAction = {
  type: typeof SET_TAG_FILTER
  tags: ITag[]
}
export type SetPageNoAction = {
  type: typeof SET_PAGE
  pageNo: number
}
export type ToggleThumbnailVisibilityAction = {
  type: typeof TOGGLE_TN
  isVisible: boolean
}
export type PageInfoState = {
  nameFilter: string
  models: ITag[]
  tags: ITag[]
  pageNo: number
  isVisible: boolean
}
export type PageInfoActionTypes =
  | SetNameFilterAction
  | SetModelFilterAction
  | SetTagFilterAction
  | SetPageNoAction
  | ToggleThumbnailVisibilityAction

export type IItem = {
  name: string
  id: string
  category: string
  tags?: string[]
  model?: string
  detail: string
  rating: number
}

export type IImageListState = {
  tags: ITag[]
  models: ITag[]
}
export type IPaginatedThumbnailViewerProps = {
  items: IItem[]
}
export type IImageViewerRCProps = {
  id: string
}
export type IImageViewerLocationState = {
  name: string
  detail: string
}
export type IImageViewerState = {
  filetype: string
  length: number
}
