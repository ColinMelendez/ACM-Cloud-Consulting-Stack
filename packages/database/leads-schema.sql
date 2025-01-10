-- Uncomment if you wan to reset the table for deployments
-- DROP TABLE IF EXISTS Leads;
CREATE TABLE IF NOT EXISTS Leads (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Email TEXT NOT NULL,
    Name TEXT NOT NULL,
    Company TEXT NOT NULL,
    Message TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON Leads(Email);