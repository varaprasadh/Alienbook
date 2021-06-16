cd client
npm run build 
cd ..
rm -rf api/public/*
cp -r client/dist/* api/public

