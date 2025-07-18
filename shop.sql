CREATE DATABASE mini_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE users (
    id int AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
)

CREATE TABLE products (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock int DEFAULT 0,
    image_url VARCHAR(255)
);

CREATe TABLE categories(
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_date DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);



-- table pour panier --

-- Table pour stocker les paniers (un par utilisateur)
CREATE TABLE carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table pour stocker les articles dans chaque panier--
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL, /* Stocke le prix du produit au moment de l'ajout au panier */
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP, /* Date et heure d'ajout de l'article au panier */
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE, /* Si le panier est supprimé, les articles du panier le sont aussi */
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE 
    UNIQUE KEY unique_cart_product (cart_id, product_id) /* Assure qu'un produit ne peut apparaître qu'une seule fois dans un panier */
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL, /* Stocke le prix du produit au moment de la commande */
  product_name VARCHAR(255) NOT NULL, /* Stocke le nom du produit au moment de la commande */
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT /* Si le produit est supprimé, la commande ne peut pas être supprimée */
);

-- MISE A JOUR DE LA TABLE ORDERS--
ALTER TABLE orders /* modifie la table orders */
ADD COLUMN total DECIMAL(10, 2) NOT NULL DEFAULT 0, 
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending', /* Statut de la commande, par défaut 'pending' */
ADD COLUMN shipping_address VARCHAR(255), /* Adresse de livraison */
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP, /* Date de création de la commande */
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP; /* Date de mise à jour de la commande, se met à jour automatiquement à chaque modification */




/* AJOUTE CATEGORY_ID DANS PRODUCTS, un produit peut être dans une catégorie (ou null si supprimée).*/
ALTER TABLE products /* modifie la table products */
ADD COLUMN category_id INT, /* ajoute la colonne category_id de type INT pour stocker l'ID de la catégorie à laquelle le produit appartient */
ADD FOREIGN KEY (category_id) REFERENCES categories(id)/* cré une clé etrangère, garantit l'integrité : un produit ne peut referencer qu'une categorie existante */ ON DELETE SET NULL; /* Ce comportement s’active lorsqu’une ligne de la table categories est supprimée.*/