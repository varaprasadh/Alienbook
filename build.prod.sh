export NODE_ENV=production
cd client
npm install
npm run build 
cd ..
mkdir server/public
cp -r client/dist/* server/public