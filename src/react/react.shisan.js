import { renderComponent } from '../react-dom/react-dom.shisan'
function createElement(tag, attrs, ...children) {
  return {
    tag, attrs, children
  }
}

export class Component {
  constructor(props = {}) {
    this.state = {}
    this.props = props
  }

  setState(stateChange) {
    Object.assign(this.state, stateChange)
    renderComponent(this)
  }
}

const React = { createElement, Component }

export default React