#!/bin/bash

# Script pour configurer SSL avec Let's Encrypt
# À exécuter depuis le répertoire du projet sur le VPS

set -e

echo "=== Configuration SSL avec Let's Encrypt ==="

# Vérifier que les variables sont définies
if [ -z "$DOMAIN" ]; then
    echo "Erreur: La variable DOMAIN n'est pas définie"
    echo "Utilisez: export DOMAIN=votre-domaine.com"
    exit 1
fi

if [ -z "$SSL_EMAIL" ]; then
    echo "Erreur: La variable SSL_EMAIL n'est pas définie"
    echo "Utilisez: export SSL_EMAIL=votre-email@example.com"
    exit 1
fi

echo "Domaine: $DOMAIN"
echo "Email: $SSL_EMAIL"

# Créer les dossiers nécessaires
mkdir -p nginx/ssl

# Vérifier que les services sont en cours d'exécution
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "Démarrage des services..."
    docker-compose -f docker-compose.prod.yml up -d
    sleep 10
fi

# Obtenir le certificat SSL
echo "Obtention du certificat SSL..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $SSL_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Mettre à jour la configuration nginx pour activer HTTPS
echo "Activation de la configuration HTTPS dans nginx..."
echo "IMPORTANT: Décommentez la section HTTPS dans nginx/nginx.conf"
echo "et remplacez 'votre-domaine.com' par votre domaine réel"

# Recharger nginx
echo "Rechargement de nginx..."
docker-compose -f docker-compose.prod.yml restart nginx

echo "=== Configuration SSL terminée ==="
echo ""
echo "N'oubliez pas de :"
echo "1. Éditer nginx/nginx.conf et décommenter la section HTTPS"
echo "2. Remplacer 'votre-domaine.com' par $DOMAIN"
echo "3. Décommenter la redirection HTTP vers HTTPS"
echo "4. Redémarrer nginx: docker-compose -f docker-compose.prod.yml restart nginx"
