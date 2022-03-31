
const inline = (content) => m("code.inline", content)
const python = (content) => m("pre.language-python", m("code", content))

const tags = {
    DP: "Dynamic Programming",
    DP_CLASSIC: "Dynamic Programming - Classic",
    DP_SUM: "Dynamic Programming - Sum within a list",
    MARKY: "Mark as you go",
    PERMUTATIONS: "Permutations",
    TREE: "Trees",
    GRAPH: "Graphs",
    SLIDING_WINDOW: "Sliding window",
    SUBSEQUENCE: "Subsequences",
    FAST_AND_SLOW: "Fast and slow pointers",
    TWO_POINTERS: "Two pointers",
    _3SUM: "3SUM",
    BINARY_SEARCH: "Binary search",
    PRIMES: "Primes",
    BITWISE: "Bitwise",
    PALINDROME: "Palindromes",
    TRIE: "Trie",
    WORDSEARCH: "Wordsearch",
    DOUBLY_LINKED_LIST: "Doubly linked list",
    LRU_CACHE: "LRU Cache",
    SORTING: "Sorting Algorithms",
    HEAP: "Heaps",
    MEDIAN: "Median",
}
const ids = {
    LEETCODE_22: "LEETCODE_22",
    LEETCODE_78: "LEETCODE_78",
    LEETCODE_47: "LEETCODE_47",
    LEETCODE_44: "LEETCODE_44",
    LEETCODE_198: "LEETCODE_198",
    LEETCODE_300: "LEETCODE_300",
    LEETCODE_11: "LEETCODE_11",
    LEETCODE_39: "LEETCODE_39",
    LEETCODE_216: "LEETCODE_216",
    LEETCODE_322: "LEETCODE_322",
    LEETCODE_102: "LEETCODE_102",
    LEETCODE_116: "LEETCODE_116",
    LEETCODE_236: "LEETCODE_236",
    LEETCODE_124: "LEETCODE_124",
    LEETCODE_310: "LEETCODE_310",
    LEETCODE_210: "LEETCODE_210",
    LEETCODE_209: "LEETCODE_209",
    LEETCODE_3: "LEETCODE_3",
    LEETCODE_121: "LEETCODE_121",
    LEETCODE_16: "LEETCODE_16",
    PRIMES_HANDY: "PRIMES_HANDY",
    BITWISE_HANDY: "BITWISE_HANDY",
    LEETCODE_33: "LEETCODE_33",
    LEETCODE_5: "LEETCODE_5",
    LEETCODE_212: "LEETCODE_212",
    LEETCODE_146: "LEETCODE_146",
    SORTING_HANDY: "SORTING_HANDY",
    LEETCODE_295: "LEETCODE_295",
}


const state = {
    tagSelected: null,
}
const toggle = (tag) => {
    if (state.tagSelected === tag) state.tagSelected = null
    else state.tagSelected = tag
    render()
    Prism.highlightAll()
}

const problems = []
const Tag = (tag) => m("button.tag",
    {
        class: state.tagSelected === tag ? ["tag-selected"]: [],
        onclick: () => toggle(tag)
    },
    tag
)
const View = () => m("",
    m("h3", "Tags"),
    Object.values(tags).map(Tag),
    problems
        .filter(problem => state.tagSelected === null || problem.tags.includes(state.tagSelected))
        .map(({id, summary, tags, href, description, code}) => m(".problem",
            {id},
            m("details.no-border", m("summary", m("b", summary), " ┄ ", m("a", {href}, m("span", "original problem"))),
                m(".description", description.length ? description : m("em", "Description  to follow"))),
            tags.map(Tag),
            python(code),
            m("a", {href: "#top"}, m("small", "↑ back to top")),
        )
    )
)

// Problems:

