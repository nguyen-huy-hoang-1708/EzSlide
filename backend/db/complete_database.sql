-- ============================================================
-- EZSlide - Complete Database Setup Script
-- Bao gồm: Tạo bảng + Dữ liệu + Chuyển đổi tiêu đề sang Nhật
-- ============================================================

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ============================================================
-- SECTION 1: DROP EXISTING DATABASE (Optional)
-- ============================================================

DROP DATABASE IF EXISTS `EZSlide`;
CREATE DATABASE `EZSlide` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `EZSlide`;

-- ============================================================
-- SECTION 2: CREATE TABLES
-- ============================================================

-- Table: User
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `avatarUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: Presentation
CREATE TABLE `Presentation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `templateId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Presentation_templateId_idx`(`templateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: Template
CREATE TABLE `Template` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `data` VARCHAR(191) NOT NULL DEFAULT '{}',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: Slide
CREATE TABLE `Slide` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `orderIndex` INTEGER NULL,
    `presentationId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `templateId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Slide_presentationId_idx`(`presentationId`),
    INDEX `Slide_templateId_idx`(`templateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: Element
CREATE TABLE `Element` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slideId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `zIndex` INTEGER NULL,
    `x` DOUBLE NULL,
    `y` DOUBLE NULL,
    `width` DOUBLE NULL,
    `height` DOUBLE NULL,
    `rotation` DOUBLE NULL,
    `data` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Element_slideId_idx`(`slideId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: Asset
CREATE TABLE `Asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Asset_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table: _prisma_migrations
CREATE TABLE `_prisma_migrations` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `checksum` VARCHAR(64) NOT NULL,
    `finished_at` DATETIME(3) NULL,
    `migration_name` VARCHAR(255) NOT NULL,
    `logs` LONGTEXT NULL,
    `rolled_back_at` DATETIME(3) NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `applied_steps_count` INTEGER NOT NULL DEFAULT 0
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- SECTION 3: ADD FOREIGN KEY CONSTRAINTS
-- ============================================================

ALTER TABLE `Presentation` ADD CONSTRAINT `Presentation_userId_fkey` 
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Presentation` ADD CONSTRAINT `Presentation_templateId_fkey` 
    FOREIGN KEY (`templateId`) REFERENCES `Template`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Slide` ADD CONSTRAINT `Slide_presentationId_fkey` 
    FOREIGN KEY (`presentationId`) REFERENCES `Presentation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Slide` ADD CONSTRAINT `Slide_userId_fkey` 
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Slide` ADD CONSTRAINT `Slide_templateId_fkey` 
    FOREIGN KEY (`templateId`) REFERENCES `Template`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Element` ADD CONSTRAINT `Element_slideId_fkey` 
    FOREIGN KEY (`slideId`) REFERENCES `Slide`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Asset` ADD CONSTRAINT `Asset_userId_fkey` 
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================
-- SECTION 4: INSERT SAMPLE DATA (Users, Templates, Presentations, Slides, Elements)
-- ============================================================

-- Insert test users with properly hashed passwords
-- Password for test@example.com: Test@123
-- Password for admin@example.com: Admin@123
INSERT INTO `User` (`email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
('test@example.com', '$2b$10$zq4L17BKsrleAafoJ8qNyeVKk7br.NOCz37LiEzfaGrIE.fx/7H3O', 'Demo User', 'user', NOW(3), NOW(3)),
('admin@example.com', '$2b$10$1JvufVEfQy541UhIqQFNCOifVChneGQupZPA46HtnLn11NVwcTpte', 'Admin User', 'admin', NOW(3), NOW(3));

-- Get user IDs for foreign keys (MySQL variables)
SET @adminUserId = (SELECT id FROM `User` WHERE email = 'admin@example.com' LIMIT 1);
SET @testUserId = (SELECT id FROM `User` WHERE email = 'test@example.com' LIMIT 1);

-- Insert Template: Business Pitch Deck Pro
INSERT INTO `Template` (`name`, `category`, `thumbnail`, `data`) VALUES
('ビジネスピッチデッキプロ', 'ビジネス', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop', 
 '{"{"theme":{"{"colors":["{"#1a56db","#ffffff","#f3f4f6"]}},"slideCount":10}');

SET @templateId = LAST_INSERT_ID();

-- Create sample presentation for this template
INSERT INTO `Presentation` (`userId`, `title`, `templateId`, `createdAt`, `updatedAt`) VALUES
(@adminUserId, 'ビジネスピッチデッキプロ - サンプル', @templateId, NOW(3), NOW(3));

SET @presentationId = LAST_INSERT_ID();

-- Slide 1: Cover Slide
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 1, '表紙', '{"background":"#1a56db","backgroundImage":"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"}', NOW(3), NOW(3));

SET @slideId1 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId1, 'shape', 0, 0, 960, 540, 0, 0, '{"shape":"rectangle","fill":"#1a56db","opacity":0.85}', NOW(3), NOW(3)),
(@slideId1, 'text', 80, 150, 800, 120, 1, 0, '{"text":"TechVision AI","fontSize":82,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId1, 'text', 80, 280, 800, 70, 2, 0, '{"text":"Revolutionizing Business Intelligence with AI","fontSize":38,"color":"#bfdbfe","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId1, 'text', 300, 380, 360, 50, 3, 0, '{"text":"Series A Investment Deck | Q4 2025","fontSize":22,"color":"#e0e7ff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId1, 'shape', 750, 420, 180, 180, 4, 0, '{"shape":"circle","fill":"#3b82f6","opacity":0.2}', NOW(3), NOW(3));

-- Slide 2: The Problem
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 2, '問題点', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));

SET @slideId2 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2, 'text', 80, 50, 800, 80, 0, 0, '{"text":"The Challenge We\'re Solving","fontSize":52,"fontWeight":"bold","color":"#1a56db"}', NOW(3), NOW(3)),
(@slideId2, 'shape', 60, 145, 8, 320, 1, 0, '{"shape":"rectangle","fill":"#1a56db","opacity":1}', NOW(3), NOW(3)),
(@slideId2, 'image', 520, 150, 400, 320, 2, 0, '{"imageUrl":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=640&fit=crop","alt":"Problem"}', NOW(3), NOW(3)),
(@slideId2, 'text', 80, 150, 420, 320, 3, 0, '{"text":"📊 Companies waste $2.5M annually\\non manual data analysis\\n\\n⏰ 60% of decisions delayed\\ndue to lack of insights\\n\\n🔍 Traditional BI tools require\\nweeks of training\\n\\n💸 90% of SMBs can\'t afford\\nenterprise solutions","fontSize":24,"color":"#374151","lineHeight":1.8}', NOW(3), NOW(3));

-- Slide 3: Our Solution
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 3, '解決策', '{"background":"#f8fafc","backgroundImage":"https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop"}', NOW(3), NOW(3));

SET @slideId3 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3, 'shape', 0, 0, 960, 540, 0, 0, '{"shape":"rectangle","fill":"#0f172a","opacity":0.80}', NOW(3), NOW(3)),
(@slideId3, 'text', 80, 120, 800, 100, 1, 0, '{"text":"AI-Powered Business Intelligence","fontSize":68,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId3, 'text', 120, 250, 720, 180, 2, 0, '{"text":"Get instant insights from your data\\nusing natural language queries.\\nNo training required.\\nAnswers in seconds, not weeks.","fontSize":34,"color":"#e0e7ff","textAlign":"center","lineHeight":1.6}', NOW(3), NOW(3));

-- Slide 4: Product Demo
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 4, '製品デモ', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));

