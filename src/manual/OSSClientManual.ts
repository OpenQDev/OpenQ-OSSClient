import OSSClient from "../OSSClient";
import { StorageType } from "../types";

// Example usage
const client = new OSSClient(StorageType.InMemory);
const dataSourceKey = 'localhost';
const url = client.dataSources[dataSourceKey].endpoint;

const query = "query { viewer { login } }"

client.makeRequest(query)
  .then(data => {
    console.log('Response:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });