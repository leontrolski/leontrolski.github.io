import { page, inline, python, bash, html, css, sql } from "./base.dn.js"

export const filename = "sqlalchemy-relationships.html"
const title = "SQLAlchemy relationships TLDR"
const h1 = ["SQLAlchemy relationship loading techniques TLDR"]

export default page(title, h1, [
    m("p", "The ", m("a", {href: "https://docs.sqlalchemy.org/en/14/orm/loading_relationships.html"}, "SQLAlchemy docs for relationship loading techniques"), " are great and have some useful examples."),
    m("p", "This is a TLDR for those in a hurry who can never remember the difference between a ", inline("subqueryload"), " and a ", inline("selectinload"), "."),
    m("br"),
    m("details",
        m("summary", "Users have many Baskets, simple! Here's our set up code."),
        python(`from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import (
    backref,
    relationship,
    sessionmaker,
    lazyload,
    joinedload,
    subqueryload,
    selectinload,
    raiseload,
    noload,
)
from sqlalchemy.schema import ForeignKey

Base = declarative_base()


class User(Base):
    __tablename__ = "user"
    user_id = Column(Integer, primary_key=True)
    name = Column(String)


class Basket(Base):
    __tablename__ = "basket"
    basket_id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey(User.user_id))
    price = Column(Integer)
    user = relationship(User, backref=backref("baskets", lazy="raise"))


engine = create_engine("sqlite://", echo=True)
Base.metadata.create_all(engine)
session = sessionmaker(engine)()


users = [
    User(
        name="ben",
        baskets=[Basket(price=1), Basket(price=2)],
    ),
    User(
        name="si",
        baskets=[Basket(price=3), Basket(price=4)],
    ),
    User(
        name="si",
        baskets=[Basket(price=5)],
    ),
]
session.add_all(users)
session.commit()`),
    ),
    m("br"),
    m("br"),
    m("b", "Note from the above:"),
    python(`backref=backref("baskets", lazy="raise")`),
    m("b", "This should probably be the default as it forces you to pick a loading technique at query time."),
    m("br"),
    m("br"),
    m("p", "The N+1 (where N is the number of Users) looking bit of code we're going to write at is:"),
    python(`qry = (
    session.query(User)
    .filter(User.name == "si")
    .options(someloadingtechnique(User.baskets))
)

for user in qry:  # Point A
    print(f"User: {user.user_id}")

    for basket in user.baskets:  # Point B
        print(f"Basket {basket.basket_id}")`),
    m("p", "We're going to swap out ", inline("someloadingtechnique"), " with each of SQLAlchemy's and inspect the SQL."),
    m("br"),
    python(`.options(lazyload(User.baskets))  # SQLAlchemy's default on a relationship`),
    sql(`-- At point A
SELECT ...
FROM user
WHERE user.name = ?`),
    sql(`-- Each time at point B - classic N+1!
SELECT ...
FROM basket
WHERE ? = basket.user_id`),
    m("br"),
    python(`.options(joinedload(User.baskets))  # I'm informed this is similar to Django's select_related`),
    sql(`-- At point A, nothing at point B
SELECT ...
FROM user
LEFT OUTER JOIN basket ON user.user_id = basket.user_id
WHERE user.name = ?`),
    m("br"),
    python(`.options(subqueryload(User.baskets))`),
sql(`-- At point A, nothing at point B
SELECT ...
FROM (
    SELECT user.user_id AS user_user_id
    FROM user
    WHERE user.name = ?
) AS anon_1
JOIN basket ON anon_1.user_user_id = basket.user_id`),
    m("br"),
    python(`.options(selectinload(User.baskets))  # I'm informed this is similar to Django's prefetch_related`),
    sql(`-- Both at point A!
SELECT ...
FROM user
WHERE user.name = ?

SELECT ...
FROM user
JOIN basket ON user.user_id = basket.user_id
WHERE user.user_id IN (?, ?) -- The ids we SELECT-ed above earlier

-- SQLAlchemy "joins" the results together in memory`),
    m("br"),
    python(`.options(raiseload(User.baskets))

# At point B, raises an error, no second query performed`),
    m("br"),
    python(`.options(noload(User.baskets))

# At point B, no second query performed
# user.baskets is just an empty list`),

])
