// A double-ended queue set (dequeue set) is a queue-like data structure that supports insertion and deletion at both the front and the back of the queue.
// The "set" comes from the fact that it contains all unique elements

// OPERATION
// We enqueu fresh new tokens to the front of the queue
// Once exhausted or approaching exhaustion, we dequeueue the token from the front and enqueue it to the back
// This gives it time to "reload" while we use the next token in the dequeue set
// The uniqueness property is important because we don't want to use the same token twice in a row after its been exhausted

export interface DequeueSet {
	items: Record<string, boolean>;
	queue: string[];

	enqueue(item: string): void;
	dequeue(): string | null;
	peek(): string | null;
	remove(item: string): void;
	sendToBack(item: string): void;
	isEmpty(): boolean;
}