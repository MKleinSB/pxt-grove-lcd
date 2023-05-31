// Hier kann man Tests durchführen; diese Datei wird nicht kompiliert, wenn dieses Paket als Erweiterung verwendet wird.
input.onButtonPressed(Button.A, function() {
    modules.characterScreen1.setLine(0, ":(")
})


input.onButtonPressed(Button.B, function () {
    modules.characterScreen1.setLine(1, ":)")
})