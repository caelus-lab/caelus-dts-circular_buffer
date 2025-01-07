import {IterableElement} from "@caelus-dts/iterable";
import * as console from "node:console";

export interface CBConfig {
    /**
     * Overwrite the buffer's old data if it reaches full capacity.
     * @default false
     */
    overwrite?: boolean;
    /**
     * If the buffer is full and a write operation is called, print a warning message in the console and ignore writing to the buffer.
     *
     * * **Note:** This feature only takes action if the buffer's overwrite option is set to `false`.
     *
     * @default true
     */
    warnOnFull?: boolean;
    /**
     * Determines whether a notification should be triggered when an existing value is overwritten.
     *
     * * **Note:** This feature only takes action if the buffer's overwrite option is set to `true`.
     *
     * @default false
     */
    notifyOnOverwrite?: boolean;
}


/**
 * Represents a generic circular buffer that efficiently manages data in a fixed-size buffer
 */
export default class CircularBuffer<T> extends IterableElement<T> {
    private readonly config: Required<CBConfig>;
    private bufferState: CBState<T>;

    /**
     * Creates an instance of the class with a specified buffer capacity and configuration options.
     *
     * @param capacity - The maximum number of elements the buffer can hold.
     * @param [config={}] - Configuration options for the buffer.
     * @param [config.overwrite=false] - Determines if the buffer should overwrite old elements when full.
     * @param [config.warnOnFull=true] - Determines if a warning should be issued when the buffer becomes full
     * @param [config.notifyOnOverwrite=false] - Determines if a warning should be issued when an existing value is overwritten.
     */
    constructor(
        capacity: number,
        config: CBConfig = {},
    ) {
        super();
        this.config = {
            overwrite: config.overwrite ?? false,
            warnOnFull: config.warnOnFull ?? true,
            notifyOnOverwrite: config.notifyOnOverwrite ?? false
        };
        this.bufferState = new CBState<T>(capacity);
    }

    /**
     * Retrieves the capacity of the buffer state.
     *
     * @return The capacity of the buffer state.
     */
    public get capacity() {
        return this.bufferState.capacity;
    }

    /**
     * Determines whether the collection is empty.
     *
     * @return Returns true if the collection has no elements, otherwise false.
     */
    public get isEmpty() {
        return this.bufferState.isEmpty;
    }

    /**
     * Checks whether the buffer is full based on its size and capacity.
     *
     * @return Returns true if the current size equals the capacity, false otherwise.
     */
    public get isFull() {
        return this.bufferState.isFull;
    }

    /**
     * Gets the size of the elements' collection.
     *
     * @return The number of elements in the collection.
     */
    public get size() {
        return this.bufferState.size;
    }

    protected override get iterator() {
        let index = 0;
        return {
            next: () => {
                if (index >= this.size) return {done: true, value: undefined};
                const value = this.bufferState.readAtIndex(index);
                index++;
                return {done: false, value};
            },
            return: () => {
                index = 0;
                return {
                    done: false,
                    value: undefined,
                };
            },
        } as IterableIterator<T>;
    }

    /**
     * Creates a new CircularBuffer instance from the given iterable values and configuration parameters.
     *
     * @param values - An iterable collection of values to be inserted into the circular buffer.
     * @param capacity - The maximum capacity of the circular buffer.
     * @param [config={}] - Optional configuration options for the circular buffer.
     *
     * @return A new CircularBuffer instance containing the provided values.
     */
    static from<O>(
        values: Iterable<O>,
        capacity: number,
        config: CBConfig = {},
    ) {
        const buffer = new CircularBuffer<O>(capacity, config);
        buffer.writeAll(values);
        return buffer;
    }

    /**
     * Clears the buffer by resetting its internal state.
     *
     * @return This method does not return any value.
     */
    public clear() {
        this.bufferState.clear();
    }

    /**
     * Reads and retrieves the next value from the buffer.
     *
     * @return The next value from the buffer, or undefined if the buffer is empty.
     */
    public read() {
        if (this.isEmpty) return undefined;
        return this.bufferState.read();
    }

    /**
     * Removes and retrieves the next element from the buffer.
     *
     * @return The next element in the buffer, or `undefined` if the buffer is empty.
     */
    public dump() {
        if (this.isEmpty) return undefined;
        const value = this.bufferState.readAtIndex(this.bufferState.readIndex);
        this.bufferState.writeAtIndex(this.bufferState.readIndex, undefined as T);
        this.bufferState.elements -= 1;
        this.bufferState.incReadIndex();
        return value;
    }

