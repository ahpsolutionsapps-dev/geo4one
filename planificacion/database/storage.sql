-- ============================================================
-- FILES
-- ============================================================

CREATE TABLE "Files" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "FileName" TEXT NOT NULL,
    "OriginalFileName" TEXT NOT NULL,
    "Extension" TEXT NOT NULL,
    "MimeType" TEXT NOT NULL,
    "FileSize" BIGINT NOT NULL,
    "StoragePath" TEXT NOT NULL,
    "Hash" TEXT,
    "IsPublic" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ,
    "DeletedAt" TIMESTAMPTZ
);


-- ============================================================
-- FILE RELATIONS
-- ============================================================

CREATE TABLE "FileRelations" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "FileId" UUID NOT NULL,
    "EntityType" TEXT NOT NULL,
    "EntityId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FK_FileRelations_Files"
        FOREIGN KEY ("FileId")
        REFERENCES "Files"("Id")
);


-- ============================================================
-- FILE CATEGORIES
-- ============================================================

CREATE TABLE "FileCategories" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" TEXT NOT NULL,
    "Description" TEXT
);


-- ============================================================
-- FILE CATEGORY RELATIONS
-- ============================================================

CREATE TABLE "FileCategoryRelations" (
    "FileId" UUID NOT NULL,
    "CategoryId" UUID NOT NULL,

    PRIMARY KEY ("FileId", "CategoryId"),

    CONSTRAINT "FK_FileCategoryRelations_Files"
        FOREIGN KEY ("FileId")
        REFERENCES "Files"("Id"),

    CONSTRAINT "FK_FileCategoryRelations_FileCategories"
        FOREIGN KEY ("CategoryId")
        REFERENCES "FileCategories"("Id")
);


-- ============================================================
-- FILE VERSIONS
-- ============================================================

CREATE TABLE "FileVersions" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "FileId" UUID NOT NULL,
    "VersionNumber" INTEGER NOT NULL,
    "StoragePath" TEXT NOT NULL,
    "FileSize" BIGINT NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FK_FileVersions_Files"
        FOREIGN KEY ("FileId")
        REFERENCES "Files"("Id"),

    CONSTRAINT "UQ_FileVersions_File_Version"
        UNIQUE ("FileId", "VersionNumber")
);


-- ============================================================
-- TAGS
-- ============================================================

CREATE TABLE "Tags" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" TEXT NOT NULL UNIQUE
);


-- ============================================================
-- FILE TAGS
-- ============================================================

CREATE TABLE "FileTags" (
    "FileId" UUID NOT NULL,
    "TagId" UUID NOT NULL,

    PRIMARY KEY ("FileId", "TagId"),

    CONSTRAINT "FK_FileTags_Files"
        FOREIGN KEY ("FileId")
        REFERENCES "Files"("Id"),

    CONSTRAINT "FK_FileTags_Tags"
        FOREIGN KEY ("TagId")
        REFERENCES "Tags"("Id")
);


-- ============================================================
-- API KEYS
-- ============================================================

CREATE TABLE "ApiKeys" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" TEXT NOT NULL,
    "ApiKey" TEXT NOT NULL UNIQUE,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastUsedAt" TIMESTAMPTZ
);


-- ============================================================
-- SIGNED URLS
-- ============================================================

CREATE TABLE "SignedUrls" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "FileId" UUID NOT NULL,
    "Token" TEXT NOT NULL UNIQUE,
    "ExpiresAt" TIMESTAMPTZ NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FK_SignedUrls_Files"
        FOREIGN KEY ("FileId")
        REFERENCES "Files"("Id")
);


-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE "AuditLogs" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ApiKeyId" UUID,
    "Action" TEXT NOT NULL,
    "FileId" UUID,
    "Details" TEXT,
    "IpAddress" INET,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FK_AuditLogs_ApiKeys"
        FOREIGN KEY ("ApiKeyId")
        REFERENCES "ApiKeys"("Id"),

    CONSTRAINT "FK_AuditLogs_Files"
        FOREIGN KEY ("FileId")
        REFERENCES "Files"("Id")
);