// Hier kann man Tests durchführen; diese Datei wird nicht kompiliert, wenn dieses Paket als Erweiterung verwendet wird.
input.onButtonPressed(Button.A, function() {
    modules.characterScreen1.setLine(0, "12345678901234567")
})
input.onButtonPressed(Button.B, function () {
modules.characterScreen1.setLineValue(1, "Light", 123)   
})