import bcrypt

# The hash from the database
hash_in_db = b"$2b$12$Vu4IBV/xMeFWREuKEDbWqumtO7a8729Q/AQGSVtBFiEgJQLL8OfLq"

# Test if the password matches
result = bcrypt.checkpw(b"Admin123456", hash_in_db)
print(f"Password 'Admin123456' matches: {result}")

# Also test with a different password
result2 = bcrypt.checkpw(b"Admin1234567", hash_in_db)
print(f"Password 'Admin1234567' matches: {result2}")