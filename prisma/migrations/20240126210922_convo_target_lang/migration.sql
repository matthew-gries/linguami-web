/*
  Warnings:

  - Added the required column `targetLanguage` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "targetLanguage" TEXT NOT NULL;
