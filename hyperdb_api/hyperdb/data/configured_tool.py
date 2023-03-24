from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class ConfiguredToolModel(BaseModel):

    tool: int
    tool_settings: int


class ConfiguredTool(DataABC):

    model = ConfiguredToolModel
    _generated_instances = -1

    def __init__(self, id: int, tool: int, tool_settings: int):
        self.id = id
        self.tool = tool
        self.tool_settings = tool_settings

    @classmethod
    def generate_random(cls, num_tools, num_tool_settings):
        cls._generated_instances += 1
        tool = random.randint(0, num_tools-1)
        tool_settings = random.randint(0, num_tool_settings-1)
        return cls(id=cls._generated_instances, tool=tool, tool_settings=tool_settings)
