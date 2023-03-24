from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class CountrySystemAssociationModel(BaseModel):

    country: int
    system: int


class CountrySystemAssociation(DataABC):

    model = CountrySystemAssociationModel
    _generated_instances = -1

    def __init__(self, id: int, country: int, system: int):
        self.id = id
        self.country = country
        self.system = system

    @classmethod
    def generate_random(cls, num_countries: int, num_systems: int):
        country = random.randint(0, num_countries-1)
        system = random.randint(0, num_systems-1)
        cls._generated_instances += 1

        return cls(id=cls._generated_instances, country=country, system=system)
