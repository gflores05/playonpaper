export class IdentifiableMap<T extends { id: T['id'] }> extends Map<
  T['id'],
  T
> {
  constructor(items: T[]) {
    super(items.map((item) => [item.id, item]))
  }

  map<R>(func: (obj: T) => R) {
    const result: R[] = []
    for (const val of this.values()) {
      result.push(func(val))
    }
    return result
  }

  private recreate() {
    return new IdentifiableMap(Array.from(this.values()))
  }

  update(item: Partial<T>) {
    if (!item.id) {
      throw Error('Id is required to update the item')
    }

    const current = this.get(item.id)

    if (!current) {
      return this
    }

    this.set(item.id, { ...current, ...item })

    return this.recreate()
  }

  remove(id: T['id']) {
    this.remove(id)

    return this.recreate()
  }
}
