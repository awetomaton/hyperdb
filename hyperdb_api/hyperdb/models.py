from typing import List
import lorem
import pycountry
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, Float
from sqlalchemy.orm import Mapped, mapped_column
from hyperdb.database import Base
from names import get_full_name
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
        name = get_full_name().lower().replace(" ", "_")
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
    def generate_random(cls, countries: List[Country], systems: List[System]):
        country_ids = [country.id for country in countries]
        system_ids = [system.id for system in systems]
        country_fk = random.choice(country_ids)
        system_fk = random.choice(system_ids)

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
    def generate_random(cls, contributors: List[Contributor], systems: List[System]):
        file = get_full_name().lower().replace(" ", "_") + ".IGS"
        contributor_ids = [contributor.id for contributor in contributors]
        contributor_fk = random.choice(contributor_ids)
        system_ids = [system.id for system in systems]
        system_fk = random.choice(system_ids)

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
    def generate_random(cls, contributors: List[Contributor], geometries: List[Geometry]):
        file = get_full_name().lower().replace(" ", "_") + ".MSH"
        contributor_ids = [contributor.id for contributor in contributors]
        contributor_fk = random.choice(contributor_ids)
        geometry_ids = [geometry.id for geometry in geometries]
        geometry_fk = random.choice(geometry_ids)

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
        name = get_full_name().lower().replace(" ", "_")
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
        conf_file = get_full_name().lower().replace(" ", "_") + ".conf"
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
        cntl_file = get_full_name().lower().replace(" ", "_") + ".cntl"
        hash = str(random.randint(0, 100000))
        return cls(cntl_file=cntl_file, hash=hash)


class ToolSetting(Base, ToDictMixin):
    """
    """
    __tablename__ = "tool_settings"
    __table_args__ = (UniqueConstraint('cbaero_settings_fk', 'cart3d_settings_fk', name='tool_settings_uk'),)
    

    id: Mapped[int] = mapped_column(primary_key=True)
    cbaero_settings_fk: Mapped[int] = mapped_column(ForeignKey("cbaero_settings.id"), nullable=True)
    cart3d_settings_fk: Mapped[int] = mapped_column(ForeignKey("cart3d_settings.id"), nullable=True)

    @classmethod
    def generate_random(cls, cbaero_settings, cart3d_settings):
        tool_settings = {
            "cbaero_settings_fk": [item.id for item in cbaero_settings],
            "cart3d_settings_fk": [item.id for item in cart3d_settings]
        }
        setting_type = random.choice(list(tool_settings.keys()))

        kwargs = {
            setting_type: random.choice(tool_settings[setting_type])
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
    def generate_random(cls, tools: List[Tool], tool_settings: List[ToolSetting]):
        tool_ids = [tool.id for tool in tools]
        tool_fk = random.choice(tool_ids)
        tool_setting_ids = [tool_setting.id for tool_setting in tool_settings]
        tool_settings_fk = random.choice(tool_setting_ids)
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
    def generate_random(cls, contributors: List[Contributor], meshes: List[Mesh], tools: List[Tool], configured_tools: List[ConfiguredTool]):
        contributor_ids = [item.id for item in contributors]
        mesh_ids = [item.id for item in meshes]
        tool_ids = [item.id for item in tools]
        configured_tool_ids = [item.id for item in configured_tools]
        contributor_fk = random.choice(contributor_ids)
        mesh_fk = random.choice(mesh_ids)
        tool_fk = random.choice(tool_ids)
        configured_tool_fk = random.choice(configured_tool_ids)

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
    def generate_random(cls, contributors: List[Contributor], geometries: List[Geometry], tools: List[Tool], configured_tools: List[ConfiguredTool]):
        contributor_fk = random.choice([item.id for item in contributors])
        geometry_fk = random.choice([item.id for item in geometries])
        tool_fk = random.choice([item.id for item in tools])
        configured_tool_fk = random.choice([item.id for item in configured_tools])

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
    def generate_random(cls, configured_tools: List[ConfiguredTool], meshes: List[Mesh]):
        mach = random.random()
        alpha = random.random()
        lift_coefficient = random.random()
        drag_coefficient = random.random()
        configured_tool_fk = random.choice([item.id for item in configured_tools])
        mesh_fk = random.choice([item.id for item in meshes])
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
    contributor_fk = mapped_column(ForeignKey("contributors.id"), nullable=True)
    system_fk = mapped_column(ForeignKey("systems.id"), nullable=True)
    geometry_fk = mapped_column(ForeignKey("geometries.id"), nullable=True)
    mesh_fk = mapped_column(ForeignKey("meshes.id"), nullable=True)
    tool_mesh_association_fk = mapped_column(ForeignKey("tool_mesh_associations.id"), nullable=True)
    configured_tool_fk = mapped_column(ForeignKey("configured_tools.id"), nullable=True)

    @classmethod
    def generate_random(cls, 
                        contributors,
                        systems,
                        geometries,
                        meshes,
                        tool_mesh_associations,
                        configured_tools
                        ):

        title = lorem.sentence()[0:64]
        body = lorem.paragraph()[0:256]
        contributor_fk = random.choice([item.id for item in contributors])

        foreign_keys = [
            ("system_fk", random.choice([item.id for item in systems])),
            ("geometry_fk", random.choice([item.id for item in geometries])),
            ("mesh_fk", random.choice([item.id for item in meshes])),
            ("tool_mesh_association_fk", random.choice([item.id for item in tool_mesh_associations])),
            ("configured_tool_fk", random.choice([item.id for item in configured_tools]))
        ]
        foreign_key_index = random.randint(0, len(foreign_keys)-1)
        foreign_key = foreign_keys[foreign_key_index]
        kwargs = {foreign_key[0]: foreign_key[1]}

        return cls(title=title, body=body, contributor_fk=contributor_fk, **kwargs)
