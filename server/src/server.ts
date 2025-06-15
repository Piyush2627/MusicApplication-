import app from './app'
import config from './config'
import connectionDb from './db/connection'

const PORT = config.port

connectionDb(process.env.MONGODB_URI!)

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${config.nodeEnv} mode`)
  })
  .on('error', (err) => {
    console.error('Server failed to start:', err)
    process.exit(1)
  })
