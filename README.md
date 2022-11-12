# ENDPOINTS

[GET]

/users - List of all users in database

/users/:id/friends - List with all friends
/users/:id/enemies - List with all enemies

[POST]

/users/loggin - The user will loggin
/users/sign-in - The user will sign-in

# MODELS

[USER]

- id: String,
- name: String,
- image?: String,
- contacts{}
  - enemies: String
  - friends: String[],
