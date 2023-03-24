from pydantic import BaseModel


class SystemBase(BaseModel):
    title: str
    description: str | None = None


class SystemCreate(SystemBase):
    pass


class System(SystemBase):
    id: int

    class Config:
        orm_mode = True
