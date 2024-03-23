import express, { json } from 'express';
import { connect } from './config/dbConfig';

const app = express();

// Middleware
app.use(json());

// API routes here

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test database connection
  connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database...');
  });
});
