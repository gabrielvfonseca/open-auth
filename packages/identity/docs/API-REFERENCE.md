# Identity API Reference

## User Services

### `getUserById(id: string)`
Fetches a user and their linked accounts.

### `createUser(data: CreateUserDto)`
Initializes a new user record.

## Account Services

### `linkAccount(userId: string, accountData: any)`
Binds a new authentication method to an existing user.

### `unlinkAccount(userId: string, provider: string)`
Removes a specific authentication method.
