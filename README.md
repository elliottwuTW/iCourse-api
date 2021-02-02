## iCourse API
Backend API server for iCourse Node.js web application, a course directory website.

### Document
Check api details in [iCourse REST API](https://icourse-api.herokuapp.com/)

### App spec
#### Authentication
- Authenticated by JWT
- Registration
  - Registered as role of "user" or "publisher"
  - Once successful, token will be sent as response
- Login
  - Using email and password
  - Once successful, token will be sent as response
- Get current user
  - Get the currently logged in user via token
- Forgot password
  - An unhashed token will be emailed to user's registered email address
  - Send PUT request with the unhashed token to reset password
  - The token expires after 10 mins

#### Authorization
- Routes are accessible to specific roles

#### Models
##### Users
- Get user details
  - Must be user self
- Get user public info
  - Login needed
- Manage user CRUD
  - Admin Only

##### Groups
- List all groups in the database
  - Filtering, Sorting, Pagination, etc 
- List all groups by radius from location with latitude and longitude
  - Filtering, Sorting, Pagination, etc 
- Get single group
- Create a group
  - Login needed
  - Must be role of "publisher" or "admin"
  - Fields validation
  - Only one group per publisher
- Update a group
  - Login needed
  - Owner only
  - Fields validation
- Delete a group
  - Login needed
  - Owner only

##### Courses
- List all courses in the database
  - Filtering, Sorting, Pagination, etc
- List all courses of a group
  - Filtering, Sorting, Pagination, etc
- Get single course
- Create new course for a group
  - Login needed
  - Must be role of "publisher" or "admin"
  - Owner only
  - Fields validation
- Update a course
  - Login needed
  - Owner only
  - Fields validation
- Delete a course
  - Login needed
  - Owner only
- Calculate the average cost of all courses for a group

##### Reviews
- List all reviews in the database
  - Filtering, Sorting, Pagination, etc
- List all reviews of a course
  - Filtering, Sorting, Pagination, etc
- Get single review
- Post a review for a course
  - Login needed
  - Must be role of "user" or "admin"
  - Fields validation
  - Only one review per user
- Update a review
  - Login needed
  - Owner only
  - Fields validation
- Delete a review
  - Login needed
  - Owner only
- Calculate the average rating from all reviews of different courses for a group

##### Orders
Login needed
- List all orders in the database
  - Filtering, Sorting, Pagination, etc
  - Admin only
- List all orders of an user
  - Filtering, Sorting, Pagination, etc
  - Owner only
- Get an order of user
  - Owner only
- Cancel an order
  - Owner only
- Update serial number of an order when preparing for payment
  - Owner only
- Update payment status of an order
  - Protected by secret header

#### Join Tables
##### Follows
Login needed
- Users can follow multiple groups
  - Publisher can't follow owned group
- Followers will receive email when the followed group publishes new course

##### Enrollments
- Users get enrolled in the course after finishing payment

##### OrderCourses
- Course items are recorded when an order is set up

### Scheme Structure
![](https://raw.githubusercontent.com/elliottwuTW/iCourse-api/master/public/scheme-structure.png)

### Usage
- Install dependencies
  ```
  npm install
  ```
- Follow `.env.example` to setup your .env
  ```
  touch .env
  ```
- Checkout `config.json` to setup database
  ```
  {
    "development": {
      "username": "YOUR_USERNAME",
      "password": "YOUR_PASSWORD",
      "database": "YOUR_DB_NAME",
      "host": "127.0.0.1",
      "dialect": "mysql",
      "operatorsAliases": false
    },
    "test": {
      "username": "YOUR_USERNAME",
      "password": "YOUR_PASSWORD",
      "database": "YOUR_DB_NAME",
      "host": "127.0.0.1",
      "dialect": "mysql",
      "logging": false
    },
    "production": {
      "use_env_variable": "YOUR_DATABASE_URL"
    }
  }
  ```
- Database seeder
  ```
  # database migration
  npx sequelize db:migrate

  # generate seed data
  npx sequelize db:seed:all
  ```
- Run app
  ```
  # dev mode
  npm run dev

  # prod mode
  npm run start
  ```

### Package Version
- express : 4.17.1
- mysql2 : 2.2.5
- sequelize : 6.3.5
- sequelize-cli : 6.2.0

### App Info
#### Author 
[elliottwuTW](https://github.com/elliottwuTW)

#### Version
1.2.0