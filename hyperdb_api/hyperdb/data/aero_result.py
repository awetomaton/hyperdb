from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class AeroResultModel(BaseModel):

    mach: float
    alpha: float
    lift_coefficient: float
    drag_coefficient: float
    configured_tool: int


class AeroResult(DataABC):

    model = AeroResultModel
    _generated_instances = -1

    def __init__(self, id: int, mach: float, alpha: float, lift_coefficient: float, drag_coefficient: float, configured_tool: int):
        self.id = id
        self.mach = mach
        self.alpha = alpha
        self.lift_coefficient = lift_coefficient
        self.drag_coefficient = drag_coefficient
        self.configured_tool = configured_tool

    @classmethod
    def generate_random(cls, num_configured_tools: int):
        cls._generated_instances += 1
        mach = random.random()
        alpha = random.random()
        lift_coefficient = random.random()
        drag_coefficient = random.random()
        configured_tool = random.randint(0, num_configured_tools-1)
        return cls(id=cls._generated_instances, 
                   mach=mach,
                   alpha=alpha,
                   lift_coefficient=lift_coefficient,
                   drag_coefficient=drag_coefficient,
                   configured_tool=configured_tool)