problems.push({
    id: ids.LEETCODE_22,
    summary: "All the permutations of i pairs of parentheses (())",
    tags: [tags.PERMUTATIONS, tags.DP],
    href: "https://leetcode.com/problems/generate-parentheses",
    description: ``,
    code: `def f(i):
    if i == 0:
        return [""]
    a = []
    a_prev = [f(j) for j in range(i)]
    for xs, ys in zip(a_prev, reversed(a_prev)):
        for x in xs:
            for y in ys:
                a.append(f"({x}){y}")
    return a

assert f(3) == ['()()()', '()(())', '(())()', '(()())', '((()))']`,
})

problems.push({
    id: ids.LEETCODE_78,
    summary: "Possible subsets of unique l",
    tags: [tags.PERMUTATIONS],
    href: "https://leetcode.com/problems/subsets",
    description: ``,
    code: `l = [4, 6, 8]
a = [[]]
for x in l:
    a += [ys + [x] for ys in a]

assert a == [[], [4], [6], [4, 6], [8], [4, 8], [6, 8], [4, 6, 8]]`,
})


problems.push({
    id: ids.LEETCODE_47,
    summary: "Find all the permutations",
    tags: [tags.PERMUTATIONS],
    href: "https://leetcode.com/problems/permutations-ii",
    description: ``,
    code: `l = [1, 1, 2]
a = {()}
for x in l:
    a = {(*y[:i], x, *y[i:]) for y in a for i in range(len(y) + 1)}

assert a == {(1, 2, 1), (2, 1, 1), (1, 1, 2)}`,
})


problems.push({
    id: ids.LEETCODE_44,
    summary: "Regex style - do letters s[:i + 1] match pattern p[:j + 1]",
    tags: [tags.DP, tags.DP_CLASSIC],
    href: "https://leetcode.com/problems/wildcard-matching",
    description: ``,
    code: `s, p = "xaylmz", "x?y*z"
def f(i, j):
    if i < -1:
        return False
    x, y = "" if i == -1 else s[i], "" if j == -1 else p[j]
    if y == "":
        return x == ""
    if y == "*":
        return f(i - 1, j) or f(i, j - 1)
    return f(i - 1, j - 1) and (x == y or y == "?")

assert f(len(s) - 1, len(p) - 1) is True`,
})


problems.push({
    id: ids.LEETCODE_198,
    summary: "Max-rob non-adjacent houses",
    tags: [tags.DP, tags.DP_CLASSIC],
    href: "https://leetcode.com/problems/house-robber",
    description: ``,
    code: `l = [2, 7, 9, 3, 1]
def f(i):
    if i == -1:
        return 0
    if i == 0:
        return l[i]
    return max(l[i] + f(i - 2), f(i - 1))

assert f(len(l) - 1) == 12`,
})


problems.push({
    id: ids.LEETCODE_300,
    summary: "Longest increasing subsequence",
    tags: [tags.DP, tags.SUBSEQUENCE],
    href: "https://leetcode.com/problems/longest-increasing-subsequence",
    description: ``,
    code: `l = [10, 9, 2, 5, 3, 7, 101, 18]
def f(i):
    return max((f(j) for j in range(i + 1, len(l)) if l[i] > l[j]), default=0) + 1

assert max(f(i) for i in range(len(l))) ==  4`,
})

problems.push({
    id: ids.LEETCODE_11,
    summary: "How much water?",
    tags: [tags.DP, tags.DP_CLASSIC],
    href: "https://leetcode.com/problems/container-with-most-water",
    description: ``,
    code: `l = [1,8,6,2,5,4,8,3,7]
def f(j):
    return max(((j - i) * min(l[i], l[j]) for i in range(j)), default=0)

assert max(f(j) for j in range(len(l))) == 49`,
})


problems.push({
    id: ids.LEETCODE_39,
    summary: "Unique l, unique sum to t, allow repeats",
    tags: [tags.DP, tags.DP_SUM],
    href: "https://leetcode.com/problems/combination-sum",
    description: ``,
    code: `t, l = 7, [2, 3, 6, 7]
def f(l, t, w):
    for i, x in enumerate(l):
        l_new = l[i:]
        t_new = t - x
        w_new = w + [x]
        if t_new < 0:
            continue
        if t_new == 0:
            yield w_new
            continue
        yield from f(l_new, t_new, w_new)

assert list(f(l, t, [])) == [[2, 2, 3], [7]]`,
})