SET @slideId4 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId4, 'text', 80, 50, 800, 80, 0, 0, '{"text":"How It Works","fontSize":52,"fontWeight":"bold","color":"#1a56db"}', NOW(3), NOW(3)),
(@slideId4, 'image', 80, 150, 800, 350, 1, 0, '{"imageUrl":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=700&fit=crop","alt":"Dashboard"}', NOW(3), NOW(3)),
(@slideId4, 'shape', 300, 480, 360, 4, 2, 0, '{"shape":"rectangle","fill":"#1a56db","opacity":1}', NOW(3), NOW(3));

-- Slide 5: Key Features
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 5, '主要機能', '{"background":"#f8fafc","backgroundImage":""}', NOW(3), NOW(3));

SET @slideId5 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId5, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Powerful Features","fontSize":52,"fontWeight":"bold","color":"#1a56db"}', NOW(3), NOW(3)),
(@slideId5, 'shape', 80, 160, 380, 150, 1, 0, '{"shape":"rectangle","fill":"#ffffff","opacity":1}', NOW(3), NOW(3)),
(@slideId5, 'text', 110, 190, 320, 90, 2, 0, '{"text":"🤖 Natural Language AI\\nAsk questions in plain English","fontSize":22,"color":"#1f2937","lineHeight":1.6}', NOW(3), NOW(3)),
(@slideId5, 'shape', 500, 160, 380, 150, 3, 0, '{"shape":"rectangle","fill":"#ffffff","opacity":1}', NOW(3), NOW(3)),
(@slideId5, 'text', 530, 190, 320, 90, 4, 0, '{"text":"📊 Real-time Analytics\\nLive data visualization","fontSize":22,"color":"#1f2937","lineHeight":1.6}', NOW(3), NOW(3)),
(@slideId5, 'shape', 80, 330, 380, 150, 5, 0, '{"shape":"rectangle","fill":"#ffffff","opacity":1}', NOW(3), NOW(3)),
(@slideId5, 'text', 110, 360, 320, 90, 6, 0, '{"text":"🔒 Enterprise Security\\nBank-level encryption","fontSize":22,"color":"#1f2937","lineHeight":1.6}', NOW(3), NOW(3)),
(@slideId5, 'shape', 500, 330, 380, 150, 7, 0, '{"shape":"rectangle","fill":"#ffffff","opacity":1}', NOW(3), NOW(3)),
(@slideId5, 'text', 530, 360, 320, 90, 8, 0, '{"text":"🚀 Instant Deployment\\nUp and running in minutes","fontSize":22,"color":"#1f2937","lineHeight":1.6}', NOW(3), NOW(3));

-- Slide 6: Market Opportunity
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 6, '市場機会', '{"background":"#1a56db","backgroundImage":""}', NOW(3), NOW(3));

SET @slideId6 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId6, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Massive Market Opportunity","fontSize":56,"fontWeight":"bold","color":"#ffffff"}', NOW(3), NOW(3)),
(@slideId6, 'shape', 80, 170, 240, 240, 1, 0, '{"shape":"circle","fill":"#3b82f6","opacity":1}', NOW(3), NOW(3)),
(@slideId6, 'text', 100, 240, 200, 120, 2, 0, '{"text":"$45B\\nTAM","fontSize":48,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId6, 'shape', 360, 170, 240, 240, 3, 0, '{"shape":"circle","fill":"#60a5fa","opacity":1}', NOW(3), NOW(3)),
(@slideId6, 'text', 380, 240, 200, 120, 4, 0, '{"text":"$12B\\nSAM","fontSize":48,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId6, 'shape', 640, 170, 240, 240, 5, 0, '{"shape":"circle","fill":"#93c5fd","opacity":1}', NOW(3), NOW(3)),
(@slideId6, 'text', 660, 240, 200, 120, 6, 0, '{"text":"$2.8B\\nSOM","fontSize":48,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3));

-- Slide 7: Business Model
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 7, 'ビジネスモデル', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));

SET @slideId7 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId7, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Revenue Streams","fontSize":52,"fontWeight":"bold","color":"#1a56db"}', NOW(3), NOW(3)),
(@slideId7, 'shape', 80, 160, 250, 220, 1, 0, '{"shape":"rectangle","fill":"#1a56db","opacity":1}', NOW(3), NOW(3)),
(@slideId7, 'text', 100, 200, 210, 160, 2, 0, '{"text":"💼 Enterprise\\n\\n$999/mo\\n\\n50% margin","fontSize":26,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.8}', NOW(3), NOW(3)),
(@slideId7, 'shape', 355, 160, 250, 220, 3, 0, '{"shape":"rectangle","fill":"#3b82f6","opacity":1}', NOW(3), NOW(3)),
(@slideId7, 'text', 375, 200, 210, 160, 4, 0, '{"text":"🏢 Business\\n\\n$299/mo\\n\\n60% margin","fontSize":26,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.8}', NOW(3), NOW(3)),
(@slideId7, 'shape', 630, 160, 250, 220, 5, 0, '{"shape":"rectangle","fill":"#60a5fa","opacity":1}', NOW(3), NOW(3)),
(@slideId7, 'text', 650, 200, 210, 160, 6, 0, '{"text":"👤 Starter\\n\\n$49/mo\\n\\n70% margin","fontSize":26,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.8}', NOW(3), NOW(3));

-- Slide 8: Traction & Growth
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 8, '成長と実績', '{"background":"#f8fafc","backgroundImage":""}', NOW(3), NOW(3));

SET @slideId8 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId8, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Our Progress","fontSize":52,"fontWeight":"bold","color":"#1a56db"}', NOW(3), NOW(3)),
(@slideId8, 'image', 500, 140, 400, 360, 1, 0, '{"imageUrl":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=720&fit=crop","alt":"Growth"}', NOW(3), NOW(3)),
(@slideId8, 'text', 80, 150, 400, 340, 2, 0, '{"text":"✅ 15,000+ active users\\n\\n✅ $1.2M ARR (Annual Recurring Revenue)\\n\\n✅ 150% YoY growth rate\\n\\n✅ 95% customer retention\\n\\n✅ Partnerships with\\n     Fortune 500 companies","fontSize":26,"color":"#1f2937","lineHeight":1.9,"fontWeight":"600"}', NOW(3), NOW(3));

-- Slide 9: The Team
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 9, 'チーム紹介', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));

