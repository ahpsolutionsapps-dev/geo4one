-- CreateTable
CREATE TABLE "Files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "FileName" TEXT NOT NULL,
    "OriginalFileName" TEXT NOT NULL,
    "Extension" TEXT NOT NULL,
    "MimeType" TEXT NOT NULL,
    "FileSize" INTEGER NOT NULL,
    "StoragePath" TEXT NOT NULL,
    "Hash" TEXT,
    "IsPublic" INTEGER NOT NULL DEFAULT 0,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME,
    "DeletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "FileRelations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "FileId" TEXT NOT NULL,
    "EntityType" TEXT NOT NULL,
    "EntityId" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FileRelations_FileId_fkey" FOREIGN KEY ("FileId") REFERENCES "Files" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FileCategories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "Description" TEXT
);

-- CreateTable
CREATE TABLE "FileCategoryRelations" (
    "FileId" TEXT NOT NULL,
    "CategoryId" TEXT NOT NULL,

    PRIMARY KEY ("FileId", "CategoryId"),
    CONSTRAINT "FileCategoryRelations_FileId_fkey" FOREIGN KEY ("FileId") REFERENCES "Files" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FileCategoryRelations_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "FileCategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FileVersions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "FileId" TEXT NOT NULL,
    "VersionNumber" INTEGER NOT NULL,
    "StoragePath" TEXT NOT NULL,
    "FileSize" INTEGER NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FileVersions_FileId_fkey" FOREIGN KEY ("FileId") REFERENCES "Files" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FileTags" (
    "FileId" TEXT NOT NULL,
    "TagId" TEXT NOT NULL,

    PRIMARY KEY ("FileId", "TagId"),
    CONSTRAINT "FileTags_FileId_fkey" FOREIGN KEY ("FileId") REFERENCES "Files" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FileTags_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApiKeys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "ApiKey" TEXT NOT NULL,
    "IsActive" INTEGER NOT NULL DEFAULT 1,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastUsedAt" DATETIME
);

-- CreateTable
CREATE TABLE "SignedUrls" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "FileId" TEXT NOT NULL,
    "Token" TEXT NOT NULL,
    "ExpiresAt" DATETIME NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SignedUrls_FileId_fkey" FOREIGN KEY ("FileId") REFERENCES "Files" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ApiKeyId" TEXT,
    "Action" TEXT NOT NULL,
    "FileId" TEXT,
    "Details" TEXT,
    "IpAddress" TEXT,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLogs_ApiKeyId_fkey" FOREIGN KEY ("ApiKeyId") REFERENCES "ApiKeys" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_Name_key" ON "Tags"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_ApiKey_key" ON "ApiKeys"("ApiKey");

-- CreateIndex
CREATE UNIQUE INDEX "SignedUrls_Token_key" ON "SignedUrls"("Token");
