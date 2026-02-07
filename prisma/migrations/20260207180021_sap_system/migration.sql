/*
  Warnings:

  - Added the required column `updatedAt` to the `Factory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `healthState` on the `Machine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "HealthState" AS ENUM ('OPERATIONAL', 'MAINTENANCE', 'DOWN', 'RETIRED');

-- AlterTable
ALTER TABLE "Factory" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "healthState",
ADD COLUMN     "healthState" "HealthState" NOT NULL;

-- CreateIndex
CREATE INDEX "Machine_factoryId_idx" ON "Machine"("factoryId");

-- CreateIndex
CREATE INDEX "Machine_bayId_idx" ON "Machine"("bayId");

-- CreateIndex
CREATE INDEX "Machine_machineTypeId_idx" ON "Machine"("machineTypeId");
