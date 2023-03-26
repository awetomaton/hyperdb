from sqlalchemy.orm import Session
from hyperdb import models
from hyperdb import schemas


def get_systems(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.System).offset(skip).limit(limit).all()


def get_system(db: Session, system_id):
    """
    Based on https://stackoverflow.com/questions/6750017/how-to-query-database-by-id-using-sqlalchemy
    """
    return models.System.query.get(system_id)


def get_system_comments(db: Session, system_id):
    """https://stackoverflow.com/questions/43880531/select-specific-column-value-with-sqlalchamey-based-on-filter
    """
    return models.Comment.query.filter(models.Comment.system_fk == system_id).all()


def create_system(db: Session, system: schemas.SystemCreate):
    db_item = models.System(**system.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_countries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Country).offset(skip).limit(limit).all()


def create_country(db: Session, country: schemas.CountryCreate):
    db_item = models.Country(**country.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_contributors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Contributor).offset(skip).limit(limit).all()


def create_contributor(db: Session, contributor: schemas.ContributorCreate):
    db_item = models.Contributor(**contributor.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_geometries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Geometry).offset(skip).limit(limit).all()


def create_geometry(db: Session, geometry: schemas.GeometryCreate):
    db_item = models.Geometry(**geometry.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


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


def get_aero_results(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AeroResult).offset(skip).limit(limit).all()


def create_aero_result(db: Session, aero_result: schemas.AeroResultCreate):
    db_item = models.AeroResult(**aero_result.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_comments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Comment).offset(skip).limit(limit).all()


def create_comment(db: Session, comment: schemas.CommentCreate):
    db_item = models.Comment(**comment.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
