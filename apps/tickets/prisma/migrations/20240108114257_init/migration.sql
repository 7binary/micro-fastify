-- CreateTable
CREATE TABLE "ticket" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "price" MONEY NOT NULL,
    "soldAt" TIMESTAMP(3),
    "authorUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);
