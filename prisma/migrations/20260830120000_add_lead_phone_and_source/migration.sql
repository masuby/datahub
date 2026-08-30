-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "source" TEXT;

-- CreateIndex
CREATE INDEX "leads_source_idx" ON "leads"("source");
