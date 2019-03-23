import { create, topic, subscribe, publish } from '../src/makler'

// Convert
describe('Makler', () => {
  // Dummy data
  const data = { test: true }

  // Test simple string
  test('When publishing all subscription should be triggered', () => {
    // Setup a channel
    const broker = create()

    // On event trigger a jest fn
    const onEvent1 = jest.fn()
    const onEvent2 = jest.fn()

    // Subscribe and publish
    subscribe(broker, onEvent1)
    subscribe(broker, onEvent2)
    publish(broker, data)

    // Test if the event function has been called
    expect(onEvent1).toHaveBeenCalled()
    expect(onEvent2).toHaveBeenCalled()
  })

  // Test data
  test('When subsrciber is called the data is passed correctly', () => {
    // Setup a channel
    const broker = create()

    // Subscribe and publish
    subscribe(broker, context => {
      expect(context).toEqual(data)
    })
    publish(broker, data)
  })

  // Test event
  test('Topic is passed correctly when matching on different channels', () => {
    // Setup a channel
    const broker = create()
    const chan = topic(broker, ['topic'])

    // Subscribe and publish
    subscribe(broker, (context, subject) => {
      expect(subject).toEqual(['topic'])
    })
    publish(chan, data)
  })

  // Test event
  test('Topic is empty when subscribing on the same channel', () => {
    // Setup a channel
    const broker = create()
    const chan = topic(broker, ['topic'])

    // Subscribe and publish
    subscribe(chan, (context, subject) => {
      expect(subject).toEqual([])
    })
    publish(chan, data)
  })

  // Test event
  test('Unsubscribing should remove subscribers from future dispatches', () => {
    // Setup a channel
    const broker = create()

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Subscribe and publish
    const unsubscribe = subscribe(broker, onEvent)

    // Unsubscribe
    unsubscribe()

    // Publish
    publish(broker, data)

    // Test if the event function has been called
    expect(onEvent).not.toHaveBeenCalled()
  })

  // Test event
  test('Subscribers on same topic are all called when topic receives an event', () => {
    // Setup a channel
    const broker = create()
    const chan1 = topic(broker, ['topic'])
    const chan2 = topic(broker, ['topic'])

    const onEvent1 = jest.fn()
    const onEvent2 = jest.fn()

    // Subscribe and publish
    subscribe(chan1, onEvent1)
    subscribe(chan2, onEvent2)
    publish(chan2, data)

    expect(onEvent1).toHaveBeenCalled()
    expect(onEvent2).toHaveBeenCalled()
  })

  // Test event
  test('Subscribers on different topic are not called when another topic receives an event', () => {
    // Setup a channel
    const broker = create()
    const chan1 = topic(broker, ['topic1'])
    const chan2 = topic(broker, ['topic2'])

    const onEvent1 = jest.fn()
    const onEvent2 = jest.fn()

    // Subscribe and publish
    subscribe(chan1, onEvent1)
    subscribe(chan2, onEvent2)
    publish(chan1, data)

    expect(onEvent1).toHaveBeenCalled()
    expect(onEvent2).not.toHaveBeenCalled()
  })

  // Test event
  test('Channels can be nested and the parent gets the events', () => {
    // Setup a channel
    const broker = create()
    const chan = topic(broker, ['topic'])
    const subchan = topic(chan, ['subtopic'])

    const onEvent = jest.fn()

    // Subscribe and publish
    subscribe(chan, onEvent)
    publish(subchan, data)

    expect(onEvent).toHaveBeenCalled()
  })

  // Test event
  test('When subscribing the buffered data is sent', () => {
    // Setup the bus
    const broker = create(2)

    // On event trigger a jest fn
    const onEvent = jest.fn()

    // Dummy data
    const data1 = { test: 'test1' }
    const data2 = { test: 'test2' }
    const data3 = { test: 'test3' }

    // Publish data before subscriptions
    publish(broker, data1)
    publish(broker, data2)
    publish(broker, data3)

    // Subscribe and see if we get the data
    subscribe(broker, onEvent)

    // Test if the event function has been called
    expect(onEvent).toHaveBeenCalledTimes(2)
  })
})