problems.push({
    id: ids.LEETCODE_216,
    summary: "Unique l, unique sum to t, len == m, no repeats",
    tags: [tags.DP, tags.DP_SUM],
    href: "https://leetcode.com/problems/combination-sum-iii",
    description: ``,
    code: `t, m, l = 9, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9]
def f(l, t, w):
    for i, x in enumerate(l):
        l_new = l[i + 1:]
        t_new = t - x
        w_new = w + [x]
        if t_new < 0:
            break
        if len(w_new) > m:
            break
        if len(w_new) == m and t_new == 0:
            yield w_new
            break
        yield from f(l_new, t_new, w_new)

assert list(f(l, t, [])) ==  [[1, 2, 6], [1, 3, 5], [2, 3, 4]]`,
})


problems.push({
    id: ids.LEETCODE_322,
    summary: "Min number of coins to make t, allow repeats",
    tags: [tags.DP, tags.DP_SUM],
    href: "https://leetcode.com/problems/coin-change",
    description: ``,
    code: `l = [83, 186, 408, 419]
@cache
def f(t):
    if t < 0:
        return None
    if t == 0:
        return 0
    a = [f(t - x) for x in l if f(t - x) is not None]
    return min(a) + 1 if a else None

assert f(6249) == 20`,
})


problems.push({
    id: ids.LEETCODE_102,
    summary: "List of (list of values at each level)",
    tags: [tags.DP_SUM],
    href: "https://leetcode.com/problems/binary-tree-level-order-traversal",
    description: ``,
    code: `@dataclass
class N:
    v: int
    l: N | None = None
    r: N | None = None

n = N(1, N(2, N(4)), N(3))
a = []
def f(n, i):
    if n is None:
        return
    if i == len(a):
        a.append([])
    a[i].append(n.v)
    f(n.l, i + 1)
    f(n.r, i + 1)
f(n, 0)

assert a == [[1], [2, 3], [4]]`,
})

problems.push({
    id: ids.LEETCODE_116,
    summary: "Connect each level",
    tags: [tags.TREE],
    href: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node",
    description: ``,
    code: `@dataclass
class N:
    v: int
    l: N | None = None
    r: N | None = None
    n: N | None = None

original = n = N(1, N(2, N(4), N(5)), N(3, N(6), N(7)))
n_leftmost = n.l
while n.l:
    l, r, e = n.l, n.r, n.n
    l.n = r
    if e:  # go right
        r.n = e.l
        n = e
    else:  # go down
        n = n_leftmost
        n_leftmost = n.l
bottom_left = original.l.l

assert [bottom_left.v, bottom_left.n.v, bottom_left.n.n.v, bottom_left.n.n.n.v] ==  [4, 5, 6, 7]`,
})


problems.push({
    id: ids.LEETCODE_236,
    summary: "Common ancestor of t and m",
    tags: [tags.TREE],
    href: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree",
    description: ``,
    code: `@dataclass
class N:
    v: int
    l: N | None = None
    r: N | None = None

n = N(1, N(2, N(4, N(7))), N(3, N(5, N(8), N(9)), N(6, None, N(10))))
t, m = 8, 6
def f(n):
    if n is None or n.v == t or n.v == m:
        return n
    x, y = f(n.l), f(n.r)
    return n if x and y else (x or y)

assert f(n).v == 3`,
})


problems.push({
    id: ids.LEETCODE_124,
    summary: "Max sum path, up and down",
    tags: [tags.TREE],
    href: "https://leetcode.com/problems/binary-tree-maximum-path-sum",
    description: ``,
    code: `@dataclass
class N:
    v: int
    l: N | None = None
    r: N | None = None

n = N(5, N(4,N(11, N(7), N(2))), N(8, N(13), N(4, N(1))))
a = -999
def f(n):
    global a
    x = f(n.l) if n.l else 0
    y = f(n.r) if n.r else 0
    a = max(a, n.v + max(x, 0) + max(y, 0))
    return max(n.v, n.v + x, n.v + y)
f(n)

assert a == 48`,
})


