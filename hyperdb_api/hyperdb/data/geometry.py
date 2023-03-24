from names import get_first_name
from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class GeometryModel(BaseModel):

    file: str
    contributor: int
    system: int
    classification: str


class Geometry(DataABC):

    model = GeometryModel
    _generated_instances = -1

    def __init__(self, id: int, file: str, contributor: int, system: int, classification: str):
        self.id = id
        self.file = file
        self.contributor = contributor
        self.system = system
        self.classification = classification

    @classmethod
    def generate_random(cls, num_contributors: int, num_systems: int):
        cls._generated_instances += 1
        file = get_first_name() + ".IGS"
        contributor = random.randint(0, num_contributors-1)
        system = random.randint(0, num_systems-1)

        return cls(id=cls._generated_instances, 
                   file=file, 
                   contributor=contributor, 
                   system=system, 
                   classification="UNCLASSIFIED")
