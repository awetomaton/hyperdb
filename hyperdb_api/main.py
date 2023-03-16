from fastapi import FastAPI
from hyperdb.system import System


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
