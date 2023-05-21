HyperDB API
===========

Introduction
------------

Setup
-----

### Database
The HyperDB API needs a PostgreSQL database. We recommend the user create a database using the hyperdb docker image 
included with this repo. Users can create the database table by running the latest database migration:

```
alembic upgrade head 
```

Users can also populate the database with randomly generated data by running the `hyperdb/fixtures.py` script.

### VS Code

The author developed this software using VS Code. Some configuration makes it easier to run this project in VS Code. 

#### PYTHONPATH
Firstly, the `hyperdb` directory under the `hyperdb_api` directory is setup as an importable Python package. To make the 
package importable, it needs to be on the developer's `PYTHONPATH`. One can do this by setting the environmental 
globally on their system, but we recommend setting this environment variable in VS Code. Unfortunately, one needs to set 
this *two* places:

1. The `.vscode/launch.json`

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Current File",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "cwd": "${fileDirname}",
            "env": {
                "PYTHONPATH": "C:\\projects\\hyperhub\\hyperdb\\hyperdb_api"
            }
        }
    ]
}
```

2. The `.env` file

```
PYTHONPATH=C:\projects\hyperhub\hyperdb\hyperdb_api
```

#### Database
The API script connects to the PostgreSQL database with the following environment variables:
 * `HYPERDB_POSTGRES_USERNAME`
 * `HYPERDB_POSTGRES_PASSWORD`
 * `HYPERDB_POSTGRES_HOST`
 * `HYPERDB_POSTGRES_PORT`
 * `HYPERDB_POSTGRES_DATABASE`

Any `alembic` commands run from a VS Code terminal also need these environment variables. To cover all the places, these are needed, users need to put these in *three* places:

1. `.vscode/settings.json`

```json
{
    ...
    "terminal.integrated.env.windows": {
        "HYPERDB_POSTGRES_USERNAME": "hyperhub", 
        "HYPERDB_POSTGRES_PASSWORD": "password",
        "HYPERDB_POSTGRES_HOST": "localhost",
        "HYPERDB_POSTGRES_PORT": "5432",
        "HYPERDB_POSTGRES_DATABASE": "hyperhub",
    }
}
```

2. `.vscode/launch.json`

```json
{
    ...,
    "configurations": [
        {
            ...,
            "env": {
                ...,
                "HYPERDB_POSTGRES_USERNAME": "hyperhub", 
                "HYPERDB_POSTGRES_PASSWORD": "password",
                "HYPERDB_POSTGRES_HOST": "localhost",
                "HYPERDB_POSTGRES_PORT": "5432",
                "HYPERDB_POSTGRES_DATABASE": "hyperhub",
            }
        }
    ]
}
```

3. `.env`

```
HYPERDB_POSTGRES_USERNAME=hyperhub
HYPERDB_POSTGRES_PASSWORD=password
HYPERDB_POSTGRES_HOST=localhost
HYPERDB_POSTGRES_PORT=5432
HYPERDB_POSTGRES_DATABASE=hyperhub
```

Database Migrations
-------------------

Database migrations are handled via `alembic`. The database was created with `alembic init alembic` and the 
`alembic/env.py` was modified. If one wishes to start with a fresh database migration, they must remove the tables in 
the database **including** the `alembic_version` table which stores database migration metadata. They must copy the 
content in the `env.py` file, delete the `alembic` directory, and then copy the `env.py` content back. Then the 
developer can run `alembic init alembic` to create migrations from scratch. Run `alembic revision --autogenerate` to 
automatically create a migration.


Produce secret key with `openssl rand -hex 32` as per https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/.

### RabbitMQ
run -d --hostname hyper-rabbit --name hyper-rabbit -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password -p 8080:15672 -p 5672:5672 rabbitmq:3-management