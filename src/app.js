const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorMiddleware = require('./middlewares/error.middleware');
const appointmentRoutes = require('./routes/appointment.routes');
app.use('/api/appointments', appointmentRoutes);
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use(errorMiddleware);

module.exports = app;