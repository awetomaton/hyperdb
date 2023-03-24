from pydantic import BaseModel
import random
from hyperdb.data.data_abc import DataABC


class ToolSettingsModel(BaseModel):

    cbaero_settings: int | None
    cart3d_settings: int | None


class ToolSettings(DataABC):

    model = ToolSettingsModel
    _generated_instances = -1

    def __init__(self, id: int, cbaero_settings: int | None = None, cart3d_settings: int | None = None):
        self.id = id
        self.cbaero_settings = cbaero_settings
        self.cart3d_settings = cart3d_settings

    @classmethod
    def generate_random(cls, num_settings):
        cls._generated_instances += 1
        tool_settings = ["cbaero_settings", "cart3d_settings"]
        chosen_tool_settings_index = random.randint(0, len(tool_settings)-1)

        kwargs = {
            tool_settings[chosen_tool_settings_index]: random.randint(0, num_settings-1)
        }
        return cls(id=cls._generated_instances, **kwargs)
