const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const appointmentRoutes = require('./routes/appointment.routes');
const authRoutes = require('./routes/auth.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
   
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

module.exports = app;