# Introducción

## Descripción

Austral Tournament es un videojuego 3D en tercera persona y multiplayer, que puede ser ejecutado desde un navegador web, si necesidad de instalar plugins addicionales.<br>

Hace uso de la API de **[WebGL](https://es.wikipedia.org/wiki/WebGL)** ( presente en la mayoría de los navegadores contemporáneos )
, la cual permite utilizar OpenGL 2.0 u OpenGL ES 2.0 para el renderizado.

Adicionalmente, cuenta con un programa **[Node.JS](https://es.wikipedia.org/wiki/Node.js)**, utilizado como servidor, el cual se encarga de la jugabilidad multiplayer, vía el protocolo **[WebSocket](https://es.wikipedia.org/wiki/WebSocket)**.

<aside class="notice">
Actualmente solo cuenta con la modalidad de juego <b>deathmatch</b> basada en equipos.
</aside>


## Librerías y Módulos

###En el lado del cliente (navegador), se hace uso de las siguientes librerías:

### [THREE JS](https://threejs.org)

Utilizada para facilitar el manejo de gráficos, animaciones, texturizado y sombras.

### [CANNON JS](https://schteppe.github.io/cannon.js/)

Utilizada para facilitar el manejo de physics, ( Movimientos, colisiones, etc).

### [Socket.IO](https://socket.io)

Utilizada para facilitar el manejo del protocolo WebSockets con el servidor.

### [JQuery](https://jquery.com)

Utilizada para facilitar el manejo de elementos del DOM, (Interfaz de usuario).

<aside class="success">Todas las librerías del cliente ya se encuentran incluidas en el proyecto.</aside>

###En el lado del servidor, se hace uso de los siguientes módulos:

### [Express JS](https://expressjs.com/es/)

Utilizada para brindar a los clientes acceso al sitio web y a los assets del juego.

### [Socket.IO](https://socket.io)

Utilizada para facilitar el manejo del protocolo WebSockets con el cliente.

<aside class="notice">Para mayor información sobre la instalación de los módulos del servidor, ir a la sección <b><a href="#instalacion">Instalación</a></b>.</aside>
