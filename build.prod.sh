cd client
npm ci
npm run build 
cd ..
rm -rf server/public/*
cp -r client/dist/* server/public
