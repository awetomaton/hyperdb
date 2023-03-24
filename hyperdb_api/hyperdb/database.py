import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL


# Based on:
#   https://coderpad.io/blog/development/sqlalchemy-with-postgresql/
#   https://fastapi.tiangolo.com/tutorial/sql-databases/
url = URL.create(
    drivername="postgresql",
    username=os.environ["HYPERDB_POSTGRES_USERNAME"],
    password=os.environ["HYPERDB_POSTGRES_PASSWORD"],
    host=os.environ["HYPERDB_POSTGRES_HOST"],
    port=int(os.environ["HYPERDB_POSTGRES_PORT"]),
    database=os.environ["HYPERDB_POSTGRES_DATABASE"]
)

engine = create_engine(url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
