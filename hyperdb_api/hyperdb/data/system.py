from pydantic import BaseModel
from names import get_first_name
from hyperdb.data.data_abc import DataABC


class SystemModel(BaseModel):

    name: str
    classification: str


class System(DataABC):

    model = SystemModel
    _generated_instances = -1

    def __init__(self, id: int, name: str, classification: str):
        self.id = id
        self.name = name
        self.classification = classification

    @classmethod
    def generate_random(cls):
        cls._generated_instances += 1
        name = get_first_name()
        classification = "UNCLASSIFIED"

        return cls(id=cls._generated_instances, name=name, classification=classification)
