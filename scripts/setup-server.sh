#!/bin/bash

# Script de configuration initiale du serveur Hetzner
# À exécuter sur le VPS en tant que root

set -e

echo "=== Configuration du serveur Hetzner ==="

# Mise à jour du système
echo "1. Mise à jour du système..."
apt-get update
apt-get upgrade -y

# Installation de Docker
echo "2. Installation de Docker..."
apt-get install -y ca-certificates curl gnupg lsb-release

# Ajout de la clé GPG officielle de Docker
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Configuration du repository Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Démarrage de Docker
systemctl start docker
systemctl enable docker

# Installation de Docker Compose
echo "3. Installation de Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Installation de Git
echo "4. Installation de Git..."
apt-get install -y git

# Création d'un utilisateur pour l'application (optionnel mais recommandé)
echo "5. Création de l'utilisateur deploy..."
if ! id -u deploy > /dev/null 2>&1; then
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy
    echo "Utilisateur 'deploy' créé"
fi

# Création du répertoire de l'application
echo "6. Création du répertoire de l'application..."
mkdir -p /opt/tapaslaref
chown deploy:deploy /opt/tapaslaref

# Configuration du firewall
echo "7. Configuration du firewall..."
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Installation de fail2ban pour la sécurité
echo "8. Installation de fail2ban..."
apt-get install -y fail2ban
systemctl start fail2ban
systemctl enable fail2ban

echo "=== Configuration terminée ==="
echo ""
echo "Prochaines étapes :"
echo "1. Configurez votre clé SSH pour l'utilisateur 'deploy'"
echo "2. Clonez votre repository dans /opt/tapaslaref"
echo "3. Créez le fichier .env avec vos variables d'environnement"
echo "4. Lancez docker-compose -f docker-compose.prod.yml up -d"
