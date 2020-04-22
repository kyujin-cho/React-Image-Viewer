import React from 'react'
import Axios from 'axios'
import { RouteComponentProps, Link } from 'react-router-dom'
import KVDatabase from '../dataset/database'
import {
  IImageViewerRCProps,
  IImageViewerLocationState,
  IImageViewerState,
} from '../types'

export default class ImageViewer extends React.Component<
  RouteComponentProps<IImageViewerRCProps, any, IImageViewerLocationState>,
  IImageViewerState
> {
  constructor(
    props: RouteComponentProps<
      IImageViewerRCProps,
      any,
      IImageViewerLocationState
    >
  ) {
    super(props)
    this.state = {
      filetype: '',
      length: -1,
    }
  }
  async componentDidMount(): Promise<void> {
    const { id } = this.props.match.params
    try {
      const filetype = await (await Axios.get(`/files/${id}/filetype`)).data
      const length = parseInt(
        await (await Axios.get(`/files/${id}/length`)).data
      )
      this.setState({
        ...this.state,
        filetype,
        length,
      })
    } catch (e) {
      console.error(e)
      this.props.history.goBack()
    }
  }
  render(): JSX.Element {
    const { id } = this.props.match.params
    const { filetype, length } = this.state

    if (length == -1) return <h2>Loading...</h2>
    const { name, detail } = KVDatabase.image[id]
    return (
      <div>
        <Link to="/">Go Back</Link>
        <h1>{name}</h1>
        <h2>{detail}</h2>
        {[...Array(length).keys()].map((i) => (
          <div key={i}>
            <img className="image" src={`/files/${id}/${i + 1}.${filetype}`} />
            <div className="image-page">
              {i + 1} of {length}
            </div>
          </div>
        ))}
      </div>
    )
  }
}
