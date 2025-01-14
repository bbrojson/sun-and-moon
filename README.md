# San vs Moon

Game project testing the possibility of hosting `websocket` on VPS.

[![Screen](https://github.com/bbrojson/galvanize/blob/trunk/screenshot.png)](https://galvanize-ecru.vercel.app/)

## Overview

This project is a simple one-button game where user can choose between **Sun** or **Moon**. The game uses a **State Machine** for managing transitions between different states.

## Self hosting

The goal is to self-host the application on a VPS, instead of the cloud, to sleep in peace and tranquility when the traffic picks and the bill rises above 9000!

The difficulty in setting up a VPS properly does't lie in the setup itself, but knowing what things to setup in order to do it properly.

Cheat sheet:

0. choose VPS, select distro (Debian)
   1. Connect to VPS via ssh and update the system before we start `sudo apt update && sudo apt upgrade`
1. Config new user, we wont use root account.
   1. Add new user `adduser USER_NAME`
   2. Add user to the sudo group `usermod -aG sudo USER_NAME`
   3. Switch to the new user `su USER_NAME`
2. Establish SSH connection via Key authentication
   1. Run `ssh-keygen` locally to generate new key
      1. ex: `ssh-keygen -t rsa -b 4096 -m PEM -C "vps-instance-connection"`
   2. At prompt name you can change the output file to custom one.
   3. Copy Public Key to authorized key
      1. (if on local machine) `ssh-copy-id -i PATH/.ssh/FILE_NAME.pub USER_NAME@IP`
      2. (if on vps machine) `cat FILE_NAME >> ~/.ssh/authorized_keys`
   4. Check if the key is on the server
      1. See content of authorized_keys file `cat ~/.ssh/authorized_keys`
3. Openssh Hardening
   1. Remove password authentication on SSH
      1. Edit config file in vim `sudo vim /etc/ssh/sshd_config` or `sudo nano /etc/ssh/sshd_config`
      2. Change settings to:
         1. `PubkeyAuthentication yes`
         2. `PasswordAuthentication no`
         3. `PermitRootLogin no`
         5. Set path `AuthorizedKeysFile .ssh/authorized_keys`
      3. Try to exit vim or just CTRL+X in nano
      4. Reload settings by running `sudo systemctl reload ssh`
      5. On local machine add private keys with `ssh-add PATH_TO_PRIVATE_CERT_FILE`
      6. Connect to the vps without password `ssh USER_NAME@IP`
   2. Install fail2ban
      1. `sudo apt install fail2ban`
      2. `sudo systemctl enable fail2ban`
      3. `sudo systemctl start fail2ban`
      4. `sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local`
      5. `sudo nano /etc/fail2ban/jail.local` to configure the rules, then `sudo systemctl restart fail2ban` to restart the service

4. Set the domain
   1. Buy the domain :D
   2. Config DNS, all major hosting services has nice easy one click buttons instruction how to manage that.
   3. To get the ip od the server type `ip address`
   4. Check if domain is set to server `nslookup IP`
   5. Install `nginx`

      1. `sudo apt install nginx certbot python3-certbot-nginx -y`
      2. Create a basic server block (/etc/nginx/sites-available/example.com):

         ```bash
            server {
               listen 80;
               server_name example.com www.example.com;

               root /var/www/example.com;
               index index.html index.htm;

               location / {
                  try_files $uri $uri/ =404;
               }
            }
         ```

      3. Enable the site and restart NGINX:  
         `sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/`
         `sudo nginx -t`
         `sudo systemctl restart nginx`

   6. Set TLS with [certbot](https://certbot.eff.org/)
      1. `sudo certbot --nginx`
   7. Create domain folder for nginx `sudo mkdir -p /var/www/example.com`
   8. Set permissions `sudo chown -R $USER:$USER /var/www/example.com`
   9. Set chmod `sudo chmod -R 755 /var/www/example.com`

5. Setup firewall
   1. `sudo ufw default deny incoming`
   2. `sudo ufw default allow outgoing`
   3. Check at what port you are connected to server via SSH `echo $SSH_CLIENT` it should be 22.
   4. **WARNING** Do not block your own SSH connection, ensure you are on 22 port `sudo ufw allow 22/tcp`
   5. `sudo ufw allow 433/tcp`
   6. See if configuration was added correctly `sudo ufw show added`
   7. Run `sudo ufw enable` - before double check if you are on the right port (22)
6. Install App
   1. Install basic libs `sudo apt-get install curl openssl libssl-dev npm`
   2. Install git `sudo apt-get install git`
   3. Install nodejs `sudo apt install nodejs`
      1. Check nodejs version: `node -v`
      2. Check npm version: `npm -v`
   4. Install pm2: `sudo npm install pm2 -g`
      1. Check if pm2 is working: `pm2 list`, the list should be empty
7. Setup repo on VPS
   1. Set up SSH key
   2. Create a new key as in previous steps. Paste **public key** to github SSH keys section (profile -> settings -> SSH keys).
   3. Create an folder ex `mkdir ~/repos`
   4. Clone github repo into the folder
8. Create Github auto deploy action
   1. Generate private key locally for github action `ssh-keygen -t rsa -b 4096 -C "github-actions"`
   2. Add public key to authorized keys on vps to `~/.ssh/authorized_keys`
   2. Set envs, go to Settings -> Secrets -> Actions -> New repository secret
      `PRIVATE_KEY` Copy generated private key
      `HOST` YOUR SERVER ADDRESS, example: 172.41.91.123
      `USERNAME` YOUR SERVER USERNAME, example: daniel
      `DOMAIN_NAME` YOUR DOMAIN NAME, example: example.com
   3. Setup action, in that case were using

## Stack (needs to be updated)

- VPS, debian
- nginx
- pm2
- nodejs
- Frontend: nextjs (Vercel)
