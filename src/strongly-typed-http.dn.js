import { page, inline, python, bash, js, html, css } from "./base.dn.js"

export const filename = "strongly-typed-http.html"
const title = "strongly typed http"
const h1 = "Strongly typed Web 1.0 with TypeScript"

const video = (src) => m("video", {
    src: src,
    muted: true,
    loop: true,
    autoplay: true,
    style: `
        margin: auto;
        display: block;
        max-width: calc(min(80em, 100%));
        box-shadow: 0px 0px 6px 2px #0000002b;
        margin-bottom: 2em;
    `,
})
const videoSmall = (src) => m("video", {
    src: src,
    muted: true,
    loop: true,
    autoplay: true,
    style: `
        margin: auto;
        display: block;
        max-width: calc(min(30em, 100%));
        box-shadow: 0px 0px 6px 2px #0000002b;
        margin-bottom: 2em;
    `,
})

const l = ["sdf", m("a", {href: ""}, "bb"), ""]
const l = ["sdf", inline("gdfg"), ""]

export default page(title, h1, [
    m("em", `Or more generically - "Using declarative descriptions to strongly type system boundaries with TypeScript".`),
    m("p", "You're building your Web 1.0 site (maybe more ", m("a", {href: "https://en.wikipedia.org/wiki/Web_2.0#Technologies"}, "Web 1.5"), "), you've got proper ", inline("<form>"), "s, ", inline("/urls/with/:params"), ", ", inline("?request=query&parameters=here"), ". All the good stuff. You're rendering your html in the same codebase you're serving routes from, and you're doing it all in TypeScript."),
    m("p", "How can we strongly type all the interactions between client and server so that we can't make stupid mistakes like:"),
    html(`<form method="POST" action="/foo">
    <input name="achieve">
</form>`),
    m("p", "With a typo in our Express app:"),
    js(`app.post("/foo", (req, res) => {
    const achieve = req.body.acheive  // note the typo!
    ...
})`),
    m("h2", "Let's go!"),
    m("p", "I'm going to come back to the implementation, for now let's just write some staticly typed GET links. Firstly, let's describe our routes:"),
    js(`import * as http from "./lib/http"  // our small helper library - see below

const get = {
    index: {
        url: "/",
        params: [],
        query: [],
        queryNotRequired: [],
    },
    "/v1/:foo": {
        url: "/v1/:foo",
        params: ["foo"],
        query: ["a", "b"],
        queryNotRequired: ["c"],
    },
} as const
const GET = http.makeGET(get)`),
    m("ul",
        m("li", "First we have our index, this has no params and no query parameters - simple."),
        m("li", "Next we have the route ", inline("/v1/:foo"), ", this has one param and three query parameters, two of which are required.")),
    m("p", "In our template, we now want to make a link like:"),
    html(`<a href="/v1/hey?a=A&b=B">...</a>`),
    m("p", "We're dynamically rendering the element from ", m("a", {href: "https://reactjs.org/docs/react-dom-server.html"}, "React"), " or ", m("a", {href: "https://github.com/MithrilJS/mithril-node-render#mithril-node-render"}, "Mithril"), " or whatever."),
    m("p", "With our declarative definition set up, we can now use:"),
    js(`href = GET["/v1/:foo"].makeUrl({foo: "hey"}, {a: "A", b: "B"})`),
    m("p", "Let's see with typechecking in VSCode:"),
    video("videos/get-from-client.webm"),
    m("p", "All our parameters were typechecked, wahoo!"),
    m("p", "Now, let's look at the server-side in Express:"),
    js(`app.get(GET["/v1/:foo"].url, (req, res) => {
    const { params, query } = GET["/v1/:foo"].req(req)
})`),
    m("p", "And again with typechecking:"),
    videoSmall("videos/get-from-server.webm"),
    m("p", "A very similar approach is taken for POST routes."),
    m("p", "The description:"),
    js(`const post = {
    "/v2/:bar": {
        url: "/v2/:bar",
        params: ["bar"],
        body: ["email", "message"],
    },
} as const
const POST = http.makePOST(post)`),
    m("p", "During rendering:"),
    js(`const form = POST["/v2/:bar"].makeForm({bar: "there"})`),
    m("p", "Where ", inline("form"), " has the following to help build your html: ", inline(".form"), ", ", inline(".inputs"), ", ", inline(".assertAllInputsReferenced()"), " - this final bit uses some ", inline("Proxy"), " magic to ensure you reference all the form body parts that you needed to."),
    m("p", "Now for the server-side usage in Express:"),
    videoSmall("videos/post-from-server.webm"),
    m("br"),
    m("br"),
    m("h2", "How does it work?"),
    m("p", "I'm not going to go into crazy detail, you can inspect ", m("a", {href: "https://github.com/leontrolski/strongly-typed-http/blob/main/http.ts"}, "the source"), " yourself. In summary, these bits of TypeScript were used heavily (see the video below):"),
    js(`const l = ["a", "b"] as const  // make a value's interior visible to TypeScript
const foo = {bar: l} as const
type Bar = (typeof foo)["bar"]  // convert readonly -> type and access a property
type BarUnion = Bar[number]  // convert literal[] -> union of literals
type BarMap = { [K in BarUnion]?: string}  // make a map from a union of strings
const maker = <L extends readonly string[]>(l: L): L[number] => l[0]  // use generics
const made = maker<typeof l>(l)
`),
    video("videos/nice-typescript.webm"),
    m("h2", "Conclusions"),
    m("ul",
        m("li", "I now have compile time type safety for my old-skool web pages, feels good."),
        m("li", "The big takeaway for me was - use ", inline("as const"), " + generics to bridge the run-time/compile-time boundary."),
        m("li", "There are probably more generic ways of doing this kind of thing, ", m("a", {href: "https://gcanti.github.io/io-ts/modules/Kleisli.ts.html#fromstruct"}, "io-ts"), " is in this space (but requires you and your colleagues to graduate from Kleisli's school of Functors and Monadry)."),
        m("li", "In Python land ", m("a", {href: "https://fastapi.tiangolo.com/#example-upgrade"}, "FastAPI"), " has done a brilliant job of doing this kind of thing, with nice validation methods and swagger docs baked in. If you haven't seen it, look through the docs - every language should have an equivalent framework.")
    ),
])
