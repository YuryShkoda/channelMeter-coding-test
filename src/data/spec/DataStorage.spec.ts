import * as utils from '../../utils/eventSource'
import { dataStorage } from '../../app'
import { MessageEvent, DataItem } from '../../types'
import { getMockedDataItem, stopServerAndDataStorage } from '../../spec/utils'

const mockedESreturnValue = {
  CLOSED: 0,
  CONNECTING: 0,
  OPEN: 0,
  dispatchEvent(event: Event): boolean {
    return false
  },
  onerror: jest.fn(),
  onmessage: jest.fn(),
  onopen: jest.fn(),
  readyState: 0,
  url: '',
  withCredentials: false,
  addEventListener(
    type: any,
    listener: any,
    options?: boolean | AddEventListenerOptions
  ): void {},
  close(): void {},
  removeEventListener(
    type: any,
    listener: any,
    options?: boolean | EventListenerOptions
  ): void {}
}

const getEventSourceSpy = jest.spyOn(utils, 'getEventSource')
getEventSourceSpy.mockReturnValue(mockedESreturnValue)

describe('DataStorage', () => {
  const dataStoragePrototype = Object.getPrototypeOf(dataStorage)
  const mockedData: DataItem = getMockedDataItem()
  const mockedEvent: MessageEvent = {
    type: dataStoragePrototype.sourceEvent,
    data: JSON.stringify(mockedData),
    lastEventId: '',
    origin: dataStoragePrototype.eventUrl
  }

  afterAll(() => {
    stopServerAndDataStorage()
  })

  it(`should handle 'score' event from event source`, () => {
    dataStoragePrototype.eventSourceEventHandler(mockedEvent)

    const itemsInStorage = dataStorage.getItems()

    expect(itemsInStorage.length).toEqual(1)
    expect(itemsInStorage[0]).toEqual(mockedData)
  })

  it(`should log error if 'score' event sent not valid data`, () => {
    let loggedError = ''

    jest.spyOn(process.logger, 'error').mockImplementation((info: object) => {
      loggedError = `${info}`

      return {} as any
    })

    const eventWithNotValidData = { ...mockedEvent }
    eventWithNotValidData.data = mockedEvent.data + 'NOT VALID'

    let expectedError = `Error while parsing data from event source. Event: ${JSON.stringify(
      eventWithNotValidData,
      null,
      2
    )}\nError: `

    try {
      JSON.parse(eventWithNotValidData.data)
    } catch (error: any) {
      expectedError += `"${error.message}"`
    }

    dataStoragePrototype.eventSourceEventHandler(eventWithNotValidData)

    expect(loggedError).toEqual(expectedError)
  })

  it('should add new item to the begging of the storage and delete the last item if storage limit is reached', () => {
    const testLimit = 3

    dataStoragePrototype.setLimit(testLimit)

    dataStorage.addItem(mockedData)

    for (let i = 0; i < testLimit; i++) {
      dataStorage.addItem(getMockedDataItem())
    }

    const itemsInStorage = dataStorage.getItems()

    expect(itemsInStorage.length).toEqual(testLimit)
    expect(
      itemsInStorage.find((item) => item.studentId === mockedData.studentId)
    ).toEqual(undefined)
  })
})
