cd client
npm install
npm run build
cd ..
rm -rf server/public/*
cp -r client/dist/* server/public
