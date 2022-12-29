# EVehicle UI

## How to deploy
Install LTS Node.js, then run `npm i` to download all packages.

Run `npm run start` to run the application in production mode.

If you want to run it in development mode, run `npm run dev`

---
## How to use it
First replace the url on line 4 in `js/main.js` and `js/custom-ui.js` files with your own server address (if different)

---
## How to send data
* `leftHeadlight`, `leftFrontSignal`, `leftBacklight`, `leftRearSignal`, `leftRearBrake`, `rightHeadlight`, `rightFrontSignal`, `rightBacklight`, `rightRearSignal`, `rightRearBrake` data sent in `binary` format with `L` prefix.

Example: `L 010x011010;`

* `running`, `leftDoor`, `leftSafetyBelt`, `leftDoorLock`, `rightDoor`, `rightSafetyBelt`, `rightDoorLock`, `trunk`, `wiper` data sent in `binary` format with `S` prefix.

Example: `S 1x00110x0;`

* `speed`, `leftSpeed`, `rightSpeed`, `temperature`, `battery`, `compass` data is sent in `float` format with `T` prefix every 300 ms.

Example: `T 90,86.7,98.5,67.0,56,-14.6;`

**Note:** `;` must be at the end of the data sent.

---
## Data and Values
### Lights
* `leftHeadlight`: **Left Headlight** *[binary: `0`, `1`, `x`]*
* `leftFrontSignal`: **Left Front Signal Light** *[binary: `0`, `1`, `x`]*
* `leftBacklight`: **Left Backlight** *[binary: `0`, `1`, `x`]*
* `leftRearSignal`: **Left Rear Signal Light** *[binary: `0`, `1`, `x`]*
* `leftRearBrake`: **Left Rear Brake** *[binary: `0`, `1`, `x`]*
* `rightHeadlight`: **Right Headlight** *[binary: `0`, `1`, `x`]*
* `rightFrontSignal`: **Right Front Signal Light** *[binary: `0`, `1`, `x`]*
* `rightBacklight`: **Right Backlight** *[binary: `0`, `1`, `x`]*
* `rightRearSignal`: **Right Rear Signal Light** *[binary: `0`, `1`, `x`]*
* `rightRearBrake`: **Right Rear Brake** *[binary: `0`, `1`, `x`]*

### Security
* `running`: **Running** *[binary: `0`, `1`, `x`]*
* `leftDoor`: **Left Door** *[binary: `0`, `1`, `x`]*
* `leftSafetyBelt`: **Left Safety Belt** *[binary: `0`, `1`, `x`]*
* `leftDoorLock`: **Left Door Lock** *[binary: `0`, `1`, `x`]*
* `rightDoor`: **Right Door** *[binary: `0`, `1`, `x`]*
* `rightSafetyBelt`: **Right Safety Belt** *[binary: `0`, `1`, `x`]*
* `rightDoorLock`: **Right Door Lock** *[binary: `0`, `1`, `x`]*
* `trunk`: **Trunk** *[binary: `0`, `1`, `x`]*
* `wiper`: **Wiper** *[binary: `0`, `1`, `x`]*

### Timer
* `speed`: **Main Speed** *[float: in the range of `0` and `240`]*
* `leftSpeed`: **Left Wheel Speed** *[float: in the range of `0` and `240`]*
* `rightSpeed`: **Right Wheel Speed** *[float: in the range of `0` and `240`]*
* `temperature`: **Temperature** *[float: no range]*
* `battery`: **Battery** *[float: in the range of `0` and `100`]*
* `compass`: **Compass** *[float: in the range of `-180` and `180`]*

**Note:** Timer data should be sent at every 300 milliseconds.

---
###### &copy; Copyright 2022 | RoboSA
