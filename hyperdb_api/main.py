from datetime import timedelta
from fastapi import Depends, FastAPI, HTTPException, UploadFile, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt
import os
from pathlib import Path
import shutil
from sqlalchemy.orm import Session
from typing import List, Annotated
import uvicorn
from hyperdb.database import SessionLocal
from hyperdb import schemas
from hyperdb import crud
from hyperdb import security
import uuid


app = FastAPI()
BASE_ROUTE = '/api'
HYPERDB_FILES_DIR = os.environ.get("HYPERDB_FILES_DIR", "static")
if not os.path.isdir(HYPERDB_FILES_DIR):
    os.mkdir(HYPERDB_FILES_DIR)
HYPERDB_GEOMETRIES_DIR = os.path.join(HYPERDB_FILES_DIR, "geometries")
if not os.path.isdir(HYPERDB_GEOMETRIES_DIR):
    os.mkdir(HYPERDB_GEOMETRIES_DIR)
HYPERDB_MESHES_DIR = os.path.join(HYPERDB_FILES_DIR, "meshes")
if not os.path.isdir(HYPERDB_MESHES_DIR):
    os.mkdir(HYPERDB_MESHES_DIR)
HYPERDB_TOOL_SETTINGS_DIR = os.path.join(HYPERDB_FILES_DIR, "tool_settings")
if not os.path.isdir(HYPERDB_TOOL_SETTINGS_DIR):
    os.mkdir(HYPERDB_TOOL_SETTINGS_DIR)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(
        token: Annotated[str, Depends(oauth2_scheme)],
        db: Session = Depends(get_db)
    ):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = str(payload.get("sub"))
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.retrieve_contributor(db, email=str(token_data.email))
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[schemas.Contributor, Depends(get_current_user)]
):
    return current_user


@app.post(BASE_ROUTE + "/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    user = security.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": getattr(user, 'email')}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get(BASE_ROUTE + "/me/", response_model=schemas.Contributor)
async def read_users_me(
    current_user: Annotated[schemas.Contributor, Depends(get_current_active_user)]
):
    return current_user


# Based on https://fastapi.tiangolo.com/tutorial/static-files/
app.mount(BASE_ROUTE + "/files", StaticFiles(directory=HYPERDB_FILES_DIR), name="files")


def file_upload(file: UploadFile, directory: str):
    #subdir = os.path.join(directory, str(uuid.uuid4()))
    #os.mkdir(subdir)
    subdir = directory
    destination = Path(os.path.join(subdir, str(file.filename)))
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()
    return str(destination)


@app.post(BASE_ROUTE + "/upload-geometry/", response_model=dict)
async def create_upload_geometry(file: UploadFile):
    return {"filepath": file_upload(file, HYPERDB_GEOMETRIES_DIR)}


@app.post(BASE_ROUTE + "/upload-mesh/")
async def create_upload_mesh(file: UploadFile):
    return {"filepath": file_upload(file, HYPERDB_MESHES_DIR)}


@app.post(BASE_ROUTE + "/upload-tool-setting/")
async def create_upload_tool_setting(file: UploadFile):
    return {"filepath": file_upload(file, HYPERDB_TOOL_SETTINGS_DIR)}


@app.post(BASE_ROUTE + "/systems/", response_model=schemas.System)
def create_system(system: schemas.SystemCreate, db: Session = Depends(get_db)):
    return crud.create_system(db=db, system=system)


@app.put(BASE_ROUTE + "/systems/{system_id}", response_model=schemas.System)
def update_system(system: schemas.System, db: Session = Depends(get_db)):
    return crud.update_system(db=db, system=system)


