import axios from 'axios';
import OSSClient from '../src/OSSClient';
import TokenQueue from '../src/TokenQueue';
import { DataSources, StorageType } from '../src/types';

// Mocking axios module
jest.mock('axios');

describe('OSSClient', () => {
  let ossClient: OSSClient;

  beforeEach(() => {
    ossClient = new OSSClient(StorageType.InMemory); // Replace with your preferred storage type
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an instance of OSSClient', () => {
    expect(ossClient).toBeInstanceOf(OSSClient);
  });

  it('should initialize with valid data sources', () => {
    expect(ossClient.dataSources).toEqual(expect.any(Object));
  });

  it('should add and remove tokens', () => {
    const mockToken = 'mock_token';
    ossClient.addToken(mockToken);
    const tokenQueue = (ossClient as any).tokenQueue as TokenQueue;
    expect(tokenQueue.dequeueSet.queue).toContain(mockToken);

    ossClient.removeToken(mockToken);
    expect(tokenQueue.dequeueSet.queue).not.toContain(mockToken);
  });

  it('should rotate tokens', () => {
    const mockToken1 = 'token1';
    const mockToken2 = 'token2';
    (ossClient as any).tokenQueue.addToken(mockToken1);
    (ossClient as any).tokenQueue.addToken(mockToken2);

    expect(ossClient.rotateToken()).toBe(mockToken2);
    expect(ossClient.rotateToken()).toBe(mockToken1);
    expect(ossClient.rotateToken()).toBe(mockToken2);
  });

  describe('makeRequest', () => {
    const mockResponseData = { /* Mock response data */ };

    it('should make a successful request', async () => {
      const mockAuthToken = 'mock_auth_token';
      (ossClient as any).tokenQueue.addToken(mockAuthToken);

      const mockAxiosPost = axios.post as jest.Mock;
      mockAxiosPost.mockResolvedValueOnce({ data: mockResponseData });

      const query = { /* Mock query */ };
      const response = await ossClient.makeRequest(query);

      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.any(String),
        { query },
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockAuthToken}`,
          },
        })
      );

      expect(response).toEqual(mockResponseData);
    });

    it('should retry on 401 Unauthorized and rotate tokens before subsequent call', async () => {
			const valid_token = 'valid_token';
			const invalid_token = 'invalid_token';

      (ossClient as any).tokenQueue.addToken(invalid_token);
      (ossClient as any).tokenQueue.addToken(valid_token);

      const mockAxiosPost = axios.post as jest.Mock;
      mockAxiosPost
        .mockRejectedValueOnce({ response: { status: 401 } })
        .mockResolvedValueOnce({ data: mockResponseData });

      const query = { /* Mock query */ };
      const response = await ossClient.makeRequest(query, 2);

      expect(mockAxiosPost).toHaveBeenCalledTimes(2);

      expect(response).toEqual(mockResponseData);
      expect(ossClient.tokenQueue.dequeueSet.queue[0]).toEqual('valid_token');
    });

    it('should throw an error on repeated failures', async () => {
      (ossClient as any).tokenQueue.addToken('invalid_token');

      const mockAxiosPost = axios.post as jest.Mock;
      mockAxiosPost.mockRejectedValue({ response: { status: 401 } });

      const query = { /* Mock query */ };

      await expect(ossClient.makeRequest(query, 2)).rejects.toThrow(
        'Request failed after 2 retries'
      );

      expect(mockAxiosPost).toHaveBeenCalledTimes(2);
    });
  });
});
