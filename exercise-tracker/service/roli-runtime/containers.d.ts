export declare class Stack<T> {
    private storage: T[];
    constructor(capacity: number);
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
}