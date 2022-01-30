INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 2, 1),
  ('Virginia', 'Woolf', 1, 2),
  ('Piers', 'Gaveston', 3, 2);



INSERT INTO roles (title, salary, department_id)
VALUES
    ('Manager', 175, 1),
    ('Engineer', 100, 2),
    ('Intern', 8, 2);

INSERT INTO departments (name)
VALUES
    ('Admin'),
    ('Engineering'),
    ('Education');