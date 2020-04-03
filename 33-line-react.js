const m = (...args)=>{
    let [attrs, [head, ...tail]] = [{}, args]
    let [tag, ...classes] = head.split('.')
    if (tail.length && !m.isRenderable(tail[0])) [attrs, ...tail] = tail
    if (attrs.class) classes = [...classes, ...attrs.class]
    attrs = {...attrs}; delete attrs.class
    const children = []
    const addChildren = v=>v === null? null : Array.isArray(v)? v.map(addChildren) : children.push(v)
    addChildren(tail)
    return {__m: true, tag: tag || 'div', attrs, classes, children}
}
m.isRenderable = v =>v === null || ['string', 'number'].includes(typeof v) || v.__m || Array.isArray(v)
m.update = (el, v)=>{
    if (!v.__m) return el.data === `${v}` || (el.data = v)
    for (const name of v.classes) if (!el.classList.contains(name)) el.classList.add(name)
    for (const name of el.classList) if (!v.classes.includes(name)) el.classList.remove(name)
    for (const name of Object.keys(v.attrs)) if (el[name] !== v.attrs[name]) el[name] = v.attrs[name]
    for (const {name} of el.attributes) if (!Object.keys(v.attrs).includes(name) && name !== 'class') el.removeAttribute(name)
}
m.makeEl = v=>v.__m? document.createElement(v.tag) : document.createTextNode(v)
m.render = (parent, v)=>{
    const olds = parent.childNodes || []
    const news = v.children || []
    for (const _ of Array(Math.max(0, olds.length - news.length))) parent.removeChild(parent.lastChild)
    for (const [i, child] of news.entries()){
        let el = olds[i] || m.makeEl(child)
        if (!olds[i]) parent.appendChild(el)
        const mismatch = (el.tagName || '') !== (child.tag || '').toUpperCase()
        if (mismatch) (el = m.makeEl(child)) && parent.replaceChild(el, olds[i])
        m.update(el, child)
        m.render(el, child)
    }
}
