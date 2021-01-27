import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "mostly-pointless.html"
const title = "OO in Python is mostly pointless"
const h1 = ["OO in Python is mostly pointless"]

export default page(title, h1, [
    m("p", "People bash OO a lot these days, I'm increasingly coming to the opinion they're right, at least in Python. My point here is not to argue that OO is bad per se, more that its introduction is simply unnecessary, AKA not useful."),

    m("h2", "Oli's Conjecture"),
    m("blockquote", "All OO code can be refactored into equivalent non-OO code that's as easy or more easy to understand."),
    m("p", "Let's take an example that should pan out in OO's favour, we've all seen/written code somewhat like the following:"),
    python(`class ApiClient:
    def __init__(self, root_url: str, session_cls: sessionmaker):
        self.root_url = root_url
        self.session_cls = session_cls

    def construct_url(self, entity: str) -> str:
        return f"{self.root_url}/v1/{entity}"

    def get_items(self, entity: str) -> List[Item]:
        resp = requests.get(self.construct_url(entity))
        resp.raise_for_status()
        return [Item(**n) for n in resp.json()["items"]]

    def save_items(self, entity: str) -> None:
        with scoped_session(self.session_cls) as session:
            session.add(self.get_items(entity))


class ClientA(ApiClient):
    def construct_url(self, entity: str) -> str:
        return f"{self.root_url}/{entity}"


class ClientB(ApiClient):
    def construct_url(self, entity: str) -> str:
        return f"{self.root_url}/a/special/place/{entity}"


client_a = ClientA("https://client-a", session_cls)
client_a.save_items("bars")`),

    m("p", "We chose OO it because we wanted to bind the ", inline("root_url"), " to something and we didn't want to pass around the ", inline("sessionmaker"), ". We also wanted to utilise inheritance to hook into a method halfway through the call stack."),

    m("p", "But what if we do just pass data around, and write 'boring' functions, what happens then?"),

    python(`@dataclass
class Client:
    root_url: str
    url_layout: str


client_a = Client(
    root_url="https://client-a",
    url_layout="{root_url}/{entity}",
)

client_b = Client(
    root_url="https://client-b",
    url_layout="{root_url}/a/special/place/{entity}",
)


def construct_url(client: Client, entity: str) -> str:
    return client.url_layout.format(root_url=client.root_url, entity=entity)


def get_items(client: Client, entity: str) -> List[Item]:
    resp = requests.get(construct_url(client, entity))
    resp.raise_for_status()
    return [Item(**n) for n in resp.json()["items"]]


def save_items(client: Client, session_cls: session_cls, entity: str) -> None:
    with scoped_session(session_cls) as session:
        session.add(get_items(client, entity))


save_items(client_a, session_cls, "bars")`),
    m("p", "We had to pass round the ", inline("Client"), " and the ", inline("session_cls"), " around."),
    m("p", "🤷"),
    m("p", "Who cares? We even wrote like 10% fewer characters. Also, the conjecture stands, the resulting code is at least as easy to understand and we didn't need any OO."),
    m("p", "I've heard this style referred to as the ", m("b", "bag-of-functions"), " style. That is to say, all your code just consists of typed data and module-namespaced-bags-of-functions."),

    m("h2", "What about long lived global-y things?"),
    m("p", "Use ", m("a", {href: "sane-config.html"}, "this pattern"), " to reuse config/db session classes over the lifetime of an application."),

    m("h2", "What about interfaces/abstract base classes?"),
    m("p", "Just try writing without them, I promise it's going to be OK. ", m("em", "(To be fair, it's only the introduction of type hints to Python that has made the ", m("b", "bag-of-functions"), " style so pleasant).")),

    m("h2", "What about impure things?"),
    m("p", "If you've taken the pure-FP/hexagonal-architecture pill, you want to write pure classes that take impure 'adapter' instances for ", inline("getting-the-current-datetime/API-calls/talking-to-the-db/other-impure-stuff"), ". The idea is nice in principal - should be good for testing right? - in practice, you can just use ", m("a", {href: "https://github.com/spulec/freezegun"}, "freezegun"), " / use ", m("a", {href: "https://github.com/getsentry/responses"}, "responses"), " / ", m("a", {href: "https://dhh.dk/2014/slow-database-test-fallacy.html"}, "test with the db"), " (the ", inline("other-impure-stuff"), " tends to not actually exist) and save yourself a lot of hassle."),

    m("h2", "Exceptions:"),
    m("p", "I'd like to make exceptions for the following:"),
    m("ul",
        m("li", "You'll notice I put ", inline("@dataclass"), "s in the refactored code, these are fine - they're just record types. Python 5 will only have these, not 'normal' classes."),
        m("li", "It's fine to subclass ", inline("Exception"), "s.  The usage of ", inline("try: ... except SomeClass: ..."), " fundamentally ties you to a heirarchical worldview, this is fine, just don't make it too complicated."),
        m("li", inline("Enum"), "s - same as above, they fit in well with the rest of Python."),
        m("li", "Very, very occasionally (at least in application development), you come up with a core type that's used so often, it's nice to have the cutesy stuff - think something like a ", inline("pandas.DataFrame"), "/", inline("sqlalchemy.Session"), ". In general though, don't kid yourself that you're building anything that exciting, it's just vanity getting the better of you.")),

    m("h2", "I lied."),
    m("blockquote", "My point here is not to argue that OO is bad per se."),
    m("p", "OK, I lied, it's not just a case of OO being a largely futile addition to the language, it's that it often obscures the problem at hand and encourages bad behaviours:"),
    m("ul",
        m("li", "It encourages you to mutate. Bag-of-functions makes it feel icky to mutate arguments - as it should feel. (Feel free to mutate within the confines of your function BTW, let's not go mad FP)."),
        m("li", "It's somewhat just the return of global variables. Not being able to share data between functions with ", inline("self"), " forces you to write functions with a smaller state-space that are easier to test."),
        m("li", "Smooshing in functions in with yor data makes it harder to serialise anything - in a world of REST APIs, serialisability is super useful."),
        m("li", "It encourages mad inheritance heirarchies - this has been talked about at length elsewhere."),
        m("li", "Most importantly though, it adds nothing, it's just noise that distracts from the problem at hand and makes it harder to navigate/comprehend your code.")),

    m("h2", "Notes"),
    m("ul",
        m("li", m("a", {href: "poor-mans-object.html"}, "I've written before about the poor man's object/closure thingy.")),
        m("li", m("a", {href: "https://www.youtube.com/watch?v=o9pEzgHorH0"}, "A classic video in the OO-bashing genre.")))
])
