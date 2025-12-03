-- AlterTable
ALTER TABLE `Presentation` ADD COLUMN `templateId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Presentation` ADD CONSTRAINT `Presentation_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `Template`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
