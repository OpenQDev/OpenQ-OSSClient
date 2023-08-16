import TokenQueue from '@src/TokenQueue';
import { StorageType } from '@src/types';
import InMemoryDequeueSet from '@src/dequeueset/InMemoryDequeueSet';
import RedisDequeueSet from '@src/dequeueset/RedisDequeueSet';

// Mock the InMemoryDequeueSet and RedisDequeueSet classes
jest.mock('@src/dequeueset/InMemoryDequeueSet');
jest.mock('@src/dequeueset/RedisDequeueSet');

describe('TokenQueue', () => {
  beforeEach(() => {
    jest.spyOn(InMemoryDequeueSet.prototype, 'enqueue').mockClear();
    jest.spyOn(InMemoryDequeueSet.prototype, 'peek').mockClear();
    jest.spyOn(InMemoryDequeueSet.prototype, 'remove').mockClear();
    jest.spyOn(InMemoryDequeueSet.prototype, 'sendToBack').mockClear();

    jest.spyOn(RedisDequeueSet.prototype, 'enqueue').mockClear();
    jest.spyOn(RedisDequeueSet.prototype, 'peek').mockClear();
    jest.spyOn(RedisDequeueSet.prototype, 'remove').mockClear();
    jest.spyOn(RedisDequeueSet.prototype, 'sendToBack').mockClear();
  });

  it('should initialize with InMemory storage type', () => {
    const tokenQueue = new TokenQueue(StorageType.InMemory);
    expect(InMemoryDequeueSet).toHaveBeenCalledTimes(1);
    expect(tokenQueue.dequeueSet).toBeInstanceOf(InMemoryDequeueSet);
  });

  it('should initialize with Redis storage type', () => {
    const tokenQueue = new TokenQueue(StorageType.Redis);
    expect(RedisDequeueSet).toHaveBeenCalledTimes(1);
    expect(tokenQueue.dequeueSet).toBeInstanceOf(RedisDequeueSet);
  });

  it('should throw an error for unknown storage type', () => {
    expect(() => {
      new TokenQueue('invalid_type' as StorageType);
    }).toThrow('Unknown TokenQueue initialization type');
  });

  describe('addToken', () => {
    it('should add a token to the queue', () => {
      const tokenQueue = new TokenQueue(StorageType.InMemory);
      const mockEnqueue = jest.spyOn(tokenQueue.dequeueSet, 'enqueue');

      tokenQueue.addToken('token123');

      expect(mockEnqueue).toHaveBeenCalledWith('token123');
    });
  });

  describe('getToken', () => {
    it('should get the next token without removing it', () => {
      const tokenQueue = new TokenQueue(StorageType.InMemory);
      const mockPeek = jest.spyOn(tokenQueue.dequeueSet, 'peek');
      mockPeek.mockReturnValue('token123');

      const result = tokenQueue.getToken();

      expect(mockPeek).toHaveBeenCalled();
      expect(result).toBe('token123');
    });
  });

  describe('removeToken', () => {
    it('should remove a token from the queue', () => {
      const tokenQueue = new TokenQueue(StorageType.InMemory);
      const mockRemove = jest.spyOn(tokenQueue.dequeueSet, 'remove');

      tokenQueue.removeToken('token123');

      expect(mockRemove).toHaveBeenCalledWith('token123');
    });
  });

  describe('sendToBack', () => {
    it('should send a token to the back of the queue', () => {
      const tokenQueue = new TokenQueue(StorageType.InMemory);
      const mockSendToBack = jest.spyOn(tokenQueue.dequeueSet, 'sendToBack');

      tokenQueue.sendToBack('token123');

      expect(mockSendToBack).toHaveBeenCalledWith('token123');
    });
  });
});
