CREATE DATABASE mini_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE users (
    id int AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,*
    password varchar(255) NOT NULL,
)

CREATE TABLE products (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock int DEFAULT 0,
    image_url VARCHAR(255),
);

CREATe TABLE category (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);


/* AJOUTE CATEGORY_ID DANS PRODUCTS, un produit peut être dans une catégorie (ou null si supprimée).*/
ALTER TABLE products
ADD COLUMN category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;