SET @slideId9 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId9, 'text', 80, 50, 800, 80, 0, 0, '{"text":"World-Class Leadership","fontSize":52,"fontWeight":"bold","color":"#1a56db"}', NOW(3), NOW(3)),
(@slideId9, 'image', 80, 160, 180, 180, 1, 0, '{"imageUrl":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=360&h=360&fit=crop","alt":"CEO"}', NOW(3), NOW(3)),
(@slideId9, 'text', 80, 355, 180, 100, 2, 0, '{"text":"John Smith\\nCEO & Founder\\nEx-Google","fontSize":18,"color":"#374151","textAlign":"center","lineHeight":1.6,"fontWeight":"600"}', NOW(3), NOW(3)),
(@slideId9, 'image', 280, 160, 180, 180, 3, 0, '{"imageUrl":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=360&h=360&fit=crop","alt":"CTO"}', NOW(3), NOW(3)),
(@slideId9, 'text', 280, 355, 180, 100, 4, 0, '{"text":"Sarah Lee\\nCTO\\nEx-Microsoft","fontSize":18,"color":"#374151","textAlign":"center","lineHeight":1.6,"fontWeight":"600"}', NOW(3), NOW(3)),
(@slideId9, 'image', 480, 160, 180, 180, 5, 0, '{"imageUrl":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=360&h=360&fit=crop","alt":"CPO"}', NOW(3), NOW(3)),
(@slideId9, 'text', 480, 355, 180, 100, 6, 0, '{"text":"Mike Chen\\nCPO\\nEx-Amazon","fontSize":18,"color":"#374151","textAlign":"center","lineHeight":1.6,"fontWeight":"600"}', NOW(3), NOW(3)),
(@slideId9, 'image', 680, 160, 180, 180, 7, 0, '{"imageUrl":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=360&h=360&fit=crop","alt":"CMO"}', NOW(3), NOW(3)),
(@slideId9, 'text', 680, 355, 180, 100, 8, 0, '{"text":"Emily Davis\\nCMO\\nEx-Meta","fontSize":18,"color":"#374151","textAlign":"center","lineHeight":1.6,"fontWeight":"600"}', NOW(3), NOW(3));

-- Slide 10: Investment Ask
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId, 10, '投資依頼', '{"background":"#1a56db","backgroundImage":"https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=1080&fit=crop"}', NOW(3), NOW(3));

SET @slideId10 = LAST_INSERT_ID();

INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId10, 'shape', 0, 0, 960, 540, 0, 0, '{"shape":"rectangle","fill":"#1e40af","opacity":0.92}', NOW(3), NOW(3)),
(@slideId10, 'text', 80, 100, 800, 100, 1, 0, '{"text":"Join Us in Transforming BI","fontSize":64,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId10, 'text', 120, 230, 720, 200, 2, 0, '{"text":"Raising $10M Series A\\n\\nto scale operations, expand our team,\\nand capture significant market share\\nin the growing BI industry","fontSize":32,"color":"#bfdbfe","textAlign":"center","lineHeight":1.8}', NOW(3), NOW(3)),
(@slideId10, 'text', 280, 450, 400, 60, 3, 0, '{"text":"contact@techvision.ai","fontSize":28,"color":"#ffffff","textAlign":"center","fontWeight":"bold"}', NOW(3), NOW(3));

-- ============================================================
-- Insert Template 2: Modern Education Course
-- ============================================================

INSERT INTO `Template` (`name`, `category`, `thumbnail`, `data`) VALUES
('モダン教育コース', '教育', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', 
 '{"{"theme":{"{"colors":["{"#059669","#ffffff","#f0fdf4"]}},"slideCount":10}');

SET @templateId2 = LAST_INSERT_ID();

-- Create sample presentation for template 2
INSERT INTO `Presentation` (`userId`, `title`, `templateId`, `createdAt`, `updatedAt`) VALUES
(@adminUserId, 'モダン教育コース - サンプル', @templateId2, NOW(3), NOW(3));

SET @presentationId2 = LAST_INSERT_ID();

-- Template 2, Slide 1: Course Introduction
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 1, 'Course Introduction', '{"background":"#059669","backgroundImage":"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop"}', NOW(3), NOW(3));
SET @slideId2_1 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_1, 'shape', 0, 0, 960, 540, 0, 0, '{"shape":"rectangle","fill":"#047857","opacity":0.88}', NOW(3), NOW(3)),
(@slideId2_1, 'text', 80, 130, 800, 140, 1, 0, '{"text":"Modern Web Development","fontSize":78,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId2_1, 'text', 80, 290, 800, 90, 2, 0, '{"text":"From Zero to Full-Stack Developer in 12 Weeks","fontSize":36,"color":"#d1fae5","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId2_1, 'text', 250, 410, 460, 60, 3, 0, '{"text":"100% Online • Live Classes • Certificate","fontSize":24,"color":"#ecfdf5","textAlign":"center","fontWeight":"600"}', NOW(3), NOW(3));

-- Template 2, Slide 2: What You Will Learn
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 2, 'What You Will Learn', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId2_2 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_2, 'text', 80, 50, 800, 80, 0, 0, '{"text":"What You\'ll Master","fontSize":52,"fontWeight":"bold","color":"#059669"}', NOW(3), NOW(3)),
(@slideId2_2, 'image', 520, 150, 400, 340, 1, 0, '{"imageUrl":"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=680&fit=crop","alt":"Coding"}', NOW(3), NOW(3)),
(@slideId2_2, 'text', 80, 150, 420, 340, 2, 0, '{"text":"✅ HTML5, CSS3 & JavaScript ES6+\\n\\n✅ React, Vue & Modern Frameworks\\n\\n✅ Node.js & Express Backend\\n\\n✅ Database Design (SQL & NoSQL)\\n\\n✅ Git, Testing & Deployment\\n\\n✅ Build Real-World Projects","fontSize":23,"color":"#1f2937","lineHeight":1.95,"fontWeight":"500"}', NOW(3), NOW(3));

-- Template 2, Slide 3: Prerequisites
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 3, 'Prerequisites', '{"background":"#f0fdf4","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId2_3 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_3, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Who Should Enroll","fontSize":52,"fontWeight":"bold","color":"#059669"}', NOW(3), NOW(3)),
(@slideId2_3, 'shape', 80, 160, 390, 310, 1, 0, '{"shape":"rectangle","fill":"#ffffff","opacity":1}', NOW(3), NOW(3)),
(@slideId2_3, 'text', 110, 190, 330, 250, 2, 0, '{"text":"✓ Complete Beginners Welcome\\n\\n✓ Career Switchers\\n\\n✓ Self-Taught Developers\\n\\n✓ CS Students\\n\\n✓ Anyone Passionate About Tech","fontSize":25,"color":"#374151","lineHeight":1.9,"fontWeight":"500"}', NOW(3), NOW(3)),
(@slideId2_3, 'image', 500, 160, 410, 310, 3, 0, '{"imageUrl":"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=820&h=620&fit=crop","alt":"Students"}', NOW(3), NOW(3));

