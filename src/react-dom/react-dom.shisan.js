import { Component } from '../react/react.shisan'
export function renderComponent(component) {
  let base
  const renderer = component.render()
  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate()
  }
  // base = _render(renderer)
  base = diff(component.base, renderer)

  if (component.base) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate()
    }
  } else if (component.componentDidMount) {
    component.componentDidMount()
  }

  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base)
  }

  component.base = base
  base._component = component
}

export function createComponent(component, props) {
  let inst
  // 类定义组件
  if (component.prototype && component.prototype.render) {
    inst = new component(props)
  } else { // 函数定义组件
    inst = new Component(props)
    inst.constructor = component
    inst.render = function() {
      return this.constructor(props)
    }
  }
  return inst
}

function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount()
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps()
  }
  component.props = props
  renderComponent(component)
}

function render(vnode, container) {
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
  // 如果属性名是className 则改回class
  if (name === 'className') name = 'class'
  
  // 如果属性名是onXXX， 则是一个事件监听方法
  if (/on\w+/.test(name)) {
    name = name.toLowerCase()
    dom[name] = value || ''
  } else if (name === 'style') { // 如果属性名是style， 则更新style对象
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || ''
    } else if (value && typeof value === 'object') {
      for (let name in value) {
        dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name]
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

const ReactDOM = {
  render(vnode, container) {
    container.innerHTML = ''
    return render(vnode, container)
  }
}

export default ReactDOM