from fastapi import Depends, FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
import os
from sqlalchemy.orm import Session
from typing import List
import uvicorn
from hyperdb.database import SessionLocal, engine
from hyperdb import schemas
from hyperdb import crud


app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Based on https://fastapi.tiangolo.com/tutorial/static-files/
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.post("/systems/", response_model=schemas.System)
def create_system(system: schemas.SystemCreate, db: Session = Depends(get_db)):
    return crud.create_system(db=db, system=system)


@app.get("/systems/", response_model=List[schemas.System])
def read_systems(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    systems = crud.get_systems(db, skip=skip, limit=limit)
    return systems


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
