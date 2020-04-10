# Introducción

## Objectivo
El objetivo principal de esta documentación, es permitir al lector una fácil comprensión de los requerimientos, proceso de instalación y ejecución del videojuego Austral Tournament, para que pueda implementarlo en el entorno deseado.<br><br>

También se abarcará en detalle la estructura, funcionamiento interno, API's y protocolos del software, para quién desee modificarlo, o utilizarlo como referencia para desarrollar su propio videojuego web multiplayer.  




## ¿Qué es Austral Tournament?

Austral Tournament es un videojuego 3D en tercera persona y multiplayer, que puede ser ejecutado desde un navegador web, si necesidad de instalar plugins addicionales.<br>

Hace uso de la API de **[WebGL](https://es.wikipedia.org/wiki/WebGL)** ( presente en la mayoría de los navegadores contemporáneos )
, la cual permite utilizar OpenGL 2.0 u OpenGL ES 2.0 para el renderizado.

Adicionalmente, cuenta con un programa **[Node.JS](https://es.wikipedia.org/wiki/Node.js)**, utilizado como servidor, el cual se encarga de la jugabilidad multiplayer, vía el protocolo **[WebSocket](https://es.wikipedia.org/wiki/WebSocket)**.

<aside class="notice">
Actualmente solo cuenta con la modalidad de juego <b>deathmatch</b> basada en equipos.
</aside>
