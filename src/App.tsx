import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { ImageList, ImageViewer } from './components'
initializeIcons()

class MainApp extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render(): JSX.Element {
    return (
      <Switch>
        <Route path="/" exact component={ImageList} />
        <Route path="/:id" component={ImageViewer} />
      </Switch>
    )
  }
}
export default MainApp
