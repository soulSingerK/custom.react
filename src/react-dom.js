import { Component } from './react'
import { diff } from './diff'

function render(vnode, container) {
  debugger
  console.log(1212)
  return container.appendChild(_render(vnode))
}

function _render(vnode) {
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = ''

  if (typeof vnode === 'number') vnode = String(vnode)
  
  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode)
    return textNode
  }

  if (typeof vnode.tag === 'function') {
    const component = createComponent(vnode.tag, vnode.attrs)
    setComponentProps(component, vnode.attrs)
    return component.base
  }

  const dom = document.createElement(vnode.tag)
  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key]
      setAttribute(dom, key, value)
    })
  }
  vnode.children.forEach(child => render(child, dom))
  return dom
}

export function setAttribute(dom, name, value) {
  if (name === 'className') name = 'class'
  
  if (/on\w+/.test(name)) {
    name = name.toLowerCase()
    dom[name] = value
  } else if (name === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || ''
    } else if (value && typeof value === 'object') {
      for (let name in value) {
        dom.style[name] = typeof value[name] === 'number' ? `${value[name]}px` : value[name]
      }
    }
  } else {
    if (name in dom) {
      dom[name] = value || ''
    }
    if (value) {
      dom.setAttribute(name, value)
    } else {
      dom.removeAttribute(name)
    }
  }
}

// 创建组件
export function createComponent(component, props) {
  let inst
  // 如果是类定义的组件， 直接返回实例
  if (component.prototype && component.prototype.render) {
    inst = new component(props)
  } else { // 如果是函数定义组件， 则将其扩展为类定义组件
    inst = new Component(props)
    inst.constructor = component
    inst.render = function () {
      return this.constructor(props)
    }
  }
  return inst
}

export function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount()
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props)
  }
  component.props = props
  renderComponent(component)
}

export function renderComponent(component) {
  let base
  const renderer = component.render()
  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate()
  }
  // base = _render(renderer)
  base = diff(component.base, renderer)
  
  if (component.base) {
    if (component.componentDidUpdate) component.componentDidUpdate()
  } else if (component.componentDidMount) {
    component.componentDidMount()
  }

  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base)
  }

  component.base = base
  base._component = component
}

const ReactDom = {
  render: (vnode, container) => {
    container.innerHTML = ''
    return render(vnode, container)
  }
}

export default ReactDom