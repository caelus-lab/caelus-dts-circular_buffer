import CircularBuffer from "../index.ts";
import * as console from "node:console";

describe('CircularBuffer Test', () => {
    let cBuffer = new CircularBuffer<number>(3);
    beforeEach(() => {
        cBuffer.clear();
    })
    test('should initialize the class without error', () => {
        expect(cBuffer).toBeDefined();
    })
    test('should be empty initially', () => {
        expect(cBuffer.isEmpty).toBeTruthy();
        expect(cBuffer.isFull).toBeFalsy();
    });
    test('should be full after writing elements', () => {
        cBuffer.writeAll([1, 2, 3]);
        expect(cBuffer.isEmpty).toBeFalsy();
        expect(cBuffer.isFull).toBeTruthy();
    });
    test('should clear the buffer', () => {
        cBuffer.writeAll([1, 2, 3])
        cBuffer.clear()
        expect(cBuffer.size).toBe(0);
        expect(cBuffer.isEmpty).toBeTruthy();
        expect(cBuffer.isFull).toBeFalsy();
    })
    test('should write values', () => {
        const consoleSpy = jest.spyOn(console, 'warn');
        cBuffer.writeAll([1, 2, 3, 4, 5])
        expect(cBuffer.size).toBe(3);
        expect(cBuffer.toArray()).toEqual(expect.arrayContaining([1, 2, 3]));
        expect(consoleSpy).toHaveBeenCalledWith('Buffer is full. Data is being ignored. Consider increasing buffer size or enabling overwrite.');
    })
    test('should write values and overwrite existing data', () => {
        cBuffer = new CircularBuffer(3, {overwrite: true})
        cBuffer.writeAll([1, 2, 3, 4, 5])
        expect(cBuffer.size).toBe(3);
        expect(cBuffer.toArray()).toEqual(expect.arrayContaining([4, 5, 3]));
    })
    test('should wrap-around the read values', () => {
        cBuffer.writeAll([1, 2, 3])
        expect(cBuffer.read()).toEqual(1);
        expect(cBuffer.read()).toEqual(2);
        expect(cBuffer.read()).toEqual(3);
        expect(cBuffer.read()).toEqual(1);
    })
    test('should wrap-around and dump values', () => {
        cBuffer.writeAll([1, 2, 3])
        expect(cBuffer.dump()).toEqual(1);
        expect(cBuffer.dump()).toEqual(2);
        expect(cBuffer.dump()).toEqual(3);
        expect(cBuffer.dump()).toEqual(undefined);
        expect(cBuffer.size).toBe(0)
    })
    test('should support toArray', () => {
        cBuffer.writeAll([1, 2, 3])
        expect(cBuffer.toArray()).toEqual(expect.arrayContaining([1, 2, 3]));
    })
    test('should resize the buffer', () => {
        cBuffer.writeAll([1, 2, 3])
        expect(cBuffer.capacity).toBe(3);
        cBuffer.resize(5)
        expect(cBuffer.capacity).toBe(5);
        expect(cBuffer.toArray()).toEqual(expect.arrayContaining([1, 2, 3]));
        cBuffer.writeAll([4, 5])
        expect(cBuffer.toArray()).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
    })
    test('should create a CircularBuffer using a static function', () => {
        const buffer = CircularBuffer.from([1, 2, 3], 3)
        expect(buffer.capacity).toBe(3);
        expect(buffer.toArray()).toEqual(expect.arrayContaining([1, 2, 3]));
    })
})