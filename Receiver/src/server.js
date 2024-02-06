import * as Consumer from "./redpanda/consumer.js"

async function start() {

    console.log("Connecting...")
    Consumer.connexion().catch(e => console.error(`[example/consumer] ${e.message}`, e))

}

start()