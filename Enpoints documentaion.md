# API Endpoint Documentation

## Public Endpoints

### Station Information

**GET /stations/:id**

- Purpose: Retrieves all trains passing through a specific station
- Parameters: station ID
- Response: An object with the station's name and an array of train objects with schedule information

**GET /stations**

- Purpose: Retrieves a list of all railway stations in Romania
- Response: Array of station objects containing names and IDs

## Protected Endpoints

All protected endpoints require a valid JWT access token in the Authorization header using Bearer scheme.

### Delay Management

**POST /trip/delays/:trainNumber**

- Purpose: Adds a delay to a specific train. Use the same trainNumber and the delay value will update.
- Parameters: train number
- Authentication: Required (Admin)
- Access: Bearer token
- Request body: { "delay": `delay_value_in_minutes` }
  > Replace `your_delay_value_here` with the actual delay in minutes.

**DELETE /trip/delays/:trainNumber**

- Purpose: Removes delay information from a train
- Parameters: train number
- Authentication: Required (Admin)
- Access: Bearer token

### Service Notifications

**POST /remarks/:trainNumber**

- Purpose: Adds a notification message to a specific train
- Parameters: train number
- Authentication: Required (Admin)
- Access: Bearer token
- Request body: { "message": `notification_text` }
  > Replace `notification_text` with the actual notification text.

**PATCH /remarks/:trainNumber/:remarkID**

- Purpose: Updates an existing notification
- Parameters: train number, remark ID
- Authentication: Required (Admin)
- Access: Bearer token
- Request body: Updated message object

**DELETE /remarks/:trainNumber/:remarkID**

- Purpose: Removes a notification from a train
- Parameters: train number, remark ID
- Authentication: Required (Admin)
- Access: Bearer token

### User Management

**POST /auth/login**

- Purpose: Authenticates user and provides access token
- Authentication: None
- Request body: { "email": "user@example.com", "password": "securepassword" }
- Response: { "access_token": "JWT_TOKEN" }

**POST /auth/signup**

- Purpose: Creates new user account
- Authentication: Required (Super Admin)
- Access: Bearer token
- Request body: { "email": "user@example.com", "password": "securepassword", "fullname": "Admin" }
- Note: Only super administrators can create new user accounts

**DELETE /users/:userID**

- Purpose: Removes a user from the system
- Parameters: user ID
- Authentication: Required (Super Admin)
- Access: Bearer token
- Note: Restricted to super administrator accounts

**Get /users**

- Purpose: Retrieves a list of all administrators
- Authentication: Required (Admin)
- Access: Bearer token
