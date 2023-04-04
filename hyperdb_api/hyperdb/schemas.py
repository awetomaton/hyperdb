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


class CountryCreate(CountryBase):
    pass


class Country(CountryBase):
    id: int

    class Config:
        orm_mode = True


class ContributorBase(BaseModel):
    name: str
    email: str


class ContributorCreate(ContributorBase):
    pass


class Contributor(ContributorBase):
    id: int

    class Config:
        orm_mode = True


class GeometryBase(BaseModel):
    file: str
    contributor_fk: int
    system_fk: int
    classification: str


class GeometryCreate(GeometryBase):
    pass


class Geometry(GeometryBase):
    id: int

    class Config:
        orm_mode = True


class MeshBase(BaseModel):
    file: str
    contributor_fk: int
    geometry_fk: int


class MeshCreate(MeshBase):
    pass


class Mesh(MeshBase):
    id: int

    class Config:
        orm_mode = True


class ToolBase(BaseModel):
    name: str
    version: str


class ToolCreate(ToolBase):
    pass


class Tool(ToolBase):
    id: int

    class Config:
        orm_mode = True


class CBAeroSettingBase(BaseModel):
    conf_file: str
    hash: str


class CBAeroSettingCreate(CBAeroSettingBase):
    pass


class CBAeroSetting(CBAeroSettingBase):
    id: int

    class Config:
        orm_mode = True


class Cart3DSettingBase(BaseModel):
    cntl_file: str
    hash: str


class Cart3DSettingCreate(Cart3DSettingBase):
    pass


class Cart3DSetting(Cart3DSettingBase):
    id: int

    class Config:
        orm_mode = True


class ToolSettingBase(BaseModel):
    cbaero_settings_fk: int
    cart3d_settings_fk: int


class ToolSettingCreate(ToolSettingBase):
    pass


class ToolSetting(ToolSettingBase):
    id: int

    class Config:
        orm_mode = True


class ConfiguredToolBase(BaseModel):
    tool_fk: int
    tool_settings_fk: int


class ConfiguredToolCreate(ConfiguredToolBase):
    pass


class ConfiguredTool(ConfiguredToolBase):
    id: int

    class Config:
        orm_mode = True


class ToolMeshAssociationBase(BaseModel):
    contributor_fk: int
    mesh_fk: int
    tool_fk: int
    configured_tool_fk: int


class ToolMeshAssociationCreate(ToolMeshAssociationBase):
    pass


class ToolMeshAssociation(ToolMeshAssociationBase):
    id: int

    class Config:
        orm_mode = True


class ToolGeometryAssociationBase(BaseModel):
    contributor_fk: int
    geometry_fk: int
    tool_fk: int
    configured_tool_fk: int


class ToolGeometryAssociationCreate(ToolGeometryAssociationBase):
    pass


class ToolGeometryAssociation(ToolGeometryAssociationBase):
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


class AeroResultCreate(AeroResultBase):
    pass


class AeroResult(AeroResultBase):
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


class CommentCreate(CommentBase):
    pass


class Comment(CommentBase):
    id: int

    class Config:
        orm_mode = True
