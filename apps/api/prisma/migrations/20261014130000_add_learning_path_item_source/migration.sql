-- AlterTable
ALTER TABLE "LearningPathItem" ADD COLUMN IF NOT EXISTS "source" TEXT DEFAULT 'system';
