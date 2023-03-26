from pydantic import BaseModel


class SystemBase(BaseModel):
    name: str
    classification: str


class SystemCreate(SystemBase):
    pass


class System(SystemBase):
    id: int

    class Config:
        orm_mode = True


class CountryBase(BaseModel):
    alpha_three_code: str
    icon: str


class CountryCreate(SystemBase):
    pass


class Country(SystemBase):
    id: int

    class Config:
        orm_mode = True


class ContributorBase(BaseModel):
    name: str
    email: str


class ContributorCreate(SystemBase):
    pass


class Contributor(SystemBase):
    id: int

    class Config:
        orm_mode = True


class GeometryBase(BaseModel):
    file: str
    contributor_fk: int
    system_fk: int
    classification: str


class GeometryCreate(SystemBase):
    pass


class Geometry(SystemBase):
    id: int

    class Config:
        orm_mode = True


class MeshBase(BaseModel):
    file: str
    contributor_fk: int
    geometry_fk: int


class MeshCreate(SystemBase):
    pass


class Mesh(SystemBase):
    id: int

    class Config:
        orm_mode = True


class ToolBase(BaseModel):
    name: str
    version: str


class ToolCreate(SystemBase):
    pass


class Tool(SystemBase):
    id: int

    class Config:
        orm_mode = True


class CBAeroSettingBase(BaseModel):
    conf_file: str
    hash: str


class CBAeroSettingCreate(SystemBase):
    pass


class CBAeroSetting(SystemBase):
    id: int

    class Config:
        orm_mode = True


class Cart3DSettingBase(BaseModel):
    cntl_file: str
    hash: str


class Cart3DSettingCreate(SystemBase):
    pass


class Cart3DSetting(SystemBase):
    id: int

    class Config:
        orm_mode = True


class ToolSettingBase(BaseModel):
    cbaero_settings_fk: int
    cart3d_settings_fk: int


class ToolSettingCreate(SystemBase):
    pass


class ToolSetting(SystemBase):
    id: int

    class Config:
        orm_mode = True


class ConfiguredToolBase(BaseModel):
    tool_fk: int
    tool_settings_fk: int


class ConfiguredToolCreate(SystemBase):
    pass


class ConfiguredTool(SystemBase):
    id: int

    class Config:
        orm_mode = True


class ToolMeshAssociationBase(BaseModel):
    contributor_fk: int
    mesh_fk: int
    tool_fk: int
    configured_tool_fk: int


class ToolMeshAssociationCreate(SystemBase):
    pass


class ToolMeshAssociation(SystemBase):
    id: int

    class Config:
        orm_mode = True


class ToolGeometryAssociationBase(BaseModel):
    contributor_fk: int
    geometry_fk: int
    tool_fk: int
    configured_tool_fk: int


class ToolGeometryAssociationCreate(SystemBase):
    pass


class ToolGeometryAssociation(SystemBase):
    id: int

    class Config:
        orm_mode = True


class AeroResultBase(BaseModel):
    mach: float
    alpha: float
    lift_coefficient: float
    drag_coefficient: float
    configured_tool_fk: int
    mesh_fk: int


class AeroResultCreate(SystemBase):
    pass


class AeroResult(SystemBase):
    id: int

    class Config:
        orm_mode = True


class CommentBase(BaseModel):
    title: str
    body: str
    contributor_fk: int
    system_fk: int
    geometry_fk: int
    mesh_fk: int
    tool_mesh_association_fk: int
    configured_tool_fk: int


class CommentCreate(SystemBase):
    pass


class Comment(SystemBase):
    id: int

    class Config:
        orm_mode = True
