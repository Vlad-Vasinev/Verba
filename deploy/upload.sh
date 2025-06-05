rm -rf tmp
mkdir -p tmp/local/templates/verba/{css,js,img}
mkdir -p tmp/local/{php_interface,includes}
hash=$(git rev-parse --short HEAD)
ts=$(date +"%Y%m%d%H%M%S")
echo "<?php define('ASSET_VERSION', '${hash}_${ts}');" > \
  "tmp/local/php_interface/asset_version.php"
cp app/css/main.css tmp/local/templates/verba/css/main.css
sed -i 's/..\/..\/img/..\/img/g' tmp/local/templates/verba/css/main.css
cp app/js/main.js tmp/local/templates/verba/js/main.js
cp -r -T app/img tmp/local/templates/verba/img
cp -r -T app/fonts tmp/local/templates/verba/fonts
cp -r app/api/customization.json tmp/local/includes/customization.json
chmod 400 "$UPLOAD_KEY"
rsync -az --rsh="ssh -i $UPLOAD_KEY -o StrictHostKeyChecking=no -o PasswordAuthentication=no" tmp/local/ bitrix@"$UPLOAD_ADDRESS":/home/bitrix/www/local
