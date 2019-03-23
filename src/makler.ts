// Handler
type Handler = (context: any) => void
type Subscriber = (data: any, path: Array<string>) => void

// Unsubscriber
type Unsubscriber = () => void

// Broker
type Broker = {
  handlers: Set<Handler>
  buffer: Array<any>
  bufferSize: number
  path: Array<string>
}

// Create a broker
export const create = (bufferSize: number = 0): Broker => ({
  handlers: new Set(),
  buffer: [],
  bufferSize,
  path: []
})

// Create a channel from broker
export const topic = (broker: Broker, path: Array<string>): Broker => ({
  ...broker,
  path: [...broker.path, ...path]
})

// Publish
export const publish = (broker: Broker, data: any): void => {
  // Load the data
  const { path, buffer, bufferSize, handlers } = broker

  // Setup the context
  const context = [data, path]

  // Send the data to all handlers
  handlers.forEach((handler: Handler) => {
    handler(context)
  })

  // Buffer the data when we have a buffered bus
  if (bufferSize > 0) {
    // Push the data at the end of the buffer
    buffer.push(context)

    // Remove the oldest data if we exceed the buffer size
    if (buffer.length > bufferSize) {
      buffer.shift()
    }
  }
}

// Subscribe
export const subscribe = (broker: Broker, subscriber: Subscriber): Unsubscriber => {
  // Load data from the broker
  const { handlers, buffer, path } = broker

  // Create a handler out of the subscriber
  const handler = ([data, topic]: [any, Array<string>]): void => {
    if (path.every((v, k) => v === topic[k])) {
      return subscriber(data, topic.slice(path.length))
    }
  }

  // Attach the handler
  handlers.add(handler)

  // Send the bufferedd data
  buffer.forEach(handler)

  // Return an unsubscriber
  return () => {
    handlers.delete(handler)
  }
}
