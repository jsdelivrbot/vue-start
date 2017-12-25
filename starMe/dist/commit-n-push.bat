cd ..
node build/build.js
cd dist
git fetch heroku master
git pull heroku master
git add *
git commit -a -m 'renew static'
git push heroku master
git push origin master