-- Template 2, Slide 4: Phase 1: Frontend Fundamentals
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 4, 'Phase 1: Frontend Fundamentals', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId2_4 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_4, 'text', 80, 45, 800, 75, 0, 0, '{"text":"Weeks 1-3: Frontend Fundamentals","fontSize":48,"fontWeight":"bold","color":"#059669"}', NOW(3), NOW(3)),
(@slideId2_4, 'text', 100, 145, 380, 170, 1, 0, '{"text":"📘 Week 1-2: HTML & CSS\\n• Semantic HTML5\\n• Flexbox & Grid Layouts\\n• Responsive Design\\n• CSS Animations","fontSize":21,"color":"#1f2937","lineHeight":1.75}', NOW(3), NOW(3)),
(@slideId2_4, 'text', 520, 145, 380, 170, 2, 0, '{"text":"⚡ Week 3: JavaScript\\n• Variables & Functions\\n• DOM Manipulation\\n• Events & Async Code\\n• ES6+ Features","fontSize":21,"color":"#1f2937","lineHeight":1.75}', NOW(3), NOW(3)),
(@slideId2_4, 'shape', 80, 345, 800, 155, 3, 0, '{"shape":"rectangle","fill":"#d1fae5","opacity":1}', NOW(3), NOW(3)),
(@slideId2_4, 'text', 110, 375, 740, 95, 4, 0, '{"text":"🎯 Project: Build Your Portfolio Website\\nResponsive personal site with smooth animations","fontSize":27,"color":"#065f46","textAlign":"center","fontWeight":"bold","lineHeight":1.6}', NOW(3), NOW(3));

-- Template 2, Slide 5: Phase 2: Modern Frontend
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 5, 'Phase 2: Modern Frontend', '{"background":"#f0fdf4","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId2_5 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_5, 'text', 80, 45, 800, 75, 0, 0, '{"text":"Weeks 4-6: Modern Frontend Stack","fontSize":48,"fontWeight":"bold","color":"#059669"}', NOW(3), NOW(3)),
(@slideId2_5, 'text', 100, 145, 380, 190, 1, 0, '{"text":"⚛️ Week 4-5: React Ecosystem\\n• Components & Props\\n• Hooks & State Management\\n• React Router\\n• Context API\\n• Performance Tips","fontSize":21,"color":"#1f2937","lineHeight":1.75}', NOW(3), NOW(3)),
(@slideId2_5, 'text', 520, 145, 380, 190, 2, 0, '{"text":"🛠️ Week 6: Advanced Tools\\n• TypeScript Basics\\n• Tailwind CSS\\n• Vite Build Tool\\n• npm & Packages\\n• Git Version Control","fontSize":21,"color":"#1f2937","lineHeight":1.75}', NOW(3), NOW(3)),
(@slideId2_5, 'shape', 80, 365, 800, 135, 3, 0, '{"shape":"rectangle","fill":"#ffffff","opacity":1}', NOW(3), NOW(3)),
(@slideId2_5, 'text', 110, 390, 740, 85, 4, 0, '{"text":"🎯 Project: E-commerce Shopping App\\nFull React app with cart, routing & API integration","fontSize":26,"color":"#065f46","textAlign":"center","fontWeight":"bold","lineHeight":1.6}', NOW(3), NOW(3));

-- Template 2, Slide 6: Phase 3: Backend Development
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 6, 'Phase 3: Backend Development', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId2_6 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_6, 'text', 80, 45, 800, 75, 0, 0, '{"text":"Weeks 7-9: Backend & Databases","fontSize":48,"fontWeight":"bold","color":"#059669"}', NOW(3), NOW(3)),
(@slideId2_6, 'image', 530, 135, 390, 355, 1, 0, '{"imageUrl":"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=780&h=710&fit=crop","alt":"Server"}', NOW(3), NOW(3)),
(@slideId2_6, 'text', 80, 145, 430, 335, 2, 0, '{"text":"🖥️ Week 7-8: Node.js & Express\\n• REST API Design\\n• Middleware & Routing\\n• Authentication (JWT)\\n• File Uploads\\n\\n💾 Week 9: Databases\\n• SQL (PostgreSQL/MySQL)\\n• NoSQL (MongoDB)\\n• Prisma ORM\\n• Query Optimization","fontSize":21,"color":"#1f2937","lineHeight":1.8}', NOW(3), NOW(3));

-- Template 2, Slide 7: Phase 4: Full-Stack Integration
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 7, 'Phase 4: Full-Stack Integration', '{"background":"#f0fdf4","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId2_7 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_7, 'text', 80, 45, 800, 75, 0, 0, '{"text":"Weeks 10-12: Full-Stack & Deploy","fontSize":48,"fontWeight":"bold","color":"#059669"}', NOW(3), NOW(3)),
(@slideId2_7, 'text', 100, 145, 380, 205, 1, 0, '{"text":"🧪 Week 10: Testing\\n• Unit Tests (Jest)\\n• Integration Tests\\n• E2E Testing (Cypress)\\n• Code Quality\\n• CI/CD Basics","fontSize":21,"color":"#1f2937","lineHeight":1.75}', NOW(3), NOW(3)),
(@slideId2_7, 'text', 520, 145, 380, 205, 2, 0, '{"text":"🚀 Week 11-12: Deployment\\n• Docker Containers\\n• Cloud (AWS/Vercel)\\n• Performance Tuning\\n• Security Practices\\n• Monitoring","fontSize":21,"color":"#1f2937","lineHeight":1.75}', NOW(3), NOW(3)),
(@slideId2_7, 'shape', 80, 375, 800, 125, 3, 0, '{"shape":"rectangle","fill":"#059669","opacity":1}', NOW(3), NOW(3)),
(@slideId2_7, 'text', 110, 400, 740, 75, 4, 0, '{"text":"🚀 Capstone: Social Media Platform\\nFull-stack app with auth, posts, comments & deployment","fontSize":27,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.5}', NOW(3), NOW(3));

-- Template 2, Slide 8: Expert Instructors
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 8, 'Expert Instructors', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId2_8 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_8, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Your Expert Instructors","fontSize":52,"fontWeight":"bold","color":"#059669"}', NOW(3), NOW(3)),
(@slideId2_8, 'image', 130, 165, 155, 155, 1, 0, '{"imageUrl":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=310&h=310&fit=crop","alt":"Instructor"}', NOW(3), NOW(3)),
(@slideId2_8, 'text', 130, 335, 155, 95, 2, 0, '{"text":"Dr. Alex Chen\\nLead Instructor\\n10y experience","fontSize":17,"color":"#374151","textAlign":"center","lineHeight":1.55}', NOW(3), NOW(3)),
(@slideId2_8, 'image', 315, 165, 155, 155, 3, 0, '{"imageUrl":"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=310&h=310&fit=crop","alt":"Instructor"}', NOW(3), NOW(3)),
(@slideId2_8, 'text', 315, 335, 155, 95, 4, 0, '{"text":"Maria Rodriguez\\nReact Specialist\\n8y experience","fontSize":17,"color":"#374151","textAlign":"center","lineHeight":1.55}', NOW(3), NOW(3)),
(@slideId2_8, 'image', 500, 165, 155, 155, 5, 0, '{"imageUrl":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=310&h=310&fit=crop","alt":"Instructor"}', NOW(3), NOW(3)),
(@slideId2_8, 'text', 500, 335, 155, 95, 6, 0, '{"text":"James Wilson\\nBackend Expert\\n12y experience","fontSize":17,"color":"#374151","textAlign":"center","lineHeight":1.55}', NOW(3), NOW(3)),
(@slideId2_8, 'image', 685, 165, 155, 155, 7, 0, '{"imageUrl":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=310&h=310&fit=crop","alt":"Instructor"}', NOW(3), NOW(3)),
(@slideId2_8, 'text', 685, 335, 155, 95, 8, 0, '{"text":"Lisa Park\\nDevOps Mentor\\n9y experience","fontSize":17,"color":"#374151","textAlign":"center","lineHeight":1.55}', NOW(3), NOW(3));

