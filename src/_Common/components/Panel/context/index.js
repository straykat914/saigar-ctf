import React, { createContext } from 'react'

const PanelContext = createContext({
  component: null,
  props: {},
  showPanel: () => {},
  hidePanel: () => {},
})

export class PanelProvider extends React.Component {
  showPanel = (component, props = {}) => {
    // this.setState(prevState => ({
    //   component: prevState.component ? null : component,
    //   props,
    // }))
    this.setState({
      component,
      props,
    })
  }

  hidePanel = () => {
    this.setState({
      component: null,
      props: {},
    })
  }

  state = {
    component: null,
    props: {},
    showPanel: this.showPanel,
    hidePanel: this.hidePanel,
  }

  render() {
    const { children } = this.props
    console.log(this.state)
    return <PanelContext.Provider value={this.state}>{children}</PanelContext.Provider>
  }
}

export const PanelConsumer = PanelContext.Consumer