import Subject from './subject'

const makeSinkProxies =
  drivers => {
    let sinkProxies = {}
    for (let name in drivers) {
      if (drivers.hasOwnProperty(name)) {
        sinkProxies[name] = Subject()
      }
    }
    return sinkProxies
  }

const callDrivers =
  (drivers, sinkProxies) => {
    let sources = {}
    for (let name in drivers) {
      if (drivers.hasOwnProperty(name)) {
        sources[name] = drivers[name](sinkProxies[name], name)
      }
    }
    return sources
  }

const replicateMany =
  (sinks, sinkProxies) =>
    setTimeout(
      () => {
        for (let name in sinks) {
          if (sinks.hasOwnProperty(name) &&
          sinkProxies.hasOwnProperty(name))
          {
            sinks[name].forEach(sinkProxies[name].push)
          }
        }
      }
      , 1
    )

const isObjectEmpty =
  obj => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }

const run =
  (main, drivers) => {
    if (typeof main !== `function`) {
      throw new Error(`First argument given to Cycle.run() must be the ` +
        `'main' function.`)
    }
    if (typeof drivers !== `object` || drivers === null) {
      throw new Error(`Second argument given to Cycle.run() must be an  ` +
        `object with driver functions as properties.`)
    }
    if (isObjectEmpty(drivers)) {
      throw new Error(`Second argument given to Cycle.run() must be an ` +
        `object with at least one driver function declared as a property.`)
    }

    let sinkProxies = makeSinkProxies(drivers)
    let sources = callDrivers(drivers, sinkProxies)
    let sinks = main(sources)
    replicateMany(sinks, sinkProxies)
    return {sinks, sources}
  }

export {run}
