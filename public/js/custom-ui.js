import { io } from "/js/socket.io.min.js"

// Replace this url with your own server address
const socket = io('http://localhost:3000')
const triggers = {
    lights: {
        leftHeadlight: document.querySelector('button.leftHeadlight'),
        rightHeadlight: document.querySelector('button.rightHeadlight'),
        leftFrontSignal: document.querySelector('button.leftFrontSignal'),
        rightFrontSignal: document.querySelector('button.rightFrontSignal'),
        leftBacklight: document.querySelector('button.leftBacklight'),
        rightBacklight: document.querySelector('button.rightBacklight'),
        leftRearSignal: document.querySelector('button.leftRearSignal'),
        rightRearSignal: document.querySelector('button.rightRearSignal'),
        leftRearBrake: document.querySelector('button.leftRearBrake'),
        rightRearBrake: document.querySelector('button.rightRearBrake'),
    },
    security: {
        running: document.querySelector('button.running'),
        leftDoor: document.querySelector('button.leftDoor'),
        rightDoor: document.querySelector('button.rightDoor'),
        leftSafetyBelt: document.querySelector('button.leftSafetyBelt'),
        rightSafetyBelt: document.querySelector('button.rightSafetyBelt'),
        leftDoorLock: document.querySelector('button.leftDoorLock'),
        rightDoorLock: document.querySelector('button.rightDoorLock'),
        trunk: document.querySelector('button.trunk'),
        wiper: document.querySelector('button.wiper'),
    },
    timer: {
        speed: {
            elem: document.querySelector('.speed span'),
            min: 0,
            max: 240,
        },
        leftSpeed: {
            elem: document.querySelector('.leftSpeed span'),
            min: 0,
            max: 240,
        },
        rightSpeed: {
            elem: document.querySelector('.rightSpeed span'),
            min: 0,
            max: 240,
        },
        temperature: {
            elem: document.querySelector('.temperature span'),
            min: 0,
            max: 90,
        },
        battery: {
            elem: document.querySelector('.battery span'),
            min: 0,
            max: 100,
        },
        compass: {
            elem: document.querySelector('.compass span'),
            min: -180,
            max: 180,
        },
    },
}
let values = {
    lights: {
        leftHeadlight: 0,
        rightHeadlight: 0,
        leftFrontSignal: 0,
        rightFrontSignal: 0,
        leftBacklight: 0,
        rightBacklight: 0,
        leftRearSignal: 0,
        rightRearSignal: 0,
        leftRearBrake: 0,
        rightRearBrake: 0,
    },
    security: {
        running: 0,
        leftDoor: 0,
        rightDoor: 0,
        leftSafetyBelt: 0,
        rightSafetyBelt: 0,
        leftDoorLock: 0,
        rightDoorLock: 0,
        trunk: 0,
        wiper: 0,
    },
    timer: {
        speed: 0,
        leftSpeed: 0,
        rightSpeed: 0,
        temperature: 0,
        battery: 0,
        compass: 0,
    },
}

const map = (value, min, max, nmin, nmax) => {
    let l1 = max - min
    let l2 = nmax - nmin
    let ratio = l2 / l1

    return (value - min) * ratio + nmin
}

socket.on('connect', () => {
    console.log(socket.id)
    socket.emit('assign', 'sender')
})

for (const [key, button] of Object.entries(triggers.lights)) {
    button.addEventListener('click', () => {
        values.lights[key] = values.lights[key] === 0 ? 1 : 0

        if (values.lights[key]) button.classList.add('active')
        else button.classList.remove('active')

        socket.emit('update stats', 'L', values.lights)
    })
}

for (const [key, button] of Object.entries(triggers.security)) {
    button.addEventListener('click', () => {
        values.security[key] = values.security[key] === 0 ? 1 : 0

        if (values.security[key]) button.classList.add('active')
        else button.classList.remove('active')

        socket.emit('update stats', 'S', values.security)
    })
}

setInterval(() => {
    if (values.security.running) {
        for (const [key, value] of Object.entries(triggers.timer)) {
            const random = map(Math.random(), 0, 1, value.min, value.max)
            values.timer[key] = random

            value.elem.innerText = Math.floor(random)
        }

        socket.emit('update stats', 'T', values.timer)
    }
}, 300)