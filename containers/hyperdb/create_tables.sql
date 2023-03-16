CREATE USER DBUSER WITH PASSWORD 'DBPASSWORD';
GRANT ALL PRIVILEGES ON DATABASE DBNAME to DBUSER;


CREATE SEQUENCE system_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE system_id_seq OWNER TO DBUSER;


CREATE TABLE public.system
(
    id bigint DEFAULT nextval('system_id_seq'::regclass) not NULL,
    name character varying(128) COLLATE pg_catalog."default",
    classification character varying(128) COLLATE pg_catalog."default",
    CONSTRAINT system_pkey PRIMARY KEY (id),
    CONSTRAINT system_uk UNIQUE (name)
);
ALTER TABLE public.system OWNER to DBUSER;
GRANT ALL ON TABLE public.system TO DBUSER;


CREATE SEQUENCE country_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE country_id_seq OWNER TO DBUSER;


CREATE TABLE public.country
(
    id bigint DEFAULT nextval('country_id_seq'::regclass) not NULL,
    alpha_three_code character varying(3) COLLATE pg_catalog."default",
    CONSTRAINT country_pkey PRIMARY KEY (id),
    CONSTRAINT country_uk UNIQUE (alpha_three_code)
);
ALTER TABLE public.country OWNER to DBUSER;
GRANT ALL ON TABLE public.country TO DBUSER;


CREATE SEQUENCE country_system_associations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE country_system_associations_id_seq OWNER TO DBUSER;


CREATE TABLE public.country_system_associations
(
    id bigint DEFAULT nextval('country_system_associations_id_seq'::regclass) not NULL,
    system_fk bigint REFERENCES system(id) ON DELETE CASCADE,
    country_fk bigint REFERENCES country(id) ON DELETE CASCADE,
    CONSTRAINT country_system_associations_pkey PRIMARY KEY (id),
    CONSTRAINT country_system_associations_uk UNIQUE (system_fk, country_fk)
);
ALTER TABLE public.country_system_associations OWNER to DBUSER;
GRANT ALL ON TABLE public.country_system_associations TO DBUSER;


CREATE SEQUENCE contributor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE contributor_id_seq OWNER TO DBUSER;


CREATE TABLE public.contributor
(
    id bigint DEFAULT nextval('contributor_id_seq'::regclass) not NULL,
    name character varying(128) COLLATE pg_catalog."default",
    email character varying(64) COLLATE pg_catalog."default",
    CONSTRAINT contributor_pkey PRIMARY KEY (id),
    CONSTRAINT contributor_uk UNIQUE (name)
);
ALTER TABLE public.contributor OWNER to DBUSER;
GRANT ALL ON TABLE public.contributor TO DBUSER;


CREATE SEQUENCE geometry_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE geometry_id_seq OWNER TO DBUSER;


CREATE TABLE public.geometry
(
    id bigint DEFAULT nextval('geometry_id_seq'::regclass) not NULL,
    file character varying(128) COLLATE pg_catalog."default",
    contributor_fk bigint REFERENCES contributor(id) ON DELETE CASCADE,
    system_fk bigint REFERENCES system(id) ON DELETE CASCADE,
    CONSTRAINT geometry_pkey PRIMARY KEY (id),
    CONSTRAINT geometry_uk UNIQUE (file, system_fk)
);
ALTER TABLE public.geometry OWNER to DBUSER;
GRANT ALL ON TABLE public.geometry TO DBUSER;


CREATE SEQUENCE mesh_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE mesh_id_seq OWNER TO DBUSER;


CREATE TABLE public.mesh
(
    id bigint DEFAULT nextval('mesh_id_seq'::regclass) not NULL,
    file character varying(128) COLLATE pg_catalog."default",
    contributor_fk bigint REFERENCES contributor(id) ON DELETE CASCADE,
    geometry_fk bigint REFERENCES geometry(id) ON DELETE CASCADE,
    CONSTRAINT mesh_pkey PRIMARY KEY (id),
    CONSTRAINT mesh_uk UNIQUE (file, contributor_fk, geometry_fk)
);
ALTER TABLE public.mesh OWNER to DBUSER;
GRANT ALL ON TABLE public.mesh TO DBUSER;


CREATE SEQUENCE tool_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE tool_id_seq OWNER TO DBUSER;


CREATE TABLE public.tool
(
    id bigint DEFAULT nextval('tool_id_seq'::regclass) not NULL,
    name character varying(64) COLLATE pg_catalog."default",
    version character varying(32) COLLATE pg_catalog."default",
    CONSTRAINT tool_pkey PRIMARY KEY (id),
    CONSTRAINT tool_uk UNIQUE (name, version)
);
ALTER TABLE public.tool OWNER to DBUSER;
GRANT ALL ON TABLE public.tool TO DBUSER;


CREATE SEQUENCE cbaero_settings_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE cbaero_settings_seq OWNER TO DBUSER;