@app.get(BASE_ROUTE + "/systems/", response_model=List[schemas.System])
def read_systems(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    systems = crud.retrieve_systems(db, skip=skip, limit=limit)
    return systems


@app.get(BASE_ROUTE + "/systems/comments", response_model=List[schemas.Comment])
def read_systems_comments(db: Session = Depends(get_db)):
    system = crud.retrieve_systems_comments(db)
    return system


@app.get(BASE_ROUTE + "/systems/{system_id}", response_model=schemas.System)
def read_system(system_id: int, db: Session = Depends(get_db)):
    system = crud.retrieve_system(db, system_id)
    return system


@app.delete(BASE_ROUTE + "/systems/{system_id}")
def delete_system(system_id: int = 0, db: Session = Depends(get_db)):
    crud.destroy_system(db, system_id=system_id)
    return {'success': True}


@app.get(BASE_ROUTE + "/systems/{system_id}/comments", response_model=List[schemas.Comment])
def read_system_comments(system_id: int, db: Session = Depends(get_db)):
    comments = crud.retrieve_system_comments(db, system_id)
    return comments


@app.get(BASE_ROUTE + "/systems/{system_id}/geometries", response_model=List[schemas.Geometry])
def read_system_geometries(system_id: int, db: Session = Depends(get_db)):
    geometries = crud.retrieve_system_geometries(db, system_id)
    return geometries


@app.post(BASE_ROUTE + "/countries/", response_model=schemas.Country)
def create_country(country: schemas.CountryCreate, db: Session = Depends(get_db)):
    return crud.create_country(db=db, country=country)


@app.get(BASE_ROUTE + "/countries/", response_model=List[schemas.Country])
def read_countries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    countries = crud.retrieve_countries(db, skip=skip, limit=limit)
    return countries


@app.delete(BASE_ROUTE + "/countries/{country_id}")
def delete_country(country_id: int = 0, db: Session = Depends(get_db)):
    crud.destroy_country(db, country_id=country_id)
    return {'success': True}


@app.post(BASE_ROUTE + "/contributors/", response_model=schemas.Contributor)
def create_contributor(contributor: schemas.ContributorCreate, db: Session = Depends(get_db)):
    return crud.create_contributor(db=db, contributor=contributor)


@app.get(BASE_ROUTE + "/contributors/", response_model=List[schemas.Contributor])
def read_contributors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    contributors = crud.get_contributors(db, skip=skip, limit=limit)
    return contributors


@app.get(BASE_ROUTE + "/contributors/{contributor_id}", response_model=schemas.Contributor)
def read_contributor(contributor_id: int, db: Session = Depends(get_db)):
    return crud.retrieve_contributor(db=db, id=contributor_id)


@app.get(BASE_ROUTE + "/contributors/{contributor_id}/comments", response_model=List[schemas.Comment])
def read_contributor_comments(contributor_id: int, db: Session = Depends(get_db)):
    comments = crud.retrieve_contributor_comments(db, contributor_id=contributor_id)
    return comments


@app.get(BASE_ROUTE + "/contributors/{contributor_id}/geometries", response_model=List[schemas.Geometry])
def read_contributor_geometries(contributor_id: int, db: Session = Depends(get_db)):
    return crud.retrieve_contributor_geometries(db, contributor_id=contributor_id)


@app.get(BASE_ROUTE + "/contributors/{contributor_id}/tool-geometry-associations", response_model=List[schemas.ToolGeometryAssociation])
def read_contributor_tool_geometry_associations(contributor_id: int, db: Session = Depends(get_db)):
    return crud.retrieve_contributor_tool_geometry_associations(db, contributor_id=contributor_id)


@app.get(BASE_ROUTE + "/contributors/{contributor_id}/meshes", response_model=List[schemas.Mesh])
def read_contributor_meshes(contributor_id: int, db: Session = Depends(get_db)):
    return crud.retrieve_contributor_meshes(db, contributor_id=contributor_id)


@app.get(BASE_ROUTE + "/contributors/{contributor_id}/tool-mesh-associations", response_model=List[schemas.ToolMeshAssociation])
def read_contributor_tool_mesh_associations(contributor_id: int, db: Session = Depends(get_db)):
    return crud.retrieve_contributor_tool_mesh_associations(db, contributor_id=contributor_id)


@app.post(BASE_ROUTE + "/geometries/", response_model=schemas.Geometry)
def create_geometry(geometry: schemas.GeometryCreate, db: Session = Depends(get_db)):
    return crud.create_geometry(db=db, geometry=geometry)


@app.put(BASE_ROUTE + "/geometries/{geometry_id}", response_model=schemas.Geometry)
def update_geometry(geometry: schemas.Geometry, db: Session = Depends(get_db)):
    return crud.update_geometry(db=db, geometry=geometry)


@app.get(BASE_ROUTE + "/geometries/", response_model=List[schemas.Geometry])
def read_geometries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    geometries = crud.retrieve_geometries(db, skip=skip, limit=limit)
    return geometries


@app.get(BASE_ROUTE + "/geometries/comments", response_model=List[schemas.Comment])
def read_geometries_comments(db: Session = Depends(get_db)):
    comments = crud.retrieve_geometries_comments(db)
    return comments


@app.get(BASE_ROUTE + "/geometries/{geometry_id}", response_model=schemas.Geometry)
def read_geometry(geometry_id: int, db: Session = Depends(get_db)):
    comments = crud.retrieve_geometry(db, geometry_id)
    return comments


@app.get(BASE_ROUTE + "/geometries/{geometry_id}/comments", response_model=List[schemas.Comment])
def read_geometry_comments(geometry_id: int, db: Session = Depends(get_db)):
    comments = crud.retrieve_geometry_comments(db, geometry_id)
    return comments


@app.get(BASE_ROUTE + "/geometries/{geometry_id}/meshes", response_model=List[schemas.Mesh])
def read_geometry_meshes(geometry_id: int, db: Session = Depends(get_db)):
    return crud.retrieve_geometry_meshes(db, geometry_id)


@app.get(BASE_ROUTE + "/geometries/{geometry_id}/tools", response_model=List[schemas.ToolGeometryAssociation])
def read_geometry_tools(geometry_id: int, db: Session = Depends(get_db)):
    return crud.retrieve_geometry_tools(db, geometry_id)


@app.delete(BASE_ROUTE + "/geometries/{geometry_id}/tools")
def delete_geometry_tools(geometry_id: int, db: Session = Depends(get_db)):
    crud.destroy_geometry_tools(db, geometry_id)
    return {'success': True}


@app.delete(BASE_ROUTE + "/geometries/{geometry_id}")
def delete_geometry(geometry_id: int = 0, db: Session = Depends(get_db)):
    crud.destroy_geometry(db, geometry_id=geometry_id)
    return {'success': True}


@app.post(BASE_ROUTE + "/meshes/", response_model=schemas.Mesh)
def create_mesh(mesh: schemas.MeshCreate, db: Session = Depends(get_db)):
    return crud.create_mesh(db=db, mesh=mesh)


@app.get(BASE_ROUTE + "/meshes/", response_model=List[schemas.Mesh])
def read_meshes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    meshes = crud.get_meshes(db, skip=skip, limit=limit)
    return meshes


@app.get(BASE_ROUTE + "/meshes/{id}", response_model=schemas.Mesh)
def read_mesh(id: int, db: Session = Depends(get_db)):
    mesh = crud.get_mesh(db, id=id)
    return mesh


@app.get(BASE_ROUTE + "/meshes/{id}/comments", response_model=List[schemas.Comment])
def read_mesh_comments(id: int, db: Session = Depends(get_db)):
    mesh = crud.get_mesh_comments(db, id=id)
    return mesh


@app.get(BASE_ROUTE + "/meshes/{id}/configured-tools", response_model=List[schemas.ConfiguredTool])
def read_mesh_configured_tools(id: int, db: Session = Depends(get_db)):
    mesh = crud.get_mesh_configured_tools(db, id=id)
    return mesh


@app.post(BASE_ROUTE + "/tools/", response_model=schemas.Tool)
def create_tool(tool: schemas.ToolCreate, db: Session = Depends(get_db)):
    return crud.create_tool(db=db, tool=tool)


@app.get(BASE_ROUTE + "/tools/", response_model=List[schemas.Tool])
def read_tools(name: str | None = None, version: str | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tools = crud.retrieve_tools(db, name=name, version=version, skip=skip, limit=limit)
    return tools


@app.get(BASE_ROUTE + "/tools/{tool_id}", response_model=schemas.Tool)
def read_tool(tool_id: int, db: Session = Depends(get_db)):
    return crud.retrieve_tool(db, id=tool_id)


@app.get(BASE_ROUTE + "/tools/{tool_id}/configurations", response_model=List[schemas.ConfiguredTool])
def read_tool_configurations(tool_id: int, db: Session = Depends(get_db)):
    return crud.retrieve_tool_configurations(db, id=tool_id)


@app.delete(BASE_ROUTE + "/tools/{tool_id}")
def delete_tool(tool_id: int, db: Session = Depends(get_db)):
    crud.destroy_tool(db, id=tool_id)
    return {'success': True}


@app.post(BASE_ROUTE + "/cbaero-settings/", response_model=schemas.CBAeroSetting)
def create_cbaero_setting(cbaero_setting: schemas.CBAeroSettingCreate, db: Session = Depends(get_db)):
    return crud.create_cbaero_setting(db=db, cbaero_setting=cbaero_setting)


@app.get(BASE_ROUTE + "/cbaero-settings/", response_model=List[schemas.CBAeroSetting])
def read_cbaero_settings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cbaero_settings = crud.retrieve_cbaero_settings(db, skip=skip, limit=limit)
    return cbaero_settings


@app.get(BASE_ROUTE + "/cbaero-settings/{id}", response_model=schemas.CBAeroSetting)
def read_cbaero_setting(id: int, db: Session = Depends(get_db)):
    cbaero_setting = crud.retrieve_cbaero_setting(db, id=id)
    return cbaero_setting


@app.post(BASE_ROUTE + "/cart3d-settings/", response_model=schemas.Cart3DSetting)
def create_cart3d_setting(cart3d_setting: schemas.Cart3DSettingCreate, db: Session = Depends(get_db)):
    return crud.create_cart3d_setting(db=db, cart3d_setting=cart3d_setting)


@app.get(BASE_ROUTE + "/cart3d-settings/", response_model=List[schemas.Cart3DSetting])
def read_cart3d_settings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.retrieve_cart3d_settings(db, skip=skip, limit=limit)


@app.get(BASE_ROUTE + "/cart3d-settings/{id}", response_model=schemas.Cart3DSetting)
def read_cart3d_setting(id: int, db: Session = Depends(get_db)):
    return crud.retrieve_cart3d_setting(db, id=id)


@app.post(BASE_ROUTE + "/tool-settings/", response_model=schemas.ToolSetting)
def create_tool_setting(tool_setting: schemas.ToolSettingCreate, db: Session = Depends(get_db)):
    return crud.create_tool_setting(db=db, tool_setting=tool_setting)


@app.get(BASE_ROUTE + "/tool-settings/", response_model=List[schemas.ToolSetting])
def read_tool_settings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.retrieve_tool_settings(db, skip=skip, limit=limit)


@app.get(BASE_ROUTE + "/tool-settings/{id}", response_model=schemas.ToolSetting)
def read_tool_setting(id: int, db: Session = Depends(get_db)):
    return crud.retrieve_tool_setting(db, id=id)


@app.post(BASE_ROUTE + "/configured-tools/", response_model=schemas.ConfiguredTool)
def create_configured_tool(configured_tool: schemas.ConfiguredToolCreate, db: Session = Depends(get_db)):
    return crud.create_configured_tool(db=db, configured_tool=configured_tool)


@app.get(BASE_ROUTE + "/configured-tools/", response_model=List[schemas.ConfiguredTool])
def read_configured_tools(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.retrieve_configured_tools(db, skip=skip, limit=limit)


@app.get(BASE_ROUTE + "/configured-tools/{id}", response_model=schemas.ConfiguredTool)
def read_configured_tool(id:int, db: Session = Depends(get_db)):
    return crud.retrieve_configured_tool(db, id=id)


@app.get(BASE_ROUTE + "/configured-tools/{id}/meshes", response_model=List[schemas.Mesh])
def read_configured_tool_meshes(id:int, db: Session = Depends(get_db)):
    return crud.retrieve_configured_tool_meshes(db, id=id)


@app.get(BASE_ROUTE + "/configured-tools/{id}/aero-results", response_model=List[schemas.AeroResult])
def read_configured_tool_aero_results(id:int, db: Session = Depends(get_db)):
    return crud.retrieve_configured_aero_results(db, id=id)


@app.get(BASE_ROUTE + "/configured-tools/{id}/comments", response_model=List[schemas.Comment])
def read_configured_tool_comments(id:int, db: Session = Depends(get_db)):
    return crud.retrieve_configured_tool_comments(db, id=id)


@app.get(BASE_ROUTE + "/configured-tools/{id}/geometry-associations", response_model=schemas.ToolGeometryAssociation)
def read_configured_tool_geometry_associations(id: int, db: Session = Depends(get_db)):
    return crud.retrieve_configured_tool_geometry_associations(db, id=id)


@app.get(BASE_ROUTE + "/configured-tools/{id}/mesh-associations", response_model=schemas.ToolGeometryAssociation)
def read_configured_tool_mesh_associations(id: int, db: Session = Depends(get_db)):
    return crud.retrieve_configured_mesh_associations(db, id=id)


@app.post(BASE_ROUTE + "/tool-mesh-associations/", response_model=schemas.ToolMeshAssociation)
def create_tool_mesh_association(tool_mesh_association: schemas.ToolMeshAssociationCreate, db: Session = Depends(get_db)):
    return crud.create_tool_mesh_association(db=db, tool_mesh_association=tool_mesh_association)


@app.get(BASE_ROUTE + "/tool-mesh-associations/", response_model=List[schemas.ToolMeshAssociation])
def read_tool_mesh_associations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tool_mesh_associations(db, skip=skip, limit=limit)


@app.post(BASE_ROUTE + "/tool-geometry-associations/", response_model=schemas.ToolGeometryAssociation)
def create_tool_geometry_association(tool_geometry_association: schemas.ToolGeometryAssociationCreate, db: Session = Depends(get_db)):
    return crud.create_tool_geometry_association(db=db, tool_geometry_association=tool_geometry_association)


@app.post(BASE_ROUTE + "/tool-geometry-associations-bulk/", response_model=List[schemas.ToolGeometryAssociation])
def create_tool_geometry_associations(
    associations: List[schemas.ToolGeometryAssociationCreate], 
    db: Session = Depends(get_db)
):
    return crud.create_tool_geometry_associations(db, associations)


@app.get(BASE_ROUTE + "/tool-geometry-associations/", response_model=List[schemas.ToolGeometryAssociation])
def read_tool_geometry_associations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tool_geometry_associations(db, skip=skip, limit=limit)


@app.post(BASE_ROUTE + "/aero-results/", response_model=schemas.AeroResult)
def create_aero_result(aero_result: schemas.AeroResultCreate, db: Session = Depends(get_db)):
    return crud.create_aero_result(db=db, aero_result=aero_result)


@app.get(BASE_ROUTE + "/aero-results/", response_model=List[schemas.AeroResult])
def read_aero_results(
    mesh_id: int | None = None, 
    configured_tool_id: int | None = None, 
    skip: int | None = None, 
    limit: int | None = None, 
    db: Session = Depends(get_db)
):
    return crud.get_aero_results(db, mesh_id=mesh_id, configured_tool_id=configured_tool_id, skip=skip, limit=limit)


@app.post(BASE_ROUTE + "/comments/", response_model=schemas.Comment)
def create_comment(comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    return crud.create_comment(db=db, comment=comment)


@app.get(BASE_ROUTE + "/comments/", response_model=List[schemas.Comment])
def read_comments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_comments(db, skip=skip, limit=limit)


@app.get(BASE_ROUTE + "/comments/meta", response_model=List[schemas.CommentMeta])
def read_comments_meta(db: Session = Depends(get_db)):
    return crud.retrieve_comment_meta(db)


@app.delete(BASE_ROUTE + "/comments/{comment_id}")
def delete_comment(comment_id: int = 0, db: Session = Depends(get_db)):
    crud.destroy_comment(db, comment_id=comment_id)
    return {'success': True}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
