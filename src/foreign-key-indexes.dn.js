import { page, inline, python, bash, html, css } from "./base.dn.js"

export const filename = "foreign-key-indexes.html"
const title = "foreign key indexes"
const h1 = ["Don't get bitten by missing foreign key indexes"]

export default page(title, h1, [
    m("p", "Postgres doesn't give you indexes on foreign keys by default (unlike primary keys). This makes some sense when you think about it - there's no necessity for them in order to keep the constraint checking efficient."),
    m("p", "In reality, you nearly always want an index on any foreign keys - every time you join tables on said key. I lost track of the number of times I've hit performance bugs due to this, so I added a test to check, feel free to steal:"),
    python(`# lovingly copy-pasta-ed from stackoverflow
foreign_key_sql = """
SELECT
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT OUTER JOIN (
    SELECT
        t.relname AS table_name,
        a.attname AS column_name,
        i.relname AS index_name
    FROM
        pg_class AS t,
        pg_class AS i,
        pg_index AS ix,
        pg_attribute AS a
    WHERE
        t.oid = ix.indrelid
        AND i.oid = ix.indexrelid
        AND a.attrelid = t.oid
        AND a.attnum = ANY(ix.indkey)
        AND t.relkind = 'r'
) as indexes
ON tc.table_name = indexes.table_name AND kcu.column_name = indexes.column_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND indexes.index_name IS NULL
"""

def assert_all_foreign_keys_have_indexes(engine: Engine) -> None:
    rows = list(engine.execute(foreign_key_sql))
    if rows:
        msg = "The following foreign keys have no index:\\n" + "\\n".join(
            f"{table=} {column=} {foreign_key=}"
            for table, column, foreign_key in rows
        )
        raise RuntimeError(msg)`),
])
