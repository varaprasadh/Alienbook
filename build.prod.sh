cd client
npm ci
npm run build 
cd ..
mkdir server/public
cp -r client/dist/* server/public