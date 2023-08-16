import InMemoryDequeueSet from '../src/dequeueset/InMemoryDequeueSet';

describe('InMemoryDequeueSet', () => {
  let dequeueSet: InMemoryDequeueSet;

  beforeEach(() => {
    dequeueSet = new InMemoryDequeueSet();
  });

  it('should enqueue items', () => {
    dequeueSet.enqueue('item1');
    expect(dequeueSet.queue).toEqual(['item1']);
  });

  it('should not enqueue duplicate items', () => {
    dequeueSet.enqueue('item1');
    dequeueSet.enqueue('item1');
    expect(dequeueSet.queue).toEqual(['item1']);
  });

  it('should dequeue items', () => {
    dequeueSet.enqueue('item1');
    const item = dequeueSet.dequeue();
    expect(item).toBe('item1');
    expect(dequeueSet.queue).toEqual([]);
  });

  it('should return null when dequeueing from an empty set', () => {
    const item = dequeueSet.dequeue();
    expect(item).toBeNull();
  });

  it('should peek at the front item', () => {
    dequeueSet.enqueue('item1');
    dequeueSet.enqueue('item2');
    const item = dequeueSet.peek();
    expect(item).toBe('item1');
    expect(dequeueSet.queue).toEqual(['item1', 'item2']);
  });

  it('should return null when peeking at an empty set', () => {
    const item = dequeueSet.peek();
    expect(item).toBeNull();
  });

  it('should remove items', () => {
    dequeueSet.enqueue('item1');
    dequeueSet.enqueue('item2');
    dequeueSet.remove('item1');
    expect(dequeueSet.queue).toEqual(['item2']);
  });

  it('should send an item to the back', () => {
    dequeueSet.enqueue('item1');
    dequeueSet.enqueue('item2');
    dequeueSet.sendToBack('item1');
    expect(dequeueSet.queue).toEqual(['item2', 'item1']);
  });

  it('should correctly check if the set is empty', () => {
    expect(dequeueSet.isEmpty()).toBe(true);
    dequeueSet.enqueue('item1');
    expect(dequeueSet.isEmpty()).toBe(false);
  });
});