problems.push({
    id: ids.LEETCODE_310,
    summary: "Find the starting nodes for the minimum height-ed trees (topological sort)",
    tags: [tags.GRAPH],
    href: "https://leetcode.com/problems/minimum-height-trees",
    description: ``,
    code: `n, l = 6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]]
a = {x: set() for x in range(n)}
for x, y in l:
    a[x].add(y)
    a[y].add(x)
b = {x: len(a[x]) for x in range(n)}
xs = []
while b:
    for x in xs:
        for y in a[x]:
            b[y] -= 1
    xs = [x for x in b if b[x] <= 1]
    for x in xs:
        b.pop(x)
        for y in a[x]:
            a[y].remove(x)

assert xs == [3, 4]`,
})


problems.push({
    id: ids.LEETCODE_210,
    summary: "Courses depend on each other, can you complete them?",
    tags: [tags.DP, tags.MARKY],
    href: "https://leetcode.com/problems/course-schedule-ii",
    description: ``,
    code: `t, l = 4, [[1, 0], [2, 0], [3, 1], [3, 2]]
d = {x: set() for x in range(t)}
for x, y in l:
    d[x].add(y)
a = []
b = set()  # current loop
@cache
def f(x):  # has loops
    if x in b:
        return True
    b.add(x)
    if any(f(y) for y in d[x]):
        return True
    b.remove(x)
    a.append(x)
    return False

assert [] if any(f(x) for x in range(t)) else a == [0,1,2,3]`,
})


problems.push({
    id: ids.LEETCODE_209,
    summary: "Shortest subsequence with sum >= t",
    tags: [tags.SLIDING_WINDOW, tags.SUBSEQUENCE],
    href: "https://leetcode.com/problems/minimum-size-subarray-sum",
    description: ``,
    code: `@dataclass
class S:
    l: list[int]
    i: int = -1
    j: int = -1
    a: int = 0
    def len(self):
        return self.j - self.i
    def at_end(self):
        return self.j == len(self.l) - 1
    def inc_i(self):
        self.i += 1
        self.a -= self.l[self.i]
    def inc_j(self):
        self.j += 1
        self.a += self.l[self.j]

t, l = 7, S([2, 3, 1, 2, 4, 3, 1])
a = 999
while not l.at_end():
    l.inc_j()
    while l.a >= t:
        a = min(a, l.len())
        l.inc_i()

assert a == 2`,
})


problems.push({
    id: ids.LEETCODE_3,
    summary: "Longest subsequence with no repeats",
    tags: [tags.SLIDING_WINDOW, tags.SUBSEQUENCE],
    href: "https://leetcode.com/problems/longest-substring-without-repeating-characters",
    description: ``,
    code: `s = "pwwkew"
i, a = 0, 0
for j in range(len(s)):
    for i_next in range(i, j):
        if s[i_next] == s[j]:
            i = i_next + 1
            break
    a = max(a, j - i + 1)

assert a == 3`,
})


problems.push({
    id: ids.LEETCODE_121,
    summary: "Buy low, sell high, max profit",
    tags: [tags.FAST_AND_SLOW],
    href: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock",
    description: ``,
    code: `l = [7, 2, 5, 1, 3, 6, 4]
i, a = 0, 0
for j, y in enumerate(l):
    if y < x:  # saw a new price < old price
        i = j
    a = max(y - l[i], a)

assert a == 5`,
})


problems.push({
    id: ids.LEETCODE_16,
    summary: "Closest 3SUM",
    tags: [tags.TWO_POINTERS, tags._3SUM],
    href: "https://leetcode.com/problems/3sum-closest",
    description: ``,
    code: `t, l = 0, [-2, -1, -1, 0, 4, 5, 5, 6]
l.sort()
a = l[0] + l[1] + l[2]
for i in range(len(l) - 2):
    j, k = i + 1, len(l) - 1
    while j < k:
        x = l[i] + l[j] + l[k]
        if abs(x - t) < abs(a - t):
            a = x
        if x < t:
            j += 1
        else:
            k -= 1

assert a == 1`,
})


