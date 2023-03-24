from names import get_full_name
from pydantic import BaseModel, EmailStr
from hyperdb.data.data_abc import DataABC


class ContributorModel(BaseModel):

    name: str
    email: EmailStr


class Contributor(DataABC):

    model = ContributorModel
    _generated_instances = -1

    def __init__(self, id: int, name: str, email: str):
        self.id = id
        self.name = name
        self.email = email

    @classmethod
    def generate_random(cls):
        cls._generated_instances += 1
        name = get_full_name()
        email = name.replace(" ", ".") + "@hyperdb.com"

        return cls(id=cls._generated_instances, name=name, email=email)
