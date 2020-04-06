// UI
function tableCellClick(e, prop){
    console.log(`Click${prop}`)
    e.preventDefault()
    e.stopPropagation()
}
const TableCell = prop=>m('td.TableCell',
    {'data-text': prop, onclick: e=>tableCellClick(e, prop)},
    prop,
)
const TableRow = data=>m('tr.TableRow',
    {class: data.active? ['active'] : [], 'data-id': data.id},
    TableCell(`#${data.id}`),
    data.props.map(TableCell),
)
const Table = data=>m('table.Table', m('tbody', data.table.items.map(TableRow)))
const animBoxStyle = time=>`
    border-radius:${time % 10}px;
    background:rgba(0,0,0,${0.5 + ((time % 10) / 10)});
`
const AnimBox = props=>m('.AnimBox', {style: animBoxStyle(props.time), 'data-id': props.id})
const Anim =data=>m('.Anim', data.anim.items.map(AnimBox))
const TreeLeaf = props=>m('li.TreeLeaf', props.id)
const TreeNode = data=>m('ul.TreeNode', data.children.map(n=>n.container? TreeNode(n) : TreeLeaf(n)))
const Tree = data=>m('.Tree', TreeNode(data.tree.root))

// test
// uibench.init in the html (one per framework)
function renderState(container, state){
    const location = state && state.location
    const fs = {
        table: Table,
        anim: Anim,
        tree: Tree,
    }
    // first for mithril, then 33-line
    if (m.redraw) m.render(container, m('.Main', fs[location](state)))
    else m.render(container, {children: [m('.Main', fs[location](state))]})
}
function renderSamples(samples){
    document.body.innerHTML = "<pre>" + JSON.stringify(samples, null, " ") + "</pre>"
}
let container
document.addEventListener("DOMContentLoaded", (e) => {
    container = document.querySelector("#App")
    uibench.run(state=>renderState(container, state), renderSamples)
})
