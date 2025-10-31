#!/bin/bash

# Script de backup de la base de données PostgreSQL
# À exécuter sur le VPS

set -e

# Configuration
BACKUP_DIR="/opt/backups/tapaslaref"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"
RETENTION_DAYS=7

echo "=== Backup de la base de données ==="

# Créer le répertoire de backup s'il n'existe pas
mkdir -p $BACKUP_DIR

# Charger les variables d'environnement
cd /opt/tapaslaref
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Erreur: fichier .env introuvable"
    exit 1
fi

# Effectuer le backup
echo "Création du backup..."
docker-compose -f docker-compose.prod.yml exec -T db pg_dump \
    -U ${POSTGRES_USER:-postgres} \
    ${POSTGRES_DB:-tapaslaref} | gzip > $BACKUP_FILE

# Vérifier que le backup a réussi
if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "Backup créé avec succès: $BACKUP_FILE ($SIZE)"
else
    echo "Erreur: le backup a échoué"
    exit 1
fi

# Nettoyer les anciens backups
echo "Nettoyage des backups de plus de $RETENTION_DAYS jours..."
find $BACKUP_DIR -name "backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "=== Backup terminé ==="

# Lister les backups disponibles
echo ""
echo "Backups disponibles:"
ls -lh $BACKUP_DIR/backup_*.sql.gz 2>/dev/null || echo "Aucun backup trouvé"
