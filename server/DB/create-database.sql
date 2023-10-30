-- -- Створення бази даних (якщо вона ще не існує) SQLite
ATTACH DATABASE './DB/TaskManager.db' AS TaskManager;

-- Визначення користувачів
CREATE TABLE TaskManager.Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL,
    Email TEXT NOT NULL,
    PasswordHash TEXT NOT NULL,
    Role TEXT NOT NULL
);

-- Визначення завдань
CREATE TABLE TaskManager.Tasks (
    TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL,
    TaskName TEXT NOT NULL,
    Status TEXT NOT NULL,
    CreatedAt DATETIME NOT NULL,
    Result INTEGER,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Визначення результатів завдань
CREATE TABLE TaskManager.TaskResults (
    ResultID INTEGER PRIMARY KEY AUTOINCREMENT,
    TaskID INTEGER NOT NULL,
    PreviousNumber INTEGER NOT NULL,
    CurrentNumber INTEGER NOT NULL,
    FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID)
);

-- Визначення журналу подій завдань
CREATE TABLE TaskManager.TaskLogs (
    LogID INTEGER PRIMARY KEY AUTOINCREMENT,
    TaskID INTEGER NOT NULL,
    EventTime DATETIME NOT NULL,
    EventDescription TEXT NOT NULL,
    TaskStatus TEXT NOT NULL,
    FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID)
);