-- Template 2, Slide 9: Career Outcomes
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 9, 'Career Outcomes', '{"background":"#f0fdf4","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId2_9 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_9, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Career Success Stories","fontSize":52,"fontWeight":"bold","color":"#059669"}', NOW(3), NOW(3)),
(@slideId2_9, 'shape', 90, 165, 235, 175, 1, 0, '{"shape":"rectangle","fill":"#059669","opacity":1}', NOW(3), NOW(3)),
(@slideId2_9, 'text', 110, 210, 195, 95, 2, 0, '{"text":"94%\\nJob Placement","fontSize":38,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.55}', NOW(3), NOW(3)),
(@slideId2_9, 'shape', 362, 165, 235, 175, 3, 0, '{"shape":"rectangle","fill":"#10b981","opacity":1}', NOW(3), NOW(3)),
(@slideId2_9, 'text', 382, 210, 195, 95, 4, 0, '{"text":"$75K\\nAvg Salary","fontSize":38,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.55}', NOW(3), NOW(3)),
(@slideId2_9, 'shape', 634, 165, 235, 175, 5, 0, '{"shape":"rectangle","fill":"#34d399","opacity":1}', NOW(3), NOW(3)),
(@slideId2_9, 'text', 654, 210, 195, 95, 6, 0, '{"text":"500+\\nGraduates","fontSize":38,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.55}', NOW(3), NOW(3)),
(@slideId2_9, 'text', 80, 370, 800, 125, 7, 0, '{"text":"🏆 Certificate + Career Services Included\\nLinkedIn Optimization • Resume Review • Interview Prep\\n Alumni Network Access","fontSize":23,"color":"#065f46","textAlign":"center","lineHeight":1.85,"fontWeight":"600"}', NOW(3), NOW(3));

-- Template 2, Slide 10: Enroll Today
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId2, 10, 'Enroll Today', '{"background":"#059669","backgroundImage":"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop"}', NOW(3), NOW(3));
SET @slideId2_10 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId2_10, 'shape', 0, 0, 960, 540, 0, 0, '{"shape":"rectangle","fill":"#047857","opacity":0.91}', NOW(3), NOW(3)),
(@slideId2_10, 'text', 80, 95, 800, 105, 1, 0, '{"text":"Start Your Tech Career Today","fontSize":66,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId2_10, 'text', 180, 235, 600, 165, 2, 0, '{"text":"$2,499 • 12 Weeks • Live Online\\n\\nNext Cohort Starts: January 15th, 2024","fontSize":33,"color":"#d1fae5","textAlign":"center","lineHeight":1.8}', NOW(3), NOW(3)),
(@slideId2_10, 'shape', 330, 420, 300, 68, 3, 0, '{"shape":"rectangle","fill":"#ffffff","opacity":1}', NOW(3), NOW(3)),
(@slideId2_10, 'text', 355, 438, 250, 40, 4, 0, '{"text":"APPLY NOW →","fontSize":28,"color":"#059669","textAlign":"center","fontWeight":"bold"}', NOW(3), NOW(3));

-- ============================================================
-- Insert Template 3: Marketing Strategy 2024
-- ============================================================

INSERT INTO `Template` (`name`, `category`, `thumbnail`, `data`) VALUES
('マーケティング戦略 2024', 'マーケティング', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', 
 '{"{"theme":{"{"colors":["{"#dc2626","#ffffff","#fef2f2"]}},"slideCount":10}');

SET @templateId3 = LAST_INSERT_ID();

-- Create sample presentation for template 3
INSERT INTO `Presentation` (`userId`, `title`, `templateId`, `createdAt`, `updatedAt`) VALUES
(@adminUserId, 'マーケティング戦略 2024 - サンプル', @templateId3, NOW(3), NOW(3));

SET @presentationId3 = LAST_INSERT_ID();

-- Template 3, Slide 1: Campaign Cover
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 1, 'Campaign Cover', '{"background":"#dc2626","backgroundImage":"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop"}', NOW(3), NOW(3));
SET @slideId3_1 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_1, 'shape', 0, 0, 960, 540, 0, 0, '{"shape":"rectangle","fill":"#b91c1c","opacity":0.87}', NOW(3), NOW(3)),
(@slideId3_1, 'text', 80, 135, 800, 125, 1, 0, '{"text":"Q1 2024 Marketing Strategy","fontSize":74,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId3_1, 'text', 80, 285, 800, 85, 2, 0, '{"text":"Digital Transformation Campaign","fontSize":40,"color":"#fecaca","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId3_1, 'text', 310, 410, 340, 55, 3, 0, '{"text":"Marketing Team • Q1 2024","fontSize":24,"color":"#fee2e2","textAlign":"center","fontWeight":"600"}', NOW(3), NOW(3));

-- Template 3, Slide 2: Executive Summary
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 2, 'Executive Summary', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId3_2 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_2, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Campaign Overview","fontSize":52,"fontWeight":"bold","color":"#dc2626"}', NOW(3), NOW(3)),
(@slideId3_2, 'image', 520, 150, 400, 340, 1, 0, '{"imageUrl":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=680&fit=crop","alt":"Analytics"}', NOW(3), NOW(3)),
(@slideId3_2, 'text', 80, 155, 420, 330, 2, 0, '{"text":"🎯 Goal: 50% Brand Awareness Increase\\n\\n💰 Budget: $2.5 Million\\n\\n📅 Duration: 12 Weeks\\n\\n🌍 Markets: US, EU, APAC\\n\\n📊 KPIs: Reach, Engagement, Conversions","fontSize":24,"color":"#1f2937","lineHeight":2}', NOW(3), NOW(3));

-- Template 3, Slide 3: Target Audience
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 3, 'Target Audience', '{"background":"#fef2f2","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId3_3 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_3, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Target Audience Insights","fontSize":52,"fontWeight":"bold","color":"#dc2626"}', NOW(3), NOW(3)),
(@slideId3_3, 'shape', 85, 165, 255, 295, 1, 0, '{"shape":"rectangle","fill":"#dc2626","opacity":1}', NOW(3), NOW(3)),
(@slideId3_3, 'text', 105, 210, 215, 215, 2, 0, '{"text":"👥 Primary\\nAge 25-45\\nUrban Prof.\\n$75K+ income\\nTech-savvy","fontSize":25,"color":"#ffffff","textAlign":"center","lineHeight":1.9,"fontWeight":"600"}', NOW(3), NOW(3)),
(@slideId3_3, 'shape', 355, 165, 255, 295, 3, 0, '{"shape":"rectangle","fill":"#ef4444","opacity":1}', NOW(3), NOW(3)),
(@slideId3_3, 'text', 375, 210, 215, 215, 4, 0, '{"text":"🎓 Secondary\\nAge 18-34\\nStudents\\nDigital natives\\nPrice sensitive","fontSize":25,"color":"#ffffff","textAlign":"center","lineHeight":1.9,"fontWeight":"600"}', NOW(3), NOW(3)),
(@slideId3_3, 'shape', 625, 165, 255, 295, 5, 0, '{"shape":"rectangle","fill":"#f87171","opacity":1}', NOW(3), NOW(3)),
(@slideId3_3, 'text', 645, 210, 215, 215, 6, 0, '{"text":"💼 Tertiary\\nAge 45-65\\nExecutives\\nDecision makers\\nQuality focused","fontSize":25,"color":"#ffffff","textAlign":"center","lineHeight":1.9,"fontWeight":"600"}', NOW(3), NOW(3));

-- Template 3, Slide 4: Strategic Objectives
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 4, 'Strategic Objectives', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId3_4 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_4, 'text', 80, 42, 800, 78, 0, 0, '{"text":"Campaign Goals","fontSize":52,"fontWeight":"bold","color":"#dc2626"}', NOW(3), NOW(3)),
(@slideId3_4, 'text', 100, 150, 380, 175, 1, 0, '{"text":"📈 Awareness Goals\\n• 10M social impressions\\n• 50% brand recall increase\\n• Top 3 in category\\n• 500+ media mentions","fontSize":22,"color":"#1f2937","lineHeight":1.8}', NOW(3), NOW(3)),
(@slideId3_4, 'text', 520, 150, 380, 175, 2, 0, '{"text":"💡 Engagement Goals\\n• 500K website visits\\n• 25% engagement rate\\n• 100K+ video views\\n• 50K email subscribers","fontSize":22,"color":"#1f2937","lineHeight":1.8}', NOW(3), NOW(3)),
(@slideId3_4, 'text', 100, 350, 380, 140, 3, 0, '{"text":"🎯 Conversion Goals\\n• 20K qualified leads\\n• 2,500 new customers\\n• $5M revenue impact","fontSize":22,"color":"#1f2937","lineHeight":1.8}', NOW(3), NOW(3)),
(@slideId3_4, 'text', 520, 350, 380, 140, 4, 0, '{"text":"💰 ROI Targets\\n• 300% ROI\\n• $2 CAC\\n• 20% conversion rate","fontSize":22,"color":"#1f2937","lineHeight":1.8}', NOW(3), NOW(3));

