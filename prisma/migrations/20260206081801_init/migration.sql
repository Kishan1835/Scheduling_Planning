-- CreateTable
CREATE TABLE "Factory" (
    "factoryId" SERIAL NOT NULL,
    "factoryName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("factoryId")
);
