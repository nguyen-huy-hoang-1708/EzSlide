-- ================================================
-- MySQL Forward Engineering SQL schema provided by the user
-- ================================================
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP SCHEMA IF EXISTS `presentation_system`;
CREATE SCHEMA IF NOT EXISTS `presentation_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `presentation_system`;

-- Table `users`
DROP TABLE IF EXISTS `presentation_system`.`users`;
CREATE TABLE IF NOT EXISTS `presentation_system`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `idx_email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table `presentations`
DROP TABLE IF EXISTS `presentation_system`.`presentations`;
CREATE TABLE IF NOT EXISTS `presentation_system`.`presentations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id` ASC) VISIBLE,
  INDEX `idx_created_at` (`created_at` ASC) VISIBLE,
  CONSTRAINT `fk_presentations_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `presentation_system`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table `slides`
DROP TABLE IF EXISTS `presentation_system`.`slides`;
CREATE TABLE IF NOT EXISTS `presentation_system`.`slides` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `presentation_id` INT NOT NULL,
  `order_index` INT NOT NULL,
  `background_color` VARCHAR(50) NULL DEFAULT '#FFFFFF',
  `background_image_url` TEXT NULL,
  `notes` TEXT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_presentation_id` (`presentation_id` ASC) VISIBLE,
  INDEX `idx_order` (`presentation_id` ASC, `order_index` ASC) VISIBLE,
  CONSTRAINT `fk_slides_presentations`
    FOREIGN KEY (`presentation_id`)
    REFERENCES `presentation_system`.`presentations` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table `elements`
DROP TABLE IF EXISTS `presentation_system`.`elements`;
CREATE TABLE IF NOT EXISTS `presentation_system`.`elements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slide_id` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `z_index` INT NULL DEFAULT 0,
  `x` FLOAT NULL DEFAULT 0,
  `y` FLOAT NULL DEFAULT 0,
  `width` FLOAT NULL,
  `height` FLOAT NULL,
  `rotation` FLOAT NULL DEFAULT 0,
  `data_json` JSON NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_slide_id` (`slide_id` ASC) VISIBLE,
  INDEX `idx_type` (`type` ASC) VISIBLE,
  INDEX `idx_z_index` (`z_index` ASC) VISIBLE,
  CONSTRAINT `fk_elements_slides`
    FOREIGN KEY (`slide_id`)
    REFERENCES `presentation_system`.`slides` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table `templates`
DROP TABLE IF EXISTS `presentation_system`.`templates`;
CREATE TABLE IF NOT EXISTS `presentation_system`.`templates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `thumbnail_url` TEXT NULL,
  `preview_image_url` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_title` (`title` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table `assets`
DROP TABLE IF EXISTS `presentation_system`.`assets`;
CREATE TABLE IF NOT EXISTS `presentation_system`.`assets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `file_url` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `uploaded_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id` ASC) VISIBLE,
  INDEX `idx_type` (`type` ASC) VISIBLE,
  INDEX `idx_uploaded_at` (`uploaded_at` ASC) VISIBLE,
  CONSTRAINT `fk_assets_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `presentation_system`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Sample inserts
INSERT INTO `presentation_system`.`users` (`name`, `email`, `password_hash`) VALUES
('John Doe', 'john@example.com', '$2y$10$example_hash_1'),
('Jane Smith', 'jane@example.com', '$2y$10$example_hash_2'),
('Admin User', 'admin@example.com', '$2y$10$example_hash_3');

-- (Rest of sample data omitted for brevity - see full spec for more)

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
