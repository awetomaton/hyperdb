from sqlalchemy import select
from sqlalchemy.orm import Session, load_only
from typing import List
from hyperdb import models
from hyperdb import schemas


def create_system(db: Session, system: schemas.SystemCreate):
    db_item = models.System(**system.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_system(db: Session, system: schemas.System):
    db_item = db.query(models.System).get(system.id)
    for k, v in system.dict().items():
        if k == "id":
            continue
        setattr(db_item, k, v)
    db.commit()
    db.refresh(db_item)
    return db_item


def retrieve_systems(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.System).offset(skip).limit(limit).all()


def retrieve_systems_comments(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(models.Comment)
    model_attr = getattr(models.Comment, "system_fk")
    query = query.filter(model_attr != None)
    return query.offset(skip).limit(limit).all()
    

def destroy_system(db: Session, system_id: int):
    system = db.query(models.System).filter(models.System.id == system_id).first()
    db.delete(system)
    db.commit()


def retrieve_system(db: Session, system_id):
    """
    Based on https://stackoverflow.com/questions/6750017/how-to-query-database-by-id-using-sqlalchemy
    """
    return db.query(models.System).get(system_id)


def retrieve_system_comments(db: Session, system_id):
    """https://stackoverflow.com/questions/43880531/select-specific-column-value-with-sqlalchamey-based-on-filter
    """
    return db.query(models.Comment).filter(models.Comment.system_fk == system_id).all()


def retrieve_system_geometries(db: Session, system_id):
    return db.query(models.Geometry).filter(models.Geometry.system_fk == system_id).all()


def retrieve_countries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Country).offset(skip).limit(limit).all()


def destroy_country(db: Session, country_id: int):
    country = db.query(models.Country).filter(models.Country.id == country_id).first()
    db.delete(country)
    db.commit()


def create_country(db: Session, country: schemas.CountryCreate):
    db_item = models.Country(**country.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_contributors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Contributor).offset(skip).limit(limit).all()


def retrieve_contributor(
        db: Session, 
        id: int | None = None, 
        email: str | None = None, 
        name: str | None = None
    ):
    query = db.query(models.Contributor)
    if id is not None:
        query = query.filter(models.Contributor.id == id).first()
    elif email is not None:
        query = query.filter(models.Contributor.email == email).first()
    elif name is not None:
        query = query.filter(models.Contributor.name == name).first()
    return query


def retrieve_contributor_comments(db: Session, contributor_id: int | None = None):
    return db.query(models.Comment).filter(models.Comment.contributor_fk == contributor_id).all()


def retrieve_contributor_geometries(db: Session, contributor_id: int | None = None):
    return db.query(models.Geometry).filter(models.Geometry.contributor_fk == contributor_id).all()


def retrieve_contributor_tool_geometry_associations(db: Session, contributor_id: int | None = None):
    return db.query(models.ToolGeometryAssociation).filter(models.ToolGeometryAssociation.contributor_fk == contributor_id).all()


def retrieve_contributor_meshes(db: Session, contributor_id: int | None = None):
    return db.query(models.Mesh).filter(models.Mesh.contributor_fk == contributor_id).all()


def retrieve_contributor_tool_mesh_associations(db: Session, contributor_id: int | None = None):
    return db.query(models.ToolMeshAssociation).filter(models.ToolMeshAssociation.contributor_fk == contributor_id).all()


def create_contributor(db: Session, contributor: schemas.ContributorCreate):
    db_item = models.Contributor(**contributor.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def create_geometry(db: Session, geometry: schemas.GeometryCreate):
    db_item = models.Geometry(**geometry.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_geometry(db: Session, geometry: schemas.Geometry):
    db_item = db.query(models.Geometry).get(geometry.id)
    for k, v in geometry.dict().items():
        if k == "id":
            continue
        setattr(db_item, k, v)
    db.commit()
    db.refresh(db_item)
    return db_item


def retrieve_geometries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Geometry).offset(skip).limit(limit).all()


def retrieve_geometries_comments(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(models.Comment)
    model_attr = getattr(models.Comment, "geometry_fk")
    query = query.filter(model_attr != None)
    return query.offset(skip).limit(limit).all()


def retrieve_geometry(db: Session, geometry_id: int):
    return db.query(models.Geometry).get(geometry_id)


def retrieve_geometry_comments(db: Session, geometry_id: int):
    return db.query(models.Comment).filter(models.Comment.geometry_fk == geometry_id).all()


def retrieve_geometry_tools(db: Session, geometry_id: int):
    return db.query(models.ToolGeometryAssociation).filter(
        models.ToolGeometryAssociation.geometry_fk == geometry_id).all()


def destroy_geometry_tools(db: Session, geometry_id: int):
    db.query(models.ToolGeometryAssociation).filter(models.ToolGeometryAssociation.geometry_fk == geometry_id).delete()
    db.commit()


def retrieve_geometry_meshes(db: Session, geometry_id: int):
    return db.query(models.Mesh).filter(models.Mesh.geometry_fk == geometry_id).all()


def destroy_geometry(db: Session, geometry_id: int):
    geometry = db.query(models.Geometry).filter(models.Geometry.id == geometry_id).first()
    db.delete(geometry)
    db.commit()


def get_meshes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Mesh).offset(skip).limit(limit).all()


def create_mesh(db: Session, mesh: schemas.MeshCreate):
    db_item = models.Mesh(**mesh.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_tools(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tool).offset(skip).limit(limit).all()


def create_tool(db: Session, tool: schemas.ToolCreate):
    db_item = models.Tool(**tool.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_cbaero_settings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CBAeroSetting).offset(skip).limit(limit).all()


def create_cbaero_setting(db: Session, cbaero_setting: schemas.CBAeroSettingCreate):
    db_item = models.CBAeroSetting(**cbaero_setting.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_cart3d_settings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Cart3DSetting).offset(skip).limit(limit).all()


def create_cart3d_setting(db: Session, cart3d_setting: schemas.Cart3DSettingCreate):
    db_item = models.Cart3DSetting(**cart3d_setting.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_tool_settings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ToolSetting).offset(skip).limit(limit).all()


def create_tool_setting(db: Session, tool_setting: schemas.ToolSettingCreate):
    db_item = models.ToolSetting(**tool_setting.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_configured_tools(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ConfiguredTool).offset(skip).limit(limit).all()


def create_configured_tool(db: Session, configured_tool: schemas.ConfiguredToolCreate):
    db_item = models.ConfiguredTool(**configured_tool.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_tool_mesh_associations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ToolMeshAssociation).offset(skip).limit(limit).all()


def create_tool_mesh_association(db: Session, tool_mesh_association: schemas.ToolMeshAssociationCreate):
    db_item = models.ToolMeshAssociation(**tool_mesh_association.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_tool_geometry_associations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ToolGeometryAssociation).offset(skip).limit(limit).all()


def create_tool_geometry_association(db: Session, tool_geometry_association: schemas.ToolGeometryAssociationCreate):
    db_item = models.ToolGeometryAssociation(**tool_geometry_association.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def create_tool_geometry_associations(db: Session, associations: List[schemas.ToolGeometryAssociationCreate]):
    db_items = [models.ToolGeometryAssociation(**association.dict()) for association in associations]
    for db_item in db_items:
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
    return db_items


def get_aero_results(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AeroResult).offset(skip).limit(limit).all()


def create_aero_result(db: Session, aero_result: schemas.AeroResultCreate):
    db_item = models.AeroResult(**aero_result.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_comments(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(models.Comment)
    return query.offset(skip).limit(limit).all()


def retrieve_comment_meta(db: Session):
    stmt = select(models.Comment).options(load_only(
        models.Comment.contributor_fk,
        models.Comment.system_fk,
        models.Comment.geometry_fk,
        models.Comment.mesh_fk,
        models.Comment.configured_tool_fk,
        )
    )
    comments = db.scalars(stmt).all()
    comments_meta = [schemas.CommentMeta(
        id = comment.id, # type: ignore
        contributor_fk = comment.contributor_fk,
        system_fk = comment.system_fk,
        geometry_fk = comment.geometry_fk,
        mesh_fk = comment.mesh_fk,
        configured_tool_fk = comment.configured_tool_fk,
    ) for comment in comments]
    return comments_meta


def create_comment(db: Session, comment: schemas.CommentCreate):
    db_item = models.Comment(**comment.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def destroy_comment(db: Session, comment_id: int):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    db.delete(comment)
    db.commit()
