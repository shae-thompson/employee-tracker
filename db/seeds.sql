-- Informaton for Department table
INSERT INTO department (name)
VALUES  ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales");

--Information for Role table
INSERT INTO role (title, department_id, salary)
VALUES  ("Sales Lead", 4, "100000"),
        ("Salesperson", 4, "80000"),
        ("Lead Engineer", 1, "150000"),
        ("Software Engineer", 1, "120000"),
        ("Account Manager", 2, "160000"),
        ("Accountant", 2, "125000"),
        ("Legal Team Lead", 3, "250000"),
        ("Lawyer", 3, "190000");

--Information for Employee Table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE   ("John", "Doe", 1, NULL),
        ("Mike", "Chan", 2, 1),
        ("Ashley", "Rodriguez", 3, NULL),
        ("Kevin", "Tupik", 4, 3),
        ("Kunal", "Singh", 5, NULL),
        ("Malia", "Brown", 6, 5),
        ("Sarah", "Lourd", 7, NULL),
        ("Tom", "Allen", 8, 7),