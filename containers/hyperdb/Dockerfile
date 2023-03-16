FROM postgres:latest
ARG dbname
ARG dbuser
ARG dbpassword


ADD create_tables.sql /opt/
ADD initdb.sh /docker-entrypoint-initdb.d/
RUN sed -i -e 's/\r$//' /docker-entrypoint-initdb.d/initdb.sh
RUN sed -i "s/DBNAME/$dbname/g" /docker-entrypoint-initdb.d/initdb.sh
RUN sed -i "s/DBNAME/$dbname/g" /opt/create_tables.sql
RUN sed -i "s/DBUSER/$dbuser/g" /opt/create_tables.sql
RUN sed -i "s/DBPASSWORD/$dbpassword/g" /opt/create_tables.sql

