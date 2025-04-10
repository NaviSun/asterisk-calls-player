--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Debian 15.12-0+deb12u2)
-- Dumped by pg_dump version 17.2

-- Started on 2025-04-10 13:17:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16790)
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    permission character varying NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16789)
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO postgres;

--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 218
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- TOC entry 221 (class 1259 OID 16801)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role character varying NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16800)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 220
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 222 (class 1259 OID 16918)
-- Name: roles_permissions_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_permissions_permissions (
    "rolesId" integer NOT NULL,
    "permissionsId" integer NOT NULL
);


ALTER TABLE public.roles_permissions_permissions OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16576)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    avatar character varying DEFAULT ''::character varying NOT NULL,
    email character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    banned boolean DEFAULT true NOT NULL,
    "banReason" character varying DEFAULT ''::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16575)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 223 (class 1259 OID 16925)
-- Name: users_roles_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_roles_roles (
    "usersId" integer NOT NULL,
    "rolesId" integer NOT NULL
);


ALTER TABLE public.users_roles_roles OWNER TO postgres;

--
-- TOC entry 3222 (class 2604 OID 16793)
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- TOC entry 3223 (class 2604 OID 16804)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3216 (class 2604 OID 16579)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3393 (class 0 OID 16790)
-- Dependencies: 219
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.permissions (id, permission) VALUES (1, 'create_user');
INSERT INTO public.permissions (id, permission) VALUES (2, 'update_user');
INSERT INTO public.permissions (id, permission) VALUES (3, 'find_user');
INSERT INTO public.permissions (id, permission) VALUES (4, 'read_controller');
INSERT INTO public.permissions (id, permission) VALUES (5, 'create_role');
INSERT INTO public.permissions (id, permission) VALUES (6, 'create_permission');
INSERT INTO public.permissions (id, permission) VALUES (7, 'add_permission_to_role');
INSERT INTO public.permissions (id, permission) VALUES (8, 'find_role_all');
INSERT INTO public.permissions (id, permission) VALUES (9, 'find_permissions_all');


--
-- TOC entry 3395 (class 0 OID 16801)
-- Dependencies: 221
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles (id, role) VALUES (1, 'admin');
INSERT INTO public.roles (id, role) VALUES (2, 'user');

--
-- TOC entry 3396 (class 0 OID 16918)
-- Dependencies: 222
-- Data for Name: roles_permissions_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (1, 1);
INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (1, 2);
INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (1, 3);
INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (1, 4);
INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (2, 4);
INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (1, 5);
INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (1, 6);
INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (1, 7);
INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (1, 8);
INSERT INTO public.roles_permissions_permissions ("rolesId", "permissionsId") VALUES (1, 9);


--
-- TOC entry 3391 (class 0 OID 16576)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--


INSERT INTO public.users (id, "firstName", "lastName", avatar, email, "passwordHash", banned, "banReason", "createdAt", "updatedAt") VALUES (1, 'UserFirstName', 'UserLastName', '', 'user@example.com', '$2b$10$YfxB2wVP3VPUUbU5g8n/1.qLeHWHSd3zWJioF/7Y0qOQcnjHI.GxC', false, '', '2025-04-04 14:18:51.92', '2025-04-09 14:56:16.397');



--
-- TOC entry 3397 (class 0 OID 16925)
-- Dependencies: 223
-- Data for Name: users_roles_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users_roles_roles ("usersId", "rolesId") VALUES (1, 1);


--
-- TOC entry 3243 (class 2606 OID 16929)
-- Name: users_roles_roles PK_6c1a055682c229f5a865f2080c1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "PK_6c1a055682c229f5a865f2080c1" PRIMARY KEY ("usersId", "rolesId");


--
-- TOC entry 3229 (class 2606 OID 16797)
-- Name: permissions PK_920331560282b8bd21bb02290df; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY (id);


--
-- TOC entry 3225 (class 2606 OID 16589)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 3239 (class 2606 OID 16922)
-- Name: roles_permissions_permissions PK_b2f4e3f7fbeb7e5b495dd819842; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permissions_permissions
    ADD CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("rolesId", "permissionsId");


--
-- TOC entry 3233 (class 2606 OID 16808)
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);


--
-- TOC entry 3227 (class 2606 OID 16591)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 3235 (class 2606 OID 16810)
-- Name: roles UQ_ccc7c1489f3a6b3c9b47d4537c5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE (role);


--
-- TOC entry 3231 (class 2606 OID 16799)
-- Name: permissions UQ_efcbbce13db89dbd3ef8b7690ae; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "UQ_efcbbce13db89dbd3ef8b7690ae" UNIQUE (permission);


--
-- TOC entry 3240 (class 1259 OID 16931)
-- Name: IDX_b2f0366aa9349789527e0c36d9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b2f0366aa9349789527e0c36d9" ON public.users_roles_roles USING btree ("rolesId");


--
-- TOC entry 3236 (class 1259 OID 16923)
-- Name: IDX_dc2b9d46195bb3ed28abbf7c9e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_dc2b9d46195bb3ed28abbf7c9e" ON public.roles_permissions_permissions USING btree ("rolesId");


--
-- TOC entry 3241 (class 1259 OID 16930)
-- Name: IDX_df951a64f09865171d2d7a502b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_df951a64f09865171d2d7a502b" ON public.users_roles_roles USING btree ("usersId");


--
-- TOC entry 3237 (class 1259 OID 16924)
-- Name: IDX_fd4d5d4c7f7ff16c57549b72c6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fd4d5d4c7f7ff16c57549b72c6" ON public.roles_permissions_permissions USING btree ("permissionsId");


--
-- TOC entry 3246 (class 2606 OID 16947)
-- Name: users_roles_roles FK_b2f0366aa9349789527e0c36d97; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "FK_b2f0366aa9349789527e0c36d97" FOREIGN KEY ("rolesId") REFERENCES public.roles(id);


--
-- TOC entry 3244 (class 2606 OID 16932)
-- Name: roles_permissions_permissions FK_dc2b9d46195bb3ed28abbf7c9e3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permissions_permissions
    ADD CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3" FOREIGN KEY ("rolesId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3247 (class 2606 OID 16942)
-- Name: users_roles_roles FK_df951a64f09865171d2d7a502b1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles_roles
    ADD CONSTRAINT "FK_df951a64f09865171d2d7a502b1" FOREIGN KEY ("usersId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3245 (class 2606 OID 16937)
-- Name: roles_permissions_permissions FK_fd4d5d4c7f7ff16c57549b72c6f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permissions_permissions
    ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES public.permissions(id);


-- Completed on 2025-04-10 13:17:36

--
-- PostgreSQL database dump complete
--

