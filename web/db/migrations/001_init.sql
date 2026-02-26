CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'adult',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  start_ts INTEGER NOT NULL,
  end_ts INTEGER NOT NULL,
  location TEXT,
  notes TEXT,
  is_all_day INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'family',
  updated_at INTEGER NOT NULL,
  FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  notes TEXT,
  due_ts INTEGER,
  status TEXT NOT NULL DEFAULT 'open',
  priority INTEGER NOT NULL DEFAULT 2,
  assigned_to TEXT,
  created_by TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY(assigned_to) REFERENCES users(id),
  FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS shopping_items (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  qty TEXT,
  category TEXT,
  is_done INTEGER NOT NULL DEFAULT 0,
  list_name TEXT NOT NULL DEFAULT 'principal',
  added_by TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY(added_by) REFERENCES users(id)
);
