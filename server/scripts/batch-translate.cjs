const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const translations = [
  {
    id: "e8c2c256-c459-45fa-9f83-e7ec80bdcbd2",
    question_fr: "Un technicien découvre un impact significatif sur le revêtement de l'avion lors d'une inspection. Le manuel de maintenance indique que ce type de dommage peut être réparé à l'aide d'une pièce rapportée. Quelle est la PROCHAINE étape du technicien avant de procéder à la réparation ?",
    explanation_fr: "Avant d'appliquer une pièce rapportée, il est crucial d'inspecter la structure sous-jacente pour s'assurer qu'aucun dommage important ne compromettrait l'efficacité de la réparation. Suivre les directives AC 43.13 garantit que les réparations sont effectuées en toute sécurité et correctement.",
    options_fr: JSON.stringify(["Préparer la pièce rapportée et procéder immédiatement à la réparation.", "Inspecter la structure sous-jacente pour détecter les signes de dommage ou de déformation.", "Documenter l'impact et attendre l'approbation du gestionnaire.", "Consulter le fabricant de l'aéronef pour obtenir l'approbation de la méthode de réparation."])
  },
  {
    id: "e796b9ad-1c45-4af4-b75f-15aa59289e04",
    question_fr: "Un technicien de maintenance s'apprête à effectuer une inspection structurelle d'un aéronef. Le technicien note que l'avion n'est pas dans un hangar mais garé sur l'aire de trafic. Quel est le facteur le PLUS critique que le technicien doit prendre en compte ?",
    explanation_fr: "Les conditions météorologiques peuvent avoir un impact significatif sur la visibilité et l'accessibilité des composants de l'avion lors de l'inspection. La RAC 571.03 souligne l'importance de réaliser les inspections dans des conditions optimales pour garantir la rigueur et la précision, ce qui en fait le facteur le plus critique.",
    options_fr: JSON.stringify(["Le poids et l'équilibre de l'avion pendant l'inspection.", "Les conditions météorologiques qui peuvent affecter la qualité de l'inspection.", "La disponibilité des outils et de l'équipement nécessaires à l'inspection.", "La présence d'autres personnes qui pourraient distraire le technicien."])
  },
  {
    id: "5b52346e-22a1-4e78-a8f5-47cb594fa6c4",
    question_fr: "Un technicien effectue une mainlevée de maintenance sur un aéronef qui a récemment subi d'importantes réparations structurelles. Laquelle des actions suivantes est REQUISE avant de signer la mainlevée ?",
    explanation_fr: "Avant de signer une mainlevée de maintenance, le technicien doit s'assurer que toutes les réparations sont correctement documentées et conformes aux normes réglementaires, comme indiqué dans la RAC 573. Ceci est essentiel pour maintenir la navigabilité et la sécurité de l'aéronef.",
    options_fr: JSON.stringify(["Vérifier que toutes les réparations ont été documentées et sont conformes aux données de maintenance approuvées.", "S'assurer que l'avion a assez de carburant pour le prochain vol.", "Effectuer une inspection visuelle de l'extérieur de l'avion.", "Consulter le pilote pour tout problème en suspens avant la mainlevée."])
  },
  {
    id: "bf5458c7-e9f3-4030-878f-db364d152fd7",
    question_fr: "Lors d'un contrôle de maintenance programmé, un technicien constate que l'un des pneus du train d'atterrissage principal de l'avion est excessivement usé sur un côté. Quelle est la MEILLEURE action du technicien ?",
    explanation_fr: "L'usure excessive d'un seul côté d'un pneu indique souvent des problèmes d'alignement. Il est essentiel de traiter l'alignement avant de remplacer le pneu pour éviter une usure ultérieure. La RAC 571.03 souligne l'importance de traiter ces constatations pour garantir la navigabilité continue.",
    options_fr: JSON.stringify(["Remplacer le pneu et documenter le remplacement dans les dossiers techniques.", "Gonfler le pneu à la pression recommandée pour uniformiser l'usure.", "Vérifier l'alignement du train d'atterrissage et effectuer les ajustements nécessaires.", "Surveiller l'usure du pneu et y remédier lors du prochain cycle de maintenance."])
  },
  {
    id: "c70ecaa3-9096-4846-93e3-3d49f392f881",
    question_fr: "Un technicien est chargé de réparer une nervure fissurée dans la structure de l'aile. Le manuel de maintenance précise que la nervure doit être remplacée plutôt que réparée. Quelle est la marche à suivre la plus appropriée ?",
    explanation_fr: "Suivre le manuel de maintenance est essentiel pour garantir la conformité aux normes de sécurité. La RAC 571 exige le respect des spécifications du fabricant pour les réparations, et le remplacement de la nervure comme indiqué est essentiel pour maintenir l'intégrité structurelle de l'aéronef.",
    options_fr: JSON.stringify(["Réparer la nervure car elle n'affecte pas la résistance globale de l'avion.", "Remplacer la nervure conformément aux instructions du manuel de maintenance.", "Consulter le fabricant de l'aéronef pour des méthodes de réparation alternatives.", "Documenter la fissure et laisser la nervure non réparée jusqu'à la prochaine inspection."])
  },
  {
    id: "a2051486-ec40-4de6-86e2-20f0903ec079",
    question_fr: "Après avoir effectué une inspection approfondie, un technicien identifie des signes de fissuration par fatigue le long du longeron de l'aile. Quelle est l'action la PLUS appropriée à entreprendre ?",
    explanation_fr: "La fissuration par fatigue dans des composants structurels critiques tels que le longeron d'aile présente un risque important pour la sécurité. La mesure appropriée consiste à retirer l'aile pour un examen spécialisé, conformément à la RAC 571.02, qui exige que ces constatations soient traitées de manière exhaustive.",
    options_fr: JSON.stringify(["Documenter les constatations et surveiller tout changement.", "Appliquer une réparation temporaire et poursuivre les opérations.", "Retirer l'aile et l'envoyer pour un examen détaillé dans un atelier de réparation spécialisé.", "Réparer les fissures avec un matériau approprié conformément au manuel de maintenance."])
  },
  {
    id: "0c0d3100-4f59-49e7-af01-ce2086ec37d4",
    question_fr: "Lors d'une tâche de maintenance de routine, un technicien rencontre une modification non documentée de la structure de l'aéronef qui affecte le système de carburant. Quelle est la MEILLEURE marche à suivre pour le technicien ?",
    explanation_fr: "Documenter la modification et la transmettre au responsable de la maintenance est essentiel pour garantir une évaluation appropriée et la conformité aux exigences réglementaires. La RAC 573 exige que toutes les modifications soient documentées et évaluées quant à leur impact sur la navigabilité.",
    options_fr: JSON.stringify(["Procéder à la tâche de maintenance comme prévu car la modification semble mineure.", "Documenter la modification et informer le responsable de maintenance pour obtenir des directives supplémentaires.", "Supprimer la modification et revenir à la conception d'origine.", "Consulter l'équipage de conduite pour comprendre les implications de la modification."])
  },
  {
    id: "bce3624b-7fef-42fa-9085-d8fce277153c",
    question_fr: "Lors d'une vérification pré-vol, un technicien constate que l'aileron ne bouge pas librement sur toute son amplitude de mouvement. Que doit vérifier le technicien en PREMIER pour résoudre le problème ?",
    explanation_fr: "Vérifier d'abord les points d'articulation est prudent car ils sont essentiels au mouvement de l'aileron. Si les charnières sont corrodées ou obstruées, cela pourrait inhiber le mouvement et affecter la fonction de la surface de commande, ce qui est crucial pour la sécurité comme indiqué dans la RAC 571.",
    options_fr: JSON.stringify(["Les câbles de commande de l'aileron pour détecter des signes d'effilochage ou de coincement.", "Les poids d'équilibrage de l'aileron pour une installation correcte.", "Les points d'articulation de l'aileron pour détecter la corrosion ou l'obstruction.", "Les commandes du cockpit pour un mouvement et un fonctionnement corrects."])
  },
  {
    id: "5bbada59-89e8-4fa4-adf7-9781ef52ced0",
    question_fr: "Lors d'une inspection programmée, un technicien découvre de la corrosion sur le bord d'attaque d'une aile. La corrosion n'est pas documentée dans les dossiers de maintenance. Quelle est la MEILLEURE marche à suivre pour le technicien ?",
    explanation_fr: "Le technicien doit signaler la corrosion et suivre les procédures de réparation approuvées conformément à la RAC 571. Cela garantit le respect des normes de maintenance et des règles de sécurité. Documenter précisément les constatations est essentiel pour maintenir la navigabilité et les dossiers appropriés comme indiqué dans la Norme 573.",
    options_fr: JSON.stringify(["Documenter la corrosion dans le journal de bord et poursuivre l'inspection.", "Ignorer la corrosion car elle n'était pas dans les dossiers de maintenance.", "Signaler la corrosion au superviseur et suivre les procédures de réparation approuvées.", "Effectuer une réparation temporaire et continuer l'inspection."])
  },
  {
    id: "5b7252f5-0160-4c20-9a1e-45881d9e6732",
    question_fr: "Lors d'une inspection pré-vol, un technicien observe que les prises statiques de l'avion sont obstruées par la glace. Quelle est l'action recommandée pour résoudre ce problème ?",
    explanation_fr: "La bonne action est de signaler l'obstruction et de reporter le vol jusqu'à ce que les prises statiques soient dégagées, car ceci est essentiel pour des lectures précises d'altitude et de vitesse anémométrique, garantissant la conformité aux règles de sécurité conformément à la RAC 571.",
    options_fr: JSON.stringify(["Utiliser un liquide de dégivrage pour dégager les prises statiques.", "Signaler l'obstruction et reporter le vol jusqu'à ce que le problème soit résolu.", "Gratter manuellement la glace des prises.", "Démarrer les moteurs pour générer de la chaleur et faire fondre la glace."])
  },
  {
    id: "a7f336a0-da28-4dc1-b10d-bec4945293be",
    question_fr: "Un technicien est chargé de réparer une bosse dans le revêtement en aluminium de l'avion. Quelle est la méthode de réparation la PLUS appropriée ?",
    explanation_fr: "La méthode la plus appropriée pour réparer une bosse dans un revêtement en aluminium est d'utiliser un marteau et une tas pour redonner sa forme originale, conformément aux directives de l'AC 43.13. Cette méthode préserve l'intégrité structurelle du revêtement tout en étant conforme aux normes de maintenance.",
    options_fr: JSON.stringify(["Utiliser un marteau et une tas pour reformer la bosse.", "Découper la zone affectée et la remplacer par un nouveau morceau d'aluminium.", "Appliquer une pièce rapportée sur la bosse et la fixer avec des rivets.", "Remplir la bosse avec de l'époxy et la poncer."])
  },
  {
    id: "fb6fa1b3-d4bb-4bfe-8a9c-f39eb01faaab",
    question_fr: "Un technicien est chargé d'effectuer une inspection détaillée du fuselage de l'avion. Laquelle des méthodes suivantes est la PLUS efficace pour détecter les fissures de fatigue ?",
    explanation_fr: "Les ultrasons sont la méthode la plus efficace pour détecter les fissures de fatigue qui peuvent ne pas être visibles en surface, garantissant la conformité aux normes d'inspection rigoureuses énoncées dans l'AC 43.13 et la RAC 571.",
    options_fr: JSON.stringify(["Inspection visuelle sous un éclairage vif.", "Contrôle par ultrasons pour détecter les défauts sous la surface.", "Inspection par ressuage pour mettre en évidence les fissures superficielles.", "Inspection par particules magnétiques pour les matériaux ferreux."])
  },
  {
    id: "3f31d0e0-93bc-4eef-b43c-8400b7ca2de3",
    question_fr: "Un technicien remarque que le train d'atterrissage ne se rétracte pas complètement lors d'un essai au sol. Laquelle des causes suivantes est la PLUS probable et devrait être investiguée en premier ?",
    explanation_fr: "Un faible niveau de liquide hydraulique est une cause fréquente de non-rétraction complète du train d'atterrissage, car il affecte directement la capacité du système hydraulique à remplir sa fonction. Cela devrait être vérifié en premier conformément aux procédures de dépannage standard de l'AC 43.13.",
    options_fr: JSON.stringify(["Faible niveau de liquide hydraulique dans le réservoir.", "Interrupteurs de train d'atterrissage défectueux.", "Défaut électrique dans le circuit d'indicateur de train.", "Vérins de train d'atterrissage usés."])
  },
  {
    id: "33a254cd-d31e-4c8b-8dad-5e265f939ace",
    question_fr: "Après avoir terminé les réparations sur le bord d'attaque d'une aile, un technicien s'apprête à remettre l'avion en service. Quelle documentation est requise pour une mainlevée de maintenance appropriée ?",
    explanation_fr: "Selon la RAC 571 et la Norme 573, une mainlevée de maintenance signée et une documentation détaillant les réparations effectuées sont essentielles pour garantir la conformité et la responsabilité avant de remettre l'aéronef en service.",
    options_fr: JSON.stringify(["Une mainlevée de maintenance signée et une description détaillée du travail effectué.", "Seulement l'inscription dans le journal de bord indiquant que l'avion est navigable.", "Une confirmation verbale du technicien responsable.", "Aucune documentation n'est nécessaire si les réparations sont esthétiques."])
  },
  {
    id: "a1aa4faf-ae82-4249-a295-8be9e31fb9c0",
    question_fr: "Lors d'une inspection programmée, un technicien trouve plusieurs zones de corrosion sur la structure de l'aile de l'avion. Quelle est la PREMIÈRE étape la plus appropriée pour traiter ce problème ?",
    explanation_fr: "La première étape lorsque de la corrosion est constatée est d'évaluer son étendue et de se référer au manuel de maintenance du fabricant pour les procédures de réparation spécifiques, ce qui est conforme à la RAC 571. Cela garantit que les réparations sont effectuées selon des méthodes approuvées, maintenant ainsi la navigabilité.",
    options_fr: JSON.stringify(["Documenter les constatations dans le journal de bord et continuer l'inspection.", "Appliquer immédiatement un inhibiteur de corrosion sur les zones affectées.", "Déterminer l'étendue de la corrosion et se référer au manuel de maintenance du fabricant pour les procédures de réparation.", "Remplacer toute la structure de l'aile pour garantir la navigabilité."])
  },
  {
    id: "54b28038-7c0c-4751-a82b-ce40875cf8d0",
    question_fr: "Lors d'une inspection de routine, un technicien constate qu'un rivet dans la structure du fuselage est manquant. Quelle est la MEILLEURE marche à suivre ?",
    explanation_fr: "La meilleure marche à suivre est d'arrêter le travail et d'informer le superviseur, car cela pourrait indiquer des problèmes potentiels d'intégrité structurelle. Ceci est conforme aux protocoles de sécurité énoncés dans la RAC 571, garantissant que toutes les actions de maintenance sont effectuées en toute sécurité et conformément à la réglementation.",
    options_fr: JSON.stringify(["Installer un nouveau rivet sans inspection supplémentaire.", "Documenter le rivet manquant et continuer l'inspection.", "Arrêter immédiatement le travail et informer le superviseur pour obtenir des instructions supplémentaires.", "Utiliser une fixation temporaire jusqu'à ce que les pièces soient disponibles."])
  },
  {
    id: "8e4b33c3-a10e-4f0f-b50f-cb4a2f1aa324",
    question_fr: "Lors de l'inspection du système de commande de l'aileron, un technicien découvre un jeu excessif dans la tringlerie de commande. Que doit faire le technicien ENSUITE ?",
    explanation_fr: "Avant de prendre toute mesure corrective, il est essentiel d'investiguer la cause du jeu excessif et de se référer au manuel de maintenance pour les procédures correctives appropriées, conformément aux pratiques de maintenance standard définies dans l'AC 43.13.",
    options_fr: JSON.stringify(["Lubrifier la tringlerie de commande pour réduire le jeu.", "Remplacer la tringlerie de commande par une pièce neuve.", "Investiguer la source du jeu et se référer au manuel de maintenance pour les actions correctives.", "Ajuster la tringlerie de commande pour éliminer le jeu."])
  },
  {
    id: "6c75b225-45d5-41b5-a2c6-7c3a25b2b406",
    question_fr: "Un technicien s'apprête à remplacer un carénage endommagé sur un aéronef. Quelle est la considération la PLUS importante au cours de ce processus ?",
    explanation_fr: "La considération la plus importante est de s'assurer que le carénage de remplacement répond aux spécifications du fabricant pour garantir un ajustement et un fonctionnement corrects, conformément à la RAC 571 et à la Norme 573.",
    options_fr: JSON.stringify(["Le poids du nouveau carénage par rapport à l'ancien.", "S'assurer que le nouveau carénage est peint pour correspondre à l'avion.", "Confirmer que le carénage de remplacement répond aux spécifications du fabricant.", "La couleur des fixations utilisées pour attacher le carénage."])
  },
  {
    id: "241637fb-87a7-4f98-b703-3fe8bc1c0550",
    question_fr: "Lors d'une inspection, un technicien remarque qu'un rivet dans une structure porteuse est manquant. Quelle action le technicien doit-il entreprendre ?",
    explanation_fr: "L'absence d'un rivet dans une structure porteuse peut compromettre l'intégrité de la cellule. Mettre l'avion au sol permet une évaluation approfondie de l'impact potentiel sur la sécurité structurelle et garantit la conformité à la RAC 571.10.",
    options_fr: JSON.stringify(["Remplacer immédiatement le rivet sans inspection supplémentaire.", "Documenter le rivet manquant et prévoir son remplacement lors de la prochaine maintenance programmée.", "Mettre l'avion au sol et évaluer l'intégrité structurelle avant de remplacer le rivet.", "Ignorer le rivet manquant car il n'est pas critique."])
  },
  {
    id: "93ca74f5-3005-4fe7-aa19-a2017a5337b8",
    question_fr: "Un technicien constate que la cellule de l'avion présente plusieurs bosses et déformations mineures après une tempête de grêle. Quelle est la MEILLEURE marche à suivre ?",
    explanation_fr: "Bien que les bosses mineures puissent sembler superficielles, elles peuvent affecter la résistance globale et l'aérodynamique de la cellule. Une inspection détaillée est nécessaire pour garantir la conformité à la RAC 571.10 et pour évaluer si des réparations sont nécessaires.",
    options_fr: JSON.stringify(["Documenter les constatations et continuer les opérations normales.", "Effectuer une réparation temporaire et continuer à voler.", "Effectuer une inspection détaillée pour déterminer si l'intégrité structurelle est compromise.", "Ignorer les bosses car elles n'affectent pas les performances."])
  },
  {
    id: "a30ff1e6-7622-4002-a6ae-3538e2d54715",
    question_fr: "Lors d'une inspection pré-vol, un technicien découvre que les gouvernes ne bougent pas librement. Que doit vérifier le technicien en PREMIER ?",
    explanation_fr: "Le mouvement des gouvernes est essentiel pour la sécurité des opérations de vol. Vérifier d'abord les câbles de commande est essentiel car ils peuvent affecter directement le fonctionnement des gouvernes. Selon l'AC 43.13, les systèmes de câbles doivent être inspectés régulièrement pour un bon fonctionnement.",
    options_fr: JSON.stringify(["Les charnières des gouvernes pour détecter la corrosion ou les dommages.", "Les câbles de commande associés pour détecter l'effilochage ou le coincement.", "Le poids et l'équilibre de l'avion pour garantir un chargement approprié.", "Les niveaux de liquide hydraulique dans le système de commande."])
  },
  {
    id: "57cf6c2b-9bc0-419a-8b60-76200fe9f212",
    question_fr: "Un technicien effectue une inspection de routine et remarque que le réservoir de carburant de l'avion présente une petite fuite. Quelle est la PREMIÈRE action du technicien ?",
    explanation_fr: "Les fuites de carburant présentent un risque d'incendie important et doivent être traitées immédiatement. Mettre l'avion au sol et signaler le problème garantit qu'il peut être réparé en toute sécurité selon la RAC 571.10 et les pratiques de sécurité standard.",
    options_fr: JSON.stringify(["Informer l'équipage de conduite de continuer le vol.", "Sceller la fuite avec du ruban adhésif jusqu'à ce qu'une réparation permanente puisse être effectuée.", "Mettre immédiatement l'avion au sol et signaler la fuite au contrôle de maintenance.", "Documenter la fuite et planifier une réparation pour le prochain cycle de maintenance."])
  },
  {
    id: "247f1b9d-1163-4c7f-ac9a-7b91b5f55672",
    question_fr: "Lors d'une inspection programmée, un technicien découvre qu'une section du revêtement de l'aile de l'avion se délamine. Quelle est la MEILLEURE action à entreprendre ?",
    explanation_fr: "Le délaminage du revêtement de l'aile peut affecter considérablement l'intégrité structurelle de l'avion et nécessite une évaluation par un expert. Conformément à la RAC 571.10, les constatations doivent être documentées et signalées, et les procédures appropriées doivent être initiées.",
    options_fr: JSON.stringify(["Surveiller le délaminage lors de la prochaine inspection.", "Documenter les constatations et recommander une évaluation supplémentaire par un ingénieur en structure.", "Réparer la zone délamée avec de l'adhésif sans consulter le manuel.", "Ignorer le problème car il n'est pas immédiatement dangereux."])
  },
  {
    id: "f7ead01a-46a4-464b-8880-421fc33cd948",
    question_fr: "Un technicien est chargé d'inspecter l'aile de l'avion pour détecter des signes de fatigue. Sur quelle zone le technicien doit-il se concentrer le PLUS ?",
    explanation_fr: "La fatigue se produit généralement aux points de concentration de contraintes, comme la jonction aile-fuselage. Cette zone doit être inspectée de près pour identifier les fissures ou déformations, conformément aux exigences de la RAC 571.10 pour les évaluations d'intégrité structurelle.",
    options_fr: JSON.stringify(["La zone autour des panneaux d'accès au réservoir de carburant.", "Les bords d'attaque et de fuite de l'aile.", "Les points d'attache de l'aile au fuselage.", "La zone où l'aile rencontre le longeron du fuselage."])
  },
  {
    id: "9ed27705-84ff-40af-ae0e-0ad2993555d6",
    question_fr: "Un technicien est chargé d'inspecter le système de train d'atterrissage de l'avion. Lors de l'inspection, il remarque que l'une des conduites hydrauliques présente des signes d'usure. Quelle est la MEILLEURE marche à suivre ?",
    explanation_fr: "Dans ce cas, le technicien devrait retirer la conduite pour l'inspecter minutieusement afin de détecter tout dommage interne ou fuite, conformément aux normes AC 43.13 pour les systèmes hydrauliques. L'intégrité des conduites hydrauliques est essentielle pour le fonctionnement et la sécurité du train d'atterrissage.",
    options_fr: JSON.stringify(["Remplacer immédiatement la conduite hydraulique sans inspection supplémentaire.", "Nettoyer la conduite et la ré-inspecter après un court vol.", "Documenter l'état et recommander un remplacement lors de la prochaine maintenance programmée.", "Retirer la conduite et l'inspecter pour détecter des dommages internes."])
  },
  {
    id: "2c847f47-d65f-4e32-9f1a-426bb1286254",
    question_fr: "Un technicien constate que le stabilisateur vertical de l'avion a développé une fissure lors d'une inspection. Quelle est l'action la PLUS appropriée à entreprendre ?",
    explanation_fr: "La fissure dans le stabilisateur vertical présente un risque sérieux pour la stabilité et le contrôle de l'avion. Mettre l'avion au sol et signaler le défaut garantit qu'il peut être évalué et réparé selon la RAC 571.10 et les exigences de maintenance de la Norme 571.",
    options_fr: JSON.stringify(["Appliquer une réparation temporaire et continuer les opérations.", "Documenter la fissure et planifier un remplacement lors du prochain cycle de maintenance.", "Mettre immédiatement l'avion au sol et signaler le défaut pour une évaluation supplémentaire.", "Ignorer la fissure car elle se trouve en dehors des zones critiques porteuses."])
  },
  {
    id: "786c8389-bc0b-42c8-946f-5bfe2d9c9dfb",
    question_fr: "Lors d'une inspection de routine, un technicien découvre que le revêtement de l'avion présente des signes de corrosion près de la zone de l'emplanture de l'aile. Quelle est l'action initiale la PLUS appropriée que le technicien devrait entreprendre ?",
    explanation_fr: "Le technicien doit signaler la corrosion pour qu'elle soit traitée correctement selon les procédures de maintenance. Conformément à la RAC 571.10, tous les défauts doivent être signalés pour garantir la navigabilité et la conformité aux normes de maintenance.",
    options_fr: JSON.stringify(["Ignorer la corrosion car elle n'est pas importante.", "Documenter la corrosion dans le journal de bord et continuer l'inspection.", "Poncer et repeindre immédiatement la zone affectée.", "Signaler la constatation au superviseur de maintenance et suivre les procédures de réparation de la corrosion."])
  },
  {
    id: "06e12b5c-d765-4410-b0a4-eb3c85da0e00",
    question_fr: "Lors d'une vérification du poids et de l'équilibre, un technicien découvre que le poids réel de l'avion dépasse le poids maximal autorisé spécifié dans le rapport de poids et d'équilibre de l'avion. Que doit faire le technicien ?",
    explanation_fr: "Le technicien doit assurer la conformité aux limites de poids de l'avion telles que spécifiées dans la RAC 605.12, car le dépassement de ces limites peut compromettre la sécurité et les performances de l'avion. Le vol ne doit pas avoir lieu tant que le problème de poids n'est pas résolu.",
    options_fr: JSON.stringify(["Procéder au vol comme prévu puisque le pilote l'a approuvé.", "Annuler ou retarder le vol jusqu'à ce que des ajustements appropriés soient effectués.", "Documenter l'écart de poids et continuer l'inspection de maintenance.", "Tenter de redistribuer la cargaison pour respecter les exigences de poids."])
  },
  {
    id: "5393d30a-07af-40b6-b41f-0a10286cfa1e",
    question_fr: "Lors d'un contrôle de maintenance programmé, un technicien identifie une petite bosse sur un composant structurel critique. Quelle est l'action initiale la PLUS appropriée à entreprendre ?",
    explanation_fr: "Conformément à la RAC 571.02, tout dommage aux structures critiques doit être évalué pour garantir la conformité aux normes de navigabilité. Le technicien doit informer le superviseur et évaluer la bosse par rapport aux limites de dommages admissibles spécifiées dans le manuel de maintenance avant de procéder.",
    options_fr: JSON.stringify(["Documenter la bosse et continuer le contrôle de maintenance.", "Réparer immédiatement la bosse selon le manuel du fabricant.", "Informer le superviseur et évaluer la bosse par rapport aux limites de dommages spécifiées dans le manuel de maintenance.", "Ignorer la bosse car elle n'affecte pas les opérations de vol."])
  },
  {
    id: "4320a6e9-74fb-42b8-a3a0-c260559fc830",
    question_fr: "Un technicien s'apprête à signer une mainlevée de maintenance pour un aéronef après avoir effectué les inspections requises. Quel document doit être consulté pour confirmer la conformité aux normes de maintenance et garantir la navigabilité ?",
    explanation_fr: "Le manuel de maintenance de l'aéronef contient des procédures et des normes spécifiques qui doivent être suivies pour garantir la conformité à la RAC 573 et la navigabilité de l'aéronef. Il sert de référence essentielle pour les techniciens lors de la signature des mainlevées de maintenance.",
    options_fr: JSON.stringify(["Le bulletin de service du fabricant.", "Le manuel de maintenance de l'aéronef.", "Le journal de bord.", "Les dossiers techniques."])
  },
  {
    id: "99fd289a-faf2-42b0-b1a9-250797b45dae",
    question_fr: "Lors d'une inspection de routine, un technicien découvre que l'avion n'a pas eu l'inspection obligatoire des 100 heures. Quelle est la MEILLEURE marche à suivre ?",
    explanation_fr: "Selon la RAC 605.84, un aéronef ne doit pas être exploité sans avoir effectué les inspections requises. Mettre l'avion au sol est nécessaire pour garantir la conformité aux règles de sécurité et maintenir la navigabilité jusqu'à ce que l'inspection en retard soit effectuée.",
    options_fr: JSON.stringify(["Signer la mainlevée de maintenance et effectuer l'inspection la prochaine fois.", "Mettre l'avion au sol jusqu'à ce que l'inspection soit terminée.", "Continuer les tâches de maintenance et documenter l'oubli.", "Informer le pilote et permettre à l'avion de rester en service."])
  },
  {
    id: "5fd5b142-c786-4e76-867b-c0c997c86d11",
    question_fr: "Un technicien supervise un technicien junior effectuant un travail élémentaire sur un aéronef. Quelle est la responsabilité principale du superviseur dans cette situation ?",
    explanation_fr: "Selon la Norme 566, il est de la responsabilité du superviseur de s'assurer que tout le travail est effectué selon les normes et que la formation est fournie aux techniciens juniors, garantissant ainsi la sécurité et la conformité.",
    options_fr: JSON.stringify(["S'assurer que le technicien junior termine le travail aussi rapidement que possible.", "Examiner le travail après son achèvement avant de signer la mainlevée de maintenance.", "Fournir une formation et s'assurer que le travail est effectué selon les normes.", "Permettre au technicien de travailler de manière indépendante sans supervision."])
  },
  {
    id: "de5543e6-9c89-4e71-89a6-6992fa6072db",
    question_fr: "Un technicien examine les dossiers techniques avant une mainlevée de maintenance. Lequel des dossiers suivants est considéré comme essentiel pour garantir la conformité aux RAC ?",
    explanation_fr: "La dernière mainlevée de maintenance est essentielle pour garantir la conformité à la RAC 573, car elle fournit un historique documenté de toutes les actions de maintenance récentes et des conditions de l'aéronef, ce qui est nécessaire pour le processus de décision du technicien.",
    options_fr: JSON.stringify(["Le dernier rapport de carburant.", "Le journal de bord.", "La dernière mainlevée de maintenance.", "Les notes personnelles du technicien."])
  },
  {
    id: "bafd8fac-728d-478a-9946-4a3fdc875559",
    question_fr: "Un technicien remarque qu'une consigne de navigabilité (CN) a été émise et affecte l'avion sur lequel il travaille. Quelle est la bonne action à entreprendre ?",
    explanation_fr: "Selon la RAC 591, toute consigne de navigabilité pertinente doit être respectée pour maintenir la navigabilité de l'avion. Le technicien doit effectuer les actions spécifiées dans la CN et documenter la conformité.",
    options_fr: JSON.stringify(["L'ignorer si l'avion n'est pas actuellement en service.", "Effectuer les actions requises décrites dans la CN et les documenter.", "Seulement informer le pilote et attendre des instructions supplémentaires.", "Contacter Transports Canada pour des éclaircissements."])
  },
  {
    id: "0e704f04-92c3-44f4-8831-fd95abf0bdb2",
    question_fr: "Une mainlevée de maintenance est préparée après avoir effectué une modification de la cellule. Laquelle des suivantes n'est PAS requise pour être incluse avec la mainlevée de maintenance ?",
    explanation_fr: "Les carnets de vol précédents ne sont pas pertinents pour la mainlevée de maintenance actuelle, qui doit inclure la documentation relative à la modification elle-même, telle que l'approbation et les dossiers des pièces, conformément aux exigences de la RAC 573.",
    options_fr: JSON.stringify(["Une copie de l'approbation de la modification.", "Les dossiers de toutes les pièces utilisées dans la modification.", "Les carnets de vol précédents de l'avion.", "La signature du technicien sur la modification."])
  },
  {
    id: "9735b485-b69d-4ee5-9c4a-ce795c84b1d0",
    question_fr: "Lors d'une inspection indépendante, un technicien constate que le frein-fil sur un composant est manquant. Que doit faire le technicien ?",
    explanation_fr: "Selon la RAC 571.02, toute divergence constatée lors d'une inspection doit être documentée et signalée pour garantir la conformité aux normes de sécurité. L'absence de frein-fil peut entraîner une défaillance du composant, elle doit donc être traitée correctement.",
    options_fr: JSON.stringify(["Réinstaller immédiatement le frein-fil et signer la mainlevée.", "Informer l'OMA et documenter la constatation comme une divergence.", "Ignorer le problème car il n'est pas critique pour la sécurité.", "Demander au technicien précédent s'il a oublié de l'installer."])
  },
  {
    id: "09b0fb03-0538-4019-80f0-32c11ec0a5f3",
    question_fr: "Un technicien est chargé d'effectuer une mainlevée de maintenance pour un aéronef qui a subi une réparation complexe impliquant plusieurs systèmes. Qu'est-ce qui doit être documenté pour soutenir la mainlevée ?",
    explanation_fr: "Selon la Norme 573, la documentation complète de toutes les actions de maintenance, y compris toutes les instructions pertinentes du fabricant, est essentielle pour maintenir des dossiers techniques précis et soutenir les futures mainlevées de maintenance.",
    options_fr: JSON.stringify(["Seulement les résultats de l'inspection finale.", "Toutes les actions de maintenance et toutes les instructions pertinentes du fabricant.", "Seulement les pièces remplacées lors de la réparation.", "Les notes personnelles du technicien sur le processus de réparation."])
  },
  {
    id: "db5f9002-99e8-4d29-aefb-f5db9f022aeb",
    question_fr: "Après avoir terminé une mainlevée de maintenance, un technicien constate qu'il n'a pas signé le journal de bord. Quelle est l'action la PLUS appropriée à entreprendre ?",
    explanation_fr: "Selon la RAC 605.86, il est essentiel de documenter précisément toutes les mainlevées de maintenance dans le journal de bord. Le technicien doit informer l'OMA de l'oubli et s'assurer qu'il est correctement documenté pour maintenir la conformité.",
    options_fr: JSON.stringify(["Signer immédiatement le journal sans autre action.", "Informer l'OMA et documenter l'oubli.", "Continuer avec d'autres tâches et le signer plus tard.", "Demander à un collègue de signer à sa place."])
  },
  {
    id: "544cbec4-bc83-4f2f-940e-1fe35102895a",
    question_fr: "Un technicien découvre qu'un composant a été réparé avec des matériaux non approuvés. Quelle est l'action appropriée selon les normes de maintenance ?",
    explanation_fr: "Selon la RAC 571.01, toutes les réparations doivent être effectuées en utilisant des matériaux et des méthodes approuvés par les autorités compétentes. L'utilisation de matériaux non approuvés compromet la sécurité et la légalité.",
    options_fr: JSON.stringify(["Continuer à utiliser le composant car il semble fonctionner correctement.", "Remplacer le composant par un qui répond aux normes approuvées.", "Documenter la réparation et l'utiliser jusqu'à la prochaine maintenance programmée.", "Consulter le responsable de l'OMA et reporter le problème pour examen ultérieur."])
  },
  {
    id: "f3d59f3e-9219-4797-9f44-be1f825e8fff",
    question_fr: "Après une réparation majeure, quelle documentation est requise avant que la mainlevée de maintenance puisse être signée selon les RAC ?",
    explanation_fr: "La RAC 571.10 stipule qu'une mainlevée de maintenance doit inclure toute la documentation pertinente pour garantir que le travail répond aux normes réglementaires et aux exigences de sécurité. Cela comprend la mainlevée, les rapports d'inspection et les documents de conformité requis.",
    options_fr: JSON.stringify(["Une confirmation verbale de la réparation par le technicien qui a effectué le travail.", "Seulement l'inscription dans le journal de bord reflétant les réparations effectuées.", "Tous les dossiers techniques, y compris la mainlevée de maintenance, les rapports d'inspection et les déclarations de conformité.", "Une liste de contrôle des pièces remplacées lors de la réparation sans documentation supplémentaire."])
  },
  {
    id: "b6846d43-2835-4172-9bbf-c8d226b3f0a7",
    question_fr: "Lors d'un contrôle de maintenance programmé, un technicien constate qu'un composant n'est pas répertorié dans le calendrier de maintenance approuvé. Que doit faire le technicien ?",
    explanation_fr: "Selon la RAC 573.02, toute maintenance doit être effectuée conformément aux procédures approuvées. Si un composant n'est pas répertorié, il est essentiel de consulter l'OMA pour obtenir des conseils afin de garantir la conformité.",
    options_fr: JSON.stringify(["Procéder à la maintenance car le composant fonctionne correctement.", "Consulter le manuel de maintenance et effectuer la maintenance sur la base des meilleures pratiques.", "Contacter l'OMA pour déterminer s'il existe une procédure approuvée pour ce composant.", "Documenter la constatation et l'ignorer car elle n'affecte pas la navigabilité."])
  },
  {
    id: "3dafd816-06eb-402a-8270-6aed69bfd009",
    question_fr: "Un technicien est chargé d'effectuer une inspection indépendante sur un aéronef après des travaux de maintenance. Laquelle des actions suivantes le technicien doit-il entreprendre ?",
    explanation_fr: "Selon la RAC 573.04, une inspection indépendante doit inclure un examen physique pour vérifier que les travaux de maintenance ont été effectués conformément aux normes et pratiques applicables.",
    options_fr: JSON.stringify(["Examiner les travaux effectués et signer sans procéder à une inspection physique.", "Effectuer une inspection physique approfondie et vérifier que la maintenance a été effectuée conformément à la réglementation.", "Vérifier uniquement l'exactitude et l'exhaustivité des dossiers techniques.", "Signer l'inspection sur la base de la confirmation verbale du technicien des travaux effectués."])
  },
  {
    id: "96b696ae-35b1-43a2-8bae-1d4611b8ee5e",
    question_fr: "En examinant les dossiers de maintenance, un technicien constate qu'un moteur a dépassé la limite de ses pièces à durée de vie limitée. Quelle est l'action la plus appropriée à entreprendre ?",
    explanation_fr: "Selon la RAC 571.03, les pièces à durée de vie limitée doivent être remplacées une fois leur limite atteinte, quel que soit leur état opérationnel. Le technicien doit mettre l'avion au sol pour garantir la conformité aux règles de sécurité.",
    options_fr: JSON.stringify(["Continuer à faire fonctionner le moteur car il fonctionne normalement.", "Documenter la constatation et reporter le problème pour une maintenance future.", "Mettre l'avion au sol et retirer le moteur du service jusqu'à ce que la pièce soit remplacée.", "Contacter l'autorité de réglementation pour obtenir des conseils avant d'entreprendre toute action."])
  },
  {
    id: "6309e2d0-fdb3-4a98-b1d4-d7b8aaaf2b6c",
    question_fr: "Un technicien note que les valeurs de couple spécifiées pour l'installation d'un composant critique sont différentes dans le manuel de maintenance par rapport au bulletin de service. Que doit faire le technicien ?",
    explanation_fr: "Lorsque des divergences surviennent entre les manuels de maintenance et les bulletins de service, il est essentiel de demander des éclaircissements au fabricant pour garantir la conformité aux normes de sécurité et aux pratiques les plus récentes.",
    options_fr: JSON.stringify(["Utiliser les valeurs de couple du manuel de maintenance, car c'est la référence principale.", "Contacter le fabricant pour obtenir des éclaircissements et suivre ses instructions.", "Utiliser la valeur de couple la plus élevée pour garantir que le composant est solidement fixé.", "Documenter la divergence et procéder à l'installation en utilisant les valeurs du bulletin de service."])
  },
  {
    id: "88d7c6e7-8402-4049-a638-6fb8610996c9",
    question_fr: "Un technicien effectue une inspection de routine et note des signes de corrosion sur une conduite de carburant. Quelle est la PROCHAINE meilleure action selon les pratiques standard ?",
    explanation_fr: "L'AC 43.13 stipule que la corrosion doit être évaluée pour déterminer l'action corrective nécessaire. Le technicien doit évaluer la gravité et suivre les procédures prescrites par le manuel de maintenance pour garantir la sécurité et la conformité.",
    options_fr: JSON.stringify(["Continuer l'inspection et documenter la corrosion pour référence future.", "Remplacer immédiatement la conduite de carburant sans inspection supplémentaire.", "Évaluer l'étendue de la corrosion et suivre les recommandations du fabricant pour la réparation ou le remplacement.", "Ignorer la corrosion à moins qu'elle n'affecte les performances du système de carburant."])
  },
  {
    id: "41a2a300-2346-4233-b030-37dac4f66b3d",
    question_fr: "Un technicien découvre un frein-fil desserré sur un composant critique lors d'une inspection. Quelle est l'action la PLUS appropriée à entreprendre ?",
    explanation_fr: "Un frein-fil approprié est essentiel pour garantir que les composants restent sécurisés. L'AC 43.13 souligne que tout dispositif de sécurité desserré doit être traité immédiatement, et les zones environnantes doivent être inspectées pour détecter les problèmes connexes.",
    options_fr: JSON.stringify(["Resserrer le composant et réappliquer le frein-fil sans inspection supplémentaire.", "Documenter le frein-fil desserré dans le journal de bord et continuer l'inspection.", "Retirer complètement le composant et l'envoyer pour une évaluation complète.", "Fixer correctement le frein-fil et effectuer une inspection approfondie de la zone environnante."])
  },
  {
    id: "723b4035-401e-482e-838a-348658714c48",
    question_fr: "Lors d'une mainlevée de maintenance, un technicien découvre que les dossiers de maintenance n'incluent pas la dernière conformité à la consigne de navigabilité (CN) pour un composant critique. Que doit faire le technicien avant de signer la mainlevée ?",
    explanation_fr: "Selon la RAC 571.10, une mainlevée de maintenance doit garantir que toutes les consignes de navigabilité sont respectées avant qu'un aéronef ne soit déclaré navigable. Le technicien ne doit pas signer la mainlevée avant d'avoir confirmé que la CN a été traitée.",
    options_fr: JSON.stringify(["Signer la mainlevée de maintenance et noter la documentation manquante pour référence future.", "Contacter le responsable de l'OMA pour obtenir des conseils et retenir la mainlevée jusqu'à ce que la conformité soit vérifiée.", "Terminer la mainlevée de maintenance sans autre action car le composant est toujours fonctionnel.", "Documenter les constatations et procéder à la mainlevée car l'avion est navigable."])
  },
  {
    id: "ddf96dbc-6a0e-43bc-ab00-7a18e9b67739",
    question_fr: "Un technicien signe une mainlevée de maintenance mais se rend compte que toutes les inspections requises n'ont pas été effectuées. Quelle est la bonne marche à suivre ?",
    explanation_fr: "Selon la RAC 571.10, une mainlevée de maintenance ne doit être signée que lorsque toutes les inspections et actions de maintenance ont été effectuées de manière satisfaisante. Cela garantit la conformité et la sécurité.",
    options_fr: JSON.stringify(["Procéder à la mainlevée car les inspections peuvent être effectuées plus tard.", "Documenter les inspections incomplètes et procéder à la mainlevée.", "Retenir la mainlevée de maintenance jusqu'à ce que toutes les inspections requises soient terminées.", "Signer la mainlevée et inclure une note sur les inspections incomplètes."])
  },
  {
    id: "c48be3d2-a3d1-451b-aa7b-47406e5499be",
    question_fr: "Lors d'une inspection de routine, un technicien découvre une divergence dans la documentation de la mainlevée de maintenance : le travail effectué ne correspond pas aux tâches enregistrées. Quelle est l'action la PLUS appropriée pour le technicien ?",
    explanation_fr: "Le technicien doit s'assurer que tous les dossiers de maintenance reflètent fidèlement le travail effectué. Selon la RAC 605.86, il est illégal de signer une mainlevée qui ne correspond pas au travail enregistré, ce qui présente un risque pour la sécurité.",
    options_fr: JSON.stringify(["Informer le superviseur et rectifier la documentation avant le prochain vol.", "Signer la mainlevée de maintenance car il s'agissait d'un oubli.", "Continuer le vol car la divergence est mineure.", "Documenter la divergence dans le journal de bord et procéder."])
  },
  {
    id: "1d4b3c28-f501-4611-bb13-b86dbdf35882",
    question_fr: "Un technicien est chargé d'effectuer une inspection indépendante après des travaux de maintenance. Laquelle des actions suivantes le technicien doit-il entreprendre pour se conformer à la réglementation ?",
    explanation_fr: "Selon la RAC 571.10, une inspection indépendante exige que le technicien vérifie physiquement que le travail est conforme aux normes et à la réglementation. Signer sans inspection viole les exigences réglementaires et compromet la sécurité.",
    options_fr: JSON.stringify(["Examiner les dossiers de maintenance et signer sans inspecter physiquement le travail.", "Effectuer une inspection physique du travail terminé avant de signer la mainlevée de maintenance.", "Vérifier le travail seulement si le technicien le demande.", "Demander au technicien de confirmer que le travail a été effectué correctement avant de signer."])
  }
];

async function main() {
  let count = 0;
  for (const t of translations) {
    await p.question.update({
      where: { id: t.id },
      data: {
        question_fr: t.question_fr,
        explanation_fr: t.explanation_fr,
        options_fr: t.options_fr,
      }
    });
    count++;
  }
  console.log(`✅ ${count} questions traduites`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
