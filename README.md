# San vs Moon

Game project testing the possibility of hosting `websocket` on VPS.

[![Screen](https://github.com/bbrojson/galvanize/blob/trunk/screenshot.png)](https://galvanize-ecru.vercel.app/)

## Overview

This project is a simple one-button game where user can choose between **Sun** or **Moon**. The game uses a **State Machine** for managing transitions between different states.

## Self hosting

The goal is to self-host the application on a VPS, instead of the cloud, to sleep in peace and tranquility when the traffic picks and the bill rises above 9000!

The difficulty in setting up a VPS properly does't lie in the setup itself, but knowing what things to setup in order to do it properly.

Cheat sheet:

0. choose VPS, install pure version of the one and only `Ubuntu`
1. Config Ubuntu user
   1. Connect to the terminal via `ssh` command
   2. Add new user `adduser USER_NAME`
   3. Add user to the sudo group `usermod -aG sudo USER_NAME`
   4. Switch to the new user `su USER_NAME`
2. Establish SSH connection via Key authentication
   1. Run `ssh-keygen` locally to generate new key
   2. At prompt name you can change name so it is more descriptive ex. `PATH/.ssh/id_ed25519_NAME_OF_SERVICE`
   3. Copy public key to the vps with command `ssh-copy-id -i PATH/.ssh/id_ed25519_NAME_OF_SERVICE.pub USER_NAME@IP`
   4. Check if the key is on the server
      1. Go to `cd ~/.ssh`
      2. See content of authorized_keys file `cat authorized_keys`
3. Openssh Hardening
   1. Remove password authentication on SSH
      1. Edit config file in vim `sudo vim /etc/ssh/sshd_config`
      2. Change settings to:
         1. `PubkeyAuthentication yes`
         1. `PasswordAuthentication no`
         1. `PermitRootLogin no`
         1. `UsePAM not`
         1. Change to absolute path `AuthorizedKeysFile ~/.ssh/authorized_keys`
      3. Try to exit vim ;)
      4. Reload settings by running `sudo systemctl reload ssh`
      5. On local machine add private keys with `ssh-add PATH_TO_PRIVATE_CERT_FILE`
      6. Connect to the vps without password `ssh USER_NAME@IP`
   2. Install `sudo apt install tmux`
      1. [needs to be detailed]
4. Set the domain

   1. Buy the domain :D
   2. Config DNS, all major hosting services has nice easy one click buttons instruction how to manage that.
   3. To get the ip od the server type `ip address`
   4. Check if domain is set to server `nslookup IP`
   5. Set TLS with [certbot](https://certbot.eff.org/)

5. Install App
   1. Run `sudo apt update` to check if there a new versions of packages
   2. Run `sudo apt upgrade` to install those versions
   3. install node js `sudo apt-get install -y nodejs`
   4. Check node version `node --version`
   5. Install pm2 `sudo npm install -g pm2`
   6. Run the app `pm2 start app.js`
   7. Install `nginx`
      1. [needs to be detailed]
6. Setup firewall
   1. `sudo ufw default deny incoming`
   2. `sudo ufw default allow outgoing`
   3. Check at what port you are connected to server via SSH `echo $SSH_CLIENT` it should be 22.
   4. **WARNING** do not block your won ssh connection, ensure you are on 22 port `sudo ufw allow 22/tcp`
   5. `sudo ufw allow 433/tcp`
   6. See if configuration was added correctly `sudo ufw show added`
   7. Run `sudo ufw enable`

## Stack

- VPS, ubuntu
- nginx
- pm2
- nodejs
- Frontend: nextjs (Vercel)
