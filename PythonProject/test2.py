import pandas as pd

# Load the fixed CSV (assuming you saved it as 'fixed_dataset.csv')
df = pd.read_csv('data/destinations.csv')

# Display all columns and rows
print(df)

# Check specific columns with commas
print("\nChecking 'tags' column:")
print(df['tags'])

print("\nChecking 'description' column:")
print(df['description'])

# Verify column count and names
print("\nColumn names:", df.columns.tolist())
print("Number of columns:", len(df.columns))
print("Number of rows:", len(df))