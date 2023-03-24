from abc import ABC, abstractclassmethod


class DataABC(ABC):

    def __str__(self) -> str:
        return self.__repr__()
    
    def __repr__(self) -> str:
        return str(self.to_dict())

    @classmethod
    def from_dict(cls, d):
        return cls(**d)

    @abstractclassmethod
    def generate_random(cls):
        pass

    def to_dict(self) -> dict:
        d = {}
        for attr_name in dir(self):
            if attr_name.startswith("_"):
                continue
            if attr_name == "model":
                continue
            attr_val = getattr(self, attr_name)
            if callable(attr_val):
                continue
            d[attr_name] = attr_val
        return d
    
    def to_sql_insert(self) -> str:
        return ''
    