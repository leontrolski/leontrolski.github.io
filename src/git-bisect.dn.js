import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "git-bisect.html"
const title = "succinct git bisect"
const h1 = [inline("git bisect"), " succinctly"]

export default page(title, h1, [
    m("p", "I can never remember how to ", inline("git bisect"), ", it's occasionally super-useful and there are extensive posts about it elsewhere, but I've never needed more than:"),
    bash(`cd ../top-of-repo

#                sad  happy
git bisect start HEAD HEAD~200 --

# run the test you wrote
git bisect run sh -c 'cd somewhere; pytest something'

# tests run
# then you see like:
# abcd123... is the first bad commit
# then to clean up
git bisect reset`),
])
