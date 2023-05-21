from celery import Celery


hyperdb_celery = Celery('proj',
             broker='amqp://',
             backend='rpc://',
             include=['proj.tasks'])

# Optional configuration, see the application user guide.
hyperdb_celery.conf.update(
    result_expires=3600,
)

if __name__ == '__main__':
    hyperdb_celery.start()
