const EventSource =
  process.env.NODE_ENV === 'production'
    ? require('../../eventsource/eventsource.js')
    : require('../../../eventsource/lib/eventsource.js')

export const getEventSource = (url: string) => {
  return new EventSource(url)
}
