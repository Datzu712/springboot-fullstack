create table client
(
    id    INTEGER not null
        constraint client_pk
            primary key autoincrement,
    name  VARCHAR not null,
    email VARCHAR,
    phone VARCHAR
);

create unique index client_id_uindex
    on client (id);

create table product
(
    id          INTEGER
        constraint product_pk
            primary key autoincrement,
    name        VARCHAR,
    description VARCHAR,
    price       REAL
);

create unique index product_id_uindex
    on product (id);

create table sale
(
    id            INTEGER not null
        constraint sale_pk
            primary key autoincrement,
    purchase_date DATE    not null,
    product_id    INTEGER not null
        constraint sale_product_id_fk
            references product,
    client_id     INTEGER not null
        constraint sale_client_id_fk
            references client,
    amount        INTEGER not null
);

create unique index sale_id_uindex
    on sale (id);

create table worker
(
    id   INTEGER not null
        constraint worker_pk
            primary key autoincrement,
    name VARCHAR not null,
    role VARCHAR not null
);

create unique index worker_id_uindex
    on worker (id);

