from hyperdb.celery import hyperdb_celery


@hyperdb_celery.task
def run_aero(id: int):
    pass

