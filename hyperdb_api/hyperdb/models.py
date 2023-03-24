from sqlalchemy import Column, Integer, String
from hyperdb.database import Base


class System(Base):
    __tablename__ = "systems"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    classification = Column(String, unique=True, index=True)
