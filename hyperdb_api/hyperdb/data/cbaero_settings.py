from names import get_first_name
from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class CBAeroSettingsModel(BaseModel):

    conf_file: str
    hash: str


class CBAeroSettings(DataABC):

    model = CBAeroSettingsModel
    _generated_instances = -1

    def __init__(self, id: int, conf_file: str, hash: str):
        self.id = id
        self.conf_file = conf_file
        self.hash = hash

    @classmethod
    def generate_random(cls):
        cls._generated_instances += 1
        conf_file = get_first_name() + ".conf"
        hash = str(random.randint(0, 100000))
        return cls(id=cls._generated_instances, conf_file=conf_file, hash=hash)
