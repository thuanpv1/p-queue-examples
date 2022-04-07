// winston-too-much-log-with-queue.js
const {default: PQueue} = require('p-queue')
const winston = require('winston')
const fs = require('fs')

const queue = new PQueue({
  concurrency: 1,
  intervalCap: 1,
  interval: 10
})

const myFormat = winston.format.printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.timestamp(),
  transports: [
    new winston.transports.File({
      filename: './some.log',
      format: myFormat
    })  
  ]
})

function mylog () {
  let random_string = Math.random().toString(36).substring(7)
  logger.info(random_string)
  console.log(random_string)
  return Promise.resolve(true)
}

for (let i =0; i < 1000; i++) {
  queue.add(mylog)
}