// Calling with:
//
//     m(
//         'li.some.classes',
//         {onclick: f},
//         'text',
//         otherNode,
//         null,
//         [['nested'], 'stuff'],
//     )
//
// Would return a virtual DOM node like:
//
//     {
//         __m: true,
//         tag: 'li',
//         attrs: {onclick: f},
//         classes: ['some', 'classes'],
//         children: [
//             'text',
//             otherNode,
//             'nested',
//             'stuff',
//         ],
//     }
//
const m = (...args)=>{
    // munge our args, to get: tag, attrs, classes
    let [attrs, [head, ...tail]] = [{}, args]
    let [tag, ...classes] = head.split('.')
    if (tail.length && !m.isRenderable(tail[0])) [attrs, ...tail] = tail
    if (attrs.class) classes = [...classes, ...attrs.class]
    // shallow copy attrs and delete the "class" value, we've already used that above
    attrs = {...attrs}; delete attrs.class
    // make array of children, recursively flatten the tail into this array
    // and remove nulls while we're at it
    const children = []
    const addChildren = v=>v === null? null : Array.isArray(v)? v.map(addChildren) : children.push(v)
    addChildren(tail)
    return {__m: true, tag: tag || 'div', attrs, classes, children}
}

// We can render:
// - nulls
// - strings
// - numbers
// - virtual DOM nodes
// - Arrays of the above
m.isRenderable = v =>v === null || ['string', 'number'].includes(typeof v) || v.__m || Array.isArray(v)

// Call with a (real) DOM element and a virtual one.
// Sets the attributes and classes on the real element to those of the
// virtual one - but only as it needs to.
m.update = (el, v)=>{
    // if it's a text element, set the data if we have to
    if (!v.__m) return el.data === `${v}` || (el.data = v)
    // set the class names
    for (const name of v.classes) if (!el.classList.contains(name)) el.classList.add(name)
    for (const name of el.classList) if (!v.classes.includes(name)) el.classList.remove(name)
    // set the attributes
    for (const name of Object.keys(v.attrs)) if (el[name] !== v.attrs[name]) el[name] = v.attrs[name]
    for (const {name} of el.attributes) if (!Object.keys(v.attrs).includes(name) && name !== 'class') el.removeAttribute(name)
}

// Given a virtual DOM element, make a real element,
// else make a real textNode of the value.
m.makeEl = v=>v.__m? document.createElement(v.tag) : document.createTextNode(v)

// Given a real DOM element and a virtual one:
//
// a) Get the children of each: olds and news
// b) Remove the excess olds
// c) For each of the new virtual elements:
//   1) Get the matching old element (by index),
//      if there isn't one, make a new element
//   2) If there wasn't a matching old element,
//      append the new one to the parent
//   3) If there is a mismatch (either the tag
//      name doesn't match, or there's an
//      element != textNode), make a new element
//      and replace the matching one on the parent
//   4) Update the attributes/classes on the element
//   5) Recurse through the child's children etc.
//
// Note that this makes appending to lists of elements
// very efficient, but prepending will be O[n]
m.render = (parent, v)=>{
    const olds = parent.childNodes || []  // a)
    const news = v.children || []  // a)
    for (const _ of Array(Math.max(0, olds.length - news.length))) parent.removeChild(parent.lastChild)  // b)
    for (const [i, child] of news.entries()){  // c)
        let el = olds[i] || m.makeEl(child)  // 1)
        if (!olds[i]) parent.appendChild(el)  // 2)
        const mismatch = (el.tagName || '') !== (child.tag || '').toUpperCase()  // 3)
        if (mismatch) (el = m.makeEl(child)) && parent.replaceChild(el, olds[i])  // 3)
        m.update(el, child)  // 4)
        m.render(el, child)  // 5)
    }
}
