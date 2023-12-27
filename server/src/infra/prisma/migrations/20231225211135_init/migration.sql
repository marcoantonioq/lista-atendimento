-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "list" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "locale" TEXT,
    "desc" TEXT,
    "maps" TEXT,
    "gid" TEXT,
    "recurring" TEXT,
    "date" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "updated" DATETIME
);

-- CreateTable
CREATE TABLE "EventoRemoved" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "list" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "locale" TEXT,
    "desc" TEXT,
    "maps" TEXT,
    "gid" TEXT,
    "recurring" TEXT,
    "date" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "updated" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
