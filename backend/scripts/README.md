# Scripts

Utility scripts for the authentication system.

## Generate JWT Secrets

Generate secure random secrets for JWT tokens:

```bash
node scripts/generateSecrets.js
```

This will output two secure random strings that you should copy to your `.env` file.

## Make User Admin

Promote a user to admin role:

```bash
node scripts/makeAdmin.js user@example.com
```

Example:
```bash
# First, register a user through the API
# Then make them an admin
node scripts/makeAdmin.js test@example.com
```

## Usage Tips

1. **Always generate new secrets** for production environments
2. **Never commit** `.env` file to version control
3. **Use the makeAdmin script** instead of manually editing the database
4. **Test with a regular user first** before creating admin accounts
