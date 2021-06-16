
<p align="center">
  <img src="design files/png/logo_black.png"/>
</p>

# AlienBook
 alienBook is the social media platform which supports features like
  - posts
  - reactions
  - comments upto 3 level depth
      - reactions for the comments
  - re-sharing the posts
  - notifications based upon user interactions

## TechStack
  - Vue,Vue-router,Vuex
  - Passport js
  - Express 
  - MongoDB, Mongoose 
  - Cloudinary for media storage
  - Docker to spin up mongodb container for local development

## Tools used
- VS Code
- Postman
- Robo3T

## Development Setup
  - clone the repo
  - cd /db and run docker-compose up -d (to run mongo instance)
  - cd /client and run `npm run serve` to start vue dev server
  - cd /server and run `npm run dev` to start express dev server
  - express server probably runs on port:3000 and vue runs at port:5000

