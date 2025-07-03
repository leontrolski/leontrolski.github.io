# /// script
# requires-python = ">=3.14"
# dependencies = [
#     "trolskgen>=0.0.10",
# ]
# ///
import io
from string.templatelib import Template
import xml.etree.ElementTree as ET

import trolskgen

schema = """
<A x="str" y="int">
    <B many="true" z="int" />
    <C x="str" />
</A>
"""
schema_xml = ET.parse(io.StringIO(schema)).getroot()


def as_field(node: ET.Element) -> Template:
    t = trolskgen.t(node.tag)
    if node.attrib.get("many") == "true":
        t = list[t]
    return t"{node.tag.lower()}: {t}"


def yield_classes(node: ET.Element) -> Template:
    fields = [t"{k}: {trolskgen.t(v)}" for k, v in node.attrib.items() if k != "many"]
    fields += [as_field(c) for c in node]
    yield t"""
        class {node.tag}(pydantic.BaseModel):
            {fields:*}
    """
    for c in node:
        yield from yield_classes(c)


source_template = t"""
from __future__ import annotations
import pydantic

{list(yield_classes(schema_xml)):*}
"""

print(trolskgen.to_source(source_template))

"""
from __future__ import annotations
import pydantic

class A(pydantic.BaseModel):
    x: str
    y: int
    b: list[B]
    c: C

class B(pydantic.BaseModel):
    z: int

class C(pydantic.BaseModel):
    x: str
"""
