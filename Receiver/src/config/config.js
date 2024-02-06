import 'dotenv/config'

export const getLocalBroker = () => {
    return process.env.HOST_IP !== ""
}
