import { DataItem, MessageEvent } from '../types'
import { getEventSource } from '../utils'
import { dataStorage } from '../app'

export const setupDataStorage = () => new DataStorage()

export class DataStorage {
  private storage: DataItem[] = []
  private eventUrl: string = 'http://live-test-scores.herokuapp.com/scores'
  private sourceEvent: string = 'score'
  private eventSource: EventSource
  public limit = 10000 // INFO: The limit is used to prevent the process running out of memory. Remove the limit if you understand the risk.

  constructor() {
    this.eventSource = getEventSource(this.eventUrl)

    this.eventSource.addEventListener(
      this.sourceEvent,
      this.eventSourceEventHandler
    )
  }

  private eventSourceEventHandler(event: MessageEvent) {
    if (event.data) {
      try {
        const data = JSON.parse(event.data)

        dataStorage.addItem(data)
      } catch (error: any) {
        process.logger.error(
          `Error while parsing data from event source. Event: ${JSON.stringify(
            event,
            null,
            2
          )}\nError: ${JSON.stringify(error.message, null, 2)}`
        )
      }
    }
  }

  private setLimit(limit: number) {
    dataStorage.limit = limit
  }

  public addItem(item: DataItem) {
    // INFO: remove the last element from the storage and add new item as the first element of the storage to prevent running out of memory.
    if (this.storage.length >= this.limit) this.storage.pop()

    this.storage = [item, ...this.storage]
  }

  public getItems() {
    return this.storage
  }

  public closeEventSource() {
    this.eventSource.close()
  }
}