-- Template 3, Slide 5: Channel Strategy
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 5, 'Channel Strategy', '{"background":"#fef2f2","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId3_5 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_5, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Multi-Channel Approach","fontSize":52,"fontWeight":"bold","color":"#dc2626"}', NOW(3), NOW(3)),
(@slideId3_5, 'image', 520, 150, 400, 340, 1, 0, '{"imageUrl":"https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=680&fit=crop","alt":"Social Media"}', NOW(3), NOW(3)),
(@slideId3_5, 'text', 80, 155, 425, 330, 2, 0, '{"text":"📱 Social Media (35%)\\n   Instagram, TikTok, LinkedIn\\n\\n🔍 Search/SEO (25%)\\n   Google Ads, Organic\\n\\n📧 Email Marketing (20%)\\n   Newsletter, Automation\\n\\n🎥 Video Content (15%)\\n   YouTube, Shorts\\n\\n📰 PR & Influencer (5%)","fontSize":21,"color":"#1f2937","lineHeight":1.75}', NOW(3), NOW(3));

-- Template 3, Slide 6: Content Marketing
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 6, 'Content Marketing', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId3_6 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_6, 'text', 80, 42, 800, 78, 0, 0, '{"text":"Content Marketing Mix","fontSize":52,"fontWeight":"bold","color":"#dc2626"}', NOW(3), NOW(3)),
(@slideId3_6, 'shape', 90, 155, 185, 155, 1, 0, '{"shape":"rectangle","fill":"#fef2f2","opacity":1}', NOW(3), NOW(3)),
(@slideId3_6, 'text', 105, 180, 155, 105, 2, 0, '{"text":"📝 Blog\\n48 posts\\n2x/week","fontSize":23,"color":"#991b1b","textAlign":"center","lineHeight":1.7,"fontWeight":"600"}', NOW(3), NOW(3)),
(@slideId3_6, 'shape', 295, 155, 185, 155, 3, 0, '{"shape":"rectangle","fill":"#fef2f2","opacity":1}', NOW(3), NOW(3)),
(@slideId3_6, 'text', 310, 180, 155, 105, 4, 0, '{"text":"🎬 Video\\n24 videos\\n1x/week","fontSize":23,"color":"#991b1b","textAlign":"center","lineHeight":1.7,"fontWeight":"600"}', NOW(3), NOW(3)),
(@slideId3_6, 'shape', 500, 155, 185, 155, 5, 0, '{"shape":"rectangle","fill":"#fef2f2","opacity":1}', NOW(3), NOW(3)),
(@slideId3_6, 'text', 515, 180, 155, 105, 6, 0, '{"text":"📸 Social\\n120 posts\\n10x/week","fontSize":23,"color":"#991b1b","textAlign":"center","lineHeight":1.7,"fontWeight":"600"}', NOW(3), NOW(3)),
(@slideId3_6, 'shape', 705, 155, 185, 155, 7, 0, '{"shape":"rectangle","fill":"#fef2f2","opacity":1}', NOW(3), NOW(3)),
(@slideId3_6, 'text', 720, 180, 155, 105, 8, 0, '{"text":"📧 Email\\n36 campaigns\\n3x/week","fontSize":23,"color":"#991b1b","textAlign":"center","lineHeight":1.7,"fontWeight":"600"}', NOW(3), NOW(3)),
(@slideId3_6, 'text', 80, 345, 800, 150, 9, 0, '{"text":"🎯 Content Themes:\\nCustomer Success Stories • Product Tutorials • Industry Trends\\nBehind-the-Scenes • Expert Interviews • UGC","fontSize":23,"color":"#374151","textAlign":"center","lineHeight":1.9}', NOW(3), NOW(3));

-- Template 3, Slide 7: Campaign Timeline
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 7, 'Campaign Timeline', '{"background":"#fef2f2","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId3_7 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_7, 'text', 80, 42, 800, 78, 0, 0, '{"text":"12-Week Roadmap","fontSize":52,"fontWeight":"bold","color":"#dc2626"}', NOW(3), NOW(3)),
(@slideId3_7, 'shape', 90, 155, 185, 115, 1, 0, '{"shape":"rectangle","fill":"#dc2626","opacity":1}', NOW(3), NOW(3)),
(@slideId3_7, 'text', 105, 183, 155, 65, 2, 0, '{"text":"Week 1-3\\nLaunch","fontSize":25,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.6}', NOW(3), NOW(3)),
(@slideId3_7, 'shape', 295, 155, 185, 115, 3, 0, '{"shape":"rectangle","fill":"#ef4444","opacity":1}', NOW(3), NOW(3)),
(@slideId3_7, 'text', 310, 183, 155, 65, 4, 0, '{"text":"Week 4-6\\nEngage","fontSize":25,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.6}', NOW(3), NOW(3)),
(@slideId3_7, 'shape', 500, 155, 185, 115, 5, 0, '{"shape":"rectangle","fill":"#f87171","opacity":1}', NOW(3), NOW(3)),
(@slideId3_7, 'text', 515, 183, 155, 65, 6, 0, '{"text":"Week 7-9\\nConvert","fontSize":25,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.6}', NOW(3), NOW(3)),
(@slideId3_7, 'shape', 705, 155, 185, 115, 7, 0, '{"shape":"rectangle","fill":"#fca5a5","opacity":1}', NOW(3), NOW(3)),
(@slideId3_7, 'text', 720, 183, 155, 65, 8, 0, '{"text":"Week 10-12\\nOptimize","fontSize":25,"color":"#ffffff","textAlign":"center","fontWeight":"bold","lineHeight":1.6}', NOW(3), NOW(3)),
(@slideId3_7, 'text', 80, 305, 800, 175, 9, 0, '{"text":"📋 Key Milestones:\\n✓ Launch event & PR push\\n✓ Influencer partnerships activated\\n✓ Lead generation campaigns\\n✓ Performance optimization & reporting","fontSize":23,"color":"#374151","lineHeight":2}', NOW(3), NOW(3));

