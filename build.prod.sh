cd client
npm ci
npm run build-prod 
cd ..
rm -rf server/public/*
cp -r client/dist/* server/public
