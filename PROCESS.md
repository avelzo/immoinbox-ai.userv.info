# Préparer une démo vidéo courte et convaincante

Le but n'est pas de montrer du code. Le but est que quelqu'un pense : "OK, ça peut vraiment me faire gagner du temps."

## Format recommandé
- 2 minutes max
- Capture écran simple
- Voix naturelle
- Pas de montage compliqué

Vous pouvez utiliser :
- Loom
- OBS Studio

Loom est le plus simple.

## Scénario exact de la vidéo

### 1. Intro (10 sec)
Ouvrez : http://localhost:3000
Dis quelque chose comme : "J’ai développé un assistant IA qui aide les agences immobilières à traiter automatiquement leurs emails entrants."

### 2. Montrer le dashboard (20 sec)
Va sur : /dashboard/emails
Montre :
- Catégories
- Urgences
- Résumés
- Statuts

Dis : "Chaque email est automatiquement classé, résumé et priorisé."

### 3. Montrer un email urgent (20 sec)
Clique sur :
- Fuite
- Chauffage
- Porte cassée

Montre :
- Résumé IA
- Action recommandée
- Réponse suggérée

Puis clique : "Copier la réponse"
Dis : "L'IA prépare même une réponse professionnelle modifiable."

### 4. Montrer n8n rapidement (20 sec)
Montre :
- Le workflow IMAP
- Analyse IA
- Sauvegarde

Pas besoin de détails techniques.
Dis : "Quand un email arrive, le workflow analyse automatiquement le message et l'ajoute au dashboard."

### 5. Démonstration live (30 sec)
Envoie un vrai email test :
Sujet : Chauffage en panne
Puis :
- Montre n8n
- Montre le nouvel email apparaître dans le dashboard
- Montre l'urgence détectée

C'est LE moment important.

### 6. Conclusion (10 sec)
Retour landing page.
Dis : "L'objectif est de réduire le temps passé sur les emails répétitifs et de mieux gérer les urgences."

## Très important
La vidéo doit montrer :
- Problème réel → Automatisation → Résultat visible

Pas :
- Du code
- Docker
- Prisma
- Architecture

Ensuite, quand la vidéo est prête :

### Bloc suivant : Prospection réelle
- LinkedIn
- Email agences
- Page contact
- Message court
- Premiers retours

C'est là que le projet commence à devenir potentiellement rentable.





## Docker update prisma  

```bash
docker exec -it immoinbox-app sh

npx prisma db push
npx prisma generate


npm run seed:demo



docker compose restart app
```