-- Template 3, Slide 8: Budget Allocation
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 8, 'Budget Allocation', '{"background":"#ffffff","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId3_8 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_8, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Investment Breakdown","fontSize":52,"fontWeight":"bold","color":"#dc2626"}', NOW(3), NOW(3)),
(@slideId3_8, 'shape', 85, 165, 375, 95, 1, 0, '{"shape":"rectangle","fill":"#dc2626","opacity":1}', NOW(3), NOW(3)),
(@slideId3_8, 'text', 105, 190, 335, 50, 2, 0, '{"text":"Paid Media: $1,250K (50%)","fontSize":29,"color":"#ffffff","fontWeight":"bold"}', NOW(3), NOW(3)),
(@slideId3_8, 'shape', 500, 165, 375, 95, 3, 0, '{"shape":"rectangle","fill":"#ef4444","opacity":1}', NOW(3), NOW(3)),
(@slideId3_8, 'text', 520, 190, 335, 50, 4, 0, '{"text":"Content Creation: $625K (25%)","fontSize":29,"color":"#ffffff","fontWeight":"bold"}', NOW(3), NOW(3)),
(@slideId3_8, 'shape', 85, 280, 375, 95, 5, 0, '{"shape":"rectangle","fill":"#f87171","opacity":1}', NOW(3), NOW(3)),
(@slideId3_8, 'text', 105, 305, 335, 50, 6, 0, '{"text":"Tools & Tech: $375K (15%)","fontSize":29,"color":"#ffffff","fontWeight":"bold"}', NOW(3), NOW(3)),
(@slideId3_8, 'shape', 500, 280, 375, 95, 7, 0, '{"shape":"rectangle","fill":"#fca5a5","opacity":1}', NOW(3), NOW(3)),
(@slideId3_8, 'text', 520, 305, 335, 50, 8, 0, '{"text":"Agency & Talent: $250K (10%)","fontSize":29,"color":"#ffffff","fontWeight":"bold"}', NOW(3), NOW(3)),
(@slideId3_8, 'text', 80, 415, 800, 70, 9, 0, '{"text":"💡 Total: $2.5M • Expected ROI: 300% ($7.5M)","fontSize":25,"color":"#991b1b","textAlign":"center","fontWeight":"bold"}', NOW(3), NOW(3));

-- Template 3, Slide 9: Core Team
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 9, 'Core Team', '{"background":"#fef2f2","backgroundImage":""}', NOW(3), NOW(3));
SET @slideId3_9 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_9, 'text', 80, 50, 800, 80, 0, 0, '{"text":"Marketing Team","fontSize":52,"fontWeight":"bold","color":"#dc2626"}', NOW(3), NOW(3)),
(@slideId3_9, 'image', 125, 165, 135, 135, 1, 0, '{"imageUrl":"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=270&h=270&fit=crop","alt":"Team"}', NOW(3), NOW(3)),
(@slideId3_9, 'text', 125, 315, 135, 85, 2, 0, '{"text":"Sarah Kim\\nCampaign Lead\\nStrategy","fontSize":17,"color":"#374151","textAlign":"center","lineHeight":1.5}', NOW(3), NOW(3)),
(@slideId3_9, 'image', 285, 165, 135, 135, 3, 0, '{"imageUrl":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=270&h=270&fit=crop","alt":"Team"}', NOW(3), NOW(3)),
(@slideId3_9, 'text', 285, 315, 135, 85, 4, 0, '{"text":"Tom Johnson\\nContent Dir.\\nCreative","fontSize":17,"color":"#374151","textAlign":"center","lineHeight":1.5}', NOW(3), NOW(3)),
(@slideId3_9, 'image', 445, 165, 135, 135, 5, 0, '{"imageUrl":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=270&h=270&fit=crop","alt":"Team"}', NOW(3), NOW(3)),
(@slideId3_9, 'text', 445, 315, 135, 85, 6, 0, '{"text":"Emma Lee\\nSocial Media\\nEngagement","fontSize":17,"color":"#374151","textAlign":"center","lineHeight":1.5}', NOW(3), NOW(3)),
(@slideId3_9, 'image', 605, 165, 135, 135, 7, 0, '{"imageUrl":"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=270&h=270&fit=crop","alt":"Team"}', NOW(3), NOW(3)),
(@slideId3_9, 'text', 605, 315, 135, 85, 8, 0, '{"text":"David Chen\\nData Analyst\\nMetrics","fontSize":17,"color":"#374151","textAlign":"center","lineHeight":1.5}', NOW(3), NOW(3)),
(@slideId3_9, 'image', 765, 165, 135, 135, 9, 0, '{"imageUrl":"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=270&h=270&fit=crop","alt":"Team"}', NOW(3), NOW(3)),
(@slideId3_9, 'text', 765, 315, 135, 85, 10, 0, '{"text":"Nina Patel\\nPR Manager\\nMedia","fontSize":17,"color":"#374151","textAlign":"center","lineHeight":1.5}', NOW(3), NOW(3));

