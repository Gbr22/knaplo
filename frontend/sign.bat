cd .\src-cordova\platforms\android\app\build\outputs\apk\release\
cp app-release-unsigned.apk app-release-signed.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore C:\\Users\\gbr22\\key.jks .\src-cordova\platforms\android\app\build\outputs\apk\release\app-release-signed.apk key