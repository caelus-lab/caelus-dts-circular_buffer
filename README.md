# CircularBuffer

A TypeScript implementation of a circular buffer, a data structure that uses a single, fixed-size buffer as if it were
connected end-to-end.

* **Circular Buffer Property:** The buffer does not automatically wrap around when it reaches its capacity. However, if
  it is configured with `overwrite: true`, it reuses empty spaces at the start as older data is overwritten.

## Installation

- using `npm`

```shell
npm install @caelus-dts/circular-buffer
```

- using `yarn`

```shell
yarn add @caelus-dts/circular-buffer
```

- using `pnpm`

```shell
pnpm add @caelus-dts/circular-buffer
```

## Usage Examples

```ts
import CircularBuffer from '@caelus-dts/circular-buffer';

// Create a buffer with capacity 3
const buffer = new CircularBuffer<number>(3);

// Write data to the buffer
buffer.write(1);
buffer.write(2);
buffer.write(3);

// Attempting to write more data overwrites old data
buffer.write(4); // This will log a warning for trying to overwrite existing data
console.log(buffer.toArray()); // Output: [1, 2, 3]

// Read data from the buffer
console.log(buffer.read()); // Output: 1
console.log(buffer.read()); // Output: 2

// Check if the buffer is empty or full
console.log(buffer.isEmpty()); // Output: false
console.log(buffer.isFull()); // Output: false

// Clear the buffer
buffer.clear();
console.log(buffer.isEmpty()); // Output: true

// Create a buffer with capacity 3 and allowed to overwrite old data
const buffer2 = new CircularBuffer<number>(3, {overwrite: true});

// Write data to the buffer
buffer2.write(1);
buffer2.write(2);
buffer2.write(3);

// Attempting to write more data overwrites old data
buffer2.write(4);
console.log(buffer2.toArray()); // Output: [4, 2, 3]

// Read data from the buffer
console.log(buffer2.read()); // Output: 4
console.log(buffer2.read()); // Output: 2
```

## API Reference

### Constructor

`new CircularBuffer<T>(capacity: number, config?: CircularBufferConfig)`
Creates a new CircularBuffer instance.

- **`capacity`**: (`number`) The maximum number of elements the buffer can hold.
- **`config`**: (optional, `CircularBufferConfig`) Configuration for buffer behavior:
    - **`overwrite`**: (`boolean`, default: `false`) Allow the buffer to overwrite older data when full.
    - **`warnOnFull`**: (`boolean`, default: `true`) Print a warning if the buffer try to overwrite older data when
      full, only if `overwrite` set `true`.
    - **`notifyOnOverwrite`**: (`boolean`, default: `false`) Print a warning older data was overwritten.

### Properties

- **`capacity`**: Returns the current capacity of the buffer.
- **`isEmpty`**: Returns `true` if the buffer is empty, `false` otherwise.
- **`isFull`**: Returns `true` if the buffer is full, `false` otherwise.
- **`size`**: Returns the current number of elements in the buffer.

### Methods

- **`write(value: Iterable<T>): void`**: Write new iterable value to the buffer. Overwrites the oldest entry if the buffer is full and
  `overwrite` is set to `true`.
- **`read(): T | undefined`**: Read without removing the next element from the buffer. Returns `undefined` if the buffer
  is empty.
- **`dump(): T | undefined`**: Removing and returns the next element from the buffer. Returns `undefined` if the buffer
  is empty.
- **`clear(): void`**: Clears all elements from the buffer, resetting it to an empty state and ready for reuse.
- **`resize(newCapacity: number, force: boolean): void`**: Changes the buffer's capacity, retaining existing elements up to the new capacity limit and removing any excess elements.
- **`toArray(): T[]`**: Returns a shallow copy of the buffer's elements as an array.
- **`from<O>(values: Iterable<O>,capacity: number, config?: CBConfig): CircularBuffer<O>`**: Creates a new CircularBuffer instance based on a specified array of elements, with optional configuration parameters.

## Contributing Guidelines

Contributions are welcome! Please fork the repository and submit a pull request.

## License Information

[MIT License](LICENSE)