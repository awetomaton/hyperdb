from names import get_first_name
from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class Cart3DSettingsModel(BaseModel):

    cntl_file: str
    hash: str


class Cart3DSettings(DataABC):

    model = Cart3DSettingsModel
    _generated_instances = -1

    def __init__(self, id: int, cntl_file: str, hash: str):
        self.id = id
        self.cntl_file = cntl_file
        self.hash = hash

    @classmethod
    def generate_random(cls):
        cls._generated_instances += 1
        cntl_file = get_first_name() + ".cntl"
        hash = str(random.randint(0, 100000))
        return cls(id=cls._generated_instances, cntl_file=cntl_file, hash=hash)
