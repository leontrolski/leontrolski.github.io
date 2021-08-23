const m = (tag, attrs, ...tail) => {
    const classes = attrs.class ? attrs.class.split(' ') : []
    attrs = {...attrs}; delete attrs.class
    const children = []
    const addChildren = v => v === null? null : Array.isArray(v)? v.map(addChildren) : children.push(v)
    addChildren(tail)
    return {__m: true, tag: tag || 'div', attrs, classes: classes.sort(), children}
}
m.isRenderable = v =>v === null || ['string', 'number'].includes(typeof v) || v.__m || Array.isArray(v)
m.update = (el, v) => {
    if (!v.__m) return el.data === `${v}` || (el.data = v)
    for (const name of v.classes) if (!el.classList.contains(name)) el.classList.add(name)
    for (const name of el.classList) if (!v.classes.includes(name)) el.classList.remove(name)
    for (const name of Object.keys(v.attrs)) if (el[name] !== v.attrs[name]) el[name] = v.attrs[name]
    for (const {name} of el.attributes) if (!Object.keys(v.attrs).includes(name) && name !== 'class') el.removeAttribute(name)
}
m.makeEl = v => v.__m? document.createElement(v.tag) : document.createTextNode(v)
m.render = (parent, v) => {
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
m.parseJsx = s => {
    const push = (l, v) => typeof l[l.length-1] === 'string' && typeof v === 'string' ? l[l.length-1] += v : l.push(v)
    const ts = `{${s}}`.split(/('|"|`|<|>|\/|\$\{|\{|\}|=|\n)/).filter(n => n.length)
    let [i, max] = [0, ts.length + 2]
    const areTokens = () => max-- || (() =>{throw new Error('exhausted tokens')})()
    const parseUntil = chars => {
        let c = ts[i++]
        while (areTokens()){
            if (chars.includes(ts[i]) && ts[i-1][ts[i-1].length-1] !== '\\') return c + ts[i++]
            else c += ts[i++]
        }
    }
    const parseJs = (inTemplate=false) => {
        const c = inTemplate ? [] : [ts[i++]]
        let objectDepth = 0
        while (areTokens()){
            if (ts[i] === "'") push(c, parseUntil(["'"]))
            else if (ts[i] === '"') push(c, parseUntil(['"']))
            else if (ts[i] === '`') push(c, parseTemplate())
            else if (ts[i] === '<' && ts[i+1][0] !== ' ' && ts[i+1][0] !== '=') push(c, parseEl())
            else if (ts[i] === '{') push(c, ts[i++]) && objectDepth++
            else if (ts[i] === '}' && objectDepth) push(c, ts[i++]) && objectDepth--
            else if (ts[i] === '}' && inTemplate) break
            else if (ts[i] === '}') { push(c, ts[i++]); break}
            else if (ts[i] === '/' && ts[i+1] === '/') while (ts[i] != '\n') i++
            else push(c, ts[i++])
        }
        return {toString: () => c.join('').slice(inTemplate ? 0 : 1, inTemplate ? undefined : -1)}
    }
    const parseTemplate = () => {
        const c = [parseUntil(['${', '`'])]
        const endsWith = end => typeof c[c.length-1] === 'string' && c[c.length-1].endsWith(end)
        while (areTokens()){
            if (endsWith('`')) return {toString: () => c.join('')}
            else if (endsWith('${')) push(c, parseJs(true))
            else push(c, parseUntil(['${', '`']))
        }
    }
    const parseEl = () => {
        const [c, d] = [[ts[i++]], []]
        while (areTokens()){
            if (ts[i] === '>'){ i++; break }
            else if (ts[i] === '{') c.push(parseJs())
            else if (ts[i] === '"') c.push(parseUntil(['"']))
            else c.push(...ts[i++].split(/( )/))
        }
        const tag = c.filter(n => n !== '/' && n !== ' ')[1]
        let repr = document.createElement(tag).toString().includes('UnknownElement') ? `${tag}({` : `m("${tag}", {`
        for (const [i, v] of c.entries()) repr += v.toString().startsWith('...') ? `${v}, ` : v === '=' ? `"${c[i-1]}": ${c[i+1]}, ` : ''
        const htmliseWhitepace = n => typeof n === 'string' ? `"${n.replace(/\n/g, ' ').replace(/ +/g, ' ')}"` : n
        const el = {toString: () => `${repr}}, ${d.map(htmliseWhitepace).join(', ')})`}
        if (!document.createElement(tag).outerHTML.includes('/') || c.indexOf('/') === c.length - 1) return el
        if (c.includes('/')) return Symbol.for('closing-tag')
        while (areTokens()){
            if (ts[i] === '<') {
                const inner = parseEl()
                if (inner === Symbol.for('closing-tag')) return el
                push(d, inner)
            }
            else if (ts[i] === '{') push(d, parseJs())
            else push(d, ts[i++])
        }
    }
    return parseJs().toString()
}
[...document.getElementsByTagName('script')].map(el => el.type === "text/jsx" ? eval(m.parseJsx(el.innerHTML)) : null);
