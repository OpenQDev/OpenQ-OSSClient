import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import OSSClient from './OSSClient'; // Assuming the path to your OSSClient file
import { StorageType } from './types'; // Assuming the path to your types file
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(bodyParser.json());

// Create an instance of OSSClient
const ossClient = new OSSClient(StorageType.InMemory);

const apiSecret = process.env.SCHEDULER_API_SECRET;

// Define a middleware for authorization check
const authorize = (req: Request, res: Response, next: any) => {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader || authorizationHeader !== `Bearer ${apiSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Define a POST route for adding an access token
app.get('/show-tokens', authorize, (req: Request, res: Response) => {
  try {
    const token = req.body.token as string; // Assuming the token is provided in the request body
    res.json({ tokens: ossClient.showTokens() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Define a POST route for adding an access token
app.post('/add-token', authorize, (req: Request, res: Response) => {
  try {
    const token = req.body.token as string; // Assuming the token is provided in the request body
    ossClient.addToken(token);
    res.json({ message: 'Token added successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Define a POST route for adding an access token
app.post('/remove-token', authorize, (req: Request, res: Response) => {
  try {
    const token = req.body.token as string; // Assuming the token is provided in the request body
    ossClient.removeToken(token);
    res.json({ message: 'Token removed successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Define a POST route for adding an access token
app.post('/rotate-token', authorize, (req: Request, res: Response) => {
  try {
    ossClient.rotateToken();
    res.json({ message: 'Token rotated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Define a POST route for making requests
app.post('/', async (req: Request, res: Response) => {
  try {
    const query = req.body.query as any; // Assuming the client sends the query in the request body
    const response = await ossClient.makeRequest(query);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
