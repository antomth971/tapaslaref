# Guide de Déploiement - TapasLaRef sur Hetzner VPS

Ce guide vous accompagne étape par étape pour déployer votre application (Frontend Expo Web + Backend NestJS + PostgreSQL) sur un VPS Hetzner.

---

## Prérequis

- Un compte Hetzner Cloud
- Un nom de domaine (optionnel mais recommandé pour SSL)
- Un compte GitHub avec accès au repository
- Git installé localement

---

## 1. Création du VPS Hetzner

### 1.1 Commander le serveur

1. Connectez-vous à [Hetzner Cloud Console](https://console.hetzner.cloud/)
2. Créez un nouveau projet : "TapasLaRef Production"
3. Cliquez sur "Add Server"
4. Configuration recommandée :
   - **Location** : Nuremberg (ou Falkenstein pour l'Europe)
   - **Image** : Ubuntu 22.04 LTS
   - **Type** : CX23 (2 vCPU, 4GB RAM, 40GB SSD) - ~4€/mois
   - **Networking** : IPv4 + IPv6
   - **SSH Key** : Ajoutez votre clé SSH publique
   - **Name** : tapaslaref-prod

5. Cliquez sur "Create & Buy now"

### 1.2 Configurer votre domaine (optionnel)

Si vous avez un nom de domaine, configurez un enregistrement DNS de type A :
```
Type: A
Name: @ (ou votre-domaine.com)
Value: [IP_DE_VOTRE_SERVEUR]
TTL: 3600
```

Pour un sous-domaine :
```
Type: A
Name: app
Value: [IP_DE_VOTRE_SERVEUR]
TTL: 3600
```

---

## 2. Configuration Initiale du Serveur

### 2.1 Connexion au serveur

```bash
ssh root@[IP_DE_VOTRE_SERVEUR]
```

### 2.2 Exécution du script de configuration

```bash
# Télécharger le script de configuration
curl -o setup-server.sh https://raw.githubusercontent.com/[VOTRE_USERNAME]/tapaslaref/main/scripts/setup-server.sh

# Rendre le script exécutable
chmod +x setup-server.sh

# Exécuter le script
./setup-server.sh
```

Ce script va :
- Mettre à jour le système
- Installer Docker et Docker Compose
- Installer Git
- Créer un utilisateur `deploy`
- Configurer le firewall
- Installer fail2ban pour la sécurité

**Durée estimée : 5-10 minutes**

### 2.3 Configuration de l'utilisateur deploy

```bash
# Se connecter en tant que deploy
su - deploy

# Générer une clé SSH pour le déploiement automatique (optionnel)
ssh-keygen -t ed25519 -C "deploy@tapaslaref"

# Afficher la clé publique
cat ~/.ssh/id_ed25519.pub
```

Ajoutez cette clé publique aux "Deploy Keys" de votre repository GitHub :
- Allez dans Settings > Deploy keys
- Cliquez sur "Add deploy key"
- Collez la clé publique

---

## 3. Déploiement de l'Application

### 3.1 Cloner le repository

```bash
# En tant qu'utilisateur deploy
cd /opt/tapaslaref
git clone git@github.com:[VOTRE_USERNAME]/tapaslaref.git .
```

### 3.2 Configuration des variables d'environnement

```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
```

Configurez les variables suivantes :

```env
# Base de données
POSTGRES_USER=tapaslaref_user
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!
POSTGRES_DB=tapaslaref_prod

# JWT
JWT_SECRET=VotreCleSecreteTresLonguePourJWT_ChangezMoi!

# Domaine et SSL
DOMAIN=votre-domaine.com
SSL_EMAIL=votre-email@example.com

# Backend
NODE_ENV=production
PORT=3000

# Cloudinary (si utilisé)
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

**Important** : Utilisez des mots de passe forts et uniques !

### 3.3 Vérification de la configuration Backend

Vérifiez que le backend utilise bien les variables d'environnement pour se connecter à la base de données :

```bash
# Vérifier la configuration TypeORM dans backend/src/
cat backend/src/app.module.ts
```

Assurez-vous que la configuration ressemble à ceci :

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // ... autres options
})
```

### 3.4 Vérification de la configuration Frontend

Si le frontend doit communiquer avec le backend, vérifiez l'URL de l'API :

```bash
# Créer ou éditer frontend/.env
nano frontend/.env
```

Ajoutez :
```env
EXPO_PUBLIC_API_URL=https://votre-domaine.com/api
# ou
EXPO_PUBLIC_API_URL=http://votre-ip-serveur/api
```

### 3.5 Lancer l'application

```bash
# Build et démarrer tous les conteneurs
docker-compose -f docker-compose.prod.yml up -d --build
```

Ce processus va :
1. Build l'image du backend NestJS
2. Build l'image du frontend Expo Web
3. Télécharger PostgreSQL et Nginx
4. Créer le réseau Docker
5. Démarrer tous les services

**Durée estimée : 10-15 minutes**

### 3.6 Vérifier que tout fonctionne

```bash
# Vérifier l'état des conteneurs
docker-compose -f docker-compose.prod.yml ps

# Tous les services doivent être "Up"
# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f

# Vérifier les logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### 3.7 Tester l'application

```bash
# Depuis votre machine locale
curl http://[IP_SERVEUR]/api/health

# Ou ouvrez dans votre navigateur
http://[IP_SERVEUR]
```

Vous devriez voir votre application !

---

## 4. Configuration SSL avec Let's Encrypt (HTTPS)

### 4.1 Prérequis

- Un nom de domaine pointant vers votre serveur
- Le domaine doit être accessible via HTTP (port 80)

### 4.2 Générer le certificat SSL

```bash
# Sur le serveur, en tant que deploy
cd /opt/tapaslaref

# Définir les variables
export DOMAIN=votre-domaine.com
export SSL_EMAIL=votre-email@example.com

# Exécuter le script SSL
./scripts/setup-ssl.sh
```

### 4.3 Activer HTTPS dans Nginx

```bash
# Éditer la configuration nginx
nano nginx/nginx.conf
```

1. Décommentez toute la section `server { listen 443 ssl http2; ... }`
2. Remplacez `votre-domaine.com` par votre domaine réel
3. Décommentez la redirection HTTP vers HTTPS dans la section port 80

```nginx
# Dans la section server { listen 80; ... }
location / {
    return 301 https://$host$request_uri;
}
```

### 4.4 Redémarrer Nginx

```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

### 4.5 Tester HTTPS

Ouvrez `https://votre-domaine.com` dans votre navigateur. Vous devriez voir le cadenas vert !

### 4.6 Renouvellement automatique du certificat

Ajoutez une tâche cron pour renouveler automatiquement le certificat :

```bash
# Éditer crontab
crontab -e

# Ajouter cette ligne (renouvellement tous les jours à 2h du matin)
0 2 * * * cd /opt/tapaslaref && docker-compose -f docker-compose.prod.yml run --rm certbot renew && docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 5. Configuration du Déploiement Automatique (CI/CD)

### 5.1 Configurer les secrets GitHub

1. Allez dans votre repository GitHub
2. Settings > Secrets and variables > Actions
3. Cliquez sur "New repository secret"
4. Ajoutez les secrets suivants :

| Nom | Valeur |
|-----|--------|
| `SSH_PRIVATE_KEY` | Votre clé SSH privée pour se connecter au serveur |
| `SERVER_IP` | L'adresse IP de votre serveur Hetzner |
| `SERVER_USER` | `deploy` |

### 5.2 Générer une clé SSH pour GitHub Actions

Sur votre machine locale :

```bash
# Générer une nouvelle paire de clés
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key

# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/github_actions_key.pub deploy@[IP_SERVEUR]

# Afficher la clé privée (à copier dans GitHub Secrets)
cat ~/.ssh/github_actions_key
```

### 5.3 Tester le déploiement automatique

```bash
# Faire un changement et pousser sur main
git add .
git commit -m "Test déploiement automatique"
git push origin main
```

GitHub Actions va automatiquement :
1. Se connecter au serveur
2. Pull les dernières modifications
3. Rebuild les conteneurs
4. Redémarrer l'application

Suivez le déploiement dans l'onglet "Actions" de GitHub.

---

## 6. Maintenance et Backups

### 6.1 Backup de la base de données

```bash
# Exécuter le script de backup
cd /opt/tapaslaref
./scripts/backup-db.sh
```

Les backups sont stockés dans `/opt/backups/tapaslaref/` et conservés 7 jours.

### 6.2 Automatiser les backups

```bash
# Éditer crontab
crontab -e

# Ajouter cette ligne (backup tous les jours à 3h du matin)
0 3 * * * /opt/tapaslaref/scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

### 6.3 Restaurer un backup

```bash
# Lister les backups disponibles
ls -lh /opt/backups/tapaslaref/

# Restaurer un backup
cd /opt/tapaslaref
gunzip < /opt/backups/tapaslaref/backup_YYYYMMDD_HHMMSS.sql.gz | \
docker-compose -f docker-compose.prod.yml exec -T db psql \
  -U postgres \
  -d tapaslaref_prod
```

### 6.4 Mise à jour de l'application

```bash
# Se connecter au serveur
ssh deploy@[IP_SERVEUR]
cd /opt/tapaslaref

# Pull les dernières modifications
git pull origin main

# Rebuild et redémarrer
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Nettoyer les anciennes images
docker system prune -af
```

### 6.5 Voir les logs

```bash
# Logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Logs des 100 dernières lignes
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### 6.6 Redémarrer un service

```bash
# Redémarrer le backend
docker-compose -f docker-compose.prod.yml restart backend

# Redémarrer tous les services
docker-compose -f docker-compose.prod.yml restart
```

---

## 7. Monitoring et Optimisation

### 7.1 Surveiller l'utilisation des ressources

```bash
# CPU, RAM, disque
htop

# Utilisation Docker
docker stats

# Espace disque
df -h
```

### 7.2 Optimisation de la base de données

```bash
# Se connecter à PostgreSQL
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -d tapaslaref_prod

# Analyser les performances
ANALYZE;

# Nettoyer les données obsolètes
VACUUM;
```

### 7.3 Limiter la taille des logs Docker

```bash
# Éditer le fichier daemon.json
sudo nano /etc/docker/daemon.json

# Ajouter
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

# Redémarrer Docker
sudo systemctl restart docker
```

---

## 8. Sécurité

### 8.1 Mise à jour régulière du système

```bash
# Mise à jour mensuelle recommandée
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get autoremove -y
```

### 8.2 Surveiller les tentatives de connexion

```bash
# Voir les logs fail2ban
sudo fail2ban-client status sshd

# Voir les IPs bannies
sudo fail2ban-client get sshd banned
```

### 8.3 Changer les mots de passe régulièrement

Pensez à changer régulièrement :
- Le mot de passe de la base de données
- Le JWT_SECRET
- Les clés API (Cloudinary, etc.)

---

## 9. Dépannage

### Problème : Le site ne charge pas

```bash
# Vérifier l'état des conteneurs
docker-compose -f docker-compose.prod.yml ps

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs

# Vérifier le firewall
sudo ufw status
```

### Problème : Le backend ne se connecte pas à la base

```bash
# Vérifier que la base de données est accessible
docker-compose -f docker-compose.prod.yml exec backend ping db

# Vérifier les variables d'environnement
docker-compose -f docker-compose.prod.yml exec backend env | grep DATABASE
```

### Problème : Certificat SSL expiré

```bash
# Forcer le renouvellement
docker-compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
docker-compose -f docker-compose.prod.yml restart nginx
```

### Problème : Manque d'espace disque

```bash
# Nettoyer Docker
docker system prune -af --volumes

# Nettoyer les logs
sudo journalctl --vacuum-time=7d

# Supprimer les anciens backups
find /opt/backups/tapaslaref -name "backup_*.sql.gz" -type f -mtime +30 -delete
```

---

## 10. Coûts Estimés

| Service | Coût mensuel |
|---------|--------------|
| VPS Hetzner CX23 | ~4€ |
| Nom de domaine | ~1€ |
| Certificat SSL (Let's Encrypt) | Gratuit |
| **Total** | **~5€/mois** |

---

## 11. Support et Ressources

- [Documentation Hetzner](https://docs.hetzner.com/)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation Expo](https://docs.expo.dev/)
- [Let's Encrypt](https://letsencrypt.org/)

---

## Checklist de Déploiement

- [ ] VPS Hetzner créé et accessible
- [ ] Nom de domaine configuré (optionnel)
- [ ] Serveur configuré avec setup-server.sh
- [ ] Repository cloné dans /opt/tapaslaref
- [ ] Fichier .env créé et configuré
- [ ] Application déployée avec docker-compose
- [ ] Application accessible via HTTP
- [ ] SSL configuré (si domaine)
- [ ] Redirection HTTP → HTTPS activée
- [ ] Secrets GitHub configurés
- [ ] Déploiement automatique testé
- [ ] Backup automatique configuré
- [ ] Monitoring mis en place

---

**Félicitations ! Votre application TapasLaRef est maintenant en ligne ! 🚀**

Pour toute question, consultez les logs ou contactez votre administrateur système.
