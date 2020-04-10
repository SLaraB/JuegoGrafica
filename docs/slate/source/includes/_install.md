# Requerimientos

## Navegador Web

Para poder visualizar el juego, es necesario contar con un navegador web que soporte WebGL.<br>
La mayoría de los navegadores contemporáneos lo soportan.<br><br>

Puede ver la lista de todos los navegadores compatibles **[aquí.](https://www.soft8soft.com/webgl-supported-browsers-and-troubleshooting/)**

## Node JS

Para poder ejecutar el servidor, se necesario tener instalado la última versión de **[Node JS](https://nodejs.org/es/)**.<br>
Puede descargar la última version en: **[https://nodejs.org/es/download/](https://nodejs.org/es/download/)**.

## Librerías y Módulos

En el lado del cliente (navegador), se hace uso de las siguientes librerías JavaScript:

### [THREE JS >= r115](https://threejs.org)

Utilizada para facilitar el manejo de gráficos, animaciones, texturizado y sombras.

### [CANNON JS](https://schteppe.github.io/cannon.js/)

Utilizada para facilitar el manejo de physics, ( Movimientos, colisiones, etc).

### [Socket.IO >= 2.3.0](https://socket.io)

Utilizada para facilitar el manejo del protocolo WebSockets con el servidor.

### [JQuery >= 3.4.1](https://jquery.com)

Utilizada para facilitar el manejo de elementos del DOM, (Interfaz de usuario).

<aside class="success">Todas las librerías del cliente ya se encuentran incluidas en el proyecto.</aside>

###En el lado del servidor, se hace uso de los siguientes módulos:

### [Express JS >= 4.x](https://expressjs.com/es/)

Utilizada para brindar a los clientes acceso al sitio web y a los assets del juego.

### [Socket.IO >= 2.3.0](https://socket.io)

Utilizada para facilitar el manejo del protocolo WebSockets con el cliente.

<aside class="notice">Para mayor información sobre la instalación de los módulos del servidor, ir a la sección <b><a href="#instalacion">Instalación y Ejecución</a></b>.</aside>


# Instalación y Ejecución

Una vez instalado un navegador web compatible, y Node JS, abrir una términal y ejecutar los siguientes comandos:


```shell
# Clonar el repositorio
$ git clone https://github.com/ehopperdietzel/JuegoGrafica.git

# Acceder al directorio raíz
$ cd JuegoGrafica

# Instalar los módulos requeridos por Node JS
$ npm install

# Ejecutar el servidor
$ node server.js
```
<br><br> ***( ver pestaña shell )***.

Tras ejecutar los comandos, y con el servidor en funcionamiento, puede acceder al juego, ingresando a la dirección por defecto:<br>

[http://localhost:3000](http://localhost:3000)
