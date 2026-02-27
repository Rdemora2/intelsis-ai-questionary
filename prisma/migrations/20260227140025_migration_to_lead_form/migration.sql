-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "company_size" TEXT NOT NULL,
    "motivator" TEXT NOT NULL,
    "sap_modules" TEXT NOT NULL,
    "challenges" TEXT NOT NULL,
    "demo_interest" BOOLEAN NOT NULL DEFAULT false,
    "tech_help" BOOLEAN NOT NULL DEFAULT false,
    "consent" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);
