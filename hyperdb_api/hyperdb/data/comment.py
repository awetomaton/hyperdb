import lorem
from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class CommentModel(BaseModel):

    title: str
    body: str
    contributor: int
    system: int | None
    geometry: int | None
    mesh: int | None
    tool_mesh_association: int | None
    configured_tool: int | None


class Comment(DataABC):

    model = CommentModel
    _generated_instances = -1

    def __init__(self, 
                 id: int,
                 title: str,
                 body: str,
                 contributor: int,
                 system: int | None = None,
                 geometry: int | None = None,
                 mesh: int | None = None,
                 tool_mesh_association: int | None = None,
                 configured_tool: int | None = None):
        self.id = id
        self.title = title
        self.body = body
        self.contributor = contributor
        self.system = system
        self.geometry = geometry
        self.mesh = mesh
        self.tool_mesh_association = tool_mesh_association
        self.configured_tool = configured_tool

    @classmethod
    def generate_random(cls, 
                        num_contributors: int,
                        num_systems: int,
                        num_geometries: int,
                        num_meshes: int,
                        num_tool_mesh_associations: int,
                        num_configured_tools: int
                        ):
        cls._generated_instances += 1

        title = lorem.sentence()
        body = lorem.paragraph()
        contributor = random.randint(0, num_contributors-1)

        foreign_keys = [
            ("system", random.randint(0, num_systems-1)),
            ("geometry", random.randint(0, num_geometries-1)),
            ("mesh", random.randint(0, num_meshes)),
            ("tool_mesh_association", random.randint(0, num_tool_mesh_associations-1)),
            ("configured_tool", random.randint(0, num_configured_tools-1))
        ]
        foreign_key_index = random.randint(0, len(foreign_keys)-1)
        foreign_key = foreign_keys[foreign_key_index]
        kwargs = {foreign_key[0]: foreign_key[1]}

        return cls(id=cls._generated_instances, 
                   title=title,
                   body=body,
                   contributor=contributor,
                   **kwargs)
