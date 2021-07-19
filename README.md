# github-tool - Bachelorprojekt: Verwaltungsverkzeug für GitHub-Repositories

Dieses Repository ist öffentlich zugänglich und besitzt neben dem ``master``-Branch einen zusätzlichen ``gh-pages``-Branch. 

Dieser Branch enthält nur die durch den Build-Prozess kompilierte statische Webseite aus dem “dist”-Verzeichnis. Sie steht mithilfe von GitHub-Pages unter der folgenden URL-Adresse zur Verfügung:
https://elf17hmb.github.io/github_frontend/ (Stand: 19.07.2021).


## Project setup 
### Installation aller notwendigen Node-Modules
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production (Erstellt den ``dist``-Verzeichnis mit dem Build der statischen Webseite)
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
### Troubleshooting

Falls nach 'npm install', beim Ausführen von 'npm run serve' folgende Fehlermeldung erscheint:
``
Error: Cannot find module 'vue-loader-v16/package.json'
``

'vue-loader-v16' deinstallieren:

```
npm uninstall vue-loader-v16
```
und dann wieder installieren:
```
npm i vue-loader-v16
```



### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
