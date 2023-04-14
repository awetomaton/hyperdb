from sqlalchemy.orm import Session
from hyperdb import models
from hyperdb.database import SessionLocal


def create_fixtures(
        db: Session,
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
    """Create fixtures in database from file
    """

    db.query(models.Comment).delete()
    db.query(models.AeroResult).delete()
    db.query(models.ToolGeometryAssociation).delete()
    db.query(models.ToolMeshAssociation).delete()
    db.query(models.ConfiguredTool).delete()
    db.query(models.ToolSetting).delete()
    db.query(models.Cart3DSetting).delete()
    db.query(models.CBAeroSetting).delete()
    db.query(models.Tool).delete()
    db.query(models.Mesh).delete()
    db.query(models.Geometry).delete()
    db.query(models.Contributor).delete()
    db.query(models.CountrySystemAssociation).delete()
    db.query(models.Country).delete()
    db.query(models.System).delete()
    db.commit()

    systems = [models.System.generate_random() for _ in range(num_systems)]
    for system in systems:
        db.add(system)
        db.commit()
        db.refresh(system)
    countries = [models.Country.generate_random(i) for i in range(num_countries)]
    db.commit()
    for country in countries:
        db.add(country)
        db.commit()
        db.refresh(country)
    country_system_associations = [models.CountrySystemAssociation.generate_random(countries, systems) for _ in range(num_country_system_associations)]
    for item in country_system_associations:
        db.add(item)
        db.commit()
        db.refresh(item)
    contributors = [models.Contributor.generate_random() for _ in range(num_contributors)]
    for item in contributors:
        db.add(item)
        db.commit()
        db.refresh(item)
    geometries = [models.Geometry.generate_random(contributors, systems) for _ in range(num_geometries)]
    for item in geometries:
        db.add(item)
        db.commit()
        db.refresh(item)
    meshes = [models.Mesh.generate_random(contributors, geometries) for _ in range(num_meshes)]
    for item in meshes:
        db.add(item)
        db.commit()
        db.refresh(item)
    tools = [models.Tool.generate_random() for _ in range(num_tools)]
    for item in tools:
        db.add(item)
        db.commit()
        db.refresh(item)
    cbaero_settings = [models.CBAeroSetting.generate_random() for _ in range(num_cbaero_settings)]
    for item in cbaero_settings:
        db.add(item)
        db.commit()
        db.refresh(item)
    cart3d_settings = [models.Cart3DSetting.generate_random() for _ in range(num_cart3d_settings)]
    for item in cart3d_settings:
        db.add(item)
        db.commit()
        db.refresh(item)
    tool_settings = [models.ToolSetting.generate_random(cbaero_settings, cart3d_settings) for _ in range(num_tool_settings)]
    for item in tool_settings:
        db.add(item)
        db.commit()
        db.refresh(item)
    configured_tools = [models.ConfiguredTool.generate_random(tools, tool_settings) for _ in range(num_configured_tools)]
    for item in configured_tools:
        db.add(item)
        db.commit()
        db.refresh(item)
    tool_mesh_associations = [models.ToolMeshAssociation.generate_random(contributors, meshes, tools, configured_tools) for _ in range(num_tool_mesh_associations)]
    for item in tool_mesh_associations:
        db.add(item)
        db.commit()
        db.refresh(item)
    tool_geometry_associations = [models.ToolGeometryAssociation.generate_random(contributors, geometries, tools, configured_tools) for _ in range(num_tool_geometry_associations)]
    for item in tool_geometry_associations:
        db.add(item)
        db.commit()
        db.refresh(item)
    aero_results = [models.AeroResult.generate_random(configured_tools, meshes) for _ in range(num_aero_results)]
    for item in aero_results:
        db.add(item)
        db.commit()
        db.refresh(item)
    comments = [models.Comment.generate_random(contributors, systems, geometries, meshes, tool_mesh_associations, configured_tools) for _ in range(num_comments)]
    for item in comments:
        db.add(item)
        db.commit()
        db.refresh(item)


if __name__ == "__main__":
    create_fixtures(SessionLocal())
