from fastapi import FastAPI
import os
from hyperdb.system import System


USE_POSTGRES = os.getenv("HYPERDB_USE_POSTGRES", False)


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/systems")
async def systems():
    

    return 

