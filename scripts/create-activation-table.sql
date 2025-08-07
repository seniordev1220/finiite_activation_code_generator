-- Create the activation_code table
CREATE TABLE IF NOT EXISTS activation_code (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    activation_code CHAR(9) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique combination of user credentials
    UNIQUE(first_name, last_name, email, password)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_activation_code ON activation_code(activation_code);
CREATE INDEX IF NOT EXISTS idx_user_credentials ON activation_code(first_name, last_name, email);
