# Déploiement TapasLaRef - Guide Rapide

Guide de démarrage rapide pour déployer sur Hetzner VPS. Pour le guide complet, voir [DEPLOIEMENT.md](./DEPLOIEMENT.md).

## En 5 minutes

### 1. Créer le VPS Hetzner
- Allez sur [Hetzner Cloud](https://console.hetzner.cloud/)
- Créez un serveur Ubuntu 22.04 LTS, CX23 (~4€/mois)
- Notez l'adresse IP

### 2. Configurer le serveur
```bash
# Se connecter au serveur
ssh root@[IP_SERVEUR]

# Télécharger et exécuter le script de configuration
curl -o setup.sh https://raw.githubusercontent.com/[USERNAME]/tapaslaref/main/scripts/setup-server.sh
chmod +x setup.sh
./setup.sh

# Passer à l'utilisateur deploy
su - deploy
```

### 3. Déployer l'application
```bash
# Cloner le repository
cd /opt/tapaslaref
git clone [URL_REPOSITORY] .

# Configurer l'environnement
cp .env.example .env
nano .env  # Éditer avec vos valeurs

# Lancer l'application
docker-compose -f docker-compose.prod.yml up -d --build
```

### 4. Vérifier que ça marche
```bash
# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f

# Tester
curl http://[IP_SERVEUR]
```

Votre application est en ligne à l'adresse : `http://[IP_SERVEUR]`

## Configuration SSL (optionnel)

Si vous avez un nom de domaine :

```bash
# Configurer DNS (type A) pour pointer vers votre IP
# Puis sur le serveur :
export DOMAIN=votre-domaine.com
export SSL_EMAIL=votre-email@example.com
./scripts/setup-ssl.sh

# Éditer nginx/nginx.conf et décommenter la section HTTPS
nano nginx/nginx.conf

# Redémarrer
docker-compose -f docker-compose.prod.yml restart nginx
```

## Commandes Utiles

```bash
# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f

# Redémarrer
docker-compose -f docker-compose.prod.yml restart

# Arrêter
docker-compose -f docker-compose.prod.yml down

# Backup de la base de données
./scripts/backup-db.sh

# Mise à jour
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

## Structure des Fichiers

```
tapaslaref/
├── backend/
│   ├── Dockerfile              # Image Docker backend
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile              # Image Docker frontend
│   ├── nginx.conf              # Config nginx frontend
│   └── .dockerignore
├── nginx/
│   └── nginx.conf              # Config nginx reverse proxy
├── scripts/
│   ├── setup-server.sh         # Configuration initiale serveur
│   ├── setup-ssl.sh            # Configuration SSL
│   └── backup-db.sh            # Backup base de données
├── .github/workflows/
│   └── deploy.yml              # Déploiement automatique
├── docker-compose.prod.yml     # Orchestration production
├── .env.example                # Variables d'environnement
└── DEPLOIEMENT.md              # Guide complet
```

## Coût Mensuel

- VPS Hetzner CX23 : ~4€/mois
- Nom de domaine : ~1€/mois
- SSL : Gratuit (Let's Encrypt)

**Total : ~5€/mois**

## Support

Pour le guide complet avec toutes les explications : [DEPLOIEMENT.md](./DEPLOIEMENT.md)
