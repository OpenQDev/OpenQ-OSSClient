const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const validTokens = ['valid_token_1', 'valid_token_2', 'valid_token_3'];

app.get('/', (req, res) => {
  const authToken = req.headers.authorization;
  
  if (!authToken) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  if (validTokens.includes(authToken)) {
    // Perform your authorized logic here
    return res.json({ message: 'Authorized access.' });
  } else {
    return res.status(403).json({ message: 'Unauthorized access.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
