from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Question, BlogPost, UserQuestion, HumanQuizQuestion


class Command(BaseCommand):
    help = 'Seed database with initial data (users, village questions, about-page quiz, blog posts)'

    def handle(self, *args, **options):
        self.stdout.write('Creating users...')

        # Create users
        users_data = [
            {
                'username': 'admin',
                'email': 'admin@nird.fr',
                'password': 'admin123',
                'first_name': 'Admin',
                'last_name': 'NIRD',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'username': 'teacher1',
                'email': 'teacher1@nird.fr',
                'password': 'teacher123',
                'first_name': 'Marie',
                'last_name': 'Dupont',
            },
            {
                'username': 'teacher2',
                'email': 'teacher2@nird.fr',
                'password': 'teacher123',
                'first_name': 'Jean',
                'last_name': 'Martin',
            },
            {
                'username': 'student1',
                'email': 'student1@nird.fr',
                'password': 'student123',
                'first_name': 'Lucas',
                'last_name': 'Bernard',
            },
        ]

        for user_data in users_data:
            password = user_data.pop('password')
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                user.set_password(password)
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))
            else:
                self.stdout.write(self.style.WARNING(f'User already exists: {user.username}'))

        # Get users
        admin_user = User.objects.get(username='admin')
        teacher1 = User.objects.get(username='teacher1')
        teacher2 = User.objects.get(username='teacher2')

        self.stdout.write('Creating village questions...')

        # Village Questions (Question model, with age_group + level)
        village_questions = [
            {
                'question_text': 'Le laboratoire a 20 vieux PC. Vous pouvez installer Linux ou acheter de nouvelles licences. Que choisissez-vous ?',
                'question_type': 'village',
                'level': 'beginner',
                'age_group': '14-',
                'building_id': 'lab',
                'options': [
                    {'text': 'Installer Linux', 'points': 10, 'feedback': "Excellent choix ! Vous économisez de l'argent et prolongez la vie des PC."},
                    {'text': 'Acheter de nouvelles licences', 'points': -5, 'feedback': 'Cela coûte cher et crée des déchets électroniques.'},
                ],
                'correct_answer': 0,
                'points': 10,
            },
            {
                'question_text': 'Vous cherchez des ressources pédagogiques. Que préférez-vous ?',
                'question_type': 'village',
                'level': 'beginner',
                'age_group': '14-',
                'building_id': 'library',
                'options': [
                    {'text': 'Ressources éducatives libres', 'points': 8, 'feedback': 'Parfait ! Gratuit, modifiable et respectueux des données.'},
                    {'text': 'Plateformes propriétaires payantes', 'points': -3, 'feedback': 'Cela crée une dépendance et des coûts récurrents.'},
                ],
                'correct_answer': 0,
                'points': 8,
            },
            {
                'question_text': 'Votre budget est limité. Quelle stratégie adoptez-vous ?',
                'question_type': 'village',
                'level': 'intermediate',
                'age_group': '15-17',
                'building_id': 'cityhall',
                'options': [
                    {'text': 'Reconditionner et utiliser Linux', 'points': 12, 'feedback': 'Stratégie intelligente ! Économique et écologique.'},
                    {'text': 'Acheter du matériel neuf avec Windows', 'points': -8, 'feedback': 'Coûteux et pas durable à long terme.'},
                ],
                'correct_answer': 0,
                'points': 12,
            },
            {
                'question_text': "Comment réduire l'empreinte numérique de votre école ?",
                'question_type': 'village',
                'level': 'advanced',
                'age_group': '18+',
                'building_id': 'eco',
                'options': [
                    {'text': 'Réduire le stockage cloud et utiliser des serveurs locaux', 'points': 10, 'feedback': 'Excellente décision ! Sobriété et souveraineté.'},
                    {'text': 'Utiliser plus de services cloud', 'points': -5, 'feedback': "Cela augmente la consommation d'énergie et les coûts."},
                ],
                'correct_answer': 0,
                'points': 10,
            },
            {
                'question_text': 'Quelle distribution Linux est recommandée pour les écoles primaires ?',
                'question_type': 'village',
                'level': 'beginner',
                'age_group': '14-',
                'building_id': 'lab',
                'options': [
                    {'text': 'PrimTux', 'points': 10, 'feedback': 'Correct ! PrimTux est spécialement conçue pour les écoles primaires.'},
                    {'text': 'Windows 11', 'points': -5, 'feedback': "Windows n'est pas une distribution Linux et coûte cher."},
                    {'text': 'Ubuntu', 'points': 5, 'feedback': 'Ubuntu fonctionne mais PrimTux est mieux adaptée pour les écoles.'},
                ],
                'correct_answer': 0,
                'points': 10,
            },
        ]

        for q_data in village_questions:
            question, created = Question.objects.get_or_create(
                question_text=q_data['question_text'],
                defaults={
                    'question_type': q_data['question_type'],
                    'level': q_data['level'],
                    'age_group': q_data['age_group'],
                    'building_id': q_data['building_id'],
                    'options': q_data['options'],
                    'correct_answer': q_data['correct_answer'],
                    'points': q_data['points'],
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created village question: {question.question_text[:50]}...'))
            else:
                self.stdout.write(self.style.WARNING(f'Village question already exists: {question.question_text[:50]}...'))

        self.stdout.write('Creating human quiz questions (About page)...')

        # Quiz Questions (HumanQuizQuestion model, only level)
        quiz_questions = [
            {
                'question_text': 'Combien de PC deviennent obsolètes à cause de la fin du support de Windows 10 ?',
                'level': 'beginner',
                'options': [
                    {'text': '100 millions', 'points': 5, 'feedback': "Pas tout à fait, c'est plus que ça."},
                    {'text': '400 millions', 'points': 10, 'feedback': 'Correct ! Plus de 400 millions d’ordinateurs dans le monde.'},
                    {'text': '1 milliard', 'points': 5, 'feedback': "C'est beaucoup, mais pas encore 1 milliard."},
                ],
                'correct_answer': 1,
                'points': 10,
            },
            {
                'question_text': 'Quels sont les trois piliers de la démarche NIRD ?',
                'level': 'intermediate',
                'options': [
                    {'text': 'Inclusion, Responsabilité, Durabilité', 'points': 10, 'feedback': 'Parfait ! Ce sont bien les trois piliers de NIRD.'},
                    {'text': 'Économie, Écologie, Éducation', 'points': 5, 'feedback': 'Pas exactement, mais proche des valeurs.'},
                    {'text': 'Linux, Libre, Libre', 'points': 3, 'feedback': "Linux est un outil, pas un pilier."},
                ],
                'correct_answer': 0,
                'points': 10,
            },
            {
                'question_text': "Quel pourcentage de l'empreinte environnementale du numérique provient de la fabrication des équipements ?",
                'level': 'advanced',
                'options': [
                    {'text': '50%', 'points': 5, 'feedback': "C'est plus que ça."},
                    {'text': '75%', 'points': 10, 'feedback': "Exactement ! 75% de l'impact vient de la fabrication."},
                    {'text': '90%', 'points': 5, 'feedback': "C'est beaucoup, mais pas 90%."},
                ],
                'correct_answer': 1,
                'points': 10,
            },
        ]

        for q_data in quiz_questions:
            quiz_q, created = HumanQuizQuestion.objects.get_or_create(
                question_text=q_data['question_text'],
                defaults={
                    'level': q_data['level'],
                    'options': q_data['options'],
                    'correct_answer': q_data['correct_answer'],
                    'points': q_data['points'],
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created human quiz question: {quiz_q.question_text[:50]}...'))
            else:
                self.stdout.write(self.style.WARNING(f'Human quiz question already exists: {quiz_q.question_text[:50]}...'))

        self.stdout.write('Creating blog posts...')

        # Blog Posts
        blog_posts = [
            {
                'title': 'Réutiliser 50 PC a sauvé le budget de notre école !',
                'content': '''Le lycée Carnot de Bruay-la-Buissière a réussi à économiser des milliers d'euros en reconditionnant des PC avec Linux. 

Grâce à un club informatique animé par des élèves passionnés, nous avons pu donner une seconde vie à 50 ordinateurs qui allaient être jetés. 

Les élèves ont appris à installer Linux, à configurer les machines, et à les distribuer aux écoles primaires du secteur. 

Cette initiative a non seulement permis d'économiser de l'argent, mais aussi de sensibiliser les élèves à l'écologie et à la sobriété numérique.''',
                'excerpt': "Découvrez comment le lycée Carnot a économisé des milliers d'euros en reconditionnant des PC avec Linux.",
                'category': 'stories',
                'author': teacher1,
                'status': 'approved',
                'gemini_verified': True,
                'upvote_count': 0,
            },
            {
                'title': 'Linux en classe : Guide pas à pas',
                'content': '''Installer Linux dans votre établissement scolaire peut sembler compliqué, mais c'est en fait plus simple qu'il n'y paraît.

**Étape 1 : Choisir la distribution**
- Pour les écoles primaires : PrimTux
- Pour le secondaire : Linux NIRD

**Étape 2 : Préparer les machines**
- Vérifier les spécifications minimales
- Créer une clé USB bootable

**Étape 3 : Installation**
- Booter sur la clé USB
- Suivre l'assistant d'installation
- Configurer les comptes utilisateurs

**Étape 4 : Configuration**
- Installer les logiciels éducatifs
- Configurer le réseau
- Former les enseignants

Avec un peu de préparation, la migration vers Linux peut se faire en douceur !''',
                'excerpt': 'Un guide complet pour installer et utiliser Linux dans votre établissement scolaire.',
                'category': 'tutorials',
                'author': teacher2,
                'status': 'approved',
                'gemini_verified': True,
                'upvote_count': 0,
            },
            {
                'title': 'Semaine de la Sobriété Numérique : Défis étudiants',
                'content': '''Notre établissement a organisé une semaine de sensibilisation à la sobriété numérique.

Les élèves ont participé à plusieurs défis :
- Réduire leur consommation de données
- Utiliser des logiciels libres
- Réparer plutôt que jeter

Les résultats ont été impressionnants : 30% de réduction de la consommation énergétique du parc informatique en une semaine !

Cette initiative a montré que les élèves sont sensibles aux enjeux écologiques et prêts à changer leurs habitudes.''',
                'excerpt': 'Retour sur les défis organisés dans les écoles pour sensibiliser à la sobriété numérique.',
                'category': 'challenges',
                'author': teacher1,
                'status': 'approved',
                'gemini_verified': True,
                'upvote_count': 0,
            },
            {
                'title': "Nouvelles distributions Linux pour l'éducation",
                'content': '''De nouvelles versions des distributions Linux éducatives sont disponibles !

**PrimTux 8** : Nouvelle version avec interface améliorée et nouveaux logiciels éducatifs.

**Linux NIRD** : Première version officielle pour le secondaire, avec support complet pour la spécialité NSI.

Ces distributions sont le fruit du travail collaboratif de la communauté éducative et sont entièrement gratuites et libres.

Téléchargez-les dès maintenant sur les sites officiels !''',
                'excerpt': 'Découvrez les dernières mises à jour des distributions PrimTux et Linux NIRD.',
                'category': 'news',
                'author': admin_user,
                'status': 'approved',
                'gemini_verified': True,
                'upvote_count': 0,
            },
        ]

        for post_data in blog_posts:
            post, created = BlogPost.objects.get_or_create(
                title=post_data['title'],
                defaults=post_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created blog post: {post.title}'))
            else:
                self.stdout.write(self.style.WARNING(f'Blog post already exists: {post.title}'))

        self.stdout.write(self.style.SUCCESS('\n✅ Seed data created successfully!'))
        self.stdout.write('\nUsers created / ensured:')
        self.stdout.write('  - admin / admin123 (superuser)')
        self.stdout.write('  - teacher1 / teacher123')
        self.stdout.write('  - teacher2 / teacher123')
        self.stdout.write('  - student1 / student123')
        self.stdout.write(f'\nVillage questions (Question) seeded: {len(village_questions)}')
        self.stdout.write(f'About quiz questions (HumanQuizQuestion) seeded: {len(quiz_questions)}')
        self.stdout.write(f'Blog posts created: {len(blog_posts)}')


