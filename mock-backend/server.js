const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your_super_secret_jwt_key_here';

// In-Memory Database
const users = [];
const teachers = [];
let userIdCounter = 1;

// POST /api/register
app.post('/api/register', (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ status: false, message: 'Email already exists' });
    }

    const newUser = { id: userIdCounter++, email, password, first_name, last_name, created_at: new Date().toISOString() };
    users.push(newUser);

    res.status(201).json({ status: true, message: 'User registered successfully', user_id: newUser.id });
});

// POST /api/login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ status: false, message: 'Invalid email or password' });
    }

    const payload = { iat: Date.now(), exp: Date.now() + 3600 * 1000, uid: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET);

    res.json({
        status: true,
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name }
    });
});

// POST /api/teacher/combined-insert
app.post('/api/teacher/combined-insert', (req, res) => {
    const { email, first_name, last_name, password, university_name, gender, year_joined } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ status: false, message: 'Email already exists' });
    }

    const newUser = { id: userIdCounter++, email, password, first_name, last_name, created_at: new Date().toISOString() };
    users.push(newUser);

    const newTeacher = { id: teachers.length + 1, user_id: newUser.id, university_name, gender, year_joined };
    teachers.push(newTeacher);

    res.status(201).json({ status: true, message: 'User and Teacher added successfully.', user_id: newUser.id });
});

// GET /api/users
app.get('/api/users', (req, res) => {
    // Return all users without password
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json({ status: true, data: safeUsers });
});

// GET /api/teachers
app.get('/api/teachers', (req, res) => {
    // Join with user data
    const completeTeachers = teachers.map(t => {
        const u = users.find(user => user.id === t.user_id) || {};
        return {
            ...t,
            first_name: u.first_name,
            last_name: u.last_name,
            email: u.email
        };
    });
    res.json({ status: true, data: completeTeachers });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Mock CI4 Backend Server running on http://localhost:${PORT}`);
});
