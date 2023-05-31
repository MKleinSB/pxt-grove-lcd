//% deprecated
namespace grove_lcd { }

namespace modules {
    /**
     * Grove LCD screen
     */
    //% fixedInstance whenUsed block="grove LCD"
    export const groveLCD = new CharacterScreenClient("grove LCD?dev=self&rows=2&columns=16&variant=LCD")
}

namespace servers {
    class CharacterScreenServer extends jacdac.Server {
        textDirection = jacdac.CharacterScreenTextDirection.LeftToRight
        message: string = ""

        constructor() {
            super(jacdac.SRV_CHARACTER_SCREEN, {
                variant: jacdac.CharacterScreenVariant.LCD,
            })
        }

        handlePacket(pkt: jacdac.JDPacket): void {
            this.textDirection = this.handleRegValue(
                pkt,
                jacdac.CharacterScreenReg.TextDirection,
                jacdac.CharacterScreenRegPack.TextDirection,
                this.textDirection
            )
            this.handleRegFormat(pkt,
                jacdac.CharacterScreenReg.Columns,
                jacdac.CharacterScreenRegPack.Columns,
                [16]) // NUMBER_OF_CHAR_PER_LINE
            this.handleRegFormat(pkt,
                jacdac.CharacterScreenReg.Rows,
                jacdac.CharacterScreenRegPack.Rows,
                [2]) // NUMBER_OF_CHAR_PER_LINE

            const oldMessage = this.message
            this.message = this.handleRegValue(
                pkt,
                jacdac.CharacterScreenReg.Message,
                jacdac.CharacterScreenRegPack.Message,
                this.message
            )
            if (this.message != oldMessage) this.syncMessage()
        }

        private syncMessage() {
            if (!this.message) grove_lcd.writeString("                ", 0, 100)
            else
                grove_lcd.writeString(this.message, 0, 100)
        }
    }
    function start() {
        jacdac.productIdentifier = 0x344acda0
        jacdac.deviceDescription = "Grove LCD"
        jacdac.startSelfServers(() => [
            new CharacterScreenServer()
        ])
    }
    start()
}