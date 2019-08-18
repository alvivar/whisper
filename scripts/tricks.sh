
# Sync whisper with the Droplet
rsync -rave ssh --exclude-from=whisper/exclude.txt whisper/ --delete root@165.22.45.96:~/whisper

# From server to local
rsync -rave ssh root@165.22.45.96:/etc/nginx/sites-available/default whisper/nginx/
# Local to server
rsync -rave ssh whisper/nginx/ root@165.22.45.96:/etc/nginx/sites-available/

# Restart Nginx
systemctl restart nginx
