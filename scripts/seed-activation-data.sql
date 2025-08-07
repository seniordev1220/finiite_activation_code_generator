-- Sample data for testing (optional)
INSERT INTO activation_code (first_name, last_name, email, password, activation_code) 
VALUES 
    ('John', 'Doe', 'john.doe@example.com', 'password123', 'ABC123XYZ'),
    ('Jane', 'Smith', 'jane.smith@example.com', 'mypassword', 'DEF456UVW')
ON CONFLICT DO NOTHING;
