
import json
from typing import Callable, List, Union

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

PORT = 8000


app = FastAPI(
    title="Python back-end",
    description="Python back-end via a REST API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
async def root():
    html_content = """
        <html>
            <head>
                <title>LayPeople-xai-iml22</title>
            </head>
            <body>
                <h1>Python back-end</h1>
                Visit the <a href="/docs">API doc</a> (<a href="/redoc">alternative</a>) for usage information.
            </body>
        </html>
    """
    return HTMLResponse(content=html_content, status_code=200)

@app.post("/files/")
async def create_file(file: bytes = File(...)):
    return { "file_size": len(file) }

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return { "filename": file.filename }

def update_schema_name(app: FastAPI, function: Callable, name: str) -> None:
    """
    Updates the Pydantic schema name for a FastAPI function that takes
    in a fastapi.UploadFile = File(...) or bytes = File(...).

    This is a known issue that was reported on FastAPI#1442 in which
    the schema for file upload routes were auto-generated with no
    customization options. This renames the auto-generated schema to
    something more useful and clear.

    Args:
        app: The FastAPI application to modify.
        function: The function object to modify.
        name: The new name of the schema.
    """
    for route in app.routes:
        if route.endpoint is function:
            route.body_field.type_.__name__ = name
            break

update_schema_name(app, create_file, "CreateFileSchema")
update_schema_name(app, create_upload_file, "CreateUploadSchema")


class Item(BaseModel):
    history: List[str] = []
    wei_mtd: dict = { 'content': 1/3, 'popularity': 1/3, 'users': 1/3 }
    wei_obj: dict = { 'diversity': 0, 'exploration': 0, 'surprise': 0 }
    memory: bool = False
    inflex: Union[int, float] = 1/8 
    steep: Union[int, float] = 2 
    cats_rm: List[str] = []
    subcats_rm: List[str] = []

    class Config:
        orm_mode=True
    @classmethod
    def __get_validators__(cls):
        yield cls.validate_to_json

    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value

