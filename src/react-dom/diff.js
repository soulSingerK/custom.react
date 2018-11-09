import { Component } from '../react/react.shisan'
import { setAttribute } from './react-dom.shisan'

/**
 * 
 * @param {*} dom 
 * @param {*} vnode 
 * @param {*} container 
 */
export function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode)
  
}

function diffNode(dom, vnode) {
  let out = dom

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = ''

  if (typeof vnode === 'number') vnode = String(vnode)

  // diff text node
  if (typeof vnode === 'string') {
    // 如果当前的DOM就是文本节点， 则直接更新内容
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode
      }
    } else { // 如果DOM不是文本节点， 则新建一个文本节点DOM， 并移出掉原来的
      out = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom)
      }
    }
    return out
  }

  if (typeof vnode.tag === 'function') {
    return diffComponent(dom, vnode)
  }

  if (!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(vnode.tag)
    if (dom) {
      // 将原来的子节点移动到新节点下
      [...dom.childNodes].map(out.appendChild)
      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom)
      }
    }
  }

  if (vnode.children && vnode.children.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
    diffChildren(out, vnode.children)
  }

  diffAttrubutes(out, vnode)

  return out
}

function diffComponent(dom, vnode) {
  let c = dom && dom._component

}

function diffChildren(dom, vchildren) {
  const domChildren = dom.childNodes
  const children = []

  const keyed = {}

  if (domChildren.length > 0) {
    for (let i = 0; i < domChildren.length; i++) {
      const child = domChildren[i]
      const key = child.key
      if (key) {
        keyedLen++
        keyed[key] = child
      } else {
        children.push(child)
      }
    }
  }

  if (vchildren && vchildren.length > 0) {
    let min = 0
    let chirdrenLen = children.length
    for (let i = 0; i < vchildren.length; i++) {
      const vchild = vchildren[i]
      const key = vchild.key
      let child

      if (key) {
        if (keyed[key]) {
          child = keyed[key]
          keyed[key] = undefined
        }
      } else if (min < chirdrenLen) {
        for (let j = min; j < chirdrenLen; j++) {
          let c = children[j]
          if (c && isSameNodeType(c, child)) {
            child = c
            children[j] = undefined
            if (j === chirdrenLen - 1) chirdrenLen--
            if (j === min) min++
            break
          }
        }
      }

      child = diffNode(child, vchild)

      const f = domChildren[i]
      if (child && child !== dom && child !== f) {
        if (!f) {
          dom.appendChild(child)
        } else if (child === f.nextSibling) {
          removeNode(f)
        } else {
          dom.insertBefore(child, f)
        }
      }
    }
  }
}

function diffAttrubutes(dom, vnode) {}

function isSameNodeType(dom, vnode) {}

function removeNode(node) {}