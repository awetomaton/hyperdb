import lorem
import pycountry
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, Float
from sqlalchemy.orm import Mapped, mapped_column
from hyperdb.database import Base
from names import get_first_name, get_full_name
import random


class ToDictMixin(object):

    def to_dict(self) -> dict:
        return {k: v for k, v in self.__dict__.items() if k[0] != "_"}


class System(Base, ToDictMixin):
    __tablename__ = "systems"

    id: Mapped[int] = mapped_column(primary_key=True)
    name = Column(String(128))
    classification = Column(String(128))

    @classmethod
    def generate_random(cls):
        name = get_first_name()
        classification = "UNCLASSIFIED"

        return cls(name=name, classification=classification)


class Country(Base, ToDictMixin):
    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(primary_key=True)
    alpha_three_code = Column(String(3), unique=True)
    icon = Column(String(128), unique=True)

    @classmethod
    def generate_random(cls, instance):
        country = list(pycountry.countries)[instance % len(pycountry.countries)]

        return cls(alpha_three_code=country.alpha_3)


class CountrySystemAssociation(Base, ToDictMixin):
    """
    Based on https://docs.sqlalchemy.org/en/20/core/metadata.html#sqlalchemy.schema.Column.index
    """
    __tablename__ = "country_system_associations"

    id = Column(Integer, primary_key=True, index=True)
    system_fk: Mapped[int] = mapped_column(ForeignKey("systems.id"))
    country_fk: Mapped[int] = mapped_column(ForeignKey("countries.id"))

    @classmethod
    def generate_random(cls, num_countries: int, num_systems: int):
        country_fk = random.randint(0, num_countries-1)
        system_fk = random.randint(0, num_systems-1)

        return cls(country_fk=country_fk, system_fk=system_fk)


class Contributor(Base, ToDictMixin):
    """
    """
    __tablename__ = "contributors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name = Column(String(64))
    email = Column(String(64), unique=True)

    @classmethod
    def generate_random(cls):
        name = get_full_name()
        email = name.replace(" ", ".") + "@hyperdb.com"

        return cls(name=name, email=email)


class Geometry(Base, ToDictMixin):
    """
    """
    __tablename__ = "geometries"

    id: Mapped[int] = mapped_column(primary_key=True)
    file = Column(String(128), unique=True)
    contributor_fk: Mapped[int] = mapped_column(ForeignKey("contributors.id"))
    system_fk: Mapped[int] = mapped_column(ForeignKey("systems.id"))
    classification = Column(String(128))

    @classmethod
    def generate_random(cls, num_contributors: int, num_systems: int):
        file = get_first_name() + ".IGS"
        contributor_fk = random.randint(0, num_contributors-1)
        system_fk = random.randint(0, num_systems-1)

        return cls(file=file, contributor_fk=contributor_fk, system_fk=system_fk, classification="UNCLASSIFIED")


class Mesh(Base, ToDictMixin):
    """
    """
    __tablename__ = "meshes"

    id: Mapped[int] = mapped_column(primary_key=True)
    file = Column(String(128), unique=True)
    contributor_fk: Mapped[int] = mapped_column(ForeignKey("contributors.id"))
    geometry_fk: Mapped[int] = mapped_column(ForeignKey("geometries.id"))

    @classmethod
    def generate_random(cls, num_contributors: int, num_geometries: int):
        file = get_first_name() + ".MSH"
        contributor_fk = random.randint(0, num_contributors-1)
        geometry_fk = random.randint(0, num_geometries-1)

        return cls(file=file, contributor_fk=contributor_fk, geometry_fk=geometry_fk)


