//% weight=100 color=#00A654 icon="\uf068" block="Grove LCD"
namespace grove_lcd {


    let isnotinitialized = true

    //every line gets its own buffer
    let row0 = ""
    let row1 = ""

    //every line gets its own speed
    let row0Speed = 0
    let row1Speed = 0

    //prevents the flooding of the lcd
    //only write new text 
    let row0Written = true
    let row1Written = true

    //a poormans semaphore
    let lcdUsed = false

    //syncronous writing of row0
    //if the string in row0 is greater than 16 characters(the display with) the screen is scrolled
    //if row0 is lower than 16 the screen will be written only with the new incoming string

    control.inBackground(() => {
        let pos0 = 0
        init()
        while (true) {
            while (lcdUsed) {
            }
            basic.pause(1)
            lcdUsed = true
            if (row0.length > 16) {
                if (pos0 == 1) {
                    basic.pause(1000)
                }
                setCursor(0, 0)
                writeLCD(row0.substr(pos0, 16))
                basic.pause(row0Speed)
                pos0 += 1
                if (pos0 == (row0.length - 15)) {
                    pos0 = 0
                    basic.pause(1000)
                }
            } else {
                if (row0Written) {
                    clearrow0()
                    setCursor(0, 0)
                    writeLCD(row0)
                    row0Written = false
                }
            }
            lcdUsed = false

        }
    })

    control.inBackground(() => {
        let pos1 = 0
        init()
        while (true) {
            while (lcdUsed) {
            }
            basic.pause(1)
            lcdUsed = true
            if (row1.length > 16) {
                if (pos1 == 1) {
                    basic.pause(1000)
                }
                setCursor(0, 1)
                writeLCD(row1.substr(pos1, 16))
                basic.pause(row1Speed)
                pos1 += 1
                if (pos1 == (row1.length - 15)) {
                    pos1 = 0
                    basic.pause(1000)
                }
            } else {
                if (row1Written) {
                    clearrow1()
                    setCursor(0, 1)
                    writeLCD(row1)
                    row1Written = false
                }
            }
            lcdUsed = false

        }
    })

    function writeLCD(str: string) {
        let buf = pins.createBuffer(str.length + 1)
        buf[0] = 0x40
        for (let index = 1; index <= str.length; index++) {
            if (str[index - 1] == "ä" || str[index - 1] == "Ä") {
                buf[index] = 225
            } else if (str[index - 1] == "ö" || str[index - 1] == "Ö") {
                buf[index] = 239
            } else if (str[index - 1] == "ü" || str[index - 1] == "Ü") {
                buf[index] = 245
            } else if (str[index - 1] == "ß") {
                buf[index] = 226
            } else if (str[index - 1] == "˚") {
                buf[index] = 223
            } else {
                buf[index] = str.charCodeAt(index - 1)
            }
        }
        pins.i2cWriteBuffer(0x3E, buf)
    }

    /**
     * prints a string on the LCD display
     * @param str text to display
     * @param row row to be written to
     * @param speed speed of the scrolling text
     */
    //% weight=87 blockGap=8
    //% block="write | %str to row %row  || with speed | %speed ms"
    //% blockId=write_String
    //% row.min=0 row.max=1
    //% speed.shadow=timePicker speed.defl=100

    export function writeString(str: string, row: number, speed: number = 100) {

        if (row == 0) {
            row0Speed = speed
            row0 = str
            row0Written = true
        }
        if (row == 1) {
            row1Speed = speed
            row1 = str
            row1Written = true
        }

    }

    /**
    * plots a bar graph on the LCD display
    * @param wert value to display
    * @param max maximum value
    * @param row row to be written to
    */
    //% block="plot bar graph of | %wert up to %max  || in row %row"
    //% blockId=lcd_plotBarGraph
    //% row.min=0 row.max=1
    export function bargraph(value: number, max: number, row: number = 0) {
        let bar = ""
        if (value > max) { max = value }
        for (let Index = 0; Index <= pins.map(
            value,0,max,0,15); 
            Index++) {
            bar = bar + String.fromCharCode(255)
        }
        grove_lcd.writeString(bar, row)
    }

    // function for extracting NewLine. Hidden because it´s only for Jacdac
    export function writeStringNL(str: string) {
        let part1 = ""
        let part2 = ""
        let posNL = 0
        if (str.includes("\n")) {
            posNL = str.indexOf("\n")
            row0 = str.substr(0, posNL)
            row0Written = true
            row1 = str.substr(posNL + 1, str.length - (posNL + 1))
            row1Written = true
        } else {
            row0 = str
            row0Written = true
        }
    }

    function clearrow0() {
        setCursor(0, 0)
        writeLCD("                ")
    }

    function clearrow1() {
        setCursor(0, 1)
        writeLCD("                ")
    }

    function init() {
        if (isnotinitialized) {
            basic.pause(50)

            setLCDCmd(Command.LCD_2LINE | 0x10)
            basic.pause(5)
            setLCDCmd(Command.LCD_2LINE | 0x10)
            basic.pause(1)
            setLCDCmd(Command.LCD_2LINE | 0x10)
            setLCDCmd(Command.LCD_2LINE)
            setLCDCmd(Command.LCD_DISPLAYON)
            setLCDCmd(Command.LCD_CLEARDISPLAY)
            basic.pause(2)
            setLCDCmd(Command.LCD_ENTRYLEFT | Command.LCD_ENTRYSHIFTDECREMENT)
        }
        isnotinitialized = false
    }

    function setLCDCmd(cmd: number) {
        pins.i2cWriteNumber(0x3E, 0x80 << 8 | cmd, NumberFormat.Int16BE)
    }

    function setCursor(col: number, row: number) {
        col = (row == 0 ? col | 0x80 : col | 0xc0);
        setLCDCmd(col)
    }
}

enum Command {
    LCD_ADDRESS = 0x3E,

    //command Adressen
    LCD_CLEARDISPLAY = 0x01,
    LCD_ENTRYMODESET = 0x04,
    LCD_DISPLAYCONTROL = 0x08,
    LCD_FUNCTIONSET = 0x20,
    LCD_ENTRYLEFT = 0x02 | LCD_ENTRYMODESET,
    LCD_ENTRYSHIFTDECREMENT = 0x00 | LCD_ENTRYMODESET,
    LCD_DISPLAYON = 0x04 | LCD_DISPLAYCONTROL,
    LCD_2LINE = 0x08 | LCD_FUNCTIONSET
}
