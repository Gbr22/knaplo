cd .\src-cordova\platforms\android\app\build\outputs\apk\release\
copy .\app-release-unsigned.apk .\app-release-signed.apk &
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore C:\\Users\\gbr22\\key.jks app-release-signed.apk key &
zipalign 4 app-release-signed.apk app-release-signed-aligned.apk