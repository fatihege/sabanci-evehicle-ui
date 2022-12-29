const express = require('express')
const app = express()
const { createServer } = require('http')
const server = createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const bodyParser = require('body-parser')
const { SerialPort } = require('serialport')
const { autoDetect } = require('@serialport/bindings-cpp')

require('dotenv').config()

const PORT_PATH = process.env.npm_config_port
const LIST = process.env.npm_config_list

const operationTypes = {
    L: {
        type: 'binary',
        values: ['0', '1', 'x'],
        keys: [
            'leftHeadlight',
            'leftFrontSignal',
            'leftBacklight',
            'leftRearSignal',
            'leftRearBrake',
            'rightHeadlight',
            'rightFrontSignal',
            'rightBacklight',
            'rightRearSignal',
            'rightRearBrake',
        ],
    },
    S: {
        type: 'binary',
        values: ['0', '1', 'x'],
        keys: [
            'running',
            'leftDoor',
            'leftSafetyBelt',
            'leftDoorLock',
            'rightDoor',
            'rightSafetyBelt',
            'rightDoorLock',
            'trunk',
            'wiper',
        ],
    },
    T: {
        type: 'number',
        keys: [
            'speed',
            'leftSpeed',
            'rightSpeed',
            'temperature',
            'battery',
            'compass',
        ],
    },
}

const parseData = data => {
    data = data.trim()
    const opType = data[0]
    let output = {}

    if (!operationTypes[opType]) throw new Error(`Undefined operation type: ${opType}`)
    else if (!data.endsWith(';')) throw new Error(`Data could not be fully retrieved`)
    else {
        const operation = operationTypes[opType]
        data = data.slice(1, data.length - 1).trim()

        if (operation.type === 'binary') {
            data = data.split('')
        } else if (operation.type === 'number') {
            data = data.split(',')
        } else throw new Error(`Undefined operation data type: ${operation.type}`)

        if (data.length !== operation.keys.length)
            throw new Error(`Pattern and input not matches. Searching for ${operation.keys.length}, given ${data.length}`)

        operation.keys.map((v, k) => {
            if (operation.type === 'binary') output[v] = data[k]
            else if (operation.type === 'number') output[v] = data[k].trim() === 'x' ? 'x' : parseFloat(data[k])
        })
    }

    return { key: opType, output }
}

let uiViewer = null
let dataSender = null

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

if (LIST || PORT_PATH) {
    (async () => {
        if (LIST) {
            const Binding = autoDetect()
            console.log(await Binding.list())
        } else {
            const Binding = autoDetect()
            const foundPort = (await Binding.list()).find((p) => p.path === PORT_PATH.trim())

            if (!foundPort) throw new Error(`Port not found: ${PORT_PATH}`)
            else {
                const port = new SerialPort({
                    path: foundPort.path,
                    baudRate: 9600,
                    autoOpen: false,
                })

                port.open((e) => {
                    if (e) throw new Error(`An error occurred while opening port ${foundPort.path}: ${e.message}`)
                })

                port.on('open', () => {
                    console.log(`Port opened: ${foundPort.path}`)
                })

                port.on('data', (data) => {
                    data = String(data)
                    if (data && data.length) {
                        const { key: opType, output: parsedData } = parseData(data)
                        if (uiViewer) io.emit('update', opType, parsedData)
                    }
                })
            }
        }
    })()
}

app.post('/update', (req, res) => {
    try {
        const { key: opType, output: parsedData } = parseData(req.body.data)
        if (uiViewer) io.emit('update', opType, parsedData)
        res.send({ status: 1 })
    } catch (e) {
        console.error(`An error occurred while parsing data: ${e.message}`)
        res.send({ status: 0, error: e.message })
    }
})

app.get('/custom-ui', (req, res) => {
    res.sendFile(`${__dirname}/views/custom-ui.html`)
})

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`)
})

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.emit('set operation types', operationTypes)

    socket.on('assign', (type) => {
        if (type === 'ui') uiViewer = socket.id
        else if (type === 'sender') dataSender = socket.id
    })

    socket.on('update stats', (type, values) => {
        if (!uiViewer) return
        socket.to(uiViewer).emit('update', type, values)
    })

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`)

        if (socket.id === uiViewer) uiViewer = null
        else if (socket.id === dataSender) dataSender = null
    })
})

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))