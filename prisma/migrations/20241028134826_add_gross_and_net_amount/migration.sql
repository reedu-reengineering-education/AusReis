-- AlterTable
-- Fügen Sie zuerst die neuen Spalten hinzu
ALTER TABLE "Expense" ADD COLUMN "grossAmount" DOUBLE PRECISION;
ALTER TABLE "Expense" ADD COLUMN "netAmount" DOUBLE PRECISION;

-- Kopieren Sie die bestehenden Werte von 'amount' in 'grossAmount'
UPDATE "Expense" SET "grossAmount" = "amount";

-- Berechnen Sie den Nettobetrag (hier wird angenommen, dass alle bestehenden Beträge Bruttobeträge sind und ein Steuersatz von 19% gilt)
UPDATE "Expense" SET "netAmount" = "amount" / 1.19;

-- Jetzt können wir die 'amount' Spalte entfernen
ALTER TABLE "Expense" DROP COLUMN "amount";

-- Setzen Sie die Spalten auf NOT NULL
ALTER TABLE "Expense" ALTER COLUMN "grossAmount" SET NOT NULL;
ALTER TABLE "Expense" ALTER COLUMN "netAmount" SET NOT NULL;