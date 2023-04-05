import json
import os
from sqlalchemy.orm import Session
from typing import Union
from hyperdb import models
from hyperdb.database import SessionLocal


FIXTURES_DIR = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', 'fixtures')


def generate_fixtures(
        location: Union[str, None] = None,
        num_systems: int = 4, 
        num_countries = 5, 
        num_country_system_associations=10,
        num_contributors=5,
        num_geometries=15,
        num_meshes=30,
        num_tools=10,
        num_cbaero_settings=15,
        num_cart3d_settings=15,
        num_tool_settings=10,
        num_configured_tools=10,
        num_tool_mesh_associations=20,
        num_tool_geometry_associations=20,
        num_aero_results=200,
        num_comments=20
    ):
    """Randomly generate fixtures data
    
    Parameters
    ----------
    location: str, None
        The directory or file in which to save the fixture. Defaults to the "fixtures" directory at the root of the 
        hyperdb_api project. The default filename is `fixtures.json`.
    """

    if location is None:
        fixtures_file = os.path.join(FIXTURES_DIR, 'fixtures.json')
    elif os.path.isdir(location):
        fixtures_file = os.path.join(location, 'fixtures.json')
    else:
        fixtures_file = location

    systems = [models.System.generate_random() for _ in range(num_systems)]
    countries = [models.Country.generate_random(i) for i in range(num_countries)]
    country_system_associations = [models.CountrySystemAssociation.generate_random(len(countries), len(systems)) for _ in range(num_country_system_associations)]
    contributors = [models.Contributor.generate_random() for _ in range(num_contributors)]
    geometries = [models.Geometry.generate_random(num_contributors, num_systems) for _ in range(num_geometries)]
    meshes = [models.Mesh.generate_random(num_contributors, num_geometries) for _ in range(num_meshes)]
    tools = [models.Tool.generate_random() for _ in range(num_tools)]
    cbaero_settings = [models.CBAeroSetting.generate_random() for _ in range(num_cbaero_settings)]
    cart3d_settings = [models.Cart3DSetting.generate_random() for _ in range(num_cart3d_settings)]
    tool_settings = [models.ToolSetting.generate_random(min([num_cart3d_settings, num_cbaero_settings])) for _ in range(num_tool_settings)]
    configured_tools = [models.ConfiguredTool.generate_random(num_tools, num_tool_settings) for _ in range(num_configured_tools)]
    tool_mesh_associations = [models.ToolMeshAssociation.generate_random(num_contributors, num_meshes, num_tools, num_configured_tools) for _ in range(num_tool_mesh_associations)]
    tool_geometry_associations = [models.ToolGeometryAssociation.generate_random(num_contributors, num_geometries, num_tools, num_configured_tools) for _ in range(num_tool_geometry_associations)]
    aero_results = [models.AeroResult.generate_random(num_configured_tools, num_meshes) for _ in range(num_aero_results)]
    comments = [models.Comment.generate_random(num_contributors, num_systems, num_geometries, num_meshes, num_tool_mesh_associations, num_configured_tools) for _ in range(num_comments)]
    
    fixtures = {
        "systems": [system.to_dict() for system in systems],
        "countries": [country.to_dict() for country in countries],
        "country_system_associations": [
            country_system_association.to_dict() for country_system_association in country_system_associations],
        "contributors": [contributor.to_dict() for contributor in contributors],
        "geometries": [geometry.to_dict() for geometry in geometries],
        "meshes": [mesh.to_dict() for mesh in meshes],
        "tools": [tool.to_dict() for tool in tools],
        "cbaero_settings": [cbaero_setting.to_dict() for cbaero_setting in cbaero_settings],
        "cart3d_settings": [cart3d_setting.to_dict() for cart3d_setting in cart3d_settings],
        "tool_settings": [tool_setting.to_dict() for tool_setting in tool_settings],
        "configured_tools": [configured_tool.to_dict() for configured_tool in configured_tools],
        "tool_mesh_associations": [tool_mesh_association.to_dict() for tool_mesh_association in tool_mesh_associations],
        "tool_geometry_associations": [tool_geometry_association.to_dict() for tool_geometry_association in tool_geometry_associations],
        "aero_results": [aero_result.to_dict() for aero_result in aero_results],
        "comments": [comment.to_dict() for comment in comments],
    }
    with open(fixtures_file, 'w') as fid:
        json.dump(fixtures, fid)


def create_fixtures(db: Session, file: str):
    """Create fixtures in database from file
    
    Parameters
    ----------
    file: str
        The path to the fixtures file from which to create the database rows
    """

    with open(file, 'r') as fid:
        fixtures = json.load(fid)

    for country in fixtures["countries"]:
        db_item = models.Country(**country)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)


if __name__ == "__main__":
    if not os.path.exists(FIXTURES_DIR):
        os.mkdir(FIXTURES_DIR)
    fixtures_file = os.path.join(FIXTURES_DIR, 'fixtures.json')
    #if not os.path.isfile(fixtures_file):
    generate_fixtures()
    
    create_fixtures(SessionLocal(), fixtures_file)
