from pydantic import BaseModel


class System(BaseModel):
    id: int
    name: str
    classification: str
