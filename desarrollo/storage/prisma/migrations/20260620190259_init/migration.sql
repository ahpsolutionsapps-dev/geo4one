-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Files" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "FileName" TEXT NOT NULL,
    "OriginalFileName" TEXT NOT NULL,
    "Extension" TEXT NOT NULL,
    "MimeType" TEXT NOT NULL,
    "FileSize" BIGINT NOT NULL,
    "StoragePath" TEXT NOT NULL,
    "Hash" TEXT,
    "IsPublic" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ(6),
    "DeletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Files_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "FileRelations" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "FileId" UUID NOT NULL,
    "EntityType" TEXT NOT NULL,
    "EntityId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileRelations_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "FileCategories" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "Name" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "FileCategories_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "FileCategoryRelations" (
    "FileId" UUID NOT NULL,
    "CategoryId" UUID NOT NULL,

    CONSTRAINT "FileCategoryRelations_pkey" PRIMARY KEY ("FileId","CategoryId")
);

-- CreateTable
CREATE TABLE "FileVersions" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "FileId" UUID NOT NULL,
    "VersionNumber" INTEGER NOT NULL,
    "StoragePath" TEXT NOT NULL,
    "FileSize" BIGINT NOT NULL,
    "CreatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileVersions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "Name" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "FileTags" (
    "FileId" UUID NOT NULL,
    "TagId" UUID NOT NULL,

    CONSTRAINT "FileTags_pkey" PRIMARY KEY ("FileId","TagId")
);

-- CreateTable
CREATE TABLE "ApiKeys" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "Name" TEXT NOT NULL,
    "ApiKey" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastUsedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "SignedUrls" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "FileId" UUID NOT NULL,
    "Token" TEXT NOT NULL,
    "ExpiresAt" TIMESTAMPTZ(6) NOT NULL,
    "CreatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignedUrls_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "Id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ApiKeyId" UUID,
    "Action" TEXT NOT NULL,
    "FileId" UUID,
    "Details" TEXT,
    "IpAddress" INET,
    "CreatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_FileVersions_File_Version" ON "FileVersions"("FileId", "VersionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_Name_key" ON "Tags"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_ApiKey_key" ON "ApiKeys"("ApiKey");

-- CreateIndex
CREATE UNIQUE INDEX "SignedUrls_Token_key" ON "SignedUrls"("Token");

-- AddForeignKey
ALTER TABLE "FileRelations" ADD CONSTRAINT "FK_FileRelations_Files" FOREIGN KEY ("FileId") REFERENCES "Files"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FileCategoryRelations" ADD CONSTRAINT "FK_FileCategoryRelations_Files" FOREIGN KEY ("FileId") REFERENCES "Files"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FileCategoryRelations" ADD CONSTRAINT "FK_FileCategoryRelations_FileCategories" FOREIGN KEY ("CategoryId") REFERENCES "FileCategories"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FileVersions" ADD CONSTRAINT "FK_FileVersions_Files" FOREIGN KEY ("FileId") REFERENCES "Files"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FileTags" ADD CONSTRAINT "FK_FileTags_Files" FOREIGN KEY ("FileId") REFERENCES "Files"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FileTags" ADD CONSTRAINT "FK_FileTags_Tags" FOREIGN KEY ("TagId") REFERENCES "Tags"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SignedUrls" ADD CONSTRAINT "FK_SignedUrls_Files" FOREIGN KEY ("FileId") REFERENCES "Files"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "FK_AuditLogs_ApiKeys" FOREIGN KEY ("ApiKeyId") REFERENCES "ApiKeys"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "FK_AuditLogs_Files" FOREIGN KEY ("FileId") REFERENCES "Files"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;
