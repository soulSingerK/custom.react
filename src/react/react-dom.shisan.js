function render(vnode, container) {
  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode)
    return container.appendChild(textNode)
  }

  const dom = document.createElement(vnode.tag)
  
  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key]
      setAttribute(dom, key, value)
    })
  }

  vnode.children.forEach(child => render(child, dom))
  return container.appendChild(dom)
}

function setAttribute(dom, name, value) {
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
    container.inerHTML = ''
    return render(vnode, container)
  }
}

export default ReactDOM