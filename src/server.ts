import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import OSSClient from './OSSClient'; // Assuming the path to your OSSClient file
import { StorageType } from './types'; // Assuming the path to your types file

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Create an instance of OSSClient
const ossClient = new OSSClient(StorageType.InMemory);

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
