export NODE_ENV=development
cd client
npm run build 
cd ..
rm -rf server/public/*
cp -r client/dist/* server/public

