#! /usr/bin/env/ node
import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;
dotenv.config();

const SQL = `
BEGIN;


ALTER TABLE IF EXISTS animal DROP CONSTRAINT IF EXISTS animal_category_id_fkey;

ALTER TABLE IF EXISTS animal_unit DROP CONSTRAINT IF EXISTS animal_unit_animal_id_fkey;

ALTER TABLE IF EXISTS animal_unit DROP CONSTRAINT IF EXISTS animal_unit_unit_id_fkey;

ALTER TABLE IF EXISTS description DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS fact DROP CONSTRAINT IF EXISTS None;

ALTER TABLE IF EXISTS feature DROP CONSTRAINT IF EXISTS None;


DROP TABLE IF EXISTS animal_unit;
DROP TABLE IF EXISTS unit;
DROP TABLE IF EXISTS description;
DROP TABLE IF EXISTS fact;
DROP TABLE IF EXISTS feature;
DROP TABLE IF EXISTS animal;
DROP TABLE IF EXISTS category;

CREATE TABLE IF NOT EXISTS animal
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    scientific_name character varying(100) COLLATE pg_catalog."default",
    category_id integer NOT NULL,
    img_url text COLLATE pg_catalog."default",
    natural_habitat character varying(50) COLLATE pg_catalog."default",
    lifespan numeric,
    weight numeric,

    length numeric,
    CONSTRAINT animal_pkey PRIMARY KEY (id)
);



CREATE TABLE IF NOT EXISTS animal_unit
(
    unit_id integer NOT NULL,
    animal_id integer NOT NULL,

    CONSTRAINT animal_unit_pkey PRIMARY KEY (unit_id, animal_id)
);



CREATE TABLE IF NOT EXISTS category
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    vertebrate boolean NOT NULL,
    name character varying(25) COLLATE pg_catalog."default" NOT NULL,

    CONSTRAINT category_pkey PRIMARY KEY (id)
);



CREATE TABLE IF NOT EXISTS description
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    description text COLLATE pg_catalog."default" NOT NULL,
    animal_id integer NOT NULL,

    CONSTRAINT description_pkey PRIMARY KEY (id)
);



CREATE TABLE IF NOT EXISTS fact
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    fact text COLLATE pg_catalog."default" NOT NULL,
    animal_id integer NOT NULL,
    CONSTRAINT fact_pkey PRIMARY KEY (id)
);



CREATE TABLE IF NOT EXISTS feature
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    feature text COLLATE pg_catalog."default" NOT NULL,
    category_id integer NOT NULL,
    CONSTRAINT feature_pkey PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS unit
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    category character varying(20) COLLATE pg_catalog."default" NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    abbreviation character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT unit_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS animal
    ADD CONSTRAINT animal_category_id_fkey FOREIGN KEY (category_id)
    REFERENCES category (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS animal_unit
    ADD CONSTRAINT animal_unit_animal_id_fkey FOREIGN KEY (animal_id)
    REFERENCES animal (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS animal_unit
    ADD CONSTRAINT animal_unit_unit_id_fkey FOREIGN KEY (unit_id)
    REFERENCES unit (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS description
    ADD FOREIGN KEY (animal_id)
    REFERENCES animal (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS fact
    ADD FOREIGN KEY (animal_id)
    REFERENCES animal (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS feature
    ADD FOREIGN KEY (category_id)
    REFERENCES category (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;
`;
async function main() {
  console.log("Initializing tables...");
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done");
}

main();
