##Installation du système

- Décompressez le contenu du zip dans le repertoire *www* ou *htdocs* selon le serveur que vous utilisez dans un dossier portant le nom *tyketd-test*. Il pourrait en avoir un autre, ca ne poserait aucun problème. C'est juste pour faciliter la tache avec le lien ci-dessous
- Création de la base de données : appdb dans phpmyadmin ou en ligne de commande selon votre choix.
- Taper ceci en ligne de commande (veuillez a être situé dans le dossier nommé *API*)
`php artisan migrate`
Celle ci creera les tables
- Puis tapez la commande
`php artisan serve`
Celle ci lancera  l'application

Puis ouvrez la ligne de commande dans le dossier nommé *Application* et lancez cette commande
`bower install`

Vous n'aurez qu'a aller sur votre navigateur et entrer le lien suivant

[http://localhost/tyketd-test/application](http://localhost/tyketd-test/application)

