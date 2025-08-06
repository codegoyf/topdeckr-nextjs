/*
  Warnings:

  - You are about to drop the column `deckId` on the `card` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `card` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scryfallId]` on the table `card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scryfallId` to the `card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeLine` to the `card` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."card" DROP CONSTRAINT "card_deckId_fkey";

-- AlterTable
ALTER TABLE "public"."card" DROP COLUMN "deckId",
DROP COLUMN "quantity",
ADD COLUMN     "cmc" INTEGER,
ADD COLUMN     "collectorNumber" TEXT,
ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "manaCost" TEXT,
ADD COLUMN     "oracleText" TEXT,
ADD COLUMN     "rarity" TEXT,
ADD COLUMN     "scryfallId" TEXT NOT NULL,
ADD COLUMN     "setCode" TEXT,
ADD COLUMN     "typeLine" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."deck_card" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "deckId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deck_card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deck_card_deckId_cardId_key" ON "public"."deck_card"("deckId", "cardId");

-- CreateIndex
CREATE UNIQUE INDEX "card_scryfallId_key" ON "public"."card"("scryfallId");

-- AddForeignKey
ALTER TABLE "public"."deck_card" ADD CONSTRAINT "deck_card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deck_card" ADD CONSTRAINT "deck_card_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
