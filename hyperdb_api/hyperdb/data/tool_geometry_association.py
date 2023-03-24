from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class ToolGeometryAssociationModel(BaseModel):

    contributor: int
    geometry: int
    tool: int | None
    configured_tool: int | None
    

class ToolGeometryAssociation(DataABC):

    model = ToolGeometryAssociationModel
    _generated_instances = -1

    def __init__(self, 
                 id: int, 
                 contributor: int,
                 geometry: int,
                 tool: int | None = None,
                 configured_tool: int | None = None,
                 ):
        self.id = id
        self.contributor = contributor
        self.geometry = geometry
        self.tool = tool
        self.configured_tool = configured_tool

    @classmethod
    def generate_random(cls, num_contributors: int, num_geometries: int, num_tools: int, num_configured_tools: int):
        cls._generated_instances += 1
        contributor = random.randint(0, num_contributors-1)
        geometry = random.randint(0, num_geometries-1)
        tool = random.randint(0, num_tools-1)
        configured_tool = random.randint(0, num_configured_tools-1)

        return cls(id=cls._generated_instances, contributor=contributor, geometry=geometry, tool=tool, configured_tool=configured_tool)
