import {Kafka} from "kafkajs"
import {getLocalBroker} from "../config/config.js";

const isLocalBroker = getLocalBroker()

const redpanda = new Kafka({
    brokers: [
        isLocalBroker ? `${process.env.HOST_IP}:9092` : 'redpanda-0:9092',
        'localhost:19092'],
})

const consumer = redpanda.consumer({ groupId: 'group' })

const topic = process.env.TOPIC;
export const connexion = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: false })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let json = await JSON.parse(message.value)
            console.log(`[${convertTS(message.timestamp)}] ${json.user} : ${json.message}`)
        },
    })
}

const convertTS = (ts) => {
    let date = new Date(Number.parseInt(ts));
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`
}