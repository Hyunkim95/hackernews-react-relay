import { GC_AUTH_TOKEN } from './constants'
import { SubscriptionClient } from 'subscriptions-transport-ws'

// 1
const {
  Environment,
  Network,
  RecordSource,
  Store,
} = require('relay-runtime')

// 2
const store = new Store(new RecordSource())

// 3
//1
const fetchQuery = (operation, variables) => {
  return fetch('https://api.graph.cool/relay/v1/cj7ke08ck0dy50122lo97icbw', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(GC_AUTH_TOKEN)}`
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

// 2
const setupSubscription = (config, variables, cacheConfig, observer) => {
  const query = config.text

  const subscriptionClient = new SubscriptionClient('wss://subscriptions.us-west-2.graph.cool/v1/cj7ke08ck0dy50122lo97icbww', {reconnect: true})
  subscriptionClient.subscribe({query, variables}, (error, result) => {
    observer.onNext({data: result})
  })
}

// 3
const network = Network.create(fetchQuery, setupSubscription)

// 5
const environment = new Environment({
  network,
  store,
})

// 6
export default environment