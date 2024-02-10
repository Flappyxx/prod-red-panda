import {Kafka} from "kafkajs"
import {createClient} from 'redis'
import {getLocalBroker,getTopic,redisOptions} from "../config/config.js";

const isLocalBroker = getLocalBroker()

const client = await createClient(redisOptions)
    .on('error', err => console.log('Redis Client Error', err))
    .connect()


const redpanda = new Kafka({
    brokers: [
        isLocalBroker ? `${process.env.HOST_IP}:9092` : 'redpanda-0:9092',
        'localhost:19092'],
})

const consumer = redpanda.consumer({ groupId: 'group' })

const topic = getTopic();
export const connexion = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: false })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let json = await JSON.parse(message.value)
            let words = json.message.split(" ")
            words.forEach((word)=>{
                client.incr(word)
            })
        },
    })
}

const convertTS = (ts) => {
    let date = new Date(Number.parseInt(ts));
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}`
}