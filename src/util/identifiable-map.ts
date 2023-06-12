/**
 * A map of objects that have an id property, where the id is the key
 */
export class IdentifiableMap<T extends { id: T['id'] }> extends Map<
  T['id'],
  T
> {
  constructor(items: T[]) {
    super(items.map((item) => [item.id, item]))
  }

  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param func The callback
   * @returns An array that contains the results
   */
  map<R>(func: (obj: T) => R) {
    const result: R[] = []
    for (const val of this.values()) {
      result.push(func(val))
    }
    return result
  }

  /**
   * Returns a new instance of IdentifiableMap with the same items
   * @returns A new instance of IdentifiableMap
   */
  private recreate() {
    return new IdentifiableMap(Array.from(this.values()))
  }

  /**
   * Adds a new element to the map
   * @param item The item to be added
   * @returns A new instance of IdentifiableMap with the changes
   */
  add(item: T) {
    const newInstance = this.recreate()

    newInstance.set(item.id, item)

    return newInstance
  }

  /**
   * Updates an existing item
   * @param item The changes to be applied to the item
   * @returns A new instance of IdentifiableMap with the changes
   */
  update(item: Partial<T>) {
    const newInstance = this.recreate()

    if (!item.id) {
      throw Error('Id is required to update the item')
    }

    let current = this.get(item.id)

    if (!current) {
      return newInstance
    }

    newInstance.set(item.id, { ...current, ...item })

    return newInstance
  }

  /**
   * Remove an existing item
   * @param id The item id
   * @returns A new instance of IdentifiableMap with the changes
   */
  remove(id: T['id']) {
    const newInstance = this.recreate()

    newInstance.remove(id)

    return newInstance
  }
}
