/*
  Warnings:

  - You are about to drop the column `location` on the `Factory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[factoryCode]` on the table `Factory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `factoryCode` to the `Factory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `factoryLocation` to the `Factory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industryType` to the `Factory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Factory" DROP COLUMN "location",
ADD COLUMN     "factoryCode" TEXT NOT NULL,
ADD COLUMN     "factoryLocation" TEXT NOT NULL,
ADD COLUMN     "industryType" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SapSystem" (
    "sapSystemId" SERIAL NOT NULL,
    "sapInstanceName" TEXT NOT NULL,
    "integrationType" TEXT NOT NULL,
    "factoryId" INTEGER NOT NULL,

    CONSTRAINT "SapSystem_pkey" PRIMARY KEY ("sapSystemId")
);

-- CreateTable
CREATE TABLE "Bay" (
    "bayId" SERIAL NOT NULL,
    "bayName" TEXT NOT NULL,
    "maxMachineCapacity" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "factoryId" INTEGER NOT NULL,

    CONSTRAINT "Bay_pkey" PRIMARY KEY ("bayId")
);

-- CreateTable
CREATE TABLE "MachineType" (
    "machineTypeId" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,
    "capabilities" JSONB NOT NULL,
    "constraints" JSONB NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "bayId" INTEGER NOT NULL,

    CONSTRAINT "MachineType_pkey" PRIMARY KEY ("machineTypeId")
);

-- CreateTable
CREATE TABLE "Machine" (
    "machineId" SERIAL NOT NULL,
    "modelNumber" TEXT NOT NULL,
    "installationDate" TIMESTAMP(3) NOT NULL,
    "healthState" TEXT NOT NULL,
    "usageHours" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "factoryId" INTEGER NOT NULL,
    "machineTypeId" INTEGER NOT NULL,
    "bayId" INTEGER NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("machineId")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "inventoryId" SERIAL NOT NULL,
    "materialName" TEXT NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "sapMaterialId" TEXT NOT NULL,
    "lastSyncTime" TIMESTAMP(3) NOT NULL,
    "factoryId" INTEGER NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("inventoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SapSystem_factoryId_key" ON "SapSystem"("factoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_factoryCode_key" ON "Factory"("factoryCode");

-- AddForeignKey
ALTER TABLE "SapSystem" ADD CONSTRAINT "SapSystem_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bay" ADD CONSTRAINT "Bay_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineType" ADD CONSTRAINT "MachineType_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineType" ADD CONSTRAINT "MachineType_bayId_fkey" FOREIGN KEY ("bayId") REFERENCES "Bay"("bayId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_machineTypeId_fkey" FOREIGN KEY ("machineTypeId") REFERENCES "MachineType"("machineTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_bayId_fkey" FOREIGN KEY ("bayId") REFERENCES "Bay"("bayId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
