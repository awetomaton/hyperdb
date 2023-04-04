import json
import os
from sqlalchemy.orm import Session
from typing import Union
from hyperdb import models
from hyperdb.database import SessionLocal


FIXTURES_DIR = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', 'fixtures')


def generate_fixtures(
        location: Union[str, None] = None,
        num_countries: int = 5
    ):
    """Randomly generate fixtures data
    
    Parameters
    ----------
    location: str, None
        The directory or file in which to save the fixture. Defaults to the "fixtures" directory at the root of the 
        hyperdb_api project. The default filename is `fixtures.json`.
    """

    if location is None:
        fixtures_file = os.path.join(FIXTURES_DIR, 'fixtures.json')
    elif os.path.isdir(location):
        fixtures_file = os.path.join(location, 'fixtures.json')
    else:
        fixtures_file = location

    fixtures = {
        "countries": [models.Country.generate_random().to_dict() for _ in range(num_countries)]
    }
    with open(fixtures_file, 'w') as fid:
        json.dump(fixtures, fid)


def create_fixtures(db: Session, file: str):
    """Create fixtures in database from file
    
    Parameters
    ----------
    file: str
        The path to the fixtures file from which to create the database rows
    """

    with open(file, 'r') as fid:
        fixtures = json.load(fid)

    for country in fixtures["countries"]:
        db_item = models.Country(**country)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)


if __name__ == "__main__":
    if not os.path.exists(FIXTURES_DIR):
        os.mkdir(FIXTURES_DIR)
    fixtures_file = os.path.join(FIXTURES_DIR, 'fixtures.json')
    if not os.path.isfile(fixtures_file):
        generate_fixtures()
    
    create_fixtures(SessionLocal(), fixtures_file)
