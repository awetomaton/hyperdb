from datetime import datetime
from enum import Enum
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


class CommentType(str, Enum):
    contributor = 'contributor'
    system = 'system'
    geometry = 'geometry'
    mesh = 'mesh'
    tool_mesh_association = 'tool_mesh_association'
    configured_tool = 'configured_tool'


class SystemBase(BaseModel):
    name: str
    classification: str
    country_fk: int | None


class SystemCreate(SystemBase):
    pass


class System(SystemBase):
    id: int

    class Config:
        orm_mode = True


class CountryBase(BaseModel):
    alpha_three_code: str
    icon: str | None


class CountryCreate(CountryBase):
    pass


class Country(CountryBase):
    id: int

    class Config:
        orm_mode = True


class CountrySystemAssociationBase(BaseModel):
    system_fk: int
    country_fk: int


class CountrySystemAssociationCreate(CountrySystemAssociationBase):
    pass


class CountrySystemAssociation(CountrySystemAssociationBase):
    id: int

    class Config:
        orm_mode = True


class ContributorBase(BaseModel):
    name: str
    email: str


class ContributorCreate(ContributorBase):
    password: str


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


class CBAeroSettingCreate(CBAeroSettingBase):
    pass


class CBAeroSetting(CBAeroSettingBase):
    id: int

    class Config:
        orm_mode = True


class Cart3DSettingBase(BaseModel):
    cntl_file: str


class Cart3DSettingCreate(Cart3DSettingBase):
    pass


class Cart3DSetting(Cart3DSettingBase):
    id: int

    class Config:
        orm_mode = True


class ToolSettingBase(BaseModel):
    hash: str
    cbaero_settings_fk: int | None = None
    cart3d_settings_fk: int | None = None


class ToolSettingCreate(BaseModel):
    cbaero_settings_fk: int | None = None
    cart3d_settings_fk: int | None = None


class ToolSetting(ToolSettingBase):
    id: int

    class Config:
        orm_mode = True


class ConfiguredToolBase(BaseModel):
    name: str
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


class AeroRunBase(BaseModel):
    file: str
    status: str
    datetime_created: datetime
    datetime_completed: datetime | None = None
    contributor_fk: int
    configured_tool_fk: int 
    mesh_fk: int


class AeroRunCreate(AeroRunBase):
    pass


class AeroRun(AeroRunBase):
    id: int

    class Config:
        orm_mode = True


class AeroRunResultBase(BaseModel):
    aero_run_fk: int
    aero_result_fk: int
    status: str


class AeroRunResult(AeroRunResultBase):
    id: int

    class Config:
        orm_mode = True


class MassEstimateBase(BaseModel):
    status: str
    trajectory_file: str
    mesh_fk: int
    configured_tool_fk: int
    contributor_fk: int
    datetime_created: datetime
    datetime_completed: datetime | None = None
    mass: float
    results_file: str | None = None


class MassEstimateCreate(AeroRunBase):
    pass


class MassEstimate(AeroRunResultBase):
    id: int

    class Config:
        orm_mode = True


class CommentBase(BaseModel):
    title: str
    body: str
    contributor_fk: int | None = None
    system_fk: int | None = None
    geometry_fk: int | None = None
    mesh_fk: int | None = None
    tool_setting_fk: int | None = None
    configured_tool_fk: int | None = None
    aero_run_fk: int | None = None
    mass_estimate_fk: int | None = None


class CommentCreate(CommentBase):
    pass


class Comment(CommentBase):
    id: int

    class Config:
        orm_mode = True


class CommentMeta(BaseModel):
    id: int | None = None
    contributor_fk: int | None = None
    system_fk: int | None = None
    geometry_fk: int | None = None
    mesh_fk: int | None = None
    tool_setting_fk: int | None = None
    configured_tool_fk: int | None = None
