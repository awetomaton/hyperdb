import pycountry
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, Float
from sqlalchemy.orm import Mapped, mapped_column
from hyperdb.database import Base


class ToDictMixin(object):

    def to_dict(self) -> dict:
        return {k: v for k, v in self.__dict__.items() if k[0] != "_"}


class System(Base):
    __tablename__ = "systems"

    id: Mapped[int] = mapped_column(primary_key=True)
    name = Column(String(128))
    classification = Column(String(128))


class Country(Base, ToDictMixin):
    __tablename__ = "countries"
    __generated_instances = 0

    id: Mapped[int] = mapped_column(primary_key=True)
    alpha_three_code = Column(String(3), unique=True)
    icon = Column(String(128), unique=True)

    @classmethod
    def generate_random(cls):
        country = list(pycountry.countries)[cls.__generated_instances % len(pycountry.countries)]

        return cls(alpha_three_code=country.alpha_3)


class CountrySystemAssociations(Base):
    """
    Based on https://docs.sqlalchemy.org/en/20/core/metadata.html#sqlalchemy.schema.Column.index
    """
    __tablename__ = "country_system_associations"

    id = Column(Integer, primary_key=True, index=True)
    system_fk: Mapped[int] = mapped_column(ForeignKey("systems.id"))
    country_fk: Mapped[int] = mapped_column(ForeignKey("countries.id"))


class Contributor(Base):
    """
    """
    __tablename__ = "contributors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name = Column(String(64))
    email = Column(String(64), unique=True)


class Geometry(Base):
    """
    """
    __tablename__ = "geometries"

    id: Mapped[int] = mapped_column(primary_key=True)
    file = Column(String(128), unique=True)
    contributor_fk: Mapped[int] = mapped_column(ForeignKey("contributors.id"))
    system_fk: Mapped[int] = mapped_column(ForeignKey("systems.id"))
    classification = Column(String(128))


class Mesh(Base):
    """
    """
    __tablename__ = "meshes"

    id: Mapped[int] = mapped_column(primary_key=True)
    file = Column(String(128), unique=True)
    contributor_fk: Mapped[int] = mapped_column(ForeignKey("contributors.id"))
    geometry_fk: Mapped[int] = mapped_column(ForeignKey("geometries.id"))


class Tool(Base):
    """
    """
    __tablename__ = "tools"
    __table_args__ = (UniqueConstraint('name', 'version', name='tool_version_uk'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    name = Column(String(64))
    version = Column(String(32))


class CBAeroSetting(Base):
    """
    """
    __tablename__ = "cbaero_settings"
    

    id: Mapped[int] = mapped_column(primary_key=True)
    conf_file = Column(String(128))
    hash = Column(String(128), unique=True)


class Cart3DSetting(Base):
    """
    """
    __tablename__ = "cart3d_settings"
    

    id: Mapped[int] = mapped_column(primary_key=True)
    cntl_file = Column(String(128))
    hash = Column(String(128), unique=True)


class ToolSetting(Base):
    """
    """
    __tablename__ = "tool_settings"
    __table_args__ = (UniqueConstraint('cbaero_settings_fk', 'cart3d_settings_fk', name='tool_settings_uk'),)
    

    id: Mapped[int] = mapped_column(primary_key=True)
    cbaero_settings_fk: Mapped[int] = mapped_column(ForeignKey("cbaero_settings.id"))
    cart3d_settings_fk: Mapped[int] = mapped_column(ForeignKey("cart3d_settings.id"))


class ConfiguredTool(Base):
    """
    """
    __tablename__ = "configured_tools"
    __table_args__ = (UniqueConstraint('tool_fk', 'tool_settings_fk', name='tool_configuration_uk'),)
    

    id: Mapped[int] = mapped_column(primary_key=True)
    tool_fk: Mapped[int] = mapped_column(ForeignKey("tools.id"))
    tool_settings_fk: Mapped[int] = mapped_column(ForeignKey("tool_settings.id"))


class ToolMeshAssociation(Base):
    """
    """
    __tablename__ = "tool_mesh_associations"
    

    id: Mapped[int] = mapped_column(primary_key=True)
    contributor_fk: Mapped[int] = mapped_column(ForeignKey("contributors.id"))
    mesh_fk: Mapped[int] = mapped_column(ForeignKey("meshes.id"))
    tool_fk: Mapped[int] = mapped_column(ForeignKey("tools.id"))
    configured_tool_fk: Mapped[int] = mapped_column(ForeignKey("configured_tools.id"))


class ToolGeometryAssociation(Base):
    """
    """
    __tablename__ = "tool_geometry_associations"
    

    id: Mapped[int] = mapped_column(primary_key=True)
    contributor_fk: Mapped[int] = mapped_column(ForeignKey("contributors.id"))
    geometry_fk: Mapped[int] = mapped_column(ForeignKey("geometries.id"))
    tool_fk: Mapped[int] = mapped_column(ForeignKey("tools.id"))
    configured_tool_fk: Mapped[int] = mapped_column(ForeignKey("configured_tools.id"))


class AeroResult(Base):
    """
    """
    __tablename__ = "aero_results"
    

    id = Column(Integer, primary_key=True, index=True)
    mach = Column(Float)
    alpha = Column(Float)
    lift_coefficient = Column(Float)
    drag_coefficient = Column(Float)
    configured_tool_fk: Mapped[int] = mapped_column(ForeignKey("configured_tools.id"))
    mesh_fk: Mapped[int] = mapped_column(ForeignKey("meshes.id"))


class Comment(Base):
    """
    """
    __tablename__ = "comments"
    

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(64))
    body = Column(String(256))
    contributor_fk = mapped_column(ForeignKey("contributors.id"))
    system_fk = mapped_column(ForeignKey("systems.id"))
    geometry_fk = mapped_column(ForeignKey("geometries.id"))
    mesh_fk = mapped_column(ForeignKey("meshes.id"))
    tool_mesh_association_fk = mapped_column(ForeignKey("tool_mesh_associations.id"))
    configured_tool_fk = mapped_column(ForeignKey("configured_tools.id"))

