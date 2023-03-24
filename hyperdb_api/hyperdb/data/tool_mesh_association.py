from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class ToolMeshAssociationModel(BaseModel):

    contributor: int
    mesh: int
    tool: int | None
    configured_tool: int | None
    

class ToolMeshAssociation(DataABC):

    model = ToolMeshAssociationModel
    _generated_instances = -1

    def __init__(self, 
                 id: int, 
                 contributor: int,
                 mesh: int,
                 tool: int | None = None,
                 configured_tool: int | None = None,
                 ):
        self.id = id
        self.contributor = contributor
        self.mesh = mesh
        self.tool = tool
        self.configured_tool = configured_tool

    @classmethod
    def generate_random(cls, num_contributors: int, num_meshes: int, num_tools: int, num_configured_tools: int):
        cls._generated_instances += 1
        contributor = random.randint(0, num_contributors-1)
        mesh = random.randint(0, num_meshes-1)
        tool = random.randint(0, num_tools-1)
        configured_tool = random.randint(0, num_configured_tools-1)

        return cls(id=cls._generated_instances, contributor=contributor, mesh=mesh, tool=tool, configured_tool=configured_tool)
