import { io } from "/js/socket.io.min.js"

// Replace this url with your own server address
const socket = io('http://localhost:3000')

const elems = {
    icons: {
        signal: document.querySelector('.signal-icon'),
        leftSafetyBelt: document.querySelector('.left-safety-belt-icon'),
        rightSafetyBelt: document.querySelector('.right-safety-belt-icon'),
        trunk: document.querySelector('.trunk-icon'),
        wiper: document.querySelector('.wiper-icon'),
        leftLock: document.querySelector('.left-lock-icon'),
        rightLock: document.querySelector('.right-lock-icon'),
        leftBrake: document.querySelector('.left-brake-icon'),
        rightBrake: document.querySelector('.right-brake-icon'),
    },
    texts: {
        speed: document.querySelector('.speed-text'),
        temperature: document.querySelector('.temperature-text'),
        battery: document.querySelector('.battery-text'),
    },
    lamps: {
        leftHeadlight: document.querySelector('.left-headlight-lamp'),
        rightHeadlight: document.querySelector('.right-headlight-lamp'),
        leftSignal: document.querySelector('.left-signal-lamp'),
        rightSignal: document.querySelector('.right-signal-lamp'),
        leftBacklight: document.querySelector('.left-backlight-lamp'),
        rightBacklight: document.querySelector('.right-backlight-lamp'),
        leftRearSignal: document.querySelector('.left-back-signal-lamp'),
        rightRearSignal: document.querySelector('.right-back-signal-lamp'),
    },
    lights: {
        leftSignal: document.querySelector('.left-signal-light'),
        rightSignal: document.querySelector('.right-signal-light'),
        leftRearSignal: document.querySelector('.left-back-signal-light'),
        rightRearSignal: document.querySelector('.right-back-signal-light'),
        leftHeadlight: document.querySelector('.left-headlight'),
        rightHeadlight: document.querySelector('.right-headlight'),
        leftBacklight: document.querySelector('.left-backlight'),
        rightBacklight: document.querySelector('.right-backlight'),
    },
    indicator: {
        speed: document.querySelector('.speed-hand'),
        leftSpeed: document.querySelector('.left-speed-hand'),
        rightSpeed: document.querySelector('.right-speed-hand'),
    },
    doors: {
        left: document.querySelector('.left-door'),
        right: document.querySelector('.right-door'),
    },
    carStateCircle: document.querySelector('.car-state-circle'),
    battery: document.querySelector('.battery'),
    compass: document.querySelector('.compass'),
}
let operations = {
    L: {
        leftHeadlight: {
            light: elems.lights.leftHeadlight,
            lamp: elems.lamps.leftHeadlight,
        },
        leftFrontSignal: {
            light: elems.lights.leftSignal,
            lamp: elems.lamps.leftSignal,
        },
        leftBacklight: {
            light: elems.lights.leftBacklight,
            lamp: elems.lamps.leftBacklight,
        },
        leftRearSignal: {
            light: elems.lights.leftRearSignal,
            lamp: elems.lamps.leftRearSignal,
        },
        leftRearBrake: elems.icons.leftBrake,
        rightHeadlight: {
            light: elems.lights.rightHeadlight,
            lamp: elems.lamps.rightHeadlight,
        },
        rightFrontSignal: {
            light: elems.lights.rightSignal,
            lamp: elems.lamps.rightSignal,
        },
        rightBacklight: {
            light: elems.lights.rightBacklight,
            lamp: elems.lamps.rightBacklight,
        },
        rightRearSignal: {
            light: elems.lights.rightRearSignal,
            lamp: elems.lamps.rightRearSignal,
        },
        rightRearBrake: elems.icons.rightBrake,
    },
    S: {
        running: elems.carStateCircle,
        leftDoor: elems.doors.left,
        leftSafetyBelt: elems.icons.leftSafetyBelt,
        leftDoorLock: elems.icons.leftLock,
        rightDoor: elems.doors.right,
        rightSafetyBelt: elems.icons.rightSafetyBelt,
        rightDoorLock: elems.icons.rightLock,
        trunk: elems.icons.trunk,
        wiper: elems.icons.wiper,
    },
    T: {
        speed: {
            text: elems.texts.speed,
            indicator: elems.indicator.speed,
        },
        leftSpeed: elems.indicator.leftSpeed,
        rightSpeed: elems.indicator.rightSpeed,
        temperature: elems.texts.temperature,
        battery: {
            text: elems.texts.battery,
            indicator: elems.battery,
        },
        compass: elems.compass,
    },
}
let operationTypes = {}

const map = (value, min, max, nmin, nmax) => {
    let l1 = max - min
    let l2 = nmax - nmin
    let ratio = l2 / l1

    return (value - min) * ratio + nmin
}

