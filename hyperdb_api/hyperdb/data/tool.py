from names import get_first_name
from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class ToolModel(BaseModel):

    name: str
    version: str


class Tool(DataABC):

    model = ToolModel
    _generated_instances = -1

    def __init__(self, id: int, name: str, version: str):
        self.id = id
        self.name = name
        self.version = version

    @classmethod
    def generate_random(cls):
        cls._generated_instances += 1
        name = get_first_name()
        version = "{}.{}.{}".format(random.randint(0, 9), random.randint(0, 9), random.randint(0, 9))

        return cls(id=cls._generated_instances, name=name, version=version)
