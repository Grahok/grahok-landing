/*
  Warnings:

  - A unique constraint covering the columns `[slug,isActive]` on the table `LandingPage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LandingPage_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "LandingPage_slug_isActive_key" ON "LandingPage"("slug", "isActive");
