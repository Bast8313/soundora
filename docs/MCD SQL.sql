CREATE DATABASE IF NOT EXISTS soundora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE soundora;

-- Table utilisateur
CREATE TABLE utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    adresse TEXT
);

-- Table categorie
CREATE TABLE categorie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT
);

-- Table marque
CREATE TABLE marque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table produit
CREATE TABLE produit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    id_categorie INT,
    id_marque INT,
    FOREIGN KEY (id_categorie) REFERENCES categorie(id) ON DELETE SET NULL,
    FOREIGN KEY (id_marque) REFERENCES marque(id) ON DELETE SET NULL
);

-- Table commande
CREATE TABLE commande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    date DATETIME NOT NULL,
    statut VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id) ON DELETE CASCADE
);

-- Table ligne_commande
CREATE TABLE ligne_commande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT,
    id_produit INT,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_commande) REFERENCES commande(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES produit(id) ON DELETE CASCADE
);

-- Table panier
CREATE TABLE panier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id) ON DELETE CASCADE
);

-- Table ligne_panier
CREATE TABLE ligne_panier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_panier INT,
    id_produit INT,
    quantite INT NOT NULL,
    FOREIGN KEY (id_panier) REFERENCES panier(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES produit(id) ON DELETE CASCADE
);
