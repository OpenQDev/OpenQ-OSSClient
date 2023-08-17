import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

let requestCounter = 0;

app.post('/', (req: Request, res: Response) => {
  requestCounter++;

	console.log('called')

  if (requestCounter <= 2) {
    // First and second requests, return 200
    return res.status(200).json({ message: 'Request authorized.' });
  } else {
    // Third request, return 401
    requestCounter = 0; // Reset the counter
    return res.status(401).json({ message: 'Authorization token is invalid. This should rotate tokens.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
