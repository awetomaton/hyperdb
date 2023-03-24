from names import get_first_name
from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class MeshModel(BaseModel):

    file: str
    contributor: int
    geometry: int


class Mesh(DataABC):

    model = MeshModel
    _generated_instances = -1

    def __init__(self, id: int, file: str, contributor: int, geometry: int):
        self.id = id
        self.file = file
        self.contributor = contributor
        self.geometry = geometry

    @classmethod
    def generate_random(cls, num_contributors: int, num_geometries: int):
        cls._generated_instances += 1
        file = get_first_name() + ".IGS"
        contributor = random.randint(0, num_contributors-1)
        geometry = random.randint(0, num_geometries-1)

        return cls(id=cls._generated_instances, 
                   file=file, 
                   contributor=contributor, 
                   geometry=geometry)
