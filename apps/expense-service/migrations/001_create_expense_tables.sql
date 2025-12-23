CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id),
  created_by UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  current_version_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE expense_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id),
  total_amount NUMERIC(12, 2) NOT NULL,
  paid_by UUID NOT NULL REFERENCES users(id),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE expense_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_version_id UUID NOT NULL REFERENCES expense_versions(id),
  name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL
);

CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_version_id UUID NOT NULL REFERENCES expense_versions(id),
  user_id UUID NOT NULL REFERENCES users(id),
  amount_owed NUMERIC(12, 2) NOT NULL
);
