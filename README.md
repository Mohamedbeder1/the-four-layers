# NIRD – Les Quatre Couches

Bienvenue sur l’application NIRD, un site web éducatif développé avec Next.js, TypeScript et Tailwind CSS. Ce projet propose une navigation interactive inspirée du terminal Linux et plusieurs modules ludiques pour apprendre.

## Fonctionnalités
- Navigation par commandes dans un terminal virtuel
- Pages dédiées : Accueil, À propos, Village, Quiz, Ressources, Communauté, Jeu de Décisions
- Thème personnalisable
- Interface moderne et responsive

## Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd nird/frontend
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Aucune variable d’environnement n’est requise**
   Cette application fonctionne sans configuration supplémentaire.

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   Accédez à [http://localhost:3000](http://localhost:3000)

## Déploiement sur Vercel

1. Poussez votre projet sur GitHub ou GitLab.
2. Connectez votre dépôt à Vercel ([https://vercel.com/import](https://vercel.com/import)).
3. Aucun backend n’est nécessaire. Vous n’avez pas besoin de configurer de variables d’environnement spécifiques.
4. Vercel détectera automatiquement Next.js et déploiera votre site.

## Structure du projet
```
app/           # Pages principales
components/    # Composants réutilisables
contexts/      # Contextes React
public/        # Fichiers statiques (images, icônes)
...
```

## Commandes utiles
- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Construire l’application pour la production
- `npm run start` : Lancer l’application en mode production

## Personnalisation
- Modifiez le logo dans `components/Header.tsx` (actuellement un pingouin SVG)
- Ajoutez des commandes dans le terminal via `components/TerminalNavigator.tsx`

## Licence
Ce projet est open source. Vous pouvez le modifier et le redistribuer selon vos besoins.

---

**Remarque :** Cette application fonctionne entièrement côté client et ne nécessite aucun backend.

---

Pour toute question ou suggestion, ouvrez une issue sur le dépôt ou contactez l’équipe de développement.
