-- MySQL Script generated by MySQL Workbench
-- jeu. 03 juil. 2025 15:38:53
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema soundora
-- -----------------------------------------------------
-- soundora test

-- -----------------------------------------------------
-- Schema soundora
--
-- soundora test
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `soundora` DEFAULT CHARACTER SET utf8mb4 ;
USE `soundora` ;

-- -----------------------------------------------------
-- Table `soundora`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `soundora`.`categories` (
  `id` INT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `soundora`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `soundora`.`products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(45) NULL,
  `price` VARCHAR(45) NOT NULL,
  `stock` INT NULL DEFAULT 0,
  `image_url` VARCHAR(255) NULL,
  `categories_id` INT NOT NULL,
  PRIMARY KEY (`id`, `categories_id`),
  INDEX `fk_products_categories_idx` (`categories_id` ASC) VISIBLE,
  CONSTRAINT `fk_products_categories`
    FOREIGN KEY (`categories_id`)
    REFERENCES `soundora`.`categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `soundora`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `soundora`.`orders` (
  `id` INT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `order_date` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `soundora`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `soundora`.`users` (
  `id` INT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `orders_id` INT NOT NULL,
  PRIMARY KEY (`id`, `orders_id`),
  INDEX `fk_users_orders1_idx` (`orders_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_orders1`
    FOREIGN KEY (`orders_id`)
    REFERENCES `soundora`.`orders` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `soundora`.`products_has_orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `soundora`.`products_has_orders` (
  `products_id` INT NOT NULL,
  `products_categories_id` INT NOT NULL,
  `orders_id` INT NOT NULL,
  PRIMARY KEY (`products_id`, `products_categories_id`, `orders_id`),
  INDEX `fk_products_has_orders_orders1_idx` (`orders_id` ASC) VISIBLE,
  INDEX `fk_products_has_orders_products1_idx` (`products_id` ASC, `products_categories_id` ASC) VISIBLE,
  CONSTRAINT `fk_products_has_orders_products1`
    FOREIGN KEY (`products_id` , `products_categories_id`)
    REFERENCES `soundora`.`products` (`id` , `categories_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_products_has_orders_orders1`
    FOREIGN KEY (`orders_id`)
    REFERENCES `soundora`.`orders` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `soundora`.`products_has_users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `soundora`.`products_has_users` (
  `products_id` INT NOT NULL,
  `products_categories_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `users_orders_id` INT NOT NULL,
  PRIMARY KEY (`products_id`, `products_categories_id`, `users_id`, `users_orders_id`),
  INDEX `fk_products_has_users_users1_idx` (`users_id` ASC, `users_orders_id` ASC) VISIBLE,
  INDEX `fk_products_has_users_products1_idx` (`products_id` ASC, `products_categories_id` ASC) VISIBLE,
  CONSTRAINT `fk_products_has_users_products1`
    FOREIGN KEY (`products_id` , `products_categories_id`)
    REFERENCES `soundora`.`products` (`id` , `categories_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_products_has_users_users1`
    FOREIGN KEY (`users_id` , `users_orders_id`)
    REFERENCES `soundora`.`users` (`id` , `orders_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

USE `soundora` ;

-- -----------------------------------------------------
--  routine1
-- -----------------------------------------------------

DELIMITER $$
USE `soundora`$$
$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