problems.push({
    id: ids.LEETCODE_33,
    summary: "Find t in ordered, rotated l",
    tags: [tags.BINARY_SEARCH],
    href: "https://leetcode.com/problems/search-in-rotated-sorted-array",
    description: ``,
    code: `t, l = 1, [4, 5, 6, 7, 0, 1, 2]
i, k, a = 0, len(l) - 1, -1
while True:
    j = (i + k) // 2
    x, y, z = l[i], l[j], l[k]
    if y == t:
        a = j
        break
    if z == t:
        a = k
        break
    if x <= t <= y or (x > y and (x <= t or t <= y)):
        k = j
    else:
        i = j

assert a == 5`,
})

problems.push({
    id: ids.PRIMES_HANDY,
    summary: "Sieve of Eratosthenes",
    tags: [tags.PRIMES],
    href: "https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes",
    description: ``,
    code: `primes = (x for x in count(start=2) if all(x % y for y in range(2, int(x ** 0.5) + 1)))

assert [x for x, _ in zip(primes, range(10))] == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]`,
})

problems.push({
    id: ids.BITWISE_HANDY,
    summary: "Bitwise operations",
    tags: [tags.BITWISE],
    href: "https://wiki.python.org/moin/BitwiseOperators",
    description: ``,
    code: `x, y = 4, 5
assert ~x     == -x -  1
assert x >> y ==  x // 2 ** y
assert x << y ==  x *  2 ** y
assert x ^ y  == (x | y) & ~(x & y)  # XOR = OR but not AND
assert x ^ x  ==  0
assert x      == int(bin(x)[2:], base=2)`,
})

problems.push({
    id: ids.LEETCODE_5,
    summary: "Is it a palindrome?",
    tags: [tags.PALINDROME],
    href: "https://leetcode.com/problems/longest-palindromic-substring",
    description: ``,
    code: `s = "_".join(s)  # then do as you'd think, decrementing i, j until no match`,
})


problems.push({
    id: ids.LEETCODE_212,
    summary: "Wordsearch, many words",
    tags: [tags.TRIE, tags.WORDSEARCH, tags.MARKY],
    href: "https://leetcode.com/problems/word-search-ii",
    description: ``,
    code: `l = [
    ["o","a","a","n"],
    ["e","t","a","e"],
    ["i","h","k","r"],
    ["i","f","l","v"]]
t = ["oath","pea","eat","rain"]

WORD = True
Trie = lambda: defaultdict(Trie)
b = {(i, j): x for i, row  in enumerate(l) for j, x in enumerate(row)}
root = Trie()
for word in t:
    d = root
    for x in word:
        d = d[x]
    d[WORD]

def f(n, word, i, j):
    if WORD in n:
        yield word
        del n[WORD]
    x = b.get((i, j))
    if x not in n:
        return
    n_next = n[x]
    b[i, j] = "#"
    yield from f(n_next, word + x, i + 1, j)
    yield from f(n_next, word + x, i - 1, j)
    yield from f(n_next, word + x, i, j + 1)
    yield from f(n_next, word + x, i, j - 1)
    b[i, j] = x

assert [word for i, j in b for word in f(root, "", i, j)] == ['oath', 'eat']`,
})


problems.push({
    id: ids.LEETCODE_146,
    summary: "LRU cache",
    tags: [tags.LRU_CACHE, tags.DOUBLY_LINKED_LIST],
    href: "https://leetcode.com/problems/lru-cache",
    description: ``,
    code: `@dataclass
class N:
    k: int
    v: int
    prev: N | None = None
    next: N | None = None

def LRUCache(capacity):
    d = {}
    head, tail = N(0, 0), N(0, 0)
    head.next, tail.prev = tail, head

    def splice(n):
        n.prev.next, n.next.prev = n.next, n.prev

    def add(n):
        most_recent = tail.prev
        n.prev, n.next = most_recent, tail
        most_recent.next, tail.prev = n, n

    def get(k):
        if k not in d:
            return -1
        n = d[k]
        splice(n)
        add(n)
        return n.v

    def put(k, v):
        if k in d:
            splice(d[k])
        n = N(k, v)
        add(n)
        d[k] = n
        if len(d) > capacity:
            least_recent = head.next
            splice(head.next)
            del d[least_recent.k]

    return SimpleNamespace(get=get, put=put)

c = LRUCache(2)

assert [c.put(1, 1), c.put(2, 2), c.get(1), c.put(3, 3), c.get(2), c.put(4, 4), c.get(1), c.get(3), c.get(4)] == [None, None, 1, None, -1, None, -1, 3, 4]`,
})

