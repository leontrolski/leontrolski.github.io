// UI
function tableCellClick(e, prop){
    console.log(`Click${prop}`)
    e.preventDefault()
    e.stopPropagation()
}
const tableCellClickCache = {}
function getTableCellClick(prop){
    if (tableCellClickCache[prop]) return tableCellClickCache[prop]
    return tableCellClickCache[prop] = e=>tableCellClick(e, prop)
}
const renderTableCell = prop=>m('td.TableCell',
    {'data-text': prop, onclick: getTableCellClick(prop)},
    prop,
)
const renderTableRow = data=>m('tr.TableRow',
    {class: data.active? ['active'] : [], 'data-id': data.id},
    renderTableCell(`#${data.id}`),
    data.props.map(renderTableCell),
)
const renderTable = data=>m('table.Table', m('tbody', data.table.items.map(renderTableRow)))
const animBoxStyle = time=>`
    border-radius:${time % 10}px;
    background:rgba(0,0,0,${0.5 + ((time % 10) / 10)});
`
const renderAnimBox = props=>m('.AnimBox', {style: animBoxStyle(props.time), 'data-id': props.id})
const renderAnim =data=>m('.Anim', data.anim.items.map(renderAnimBox))
const renderTreeLeaf = props=>m('li.TreeLeaf', props.id)
const renderTreeNode = data=>m('ul.TreeNode', data.children.map(n=>n.container? renderTreeNode(n) : renderTreeLeaf(n)))
const renderTree = data=>m('.Tree', renderTreeNode(data.tree.root))

// test
uibench.init("React33", "0.0.1")
function renderState(container, state){
    const location = state && state.location
    const fs = {
        table: renderTable,
        anim: renderAnim,
        tree: renderTree,
    }
    m.render(container, {children: [m('.Main', fs[location](state))]})
}
function renderSamples(samples){
    document.body.innerHTML = "<pre>" + JSON.stringify(samples, null, " ") + "</pre>"
}
let container
document.addEventListener("DOMContentLoaded", (e) => {
    container = document.querySelector("#App")
    uibench.run(state=>renderState(container, state), renderSamples)
})
// const [x, row] = [100, [...Array(4)].map((_, i)=>i)]
// const state = {
//     location: 'table',
//     table: {
//         items: [...Array(x)].map((_, i)=>({active: false, id: i, props: row})),
//     }
// }

// Framework:
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
    const normal = Object.keys(v.attrs).filter(name=>!name.startsWith('data-'))
    for (const name of normal) if (el[name] !== v.attrs[name]) el[name] = v.attrs[name]
    for (const {name} of el.attributes) if (!normal.includes(name) && name !== 'class' && !name.startsWith('data-')) el.removeAttribute(name)
    const data = Object.keys(v.attrs).filter(name=>name.startsWith('data-')).map(name=>name.slice(5))
    for (const name of data) if (el.dataset[name] !== `${v.attrs[`data-${name}`]}`) el.dataset[name] = v.attrs[`data-${name}`]
    for (const name of Object.keys(el.dataset)) if (!data.includes(name)) delete el.dataset[name]
}
m.fresh = (el, v)=>{
    if (!v.__m) return el.data = v
    el.classList.add(...v.classes)
    const normal = Object.keys(v.attrs).filter(name=>!name.startsWith('data-'))
    for (const name of normal) el[name] = v.attrs[name]
    const data = Object.keys(v.attrs).filter(name=>name.startsWith('data-')).map(name=>name.slice(5))
    for (const name of data) el.dataset[name] = v.attrs[`data-${name}`]
}
m.makeEl = v=>v.__m? document.createElement(v.tag) : document.createTextNode(v)
m.render = (parent, v)=>{
    const olds = parent.childNodes || []
    const news = v.children || []
    for (const _ of Array(Math.max(0, olds.length - news.length))) parent.removeChild(parent.lastChild)
    for (const [i, child] of news.entries()){
        const original = olds[i]
        let el = original || m.makeEl(child)
        if (!olds[i]) parent.appendChild(el)
        const mismatch = (el.tagName || '') !== (child.tag || '').toUpperCase()
        if (mismatch) (el = m.makeEl(child)) && parent.replaceChild(el, olds[i])
        if (!original || mismatch) m.fresh(el, child)
        else m.update(el, child)
        m.render(el, child)
    }
}