class Tool(Base, ToDictMixin):
    """
    """
    __tablename__ = "tools"
    __table_args__ = (UniqueConstraint('name', 'version', name='tool_version_uk'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    name = Column(String(64))
    version = Column(String(32))

    @classmethod
    def generate_random(cls):
        name = get_first_name()
        version = "{}.{}.{}".format(random.randint(0, 9), random.randint(0, 9), random.randint(0, 9))

        return cls(name=name, version=version)


class CBAeroSetting(Base, ToDictMixin):
    """
    """
    __tablename__ = "cbaero_settings"
    

    id: Mapped[int] = mapped_column(primary_key=True)
    conf_file = Column(String(128))
    hash = Column(String(128), unique=True)

    @classmethod
    def generate_random(cls):
        conf_file = get_first_name() + ".conf"
        hash = str(random.randint(0, 100000))
        return cls(conf_file=conf_file, hash=hash)


class Cart3DSetting(Base, ToDictMixin):
    """
    """
    __tablename__ = "cart3d_settings"
    

    id: Mapped[int] = mapped_column(primary_key=True)
    cntl_file = Column(String(128))
    hash = Column(String(128), unique=True)

    @classmethod
    def generate_random(cls):
        cntl_file = get_first_name() + ".cntl"
        hash = str(random.randint(0, 100000))
        return cls(cntl_file=cntl_file, hash=hash)


class ToolSetting(Base, ToDictMixin):
    """
    """
    __tablename__ = "tool_settings"
    __table_args__ = (UniqueConstraint('cbaero_settings_fk', 'cart3d_settings_fk', name='tool_settings_uk'),)
    

    id: Mapped[int] = mapped_column(primary_key=True)
    cbaero_settings_fk: Mapped[int] = mapped_column(ForeignKey("cbaero_settings.id"))
    cart3d_settings_fk: Mapped[int] = mapped_column(ForeignKey("cart3d_settings.id"))

    @classmethod
    def generate_random(cls, num_settings):
        tool_settings = ["cbaero_settings_fk", "cart3d_settings_fk"]
        chosen_tool_settings_index = random.randint(0, len(tool_settings)-1)

        kwargs = {
            tool_settings[chosen_tool_settings_index]: random.randint(0, num_settings-1)
        }
        return cls(**kwargs)


class ConfiguredTool(Base, ToDictMixin):
    """
    """
    __tablename__ = "configured_tools"
    __table_args__ = (UniqueConstraint('tool_fk', 'tool_settings_fk', name='tool_configuration_uk'),)
    

    id: Mapped[int] = mapped_column(primary_key=True)
    tool_fk: Mapped[int] = mapped_column(ForeignKey("tools.id"))
    tool_settings_fk: Mapped[int] = mapped_column(ForeignKey("tool_settings.id"))

    @classmethod
    def generate_random(cls, num_tools, num_tool_settings):
        tool_fk = random.randint(0, num_tools-1)
        tool_settings_fk = random.randint(0, num_tool_settings-1)
        return cls(tool_fk=tool_fk, tool_settings_fk=tool_settings_fk)


class ToolMeshAssociation(Base, ToDictMixin):
    """
    """
    __tablename__ = "tool_mesh_associations"
    

    id: Mapped[int] = mapped_column(primary_key=True)
    contributor_fk: Mapped[int] = mapped_column(ForeignKey("contributors.id"))
    mesh_fk: Mapped[int] = mapped_column(ForeignKey("meshes.id"))
    tool_fk: Mapped[int] = mapped_column(ForeignKey("tools.id"))
    configured_tool_fk: Mapped[int] = mapped_column(ForeignKey("configured_tools.id"))

    @classmethod
    def generate_random(cls, num_contributors: int, num_meshes: int, num_tools: int, num_configured_tools: int):
        contributor_fk = random.randint(0, num_contributors-1)
        mesh_fk = random.randint(0, num_meshes-1)
        tool_fk = random.randint(0, num_tools-1)
        configured_tool_fk = random.randint(0, num_configured_tools-1)

        return cls(contributor_fk=contributor_fk, 
                   mesh_fk=mesh_fk, 
                   tool_fk=tool_fk, 
                   configured_tool_fk=configured_tool_fk)


class ToolGeometryAssociation(Base, ToDictMixin):
    """
    """
    __tablename__ = "tool_geometry_associations"
    

    id: Mapped[int] = mapped_column(primary_key=True)
    contributor_fk: Mapped[int] = mapped_column(ForeignKey("contributors.id"))
    geometry_fk: Mapped[int] = mapped_column(ForeignKey("geometries.id"))
    tool_fk: Mapped[int] = mapped_column(ForeignKey("tools.id"))
    configured_tool_fk: Mapped[int] = mapped_column(ForeignKey("configured_tools.id"))

    @classmethod
    def generate_random(cls, num_contributors: int, num_geometries: int, num_tools: int, num_configured_tools: int):
        contributor_fk = random.randint(0, num_contributors-1)
        geometry_fk = random.randint(0, num_geometries-1)
        tool_fk = random.randint(0, num_tools-1)
        configured_tool_fk = random.randint(0, num_configured_tools-1)

        return cls(contributor_fk=contributor_fk, 
                   geometry_fk=geometry_fk, 
                   tool_fk=tool_fk, configured_tool_fk=configured_tool_fk)


class AeroResult(Base, ToDictMixin):
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

    @classmethod
    def generate_random(cls, num_configured_tools: int, num_meshes: int):
        mach = random.random()
        alpha = random.random()
        lift_coefficient = random.random()
        drag_coefficient = random.random()
        configured_tool_fk = random.randint(0, num_configured_tools-1)
        mesh_fk = random.randint(0, num_meshes-1)
        return cls(mach=mach,
                   alpha=alpha,
                   lift_coefficient=lift_coefficient,
                   drag_coefficient=drag_coefficient,
                   configured_tool_fk=configured_tool_fk,
                   mesh_fk=mesh_fk)

class Comment(Base, ToDictMixin):
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

    @classmethod
    def generate_random(cls, 
                        num_contributors: int,
                        num_systems: int,
                        num_geometries: int,
                        num_meshes: int,
                        num_tool_mesh_associations: int,
                        num_configured_tools: int
                        ):

        title = lorem.sentence()
        body = lorem.paragraph()
        contributor_fk = random.randint(0, num_contributors-1)

        foreign_keys = [
            ("system_fk", random.randint(0, num_systems-1)),
            ("geometry_fk", random.randint(0, num_geometries-1)),
            ("mesh_fk", random.randint(0, num_meshes)),
            ("tool_mesh_association_fk", random.randint(0, num_tool_mesh_associations-1)),
            ("configured_tool_fk", random.randint(0, num_configured_tools-1))
        ]
        foreign_key_index = random.randint(0, len(foreign_keys)-1)
        foreign_key = foreign_keys[foreign_key_index]
        kwargs = {foreign_key[0]: foreign_key[1]}

        return cls(title=title, body=body, contributor_fk=contributor_fk, **kwargs)
