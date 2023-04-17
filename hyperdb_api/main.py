from fastapi import Depends, FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
import os
from sqlalchemy.orm import Session
from typing import List
import uvicorn
from hyperdb.database import SessionLocal
from hyperdb import schemas
from hyperdb import crud


app = FastAPI()
BASE_ROUTE = '/api'


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Based on https://fastapi.tiangolo.com/tutorial/static-files/
app.mount(BASE_ROUTE + "/static", StaticFiles(directory="static"), name="static")


@app.post(BASE_ROUTE + "/systems/", response_model=schemas.System)
def create_system(system: schemas.SystemCreate, db: Session = Depends(get_db)):
    return crud.create_system(db=db, system=system)


@app.get(BASE_ROUTE + "/systems/", response_model=List[schemas.System])
def read_systems(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    systems = crud.retrieve_systems(db, skip=skip, limit=limit)
    return systems


@app.get(BASE_ROUTE + "/systems/{system_id}", response_model=schemas.System)
def read_system(system_id: int, db: Session = Depends(get_db)):
    system = crud.retrieve_system(db, system_id)
    return system


@app.delete(BASE_ROUTE + "/systems/{system_id}")
def delete_system(system_id: int = 0, db: Session = Depends(get_db)):
    countries = crud.destroy_system(db, system_id=system_id)
    return countries


@app.get(BASE_ROUTE + "/systems/{system_id}/comments", response_model=List[schemas.Comment])
def read_system_comments(system_id: int, db: Session = Depends(get_db)):
    system = crud.retrieve_system_comments(db, system_id)
    return system


@app.post(BASE_ROUTE + "/countries/", response_model=schemas.Country)
def create_country(country: schemas.CountryCreate, db: Session = Depends(get_db)):
    return crud.create_country(db=db, country=country)


@app.get(BASE_ROUTE + "/countries/", response_model=List[schemas.Country])
def read_countries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    countries = crud.retrieve_countries(db, skip=skip, limit=limit)
    return countries


@app.delete(BASE_ROUTE + "/countries/{country_id}")
def delete_country(country_id: int = 0, db: Session = Depends(get_db)):
    countries = crud.destroy_country(db, country_id=country_id)
    return countries


@app.post(BASE_ROUTE + "/contributors/", response_model=schemas.Contributor)
def create_contributor(contributor: schemas.ContributorCreate, db: Session = Depends(get_db)):
    return crud.create_contributor(db=db, contributor=contributor)


@app.get(BASE_ROUTE + "/contributors/", response_model=List[schemas.Contributor])
def read_contributors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    contributors = crud.get_contributors(db, skip=skip, limit=limit)
    return contributors


@app.post(BASE_ROUTE + "/geometries/", response_model=schemas.Geometry)
def create_geometry(geometry: schemas.GeometryCreate, db: Session = Depends(get_db)):
    return crud.create_geometry(db=db, geometry=geometry)


@app.get(BASE_ROUTE + "/geometries/", response_model=List[schemas.Geometry])
def read_geometries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    geometries = crud.get_geometries(db, skip=skip, limit=limit)
    return geometries


@app.post(BASE_ROUTE + "/meshes/", response_model=schemas.Mesh)
def create_mesh(mesh: schemas.MeshCreate, db: Session = Depends(get_db)):
    return crud.create_mesh(db=db, mesh=mesh)


@app.get(BASE_ROUTE + "/meshes/", response_model=List[schemas.Mesh])
def read_meshes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    meshes = crud.get_meshes(db, skip=skip, limit=limit)
    return meshes


@app.post(BASE_ROUTE + "/tools/", response_model=schemas.Tool)
def create_tool(tool: schemas.ToolCreate, db: Session = Depends(get_db)):
    return crud.create_tool(db=db, tool=tool)


@app.get(BASE_ROUTE + "/tools/", response_model=List[schemas.Tool])
def read_tools(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tools = crud.get_tools(db, skip=skip, limit=limit)
    return tools


@app.post(BASE_ROUTE + "/cbaero-settings/", response_model=schemas.CBAeroSetting)
def create_cbaero_setting(cbaero_setting: schemas.CBAeroSettingCreate, db: Session = Depends(get_db)):
    return crud.create_cbaero_setting(db=db, cbaero_setting=cbaero_setting)


@app.get(BASE_ROUTE + "/cbaero-settings/", response_model=List[schemas.CBAeroSetting])
def read_cbaero_settings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cbaero_settings = crud.get_cbaero_settings(db, skip=skip, limit=limit)
    return cbaero_settings


@app.post(BASE_ROUTE + "/cart3d-settings/", response_model=schemas.Cart3DSetting)
def create_cart3d_setting(cart3d_setting: schemas.Cart3DSettingCreate, db: Session = Depends(get_db)):
    return crud.create_cart3d_setting(db=db, cart3d_setting=cart3d_setting)


@app.get(BASE_ROUTE + "/cart3d-settings/", response_model=List[schemas.Cart3DSetting])
def read_cart3d_settings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_cart3d_settings(db, skip=skip, limit=limit)


@app.post(BASE_ROUTE + "/tool-settings/", response_model=schemas.ToolSetting)
def create_tool_setting(tool_setting: schemas.ToolSettingCreate, db: Session = Depends(get_db)):
    return crud.create_tool_setting(db=db, tool_setting=tool_setting)


@app.get(BASE_ROUTE + "/tool-settings/", response_model=List[schemas.ToolSetting])
def read_tool_settings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tool_settings(db, skip=skip, limit=limit)


@app.post(BASE_ROUTE + "/configured-tools/", response_model=schemas.ConfiguredTool)
def create_configured_tool(configured_tool: schemas.ConfiguredToolCreate, db: Session = Depends(get_db)):
    return crud.create_configured_tool(db=db, configured_tool=configured_tool)


@app.get(BASE_ROUTE + "/configured-tools/", response_model=List[schemas.ConfiguredTool])
def read_configured_tools(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_configured_tools(db, skip=skip, limit=limit)


@app.post(BASE_ROUTE + "/tool-mesh-associations/", response_model=schemas.ToolMeshAssociation)
def create_tool_mesh_association(tool_mesh_association: schemas.ToolMeshAssociationCreate, db: Session = Depends(get_db)):
    return crud.create_tool_mesh_association(db=db, tool_mesh_association=tool_mesh_association)


@app.get(BASE_ROUTE + "/tool-mesh-associations/", response_model=List[schemas.ToolMeshAssociation])
def read_tool_mesh_associations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tool_mesh_associations(db, skip=skip, limit=limit)


@app.post(BASE_ROUTE + "/tool-geometry-associations/", response_model=schemas.ToolGeometryAssociation)
def create_tool_geometry_association(tool_geometry_association: schemas.ToolGeometryAssociationCreate, db: Session = Depends(get_db)):
    return crud.create_tool_geometry_association(db=db, tool_geometry_association=tool_geometry_association)


@app.get(BASE_ROUTE + "/tool-geometry-associations/", response_model=List[schemas.ToolGeometryAssociation])
def read_tool_geometry_associations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tool_geometry_associations(db, skip=skip, limit=limit)


@app.post(BASE_ROUTE + "/aero-results/", response_model=schemas.AeroResult)
def create_aero_result(aero_result: schemas.AeroResultCreate, db: Session = Depends(get_db)):
    return crud.create_aero_result(db=db, aero_result=aero_result)


@app.get(BASE_ROUTE + "/aero-results/", response_model=List[schemas.AeroResult])
def read_aero_results(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_aero_results(db, skip=skip, limit=limit)


@app.post(BASE_ROUTE + "/comments/", response_model=schemas.Comment)
def create_comment(comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    return crud.create_comment(db=db, comment=comment)


@app.get(BASE_ROUTE + "/comments/", response_model=List[schemas.Comment])
def read_comments(type: schemas.CommentType | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_comments(db, type=type, skip=skip, limit=limit)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
