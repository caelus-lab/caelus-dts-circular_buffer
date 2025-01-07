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

## Usage
```ts
import CircularBuffer from '@caelus-dts/circular-buffer';

// Create a new CircularBuffer with a capacity of 5
const buffer = new CircularBuffer<number>(5);

// Write values to the buffer
buffer.write(1);
buffer.write(2);
buffer.writeAll([3, 4, 5]);

// Read values from the buffer
console.log(buffer.read()); // Output: 1
console.log(buffer.read()); // Output: 2

// Check buffer status
console.log(buffer.isEmpty);   // Output: false
console.log(buffer.isFull);    // Output: true
console.log(buffer.capacity);  // Output: 5
console.log(buffer.size);     // Output: 5

// Convert buffer to array
const array = buffer.toArray(); // array = [1, 2, 3, 4, 5]. buffer is not modified
const array2 = buffer.toArray(true); // array2 = [1, 2, 3, 4, 5], buffer is cleared
console.log(buffer.isEmpty); // Output: true

// Or Clear the buffer using .clear()
buffer.clear();
console.log(buffer.isEmpty); // Output: true



// Create a CircularBuffer from an iterable
const bufferFromArray = CircularBuffer.from([6, 7, 8, 9, 10], 3, { overwrite: true });
console.log(bufferFromArray.toArray()) // Output: [8, 9, 10]


// Dumping elements from the buffer
const dumped = bufferFromArray.dump();
console.log(dumped); // 8
console.log(bufferFromArray.toArray()) // Output: [9, 10, undefined]

// Resizing the buffer
bufferFromArray.resize(8);
console.log(bufferFromArray.capacity); // 8


```

## Configuration

The `CircularBuffer` constructor accepts an optional configuration object (`CBConfig`) with the following properties:

* `overwrite` (default: `false`): If `true`, when the buffer is full, writing new values will overwrite the oldest values. If `false`, writing new values when the buffer is full has no effect, and a warning is printed to the console if `warnOnFull` is `true`.

* `warnOnFull` (default: `true`): If `true`, a warning message will be printed to the console when attempting to write to a full buffer when the overwrite option is set to false.  This has no effect if `overwrite` is `true`.

* `notifyOnOverwrite` (default: `false`): If `true`, and if the `overwrite` option is also `false `, a warning will be logged to the console whenever a value is overwritten.


## Error Handling

If you attempt to resize the buffer to a smaller capacity without setting the `force` parameter to `true` in the `resize` method, a `BufferNewCapacityIsSmallerError` (BNCIS) will be thrown.


## API Reference

### Constructor

```ts
new CircularBuffer<T>(capacity: number, config?: CBConfig);
```


*   `capacity`: The maximum number of elements the buffer can hold.
*   `config`:  Optional configuration object (see Configuration section above).

### Methods
*   **`capacity`**: Returns the buffer's capacity.
*   **`clear()`**: Clears the buffer.
*   **`dump()`**: Removes and returns the next value from the buffer.
*   **`from<O>(values: Iterable<O>, capacity: number, config?: CBConfig)`**: Static method creating a circular buffer from iterable values.
*   **`isFull`**: Returns `true` if the buffer is full, `false` otherwise.
*   **`isEmpty`**: Returns `true` if the buffer is empty, `false` otherwise.
*   **`read()`**: Reads and returns the next value from the buffer. Returns `undefined` if the buffer is empty.
*   **`resize(newCapacity: number, force?: boolean)`**: Resizes the buffer.
*   **`size`**: Returns the current number of elements in the buffer.
*   **`toArray(clear?: boolean)`**: Converts the buffer to an array.
*   **`write(value: T)`**: Writes a value to the buffer.
*   **`writeAll(values: Iterable<T>)`**: Writes multiple values to the buffer from an iterable.

## Iterating

`CircularBuffer` extends `IterableElement`, making it iterable. You can use for...of loops to iterate over the elements:

```typescript
for (const value of buffer) {
    console.log(value);
}
```

## Contributing Guidelines

Contributions are welcome! Please fork the repository and submit a pull request.

## License Information

[MIT License](LICENSE)