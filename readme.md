# Aviel-FCA: Unofficial Facebook Chat API

A lightweight, fast, and unofficial API to interact with Facebook Chat programmatically.

## Installation
```bash
npm install aviel-fca
```

## Quick Start

### Login Example
```javascript
const login = require('aviel-fca');

async function login() {
  try {
    const api = await login({
      email: 'your_facebook_email',
      password: 'your_password'
    });
    console.log('Logged in successfully!');
    return api;
  } catch (error) {
    console.error('Login failed:', error);
  }
}

login();
```

### Send Message Example
```javascript
const api = await login();
api.sendMessage("Hello from Aviel-FCA!", "friend_user_id");
```

### Listen for Messages
```javascript
api.listen((err, message) => {
  if (err) return console.error(err);
  console.log('Received message:', message.body);
});
```

## API Methods
| Method               | Description                          |
|----------------------|--------------------------------------|
| `login()`            | Authenticate with Facebook           |
| `sendMessage()`      | Send text message                    |
| `listen()`           | Receive incoming messages            |
| `getUserInfo()`      | Fetch user profile data              |
| `handleRequest()`    | Accept/reject friend requests        |

## Disclaimer
This is an **unofficial** API. Use at your own risk. Not affiliated with Facebook.
