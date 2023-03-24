import pycountry
from pydantic import BaseModel
from hyperdb.data.data_abc import DataABC


class CountryModel(BaseModel):

    alpha_three_letter: str
    icon: str | None


class Country(DataABC):

    model = CountryModel
    _generated_instances = -1

    def __init__(self, id: int, alpha_three_letter: str, icon: str | None = None):
        self.id = id
        self.alpha_three_letter = alpha_three_letter
        self.icon = icon

    @classmethod
    def generate_random(cls):
        cls._generated_instances += 1
        country = list(pycountry.countries)[cls._generated_instances % len(pycountry.countries)]

        return cls(id=cls._generated_instances, alpha_three_letter=country.alpha_3)
