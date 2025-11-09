import express from 'express';

const router = express.Router();

// Example GET route
router.get('/', (req, res) => {
  res.json({ message: 'Example route is working!' });
});

// Example POST route
router.post('/', (req, res) => {
  const { data } = req.body;
  res.json({ 
    message: 'Data received',
    receivedData: data 
  });
});

export default router;

