import json
import os
from hyperdb.data import DATA_DIR
from hyperdb.data.aero_result import AeroResult
from hyperdb.data.cart3d_settings import Cart3DSettings
from hyperdb.data.cbaero_settings import CBAeroSettings
from hyperdb.data.comment import Comment
from hyperdb.data.configured_tool import ConfiguredTool
from hyperdb.data.contributor import Contributor
from hyperdb.data.country import Country
from hyperdb.data.country_system_association import CountrySystemAssociation
from hyperdb.data.geometry import Geometry
from hyperdb.data.mesh import Mesh
from hyperdb.data.system import System
from hyperdb.data.tool import Tool
from hyperdb.data.tool_geometry_association import ToolGeometryAssociation
from hyperdb.data.tool_mesh_association import ToolMeshAssociation
from hyperdb.data.tool_settings import ToolSettings


def generate_data(num_systems: int = 4, 
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
                  num_comments=20):
    systems = [System.generate_random() for _ in range(num_systems)]
    countries = [Country.generate_random() for _ in range(num_countries)]
    country_system_associations = [CountrySystemAssociation.generate_random(len(countries), len(systems)) for _ in range(num_country_system_associations)]
    contributors = [Contributor.generate_random() for _ in range(num_contributors)]
    geometries = [Geometry.generate_random(num_contributors, num_systems) for _ in range(num_geometries)]
    meshes = [Mesh.generate_random(num_contributors, num_geometries) for _ in range(num_meshes)]
    tools = [Tool.generate_random() for _ in range(num_tools)]
    cbaero_settings = [CBAeroSettings.generate_random() for _ in range(num_cbaero_settings)]
    cart3d_settings = [Cart3DSettings.generate_random() for _ in range(num_cart3d_settings)]
    tool_settings = [ToolSettings.generate_random(min([num_cart3d_settings, num_cbaero_settings])) for _ in range(num_tool_settings)]
    configured_tools = [ConfiguredTool.generate_random(num_tools, num_tool_settings) for _ in range(num_configured_tools)]
    tool_mesh_associations = [ToolMeshAssociation.generate_random(num_contributors, num_meshes, num_tools, num_configured_tools) for _ in range(num_tool_mesh_associations)]
    tool_geometry_associations = [ToolGeometryAssociation.generate_random(num_contributors, num_geometries, num_tools, num_configured_tools) for _ in range(num_tool_geometry_associations)]
    aero_results = [AeroResult.generate_random(num_configured_tools) for _ in range(num_aero_results)]
    comments = [Comment.generate_random(num_contributors, num_systems, num_geometries, num_meshes, num_tool_mesh_associations, num_configured_tools) for _ in range(num_comments)]
    
    data = {
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

    with open(os.path.join(DATA_DIR, "GENERATED_DATA.JSON"), 'w') as fid:
        json.dump(data, fid, indent=4)


if __name__ == "__main__":
    generate_data()