CREATE TABLE public.cbaero_settings
(
    id bigint DEFAULT nextval('cbaero_settings_seq'::regclass) not NULL,
    conf_file character varying(128) COLLATE pg_catalog."default",
    hash character varying(128) COLLATE pg_catalog."default",
    CONSTRAINT cbaero_settings_pkey PRIMARY KEY (id),
    CONSTRAINT cbaero_settings_uk UNIQUE (hash)
);
ALTER TABLE public.cbaero_settings OWNER to DBUSER;
GRANT ALL ON TABLE public.cbaero_settings TO DBUSER;


CREATE SEQUENCE cart3d_settings_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE cart3d_settings_seq OWNER TO DBUSER;


CREATE TABLE public.cart3d_settings
(
    id bigint DEFAULT nextval('cart3d_settings_seq'::regclass) not NULL,
    cntl_file character varying(128) COLLATE pg_catalog."default",
    hash character varying(128) COLLATE pg_catalog."default",
    CONSTRAINT cart3d_settings_pkey PRIMARY KEY (id),
    CONSTRAINT cart3d_settings_uk UNIQUE (hash)
);
ALTER TABLE public.cart3d_settings OWNER to DBUSER;
GRANT ALL ON TABLE public.cart3d_settings TO DBUSER;


CREATE SEQUENCE tool_settings_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE tool_settings_seq OWNER TO DBUSER;


CREATE TABLE public.tool_settings
(
    id bigint DEFAULT nextval('tool_settings_seq'::regclass) not NULL,
    cbaero_settings_fk bigint REFERENCES cbaero_settings(id) ON DELETE CASCADE,
    cart3d_settings_fk bigint REFERENCES cart3d_settings(id) ON DELETE CASCADE,
    CONSTRAINT tool_settings_pkey PRIMARY KEY (id),
    CONSTRAINT tool_settings_uk UNIQUE (cbaero_settings_fk, cart3d_settings_fk)
);
ALTER TABLE public.tool_settings OWNER to DBUSER;
GRANT ALL ON TABLE public.tool_settings TO DBUSER;


CREATE SEQUENCE tool_mesh_association_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE tool_mesh_association_seq OWNER TO DBUSER;


CREATE TABLE public.tool_mesh_association
(
    id bigint DEFAULT nextval('tool_mesh_association_seq'::regclass) not NULL,
    tool_fk bigint REFERENCES contributor(id) ON DELETE CASCADE,
    mesh_fk bigint REFERENCES mesh(id) ON DELETE CASCADE,
    CONSTRAINT tool_mesh_association_pkey PRIMARY KEY (id),
    CONSTRAINT tool_mesh_association_uk UNIQUE (tool_fk, mesh_fk)
);
ALTER TABLE public.tool_mesh_association OWNER to DBUSER;
GRANT ALL ON TABLE public.tool_mesh_association TO DBUSER;


CREATE SEQUENCE configured_tool_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE configured_tool_seq OWNER TO DBUSER;


CREATE TABLE public.configured_tool
(
    id bigint DEFAULT nextval('configured_tool_seq'::regclass) not NULL,
    tool_fk bigint REFERENCES contributor(id) ON DELETE CASCADE,
    tool_settings_fk bigint REFERENCES tool_settings(id) ON DELETE CASCADE,
    CONSTRAINT configured_tool_pkey PRIMARY KEY (id),
    CONSTRAINT configured_tool_uk UNIQUE (tool_fk, tool_settings_fk)
);
ALTER TABLE public.configured_tool OWNER to DBUSER;
GRANT ALL ON TABLE public.configured_tool TO DBUSER;


CREATE SEQUENCE aero_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE aero_seq OWNER TO DBUSER;


CREATE TABLE public.aero_results
(
    id bigint DEFAULT nextval('aero_seq'::regclass) not NULL,
    mach real,
    alpha real,
    reference_area real,
    lift_coefficient double precision,
    drag_coefficient double precision,
    configured_tool_fk bigint REFERENCES configured_tool(id) ON DELETE CASCADE,
    CONSTRAINT aero_results_pkey PRIMARY KEY (id)
);
ALTER TABLE public.aero_results OWNER to DBUSER;
GRANT ALL ON TABLE public.aero_results TO DBUSER;


CREATE SEQUENCE comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE comment_id_seq OWNER TO DBUSER;


CREATE TABLE public.comment
(
    id bigint DEFAULT nextval('comment_id_seq'::regclass) not NULL,
    title character varying(64) COLLATE pg_catalog."default",
    body character varying(256) COLLATE pg_catalog."default",
    contributor_fk bigint REFERENCES contributor(id) ON DELETE CASCADE,
    system_fk bigint REFERENCES system(id) ON DELETE CASCADE,
    geometry_fk bigint REFERENCES geometry(id) ON DELETE CASCADE,
    mesh_fk bigint REFERENCES mesh(id) ON DELETE CASCADE,
    tool_mesh_association_fk bigint REFERENCES tool_mesh_association(id) ON DELETE CASCADE,
    configured_tool_fk bigint REFERENCES configured_tool(id) ON DELETE CASCADE,
    CONSTRAINT comment_pkey PRIMARY KEY (id)
);
ALTER TABLE public.comment OWNER to DBUSER;
GRANT ALL ON TABLE public.comment TO DBUSER;
