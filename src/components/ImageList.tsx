import React from 'react'
import { Pagination } from '@uifabric/experiments'
import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardDetails,
} from '@fluentui/react/lib/DocumentCard'
import { ImageFit } from '@fluentui/react/lib/Image'
import { TagPicker, ITag } from '@fluentui/react/lib/Pickers'
import Database from '../dataset/database_list'
import { TextField } from '@fluentui/react/lib/TextField'
import { Toggle } from '@fluentui/react/lib/Toggle'
import { RouteComponentProps } from 'react-router-dom'

import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../store/modules'
import { IItem, IImageListState } from '../types'
import {
  setTagFilter,
  setModelFilter,
  setPageNumber,
  setNameFilter,
  toggleThumbnailVisibility,
} from '../store/modules/pageInfo'
const ITEMS_PER_PAGE = 20

const mapStateToProps = (state: RootState): RootState => ({ ...state })
const mapDispatchToProps = {
  setTags: setTagFilter,
  setModels: setModelFilter,
  setPageNo: setPageNumber,
  setNameFilter,
  toggleThumbnailVisibility,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

class ImageList extends React.Component<
  RouteComponentProps<{}> & ConnectedProps<typeof connector>,
  IImageListState
> {
  constructor(
    props: RouteComponentProps<{}> & ConnectedProps<typeof connector>
  ) {
    super(props)
    this.state = {
      tags: [],
      models: [],
    }

    this._navigateTo = this._navigateTo.bind(this)
    this._onPageChange = this._onPageChange.bind(this)
    this._onTagChanged = this._onTagChanged.bind(this)
    this._onTitleChanged = this._onTitleChanged.bind(this)
    this._onModelChanged = this._onModelChanged.bind(this)
    this._onToggled = this._onToggled.bind(this)
    this._onTagResolveSuggestion = this._onTagResolveSuggestion.bind(this)
    this._onModelResolveSuggestion = this._onModelResolveSuggestion.bind(this)
    this._listContainsDocument = this._listContainsDocument.bind(this)
    this._calculatePageCount = this._calculatePageCount.bind(this)
  }

  async componentDidMount(): Promise<void> {
    console.log(this.props.pageInfo)
    let rawTags: string[] = []
    const rawModels: string[] = []
    Database.image.forEach((item) => {
      if (item.tags) {
        rawTags = rawTags.concat(
          item.tags.filter((tag) => !rawTags.includes(tag))
        )
      }
      if (item.model && !rawModels.includes(item.model)) {
        rawModels.push(item.model)
      }
    })
    console.log(rawTags)
    console.log(rawModels)
    this.setState({
      ...this.state,
      tags: rawTags.map((item) => ({ name: item, key: item })),
      models: rawModels.map((item) => ({ name: item, key: item })),
    })
    this.props.toggleThumbnailVisibility(
      window.localStorage.getItem('showThumbnail') === 'YES'
    )
  }

  private _navigateTo(item: IItem): void {
    this.props.history.push(`/${item.id}`)
  }

  private _onPageChange(currentPageIndex: number): void {
    this.props.setPageNo(currentPageIndex + 1)
    // this.setState({ ...this.state, currentPage: currentPageIndex + 1 })
  }

  private _onTagChanged(selectedTags?: ITag[]): void {
    this.props.setTags(selectedTags || [])
    // this.setState({ ...this.state, selectedTags })
  }
  private _onTitleChanged(ev: React.FormEvent, titleFilter?: string): void {
    this.props.setNameFilter(titleFilter || '')
    // this.setState({ ...this.state, titleFilter })
  }
  private _onModelChanged(selectedModels?: ITag[]): void {
    this.props.setModels(selectedModels || [])
    // this.setState({ ...this.state, selectedModels })
  }

  private _onTagResolveSuggestion(filterText: string, tagList: ITag[]): ITag[] {
    if (!filterText) {
      return []
    }
    const filters = this.state.tags
      .filter(
        (tag) => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0
      )
      .filter((tag) => !this._listContainsDocument(tag, tagList))
      .map((tag) => tag.name)
    return filters.map((tag) => ({ name: tag, key: tag }))
  }

  private _onModelResolveSuggestion(
    filterText: string,
    tagList: ITag[]
  ): ITag[] {
    if (!filterText) {
      return []
    }
    const filters = this.state.models
      .filter(
        (tag) => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0
      )
      .filter((tag) => !this._listContainsDocument(tag, tagList))
      .map((tag) => tag.name)
    return filters.map((tag) => ({ name: tag, key: tag }))
  }

  private _listContainsDocument(tag: ITag, tagList?: ITag[]): boolean {
    if (!tagList || !tagList.length || tagList.length === 0) {
      return false
    }
    return tagList.filter((compareTag) => compareTag.key === tag.key).length > 0
  }

  private _filterAlbum(): IItem[] {
    const { tags, models, nameFilter } = this.props.pageInfo
    let filteredImages = Database.image
    if (tags && tags.length > 0) {
      const filter = tags.map((item) => item.name)
      filteredImages = filteredImages.filter(
        (item) =>
          item.tags &&
          filter.filter((selTag) => item.tags?.includes(selTag)).length > 0
      )
    }
    if (models && models.length > 0) {
      const filter = models.map((item) => item.name)
      filteredImages = filteredImages.filter(
        (item) => item.model && filter.includes(item.model)
      )
    }
    if (nameFilter && nameFilter.length > 0) {
      filteredImages = filteredImages.filter(
        (item) => item.name.toLowerCase().indexOf(nameFilter.toLowerCase()) >= 0
      )
    }
    return filteredImages
  }

  private _calculatePageCount(): number {
    return this._filterAlbum().length / ITEMS_PER_PAGE + 1
  }

  private _onToggled(ev: React.MouseEvent, checked: boolean): void {
    this.props.toggleThumbnailVisibility(checked)
    window.localStorage.setItem('showThumbnail', checked ? 'YES' : 'NO')
  }

  render(): JSX.Element {
    const { pageNo, tags, models, nameFilter, isVisible } = this.props.pageInfo
    const albums = this._filterAlbum()
    const pageStartIndex = ITEMS_PER_PAGE * (pageNo - 1)
    const pageEndIndex =
      pageStartIndex + ITEMS_PER_PAGE > albums.length
        ? albums.length
        : pageStartIndex + ITEMS_PER_PAGE
    const paginatedItems = albums.slice(pageStartIndex, pageEndIndex)
    return (
      <div>
        <div id="top" />
        <Toggle
          label="Show Thumbnail"
          checked={isVisible}
          onText="On"
          offText="Off"
          onChange={this._onToggled}
        />
        <div className="label-wrapper">
          <label>Filter by Tag</label>
        </div>
        <TagPicker
          removeButtonAriaLabel="Remove"
          onResolveSuggestions={this._onTagResolveSuggestion}
          onChange={this._onTagChanged}
          selectedItems={tags}
          getTextFromItem={(item: ITag): string => item.name}
          pickerSuggestionsProps={{
            suggestionsHeaderText: 'Suggested Tags',
            noResultsFoundText: 'No Tag Found',
          }}
          title="Filter by Tag"
          inputProps={{
            'aria-label': 'Tag Picker',
          }}
        />
        <div className="label-wrapper">
          <label>Filter by Model</label>
        </div>
        <TagPicker
          removeButtonAriaLabel="Remove"
          onResolveSuggestions={this._onModelResolveSuggestion}
          onChange={this._onModelChanged}
          selectedItems={models}
          getTextFromItem={(item: ITag): string => item.name}
          pickerSuggestionsProps={{
            suggestionsHeaderText: 'Suggested Models',
            noResultsFoundText: 'No Model Found',
          }}
          title="Filter by Model"
          inputProps={{
            'aria-label': 'Model Picker',
          }}
        />
        <div className="label-wrapper">
          <label>Filter by Name</label>
        </div>
        <TextField value={nameFilter} onChange={this._onTitleChanged} />
        <div className="pagination-row">
          <Pagination
            pageCount={this._calculatePageCount()}
            onPageChange={this._onPageChange}
            selectedPageIndex={pageNo - 1}
          />
        </div>
        {paginatedItems.map((item) => (
          <DocumentCard
            key={item.id}
            className="preview-card"
            onClick={(): void => this._navigateTo(item)}
          >
            <DocumentCardPreview
              className="tn-image"
              previewImages={[
                {
                  previewImageSrc: isVisible ? `/files/${item.id}/tn.jpg` : '',
                  imageFit: ImageFit.centerContain,
                },
              ]}
            />
            <DocumentCardTitle title={item.name} shouldTruncate={true} />
            <DocumentCardDetails>
              {item.model && <span>Model: {item.model}</span>}
              {item.tags && <span>Tags: {item.tags.join(', ')}</span>}
              <span>Rating: {item.rating} / 10</span>
              <span>Category: {item.category}</span>
            </DocumentCardDetails>
          </DocumentCard>
        ))}
        <div className="pagination-row">
          <Pagination
            pageCount={this._calculatePageCount()}
            onPageChange={this._onPageChange}
            selectedPageIndex={pageNo - 1}
          />
          <a href="#top">Move to top</a>
        </div>
      </div>
    )
  }
}
export default connector(ImageList)
