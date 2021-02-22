export const page = (title, h1, content) => m("html",
    m("meta", {"name":"viewport","content":"width=device-width, initial-scale=1.0"}),
    m("head",
        m("title", "leontrolski - ", title),
        m("style", m.trust(`
            body {margin: 5% auto; background: #fff7f7; color: #444444; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.8; max-width: 63%;}
            @media screen and (max-width: 800px) {body {font-size: 14px; line-height: 1.4; max-width: 90%;}}
            pre {width: 100%; border-top: 3px solid gray; border-bottom: 3px solid gray;}
            a {border-bottom: 1px solid #444444; color: #444444; text-decoration: none; text-shadow: 0 1px 0 #ffffff; }
            a:hover {border-bottom: 0;}
            .inline {background: #b3b2b226; padding-left: 0.3em; padding-right: 0.3em;}
            blockquote {font-style: italic;color:black;background-color:#f2f2f2;padding:2em;}
            details {border-bottom:solid 5px gray;}
        `)),
        m("link", {href: "https://unpkg.com/prism-themes@1.4.0/themes/prism-vs.css", rel: "stylesheet"}),
        m("script", {src: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/components/prism-core.min.js"}),
        m("script", {src: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/plugins/autoloader/prism-autoloader.min.js"}),
    ),
    m("body",
        m("a", {href: "index.html"}, m("img", {src:"pic.png", style: "height:2em"}), "⇦"),
        m("h1", h1),
        content,
    ),
)
export const inline = (content) => m("code.inline", content)
export const python = (content) => m("pre.language-python", m("code", dedent(content)))
export const js = (content) => m("pre.language-javascript", m("code", dedent(content)))
export const sql = (content) => m("pre.language-sql", m("code", dedent(content)))
export const bash = (content) => m("pre.language-bash", m("code", dedent(content)))
export const html = (content) => m("pre.language-html", m("code", dedent(content)))
export const css = (content) => m("pre.language-css", m("code", dedent(content)))
