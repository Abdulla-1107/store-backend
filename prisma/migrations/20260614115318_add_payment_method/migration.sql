-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('Asosiy_taomlar', 'Salatlar', 'Ichimliklar', 'Desertlar', 'Lavashlar', 'Sho_rvalar', 'Bolalar_menyusi', 'Qoshimchalar');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Cash', 'Card');

-- AlterTable Order
ALTER TABLE "Order"
ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'Cash';

-- AlterTable Product - model o'chirish va yangi columnlar
ALTER TABLE "Product" DROP COLUMN "model";

ALTER TABLE "Product"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Product"
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable Category
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category" ("name");

-- categoryId ni avval NULL bilan qo'shamiz
ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT;

-- Default category yaratamiz
INSERT INTO
    "Category" ("id", "name", "type")
VALUES (
        'default-category-id',
        'Asosiy taomlar',
        'Asosiy_taomlar'
    )
ON CONFLICT ("name") DO NOTHING;

-- Mavjud productlarga default category beramiz
UPDATE "Product"
SET
    "categoryId" = 'default-category-id'
WHERE
    "categoryId" IS NULL;

-- Endi NOT NULL qilamiz
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product"
ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;