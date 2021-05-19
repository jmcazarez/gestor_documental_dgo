
# Front de sistema de gestor documental

Este proyecto se utiliza para crear la interfaz grafica y desde aquí se hacen las conexiones al backend(api).

## Versión

1.0.0

## Instalación

1. Instalar paquetes

```
cd front-gestor-usuarios

npm install
```

2. Configurar las variables de entorno del frontend

  2.1. Ir a la carpeta environments

  ```
  cd gestor_documental_dgo/src/environments
  ```

  2.2. Configurar las variables de entorno en desarrollo, en el archivo environment.ts

  Ejemplo:

  ```
  {
    production: false,
    hmr: false,
    apiCms: 'http://45.230.172.75:3600/',
    imageBase64:
  }

  ```

  2.3. Configurar las variables de entorno de producción, en el archivo environment.prod.ts

  Ejemplo:

  ```
  {
    production: true,
    hmr: false,
    apiCms: 'http://45.230.172.75:3600/'
    imageBase64:
  }
  ```

3. Compilar y correr el frontend.

En desarrollo

```
ng serve
```

En Producción

```
ng build
```
## Estructura del proyecto front

El proyecto está desarrollado con angular2+, y está dividido de la siguiente manera:

```
- app
  - main
  - navigation
- assets
- environments
- guards
- models
- pipes
- services
```

### 1. Main
```
En esta carpeta de declaran los módulos y componentes de la aplicación, es donde se define la interfaz (html), estilos (scss) y funcionalidad (ts). 
```
### 2. Models
```
En esta carpeta se declaran los modelos de base de datos que se usaran en la aplicación.
```
### 3. Guard
```
En este directorio se declaran las interfaces que permiten proteger las rutas e indican al enrutador si se permitirá la navegación a una ruta o no.
```
### 4. Pipes
```
En este directorio se declaran las funciones que transforman visualmente la información que sera consumida por los componentes.
```
### 5. Services
```
En esta carpeta se declaran los proveedores de datos de la aplicación, estos son consumidos por los componentes.
```
### 6. Utils
```
En esta carpeta se declaran funciones de la app
```
### Assets
```
En esta carpeta de almacenan imágenes predeterminadas del sistema y estilos globales. También se almacenan archivos pdf de ejemplo de reportes.
```
### Enviroments
```
En esta carpeta se declaran las variables de entorno para el despliegue de la aplicacion en desarrollo y en producción
```

Para mas detalles del funcionamiento de este proyecto consultar [FRONT_README](./FRONT_README.md)
