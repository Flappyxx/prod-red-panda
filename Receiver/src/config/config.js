import 'dotenv/config'

export const getLocalBroker = () => {
    return process.env.HOST_IP !== ""
}

export const getTopic = () => {
    return process.env.TOPIC
}

export const redisOptions = {
    host: "myredis",
    port: 6379,
    password : "redispwd"
}