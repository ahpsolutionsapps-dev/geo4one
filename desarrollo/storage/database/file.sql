CREATE TABLE Files (
    Id TEXT PRIMARY KEY,
    FileName TEXT NOT NULL,
    OriginalFileName TEXT NOT NULL,
    Extension TEXT NOT NULL,
    MimeType TEXT NOT NULL,
    FileSize INTEGER NOT NULL,
    StoragePath TEXT NOT NULL,
    Hash TEXT,
    IsPublic INTEGER NOT NULL DEFAULT 0,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME,
    DeletedAt DATETIME
);

CREATE TABLE FileRelations (
    Id TEXT PRIMARY KEY,
    FileId TEXT NOT NULL,
    EntityType TEXT NOT NULL,
    EntityId TEXT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FileId) REFERENCES Files(Id)
);

CREATE TABLE FileCategories (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT
);

CREATE TABLE FileCategoryRelations (
    FileId TEXT NOT NULL,
    CategoryId TEXT NOT NULL,
    PRIMARY KEY (FileId, CategoryId),
    FOREIGN KEY (FileId) REFERENCES Files(Id),
    FOREIGN KEY (CategoryId) REFERENCES FileCategories(Id)
);

CREATE TABLE FileVersions (
    Id TEXT PRIMARY KEY,
    FileId TEXT NOT NULL,
    VersionNumber INTEGER NOT NULL,
    StoragePath TEXT NOT NULL,
    FileSize INTEGER NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FileId) REFERENCES Files(Id)
);

CREATE TABLE Tags (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE
);

CREATE TABLE FileTags (
    FileId TEXT NOT NULL,
    TagId TEXT NOT NULL,
    PRIMARY KEY (FileId, TagId),
    FOREIGN KEY (FileId) REFERENCES Files(Id),
    FOREIGN KEY (TagId) REFERENCES Tags(Id)
);

CREATE TABLE ApiKeys (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    ApiKey TEXT NOT NULL UNIQUE,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    LastUsedAt DATETIME
);

CREATE TABLE SignedUrls (
    Id TEXT PRIMARY KEY,
    FileId TEXT NOT NULL,
    Token TEXT NOT NULL UNIQUE,
    ExpiresAt DATETIME NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FileId) REFERENCES Files(Id)
);

CREATE TABLE AuditLogs (
    Id TEXT PRIMARY KEY,
    ApiKeyId TEXT,
    Action TEXT NOT NULL,
    FileId TEXT,
    Details TEXT,
    IpAddress TEXT,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ApiKeyId) REFERENCES ApiKeys(Id)
);
