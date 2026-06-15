-- CreateEnum
CREATE TYPE IF NOT EXISTS "CategoryType" AS ENUM ('Asosiy_taomlar', 'Salatlar', 'Ichimliklar', 'Desertlar', 'Lavashlar', 'Sho_rvalar', 'Bolalar_menyusi', 'Qoshimchalar');

-- CreateEnum
CREATE TYPE IF NOT EXISTS "PaymentMethod" AS ENUM ('Cash', 'Card');

-- AlterTable Order
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'Cash';

-- AlterTable Product
ALTER TABLE "Product" DROP COLUMN IF EXISTS "model";

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable Category
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category" ("name");

-- categoryId NULL bilan qo'shamiz
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;

-- Default category
INSERT INTO
    "Category" ("id", "name", "type")
VALUES (
        'default-category-id',
        'Asosiy taomlar',
        'Asosiy_taomlar'
    )
ON CONFLICT ("name") DO NOTHING;

-- Mavjud productlarga default category
UPDATE "Product"
SET
    "categoryId" = 'default-category-id'
WHERE
    "categoryId" IS NULL;

-- NOT NULL qilamiz
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product"
ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;