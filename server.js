require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/db');
const User = require('./models/users');
const Destination = require('./models/destination');
const requireAuth = require('./middleware/requireauth');
const requireAdmin = require('./middleware/requireadmin');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const packageRoutes = require('./routes/packagesroute');
app.use('/api/packages', packageRoutes);

const foodRoutes = require('./routes/foodroute');
app.use('/api/foods', foodRoutes);

const activityRoutes = require('./routes/activityRoute');
const placeRoutes = require('./routes/placesRoute');

app.use('/api/activities', activityRoutes);
app.use('/api/places', placeRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database connected successfully.');
}).catch((err) => {
  console.error('Database sync error:', err);
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.get('/api/users', [requireAuth, requireAdmin], async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/count', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const adminCount = await User.count({ where: { role: 'admin' } });
    const userCount = totalUsers - adminCount;
    res.status(200).json({ total: totalUsers, users: userCount, admins: adminCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/signup', async (req, res) => {
  const { fullname, email, password } = req.body;
  const role = 'user';
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, fullname, email, role },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'User signed in successfully',
      token,
      user: { id: user.id, fullname: user.fullname, email, role: user.role },
    });
  } catch (error) {
    console.error('Sign-In error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/destinations', [requireAuth, requireAdmin], async (req, res) => {
  const { name, image, description, dtype } = req.body;
  try {
    if (!dtype || !['domestic', 'international'].includes(dtype.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid dtype. Use "domestic" or "international".' });
    }
    const destination = await Destination.create({ name, image, description, dtype });
    res.status(201).json({ message: 'Destination added successfully', destination });
  } catch (error) {
    console.error('Add destination error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/destinations', async (req, res) => {
  try {
    const destinations = await Destination.findAll();
    res.status(200).json(destinations);
  } catch (error) {
    console.error('Fetch destinations error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/destinations/domestic', async (req, res) => {
  try {
    const destinations = await Destination.findAll({ where: { dtype: 'domestic' } });
    res.status(200).json(destinations);
  } catch (error) {
    console.error('Fetch domestic destinations error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/destinations/international', async (req, res) => {
  try {
    const destinations = await Destination.findAll({ where: { dtype: 'international' } });
    res.status(200).json(destinations);
  } catch (error) {
    console.error('Fetch international destinations error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/destinations/counts', async (req, res) => {
  try {
    const total = await Destination.count();
    const domestic = await Destination.count({ where: { dtype: 'domestic' } });
    const international = await Destination.count({ where: { dtype: 'international' } });
    res.status(200).json({ total, domestic, international });
  } catch (error) {
    console.error('Fetch destinations counts error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/destinations/:id', [requireAuth, requireAdmin], async (req, res) => {
  const { id } = req.params;
  const { name, image, description, dtype } = req.body;
  try {
    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found.' });
    }
    destination.name = name || destination.name;
    destination.image = image || destination.image;
    destination.description = description || destination.description;
    destination.dtype = dtype || destination.dtype;
    await destination.save();
    res.status(200).json({ message: 'Destination updated successfully.', destination });
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({ error: 'Failed to update destination.' });
  }
});

app.delete('/api/destinations/:id', [requireAuth, requireAdmin], async (req, res) => {
  const { id } = req.params;
  try {
    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found.' });
    }
    await destination.destroy();
    res.status(200).json({ message: 'Destination deleted successfully.' });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({ error: 'Failed to delete destination.' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});