-- Template 3, Slide 10: Success Metrics
INSERT INTO `Slide` (`presentationId`, `orderIndex`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(@presentationId3, 10, 'Success Metrics', '{"background":"#dc2626","backgroundImage":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop"}', NOW(3), NOW(3));
SET @slideId3_10 = LAST_INSERT_ID();
INSERT INTO `Element` (`slideId`, `type`, `x`, `y`, `width`, `height`, `zIndex`, `rotation`, `data`, `createdAt`, `updatedAt`) VALUES
(@slideId3_10, 'shape', 0, 0, 960, 540, 0, 0, '{"shape":"rectangle","fill":"#b91c1c","opacity":0.91}', NOW(3), NOW(3)),
(@slideId3_10, 'text', 80, 85, 800, 105, 1, 0, '{"text":"How We Measure Success","fontSize":66,"fontWeight":"bold","color":"#ffffff","textAlign":"center"}', NOW(3), NOW(3)),
(@slideId3_10, 'text', 100, 225, 760, 225, 2, 0, '{"text":"📊 Weekly Reports & Dashboards\\n📈 A/B Testing & Optimization\\n🎯 Real-time Performance Tracking\\n💡 Monthly Strategy Reviews\\n🏆 Final Campaign ROI Analysis","fontSize":31,"color":"#fecaca","lineHeight":2,"fontWeight":"600","textAlign":"center"}', NOW(3), NOW(3));

-- ============================================================
-- SECTION 5: CONVERT ENGLISH SLIDE TITLES TO JAPANESE
-- ============================================================

-- Course/Education related titles
UPDATE `Slide` SET `title` = 'コース紹介' WHERE `title` LIKE '%Course Introduction%';
UPDATE `Slide` SET `title` = '学習内容' WHERE `title` LIKE '%What You Will Learn%' OR `title` LIKE '%What You%ll Learn%';
UPDATE `Slide` SET `title` = '前提条件' WHERE `title` LIKE '%Prerequisites%' OR `title` LIKE '%Prerequisite%' OR `title` = 'Prerequisites';
UPDATE `Slide` SET `title` = 'フェーズ 1: フロントエンド基礎' WHERE `title` LIKE '%Phase 1%Frontend%';
UPDATE `Slide` SET `title` = 'フェーズ 2: モダンフロントエンド' WHERE `title` LIKE '%Phase 2%Frontend%' OR `title` LIKE '%Phase 2%Modern%';
UPDATE `Slide` SET `title` = 'フェーズ 3: バックエンド開発' WHERE `title` LIKE '%Phase 3%Backend%';
UPDATE `Slide` SET `title` = 'フェーズ 4: フルスタック統合' WHERE `title` LIKE '%Phase 4%Full%Stack%';
UPDATE `Slide` SET `title` = '専門講師陣' WHERE `title` = 'Expert Instructors';
UPDATE `Slide` SET `title` = 'キャリア成果' WHERE `title` = 'Career Outcomes';
UPDATE `Slide` SET `title` = '今すぐ登録' WHERE `title` = 'Enroll Today';

-- Marketing/Campaign related titles
UPDATE `Slide` SET `title` = 'キャンペーン表紙' WHERE `title` = 'Campaign Cover';
UPDATE `Slide` SET `title` = 'エグゼクティブサマリー' WHERE `title` = 'Executive Summary';
UPDATE `Slide` SET `title` = 'ターゲットオーディエンス' WHERE `title` = 'Target Audience';
UPDATE `Slide` SET `title` = '戦略目標' WHERE `title` = 'Strategic Objectives';
UPDATE `Slide` SET `title` = 'チャネル戦略' WHERE `title` = 'Channel Strategy';
UPDATE `Slide` SET `title` = 'コンテンツマーケティング' WHERE `title` = 'Content Marketing';
UPDATE `Slide` SET `title` = 'キャンペーンタイムライン' WHERE `title` = 'Campaign Timeline';
UPDATE `Slide` SET `title` = '予算配分' WHERE `title` = 'Budget Allocation';
UPDATE `Slide` SET `title` = 'コアチーム' WHERE `title` = 'Core Team';
UPDATE `Slide` SET `title` = '成功指標' WHERE `title` = 'Success Metrics';

-- Common generic slide titles
UPDATE `Slide` SET `title` = '表紙' WHERE `title` = 'Cover Slide' OR `title` = 'Cover';
UPDATE `Slide` SET `title` = '問題点' WHERE `title` = 'The Problem' OR `title` = 'Problem';
UPDATE `Slide` SET `title` = '解決策' WHERE `title` = 'Our Solution' OR `title` = 'Solution';
UPDATE `Slide` SET `title` = '製品デモ' WHERE `title` = 'Product Demo' OR `title` = 'Demo';
UPDATE `Slide` SET `title` = '主要機能' WHERE `title` = 'Key Features' OR `title` = 'Features';
UPDATE `Slide` SET `title` = '市場機会' WHERE `title` = 'Market Opportunity' OR `title` = 'Market';
UPDATE `Slide` SET `title` = 'ビジネスモデル' WHERE `title` = 'Business Model';
UPDATE `Slide` SET `title` = '成長と実績' WHERE `title` LIKE '%Traction%Growth%' OR `title` = 'Growth';
UPDATE `Slide` SET `title` = 'チーム紹介' WHERE `title` = 'The Team' OR `title` = 'Team';
UPDATE `Slide` SET `title` = '投資依頼' WHERE `title` = 'Investment Ask' OR `title` = 'Investment';
UPDATE `Slide` SET `title` = 'まとめ' WHERE `title` = 'Conclusion' OR `title` = 'Summary';
UPDATE `Slide` SET `title` = 'Q&A' WHERE `title` = 'Questions' OR `title` = 'Q&A';

-- Generic numbered slides
UPDATE `Slide` SET `title` = CONCAT('スライド ', SUBSTRING(`title`, 7)) 
WHERE `title` REGEXP '^Slide [0-9]+$';

UPDATE `Slide` SET `title` = CONCAT('新しいスライド ', SUBSTRING(`title`, 11)) 
WHERE `title` REGEXP '^New Slide [0-9]*$';

UPDATE `Slide` SET `title` = '新しいスライド' 
WHERE `title` = 'New Slide';

-- Introduction related
UPDATE `Slide` SET `title` = 'はじめに' WHERE `title` = 'Introduction' OR `title` = 'Intro';
UPDATE `Slide` SET `title` = '概要' WHERE `title` = 'Overview';
UPDATE `Slide` SET `title` = '目次' WHERE `title` = 'Table of Contents' OR `title` = 'Contents' OR `title` = 'Agenda';
UPDATE `Slide` SET `title` = '目標' WHERE `title` = 'Goals' OR `title` = 'Objectives';
UPDATE `Slide` SET `title` = '背景' WHERE `title` = 'Background';

-- Project related
UPDATE `Slide` SET `title` = 'プロジェクト概要' WHERE `title` LIKE '%Project%Overview%';
UPDATE `Slide` SET `title` = 'プロジェクト計画' WHERE `title` LIKE '%Project%Plan%';
UPDATE `Slide` SET `title` = 'プロジェクトタイムライン' WHERE `title` LIKE '%Project%Timeline%' OR `title` = 'Timeline';
UPDATE `Slide` SET `title` = 'マイルストーン' WHERE `title` = 'Milestones' OR `title` = 'Milestone';

-- Results and metrics
UPDATE `Slide` SET `title` = '結果' WHERE `title` = 'Results';
UPDATE `Slide` SET `title` = 'メトリクス' WHERE `title` = 'Metrics';
UPDATE `Slide` SET `title` = '分析' WHERE `title` = 'Analysis';
UPDATE `Slide` SET `title` = 'データ' WHERE `title` = 'Data';

-- Call to action
UPDATE `Slide` SET `title` = '次のステップ' WHERE `title` = 'Next Steps';
UPDATE `Slide` SET `title` = 'アクションアイテム' WHERE `title` = 'Action Items';
UPDATE `Slide` SET `title` = 'お問い合わせ' WHERE `title` = 'Contact' OR `title` = 'Contact Us';
UPDATE `Slide` SET `title` = 'ありがとうございました' WHERE `title` = 'Thank You' OR `title` = 'Thanks';

-- ============================================================
-- SECTION 6: VERIFICATION
-- ============================================================

SELECT 'Database setup completed successfully!' as Status;
SELECT COUNT(*) as TotalUsers FROM `User`;
SELECT COUNT(*) as TotalPresentations FROM `Presentation`;
SELECT COUNT(*) as TotalSlides FROM `Slide`;
SELECT COUNT(*) as TotalElements FROM `Element`;
SELECT COUNT(*) as TotalAssets FROM `Asset`;

-- ============================================================
-- RESET SESSION VARIABLES
-- ============================================================

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- ============================================================
-- END OF SCRIPT
-- ============================================================