    /**
     * Writes a value to the buffer.
     *
     * @param value - The value to be written to the buffer
     */
    public write(value: T) {
        if (!this.config.overwrite && this.isFull && this.config.warnOnFull) {
            console.warn("Buffer is full. Data is being ignored. Consider increasing buffer size or enabling overwrite.");
            return;
        }
        if (this.config.overwrite || this.bufferState.writeIndex < this.capacity) {
            this.bufferState.write(value);
            if (this.config.notifyOnOverwrite && this.bufferState.writeIndex === 0) console.warn("Buffer is full. Oldest data is being overwritten.");
        }
    }

    /**
     * Writes all values from the provided iterable to the intended destination.
     *
     * @param values - An iterable containing the values to be written.
     */
    public writeAll(values: Iterable<T>) {
        for (const value of values) {
            this.write(value)
        }
    }

    /**
     * Converts the elements stored in the buffer to an array.
     *
     * @param clear - If true, clears the buffer after converting its elements to an array.
     *
     * @return An array containing the elements of the buffer.
     */
    public toArray(clear = false) {
        const result = this.bufferState.toArray();
        if (clear) this.clear();
        return result;
    }

    /**
     * Resizes the internal buffer to a new capacity.
     *
     * @param newCapacity - The desired new capacity of the buffer.
     * @param [force=false] - If true, force the buffer to resize even if the new capacity is smaller than the current capacity.
     *
     * @throws {BNCIS} Throws an error if `force` is false and `newCapacity` is smaller than the current capacity.
     */
    public resize(newCapacity: number, force = false) {
        this.bufferState.resize(newCapacity, force);
    }
}

class CBState<T> {
    public buffer: T[];
    public writeIndex: number;
    public readIndex: number;
    private nElements: number;

    constructor(public capacity: number) {
        this.buffer = new Array(capacity);
        this.writeIndex = 0;
        this.readIndex = 0;
        this.nElements = 0;
    }

    public get size() {
        return this.elements;
    }

    public get elements() {
        return this.nElements
    }

    public set elements(value: number) {
        this.nElements = Math.max(0, value);
    }

    public get isEmpty() {
        return this.size === 0;
    }

    public get isFull() {
        return this.size === this.capacity;
    }

    public clear() {
        this.buffer = new Array(this.capacity);
        this.writeIndex = 0;
        this.readIndex = 0;
        this.elements = 0;
    }

    public read() {
        const value = this.readAtIndex(this.readIndex);
        this.incReadIndex();
        return value;
    }

    public write(value: T) {
        this.writeAtIndex(this.writeIndex, value);
        if (!this.isFull) this.elements += 1;
        this.incWriteIndex();
    }

    public incReadIndex() {
        this.readIndex = (this.readIndex + 1) % this.capacity;
    }

    public incWriteIndex() {
        this.writeIndex = (this.writeIndex + 1) % this.capacity;
    }

    public writeAtIndex(index: number, value: T) {
        this.buffer[index] = value;
    }

    public readAtIndex(index: number) {
        const pointer = index % this.capacity;
        return this.buffer[pointer];
    }

    public resize(newCapacity: number, force: boolean) {
        if (!force && newCapacity < this.capacity) throw new BNCIS(newCapacity, this.capacity);
        const newBuffer = new Array(newCapacity);
        const numElementsToCopy = Math.min(newCapacity, this.size);
        for (let i = 0; i < numElementsToCopy; ++i) newBuffer[i] = this.readAtIndex(i);
        this.buffer = newBuffer;
        this.capacity = newCapacity;
        this.writeIndex = numElementsToCopy;
        this.readIndex = 0;
        this.elements = numElementsToCopy;
    }

    public toArray() {
        const result: T[] = [];
        for (let i = 0; i < this.size; i++) {
            const value = this.readAtIndex(i);
            result.push(value!);
        }
        return result;
    }
}

/**
 * This class represents a specific error type thrown when there is an attempt
 * to resize a buffer to a capacity smaller than its current capacity.
 *
 * @augments Error
 * @param {number} newCapacity - The requested new capacity for the buffer.
 * @param {number} currentCapacity - The current capacity of the buffer.
 */
class BNCIS extends Error {
    override name = "BufferNewCapacityIsSmallerError";

    constructor(newCapacity: number, currentCapacity: number) {
        super(`Cannot resize buffer to a smaller capacity. New capacity: ${newCapacity}, current capacity: ${currentCapacity}`);
    }
}