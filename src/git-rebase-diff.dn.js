import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "git-rebase-diff.html"
const title = "diffing after rebase"
const h1 = [inline("git diff"), " after a rebase"]

export default page(title, h1, [
    m("p", "After doing a particularly hairy rebase, you want to check what changed (intentionally or otherwise), but only in the files you worked on originally."),
    m("p", "After rebasing, you try:"),
    bash(`git diff origin/my-special-branch my-special-branch`),
    m("p", "But there's a load of changes that other contributors have made that you don't care about!"),
    m("p", "Here's how to restrict the diff:"),
    bash(`BRANCH=my-special-branch; git diff origin/$BRANCH $BRANCH -- $(git diff master $BRANCH --name-only)`),
])
