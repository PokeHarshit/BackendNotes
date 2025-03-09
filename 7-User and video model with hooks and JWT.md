  # User and Video Model with Hooks and JWT

## Overview
This document dives deep into the creation of **User** and **Video** models in a **MERN stack** application, leveraging pre-save hooks for enhanced functionality, and utilizing **JWT (JSON Web Tokens)** for secure authentication and session management. It covers every crucial step from schema design to best practices, ensuring a beginner-friendly yet professional approach.

---

## 1. User Model
### Key Components:
- **User Schema:**
  Defines the structure for user data.
  ```javascript
  const mongoose = require('mongoose');
  const bcrypt = require('bcrypt');

  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  ```

- **Password Hashing Hook:**
  Automatically hashes passwords before saving, ensuring data security.
  ```javascript
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  ```

- **Password Comparison Method:**
  Allows secure comparison of plaintext and hashed passwords during login.
  ```javascript
  userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  ```

- **JWT Token Generation:**
  Enables token-based user authentication.
  ```javascript
  const jwt = require('jsonwebtoken');

  userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  };

  module.exports = mongoose.model('User', userSchema);
  ```

---

## 2. Video Model
### Key Components:
- **Video Schema:**
  Defines the structure for storing video metadata.
  ```javascript
  const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });

  module.exports = mongoose.model('Video', videoSchema);
  ```

- **Mongoose Aggregate Paginate Plugin:**
  Enables efficient pagination for handling large datasets.
  ```javascript
  const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

  videoSchema.plugin(mongoosePaginate);
  ```

---

## 3. Packages Discussion
### Mongoose-Aggregate-Paginate-V2:
- Provides seamless **pagination** for aggregate queries in MongoDB.
- Example usage:
  ```javascript
  const options = {
    page: 1,
    limit: 10,
  };

  Video.aggregatePaginate(Video.aggregate([{ $match: { title: /tutorial/ } }]), options)
    .then(result => console.log(result))
    .catch(err => console.error(err));
  ```

---

## 4. Authentication with JWT
### Token-Based Authentication:
- **Sign JWT Token:**
  Generates a secure token for user authentication.
  ```javascript
  const token = user.generateToken();
  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({ success: true, token });
  ```

- **Verify JWT Token Middleware:**
  Ensures only authorized users access protected routes.
  ```javascript
  const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      req.user = decoded;
      next();
    });
  };
  ```

---

## Best Practices
1. **Environment Variables:** Always store sensitive data like `JWT_SECRET` and database credentials in `.env` files.
2. **Password Security:** Use **bcrypt** with sufficient salt rounds (e.g., `10`) to ensure robust hashing.
3. **Efficient Pagination:** Leverage plugins like `mongoose-aggregate-paginate-v2` to handle large datasets efficiently.
4. **Token Expiry:** Set a reasonable expiration time for JWT tokens (e.g., `1h`) to balance security and usability.
5. **Folder Organization:** Maintain a clean and modular project structure for scalability.

---

## Visual Overview
### Relationships:
```plaintext
User <1----N> Video
```
- **One User can have many Videos** (One-to-Many Relationship).

### Folder Structure:
```plaintext
project/
├── models/
│   ├── user.js
│   ├── video.js
├── routes/
│   ├── auth.js
│   ├── video.js
├── app.js
├── .env
├── package.json
```

---

## Final Notes
This structured approach ensures secure user authentication, streamlined video management, and robust data handling with MongoDB and Mongoose. By combining best practices, proper tooling, and efficient design patterns, you can create a backend system that is both scalable and maintainable.