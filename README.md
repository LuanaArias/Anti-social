# Anti-social

## 📌 Descripción del Proyecto

Este proyecto corresponde al backend de **Anti-Social**, una red social. Permite a los usuarios registrarse, crear publicaciones con imágenes y etiquetas, dejar comentarios, y seguir a otros usuarios. Se ha desarrollado con un enfoque modular, validaciones estrictas y optimización mediante uso de caché.

---

## 🛠 Tecnologías Utilizadas

- **Node.js** + **Express**: Framework principal para construir el servidor y la API.
- **MongoDB + Mongoose**: Base de datos NoSQL y ODM para el modelado de datos.
- **Redis**: Implementación de caché para mejorar tiempos de respuesta (TTL en comentarios).
- **Multer + FileSystem + Axios**: Para manejo de imágenes locales y descarga por URL.
- **Swagger**: Documentación interactiva de endpoints.
- **Docker + Docker Compose**: Entornos replicables con contenedores.
- **Joi**: Validación de datos a través de esquemas.

---

## 📁 Estructura del Proyecto

```
📁 src/
├── controllers/       # Lógica de negocio por entidad
├── routes/            # Definición de endpoints
├── db/
│   ├── config/        # Configuración Mongo y Redis
├── middlewares/       # Validaciones y manejo de errores
├── schemas/           # Validaciones Joi
├── uploads/           # Imágenes locales
├── docs/              # Documentación Swagger y Postman
├── main.js            # Punto de entrada de la app
```

---

## 📄 Endpoints Principales

> Todos los endpoints están organizados por entidad: `/user`, `/post`, `/image`, `/comment`, `/tag`.

### 👤 Usuarios

- `POST /user/createUser` - Registrar nuevo usuario
- `GET /user/getUser/:id` - Obtener usuario por ID
- `PUT /user/updateNickName/:id` - Modificar nickname
- `POST /user/seguirUsuario/:id/:idASeguir` - Seguir a otro usuario

### 📝 Posts

- `POST /post/createPost` - Crear nuevo post
- `GET /post/getPost/:id` - Obtener post
- `PUT /post/updatePost/:id` - Modificar post
- `DELETE /post/deletePost/:id` - Eliminar post

### 🖼 Imágenes

- `POST /image/addImages/:idPost` - Subir imágenes al post
- `GET /image/getImages/:idPost` - Ver imágenes del post
- `PUT /image/updateImage/:idImage` - Modificar URL de imagen

### 💬 Comentarios

- `POST /comment/createComment/:idPost` - Comentar post
- `GET /comment/getAllComments/:idPost` - Ver comentarios
- `DELETE /comment/deleteComment/:idComment` - Borrar comentario

### 🏷 Etiquetas

- `POST /tag/createTag` - Crear nueva etiqueta
- `PUT /tag/setTags/:idPost` - Asignar etiquetas a post

---

## 🎁 Bonus Implementados

- ✅ **Caché con Redis** para almacenar temporalmente comentarios y optimizar lectura de datos poco cambiantes.
- ✅ **Subida y descarga de imágenes**: Las imágenes enviadas por URL se descargan, validan y almacenan localmente.
- ✅ **Relaciones de seguimiento entre usuarios** (followers/following).

---

## 🚀 Ejecución del Proyecto

1. Clonar repositorio:
   
   git clone https://github.com/tu-usuario/anti-social-backend.git
   cd anti-social-backend
   

2. Instalar dependencias:
   
   npm install
   

3. Levantar servicios con Docker:
   
   docker-compose up
   

4. Iniciar servidor:
   
   npm run dev
   

---

## 📚 Documentación

- Swagger disponible en: `http://localhost:3000/api-docs`
- Colección de Postman en: `src/docs/`