const renderStats = () => {
    elems.icons.signal.classList.remove('active')
    elems.icons.leftSafetyBelt.classList.remove('active')
    elems.icons.rightSafetyBelt.classList.remove('active')
    elems.icons.trunk.classList.remove('active')
    elems.icons.wiper.classList.remove('active')

    elems.texts.speed.innerHTML = '0'
    elems.texts.temperature.innerHTML = '0'
    elems.texts.battery.innerHTML = '%100'

    elems.lamps.leftHeadlight.classList.remove('active')
    elems.lamps.rightHeadlight.classList.remove('active')
    elems.lamps.leftSignal.classList.remove('active')
    elems.lamps.rightSignal.classList.remove('active')
    elems.lamps.leftBacklight.classList.remove('active')
    elems.lamps.rightBacklight.classList.remove('active')
    elems.lamps.leftRearSignal.classList.remove('active')
    elems.lamps.rightRearSignal.classList.remove('active')

    elems.lights.leftSignal.classList.remove('active')
    elems.lights.rightSignal.classList.remove('active')
    elems.lights.leftRearSignal.classList.remove('active')
    elems.lights.rightRearSignal.classList.remove('active')

    elems.indicator.speed.style.transform = 'rotate(-120deg) translate(-3px, 0)'
    elems.indicator.speed.style.transformOrigin = '320.49px 446.408px'
    elems.indicator.leftSpeed.style.transform = 'rotate(120deg) translate(-2px, 0)'
    elems.indicator.leftSpeed.style.transformOrigin = '320.086px 446.408px'
    elems.indicator.rightSpeed.style.transform = 'rotate(-120deg) translate(-2px, 0)'
    elems.indicator.rightSpeed.style.transformOrigin = '320.086px 446.408px'

    elems.doors.left.style.transform = 'rotate(0)'
    elems.doors.left.style.transformOrigin = '820px 379px'
    elems.doors.right.style.transform = 'rotate(0)'
    elems.doors.right.style.transformOrigin = '1100px 378px'

    elems.carStateCircle.classList.add('active')
    elems.battery.style.transform = 'scaleX(1)'
    elems.battery.style.transformOrigin = '1307px'
    elems.compass.style.transform = 'rotate(0deg) translate(-72.12px, 72.12px)'
    elems.compass.style.transformOrigin = '1536.1px 314.124px'
}

const updateStats = (type, data) => {
    if (type === 'L') {
        for (const [k, v] of Object.entries(data)) {
            if (v === 'x') continue

            if (v == 1) {
                if (typeof operations.L[k] !== 'object') operations.L[k].classList.add('active')
                else {
                    operations.L[k].light.classList.add('active')
                    operations.L[k].lamp.classList.add('active')
                }
            }
            else {
                if (typeof operations.L[k] !== 'object') operations.L[k].classList.remove('active')
                else {
                    operations.L[k].light.classList.remove('active')
                    operations.L[k].lamp.classList.remove('active')
                }
            }
        }
    } else if (type === 'S') {
        for (const [k, v] of Object.entries(data)) {
            if (v === 'x') continue

            if (v == 1) {
                if (k === 'running') operations.S[k].classList.remove('active')
                else operations.S[k].classList.add('active')
            } else {
                if (k === 'running') operations.S[k].classList.add('active')
                else operations.S[k].classList.remove('active')
            }
        }
    } else if (type === 'T') {
        for (let [k, v] of Object.entries(data)) {
            if (v === 'x') continue
            v = parseFloat(v)

            if (k === 'speed') {
                const speed = map(Math.max(Math.min(v, 240), 0), 0, 240, -120, 120)
                operations.T[k].text.innerHTML = Math.round(v)

                if (operations.T[k].text.innerHTML.length === 1) operations.T[k].text.style.transform = `translateX(0)`
                else if (operations.T[k].text.innerHTML.length === 2) operations.T[k].text.style.transform = `translateX(-6.5px)`
                else operations.T[k].text.style.transform = `translateX(-13px)`

                operations.T[k].indicator.style.transform = `rotate(${speed}deg) translate(-3px, 0)`
                if (v > 0) elems.carStateCircle.classList.remove('active')
            } else if (k === 'leftSpeed') {
                const leftSpeed = map(Math.max(Math.min(v, 240), 0), 0, 240, 120, -120)
                operations.T[k].style.transform = `rotate(${leftSpeed}deg) translate(-2px, 0)`
            } else if (k === 'rightSpeed') {
                const rightSpeed = map(Math.max(Math.min(v, 240), 0), 0, 240, -120, 120)
                operations.T[k].style.transform = `rotate(${rightSpeed}deg) translate(-2px, 0)`
            } else if (k === 'temperature') {
                operations.T[k].innerHTML = Math.round(v)

                console.log(operations.T[k].innerHTML)
                if (operations.T[k].innerHTML.length === 1) operations.T[k].style.transform = `translateX(0)`
                else if (operations.T[k].innerHTML.length === 2) operations.T[k].style.transform = `translateX(-30px)`
                else operations.T[k].style.transform = `translateX(-60px)`
            }
            else if (k === 'battery') {
                const scaling = map(Math.max(Math.min(v, 100), 0), 0, 100, 0, 1)
                operations.T[k].text.innerHTML = `%${Math.round(v)}`
                operations.T[k].indicator.style.transform = `scaleX(${scaling})`
            } else if (k === 'compass') operations.T[k].style.transform = `rotate(${v}deg) translate(-72.12px, 72.12px)`
        }
    }
}

socket.on('connect', () => {
    console.log(socket.id)
    socket.emit('assign', 'ui')
})

socket.on('set operation types', types => {
    operationTypes = types
    renderStats()
})

addEventListener('load', () => {
    socket.on('update', (type, data) => {
        updateStats(type, data)
    })
})