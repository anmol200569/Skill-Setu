-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN "skillId" TEXT;

-- CreateIndex
CREATE INDEX "Quiz_skillId_idx" ON "Quiz"("skillId");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;
