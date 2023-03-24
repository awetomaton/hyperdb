from sqlalchemy.orm import Session
from hyperdb import models
from hyperdb import schemas


def get_systems(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.System).offset(skip).limit(limit).all()


def create_system(db: Session, system: schemas.SystemCreate):
    db_item = Session(**system.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
