import OSSClient from '../src/OSSClient'
import axios from 'axios'

jest.mock('axios'); // Mock the axios module

describe('OSSClient', () => {
  let client;

  beforeEach(() => {
    client = new OSSClient();
  });

  it('should make a successful request', async () => {
    const dataSourceKey = 'localhost';
    const url = client.dataSources[dataSourceKey].endpoint;
    const mockData = { key: 'value' };

    axios.get.mockResolvedValue({ data: mockData });

    const response = await client.makeRequest(url, dataSourceKey);
    
    expect(response).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(url, expect.any(Object));
  });

  it('should handle request failure', async () => {
    const dataSourceKey = 'localhost';
    const url = client.dataSources[dataSourceKey].endpoint;
    const mockError = new Error('Request failed');

    axios.get.mockRejectedValue(mockError);

    await expect(client.makeRequest(url, dataSourceKey)).rejects.toThrow(
      `Request failed: ${mockError.message}`
    );
  });

  it('should handle invalid data source key', async () => {
    const invalidDataSourceKey = 'invalidSource';
    const invalidUrl = 'http://invalid.url';

    await expect(client.makeRequest(invalidUrl, invalidDataSourceKey)).rejects.toThrow(
      'Invalid data source key'
    );
  });
});
