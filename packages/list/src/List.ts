import { ContainerIterator } from '@dsilb/shared';

class ListNode<T> {
  next: ListNode<T> | null = null;
  prev: ListNode<T> | null = null;
  constructor(public value: T) {}
}

export class List<T> extends ContainerIterator<number, T> {
  protected _head: ListNode<T> | null = null;
  protected _tail: ListNode<T> | null = null;
  private _size = 0;

  constructor(iterable?: Iterable<T>) {
    super();
    if (iterable) for (const value of iterable) this.push(value);
  }

  get size() {
    return this._size;
  }

  get isEmpty() {
    return this._size === 0;
  }

  get head() {
    return this._head?.value;
  }

  get tail() {
    return this._tail?.value;
  }

  push(value: T) {
    const node = new ListNode(value);
    if (!this._head || !this._tail) {
      this._tail = this._head = node;
    } else {
      this._tail.next = node;
      node.prev = this._tail;
      this._tail = node;
    }
    this._size++;
  }

  unshift(value: T) {
    const node = new ListNode(value);
    if (!this._head || !this._tail) {
      this._tail = this._head = node;
    } else {
      this._head.prev = node;
      node.next = this._head;
      this._head = node;
    }
    this._size++;
  }

  shift() {
    if (!this._head) return;
    const head = this._head;
    if (!head.next) this._head = this._tail = null;
    else (head.next.prev = null), (this._head = head.next);
    this._size--;
    return head.value;
  }

  pop() {
    if (!this._tail) return;
    const tail = this._tail;
    if (!tail.prev) this._tail = this._head = null;
    else (tail.prev.next = null), (this._tail = tail.prev);
    this._size--;
    return tail.value;
  }

  indexOf(value: T) {
    let current = this._tail;
    let i = this._size;
    while (--i >= 0) {
      if (current && current.value === value) break;
      current = current?.prev ?? null;
    }
    return i;
  }

  at(index: number) {
    const node = this._findNode(index);
    return node?.value;
  }

  removeAt(index: number) {
    const node = this._findNode(index);
    if (!node) return;
    if (node === this._tail) return this.pop();
    if (node === this._head) return this.shift();
    const prev = node.prev!,
      next = node.next!;
    prev.next = next;
    next.prev = prev;
    this._size--;
    return node.value;
  }

  clear() {
    this._head = this._tail = null;
    this._size = 0;
  }

  forEach(callback: (value: T, index: number) => void) {
    let current = this._head;
    let i = 0;
    if (current) callback(current.value, i++), (current = current.next);
  }

  private _findNode(index: number) {
    if (index < 0) index = this._size - (index % this._size);
    else if (index >= this._size) return null;
    let current = this._tail;
    let i = this._size;
    while (--i >= 0) {
      if (i === index) return current;
      current = current?.prev ?? null;
    }
    return null;
  }
}
