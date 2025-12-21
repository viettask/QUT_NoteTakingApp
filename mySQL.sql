-- Step 1: create database note-taking-app
CREATE DATABASE note_taking_app;
USE note_taking_app;

-- Step 2: create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);

-- Step 3: create notes table
CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 4: Create categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Insert default categories into categories table
INSERT INTO categories (name, color, description) VALUES
('General', '#6c757d', 'General notes and miscellaneous items'),
('Work', '#007AFF', 'Work-related notes and tasks'),
('Personal', '#34C759', 'Personal life and family matters'),
('Ideas', '#FF9500', 'Creative ideas and brainstorming'),
('Todo', '#FF3B30', 'Tasks and to-do items'),
('Shopping', '#AF52DE', 'Shopping lists and purchases'),
('Travel', '#5AC8FA', 'Travel plans and vacation notes'),
('Health', '#FF2D55', 'Health, fitness, and wellness'),
('Finance', '#30B0C7', 'Financial planning and budgeting');

-- Step 6: Modify notes table to add category_id column (ensure it is the correct data type and nullable if needed)
ALTER TABLE notes 
ADD COLUMN category_id INT DEFAULT 1;

-- Step 7: Add the foreign key constraint
ALTER TABLE notes
ADD CONSTRAINT FK_category_id FOREIGN KEY (category_id) REFERENCES categories(id);

-- Optional: Verify the foreign key constraint is successfully added
SHOW CREATE TABLE notes;