problems.push({
    id: ids.SORTING_HANDY,
    summary: "Quicksort algorithm",
    tags: [tags.SORTING],
    href: "https://lamfo-unb.github.io/img/Sorting-algorithms/Quicksort-example.gif",
    description: ``,
    code: `# O(n log(n)) -> O(n ** 2)
def quick(l):
    if len(l) == 0:
        return l
    a, b, c = [], [], []
    p = l[0]
    [(a if x < p else c if x > p else b).append(x) for x in l]
    return quick(a) + b + quick(c)

assert quick([5, 4, 7, 3, 2, 9, 7]) == sorted([5, 4, 7, 3, 2, 9, 7])`,
})


problems.push({
    id: ids.LEETCODE_295,
    summary: "Calculate median from a stream",
    tags: [tags.HEAP, tags.MEDIAN],
    href: "https://leetcode.com/problems/find-median-from-data-stream",
    description: ``,
    code: `def MedianFinder():
    even = True
    largest_at_tip = Heap(lambda a, b: a < b)
    smallest_at_tip = Heap(lambda a, b: a >= b)

    def add(x):
        nonlocal even
        a, b = (smallest_at_tip, largest_at_tip) if even else (largest_at_tip, smallest_at_tip)
        b.push(x)
        a.push(b.pop())
        even = not even

    def median():
        if even:
            return float(smallest_at_tip.tip() + largest_at_tip.tip()) / 2
        else:
            return float(smallest_at_tip.tip())

    return SimpleNamespace(addNum=add, findMedian=median)

class N: __slots__ = "v", "p", "l", "r"  # for performance

def swap(a, b):
    a.v, b.v = b.v, a.v

def Heap(f):  # Can also use heapq from stdlib
    tip = None
    length = 0

    def get_ith_node(i):
        n = tip
        for b in bin(i + 1)[3:]:
            n = n.l if b == "0" else n.r
        return n

    def swap_towards_tip(n):
        while n.p:
            parent = n.p
            if f(n.v, parent.v):
                break
            swap(n, parent)
            n = parent

    def swap_away_from_tip(n):
        while n.l:
            child = n.l
            if n.r and f(child.v, n.r.v):
                child = n.r
            swap(n, child)
            n = child
        swap_towards_tip(n)

    def push(x):
        nonlocal tip
        nonlocal length

        new = N()
        new.v, new.p, new.l, new.r = x, None, None, None

        if length == 0:
            tip = new
            length = 1
        else:
            parent = get_ith_node((length - 1) // 2)
            if parent.l is None:
                parent.l = new
            else:
                parent.r = new
            new.p = parent
            length += 1
            swap_towards_tip(new)

    def pop():
        nonlocal tip
        nonlocal length

        if length == 0:
            raise IndexError
        if length == 1:
            tip, length, x = None, 0, tip.v
        else:
            final = get_ith_node(length - 1)
            x = tip.v
            tip.v = final.v
            if final.p.r is None:
                final.p.l = None
            else:
                final.p.r = None
            length -= 1
            swap_away_from_tip(tip)
        return x

    return SimpleNamespace(push=push, pop=pop, tip=lambda: tip.v)

x = MedianFinder()
assert [x.addNum(1), x.addNum(2), x.findMedian(), x.addNum(3), x.findMedian()] == [None, None, 1.5, None, 2.0]
`,
})



const root = document.getElementById('root')
const render = () => m.render(root, {children: [View()]})
render()
