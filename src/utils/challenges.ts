import { ChallengeConfig, ConcreteBlockType } from '../types';

// Helper to shift a blueprint vertically if needed
export function offsetBlueprint(
  blocks: Record<string, ConcreteBlockType>,
  dy: number
): Record<string, ConcreteBlockType> {
  const result: Record<string, ConcreteBlockType> = {};
  for (const [key, type] of Object.entries(blocks)) {
    const [x, y, z] = key.split(',').map(Number);
    result[`${x},${y + dy},${z}`] = type;
  }
  return result;
}

export const CHALLENGES: ChallengeConfig[] = [
  {
    id: 'pixel-heart',
    name: 'Cuore Pixel',
    category: 'principiante',
    icon: '❤️',
    description: 'Un dolce cuore voxel. La sfida ideale per iniziare a prendere confidenza con le coordinate.',
    difficulty: 1,
    tips: 'Inizia dal punto centrale inferiore sulla griglia e sali verso i due lobi simmetrici.',
    targetBlocks: {
      '0,0,0': 'brick',
      '-1,1,0': 'brick',
      '0,1,0': 'brick',
      '1,1,0': 'brick',
      '-2,2,0': 'brick',
      '-1,2,0': 'brick',
      '0,2,0': 'brick',
      '1,2,0': 'brick',
      '2,2,0': 'brick',
      '-2,3,0': 'brick',
      '-1,3,0': 'brick',
      '0,3,0': 'brick',
      '1,3,0': 'brick',
      '2,3,0': 'brick',
      '-1,4,0': 'brick',
      '1,4,0': 'brick',
    },
  },
  {
    id: 'mini-tree',
    name: 'Albero Bonsai',
    category: 'natura',
    icon: '🌳',
    description: 'Un alberello armonioso con tronco in legno robusto e chioma di foglie rigogliose.',
    difficulty: 1,
    tips: 'Costruisci prima il tronco di legno poggiato al suolo e poi espandi la chioma di foglie.',
    targetBlocks: {
      '0,0,0': 'wood',
      '0,1,0': 'wood',
      '0,2,0': 'wood',
      '-1,2,-1': 'leaves',
      '-1,2,0': 'leaves',
      '-1,2,1': 'leaves',
      '0,2,-1': 'leaves',
      '0,2,1': 'leaves',
      '1,2,-1': 'leaves',
      '1,2,0': 'leaves',
      '1,2,1': 'leaves',
      '-1,3,0': 'leaves',
      '0,3,-1': 'leaves',
      '0,3,0': 'leaves',
      '0,3,1': 'leaves',
      '1,3,0': 'leaves',
      '0,4,0': 'leaves',
    },
  },
  {
    id: 'magic-mushroom',
    name: 'Fungo Magico',
    category: 'natura',
    icon: '🍄',
    description: 'Un fungo delle favole con gambo chiaro in legno e una cappella a cupola rossa in mattoni.',
    difficulty: 1,
    tips: 'Innalza il gambo di legno a terra, poi crea la cappella 3x3 e il blocco apicale.',
    targetBlocks: {
      '0,0,0': 'wood',
      '0,1,0': 'wood',
      '-1,2,-1': 'brick',
      '-1,2,0': 'brick',
      '-1,2,1': 'brick',
      '0,2,-1': 'brick',
      '0,2,0': 'wood',
      '0,2,1': 'brick',
      '1,2,-1': 'brick',
      '1,2,0': 'brick',
      '1,2,1': 'brick',
      '0,3,0': 'brick',
      '-1,3,0': 'brick',
      '1,3,0': 'brick',
      '0,3,-1': 'brick',
      '0,3,1': 'brick',
    },
  },
  {
    id: 'pixel-star',
    name: 'Stella Dorata',
    category: 'principiante',
    icon: '⭐',
    description: 'Una stella brillante a cinque punte creata con blocchi di legno e vetro brillante.',
    difficulty: 1,
    tips: 'Posiziona il centro e allunga le braccia orizzontali, verticali e la base.',
    targetBlocks: {
      '0,0,0': 'wood',
      '-1,1,0': 'wood', '0,1,0': 'wood', '1,1,0': 'wood',
      '-2,2,0': 'wood', '-1,2,0': 'wood', '0,2,0': 'glass', '1,2,0': 'wood', '2,2,0': 'wood',
      '-1,3,0': 'wood', '0,3,0': 'wood', '1,3,0': 'wood',
      '0,4,0': 'wood',
    },
  },
  {
    id: 'garden-fountain',
    name: 'Fontana da Giardino',
    category: 'architettura',
    icon: '⛲',
    description: 'Una fontana classica con vasca in pietra, getto zampillante e acqua trasparente.',
    difficulty: 2,
    tips: 'Crea la vasca quadrata in pietra con acqua all’interno, poi innalza il pilastro centrale.',
    targetBlocks: {
      // Basin ring (Stone) y=0
      '-1,0,-1': 'stone', '0,0,-1': 'stone', '1,0,-1': 'stone',
      '-1,0,0': 'stone',  '0,0,0': 'water',  '1,0,0': 'stone',
      '-1,0,1': 'stone',  '0,0,1': 'stone',  '1,0,1': 'stone',
      // Fountain pillar & water crest
      '0,1,0': 'stone',
      '0,2,0': 'water',
      '-1,1,0': 'water',
      '1,1,0': 'water',
      '0,1,-1': 'water',
      '0,1,1': 'water',
    },
  },
  {
    id: 'step-pyramid',
    name: 'Piramide a Gradoni',
    category: 'architettura',
    icon: '🏛️',
    description: 'Una piramide a tre livelli geometricamente perfetti e simmetrici.',
    difficulty: 2,
    tips: 'La base è un quadrato 5x5 di pietra a terra, il livello medio è 3x3 in mattoni e la cima è in legno.',
    targetBlocks: {
      // Base 5x5 (Stone) at y=0
      '-2,0,-2': 'stone', '-1,0,-2': 'stone', '0,0,-2': 'stone', '1,0,-2': 'stone', '2,0,-2': 'stone',
      '-2,0,-1': 'stone', '-1,0,-1': 'stone', '0,0,-1': 'stone', '1,0,-1': 'stone', '2,0,-1': 'stone',
      '-2,0,0': 'stone',  '-1,0,0': 'stone',  '0,0,0': 'stone',  '1,0,0': 'stone',  '2,0,0': 'stone',
      '-2,0,1': 'stone',  '-1,0,1': 'stone',  '0,0,1': 'stone',  '1,0,1': 'stone',  '2,0,1': 'stone',
      '-2,0,2': 'stone',  '-1,0,2': 'stone',  '0,0,2': 'stone',  '1,0,2': 'stone',  '2,0,2': 'stone',
      // Mid 3x3 (Brick) at y=1
      '-1,1,-1': 'brick', '0,1,-1': 'brick', '1,1,-1': 'brick',
      '-1,1,0': 'brick',  '0,1,0': 'brick',  '1,1,0': 'brick',
      '-1,1,1': 'brick',  '0,1,1': 'brick',  '1,1,1': 'brick',
      // Top 1x1 (Wood) at y=2
      '0,2,0': 'wood',
    },
  },
  {
    id: 'cozy-cottage',
    name: 'Casetta Rustica',
    category: 'architettura',
    icon: '🏡',
    description: 'Una graziosa casetta con fondamenta di pietra, pareti in legno, finestra in vetro e tetto in mattoni.',
    difficulty: 2,
    tips: 'Costruisci la base e le pareti lasciando spazio per la finestra frontale in vetro.',
    targetBlocks: {
      // Floor / Foundation 3x3 at y=0
      '-1,0,-1': 'stone', '0,0,-1': 'stone', '1,0,-1': 'stone',
      '-1,0,0': 'stone',  '0,0,0': 'stone',  '1,0,0': 'stone',
      '-1,0,1': 'stone',  '0,0,1': 'stone',  '1,0,1': 'stone',
      // Walls level 1 (y=1)
      '-1,1,-1': 'wood', '0,1,-1': 'wood', '1,1,-1': 'wood',
      '-1,1,0': 'wood',                    '1,1,0': 'wood',
      '-1,1,1': 'wood',  '0,1,1': 'glass', '1,1,1': 'wood',
      // Walls level 2 (y=2)
      '-1,2,-1': 'wood', '0,2,-1': 'wood', '1,2,-1': 'wood',
      '-1,2,0': 'wood',                    '1,2,0': 'wood',
      '-1,2,1': 'wood',  '0,2,1': 'wood',  '1,2,1': 'wood',
      // Roof level 3 (y=3)
      '-1,3,-1': 'brick', '0,3,-1': 'brick', '1,3,-1': 'brick',
      '-1,3,0': 'brick',  '0,3,0': 'brick',  '1,3,0': 'brick',
      '-1,3,1': 'brick',  '0,3,1': 'brick',  '1,3,1': 'brick',
      // Roof peak level 4 (y=4)
      '0,4,-1': 'brick',  '0,4,0': 'brick',  '0,4,1': 'brick',
    },
  },
  {
    id: 'coffee-mug',
    name: 'Tazza di Caffè',
    category: 'oggetti',
    icon: '☕',
    description: 'Una tazza fumante con manico laterale sagomato e caffè scuro in terra all\'interno.',
    difficulty: 2,
    tips: 'La base è un piatto 3x3, con corpo cilindrico e manico che sporge a destra.',
    targetBlocks: {
      // Base 3x3 (y=0)
      '-1,0,-1': 'brick', '0,0,-1': 'brick', '1,0,-1': 'brick',
      '-1,0,0': 'brick',  '0,0,0': 'brick',  '1,0,0': 'brick',
      '-1,0,1': 'brick',  '0,0,1': 'brick',  '1,0,1': 'brick',
      // Body level 1 (y=1)
      '-1,1,-1': 'brick', '0,1,-1': 'brick', '1,1,-1': 'brick',
      '-1,1,0': 'brick',  '0,1,0': 'dirt',   '1,1,0': 'brick', '2,1,0': 'brick',
      '-1,1,1': 'brick',  '0,1,1': 'brick',  '1,1,1': 'brick',
      // Body level 2 (y=2)
      '-1,2,-1': 'brick', '0,2,-1': 'brick', '1,2,-1': 'brick',
      '-1,2,0': 'brick',  '0,2,0': 'dirt',   '1,2,0': 'brick', '2,2,0': 'brick',
      '-1,2,1': 'brick',  '0,2,1': 'brick',  '1,2,1': 'brick',
      // Rim level 3 (y=3)
      '-1,3,-1': 'brick', '0,3,-1': 'brick', '1,3,-1': 'brick',
      '-1,3,0': 'brick',                     '1,3,0': 'brick',
      '-1,3,1': 'brick',  '0,3,1': 'brick',  '1,3,1': 'brick',
    },
  },
  {
    id: 'castle-tower',
    name: 'Torretta Medievale',
    category: 'architettura',
    icon: '🏰',
    description: 'Una torre di guardia in pietra con porta d\'ingresso, balconata in legno e merli difensivi.',
    difficulty: 2,
    tips: 'La sommità presenta 4 merli angolari alternati.',
    targetBlocks: {
      // Base y=0
      '-1,0,-1': 'stone', '0,0,-1': 'stone', '1,0,-1': 'stone',
      '-1,0,0': 'stone',                     '1,0,0': 'stone',
      '-1,0,1': 'stone',                     '1,0,1': 'stone',
      // Wall y=1
      '-1,1,-1': 'stone', '0,1,-1': 'stone', '1,1,-1': 'stone',
      '-1,1,0': 'stone',                     '1,1,0': 'stone',
      '-1,1,1': 'stone',                     '1,1,1': 'stone',
      // Wall y=2
      '-1,2,-1': 'stone', '0,2,-1': 'stone', '1,2,-1': 'stone',
      '-1,2,0': 'stone',                     '1,2,0': 'stone',
      '-1,2,1': 'stone',  '0,2,1': 'stone',  '1,2,1': 'stone',
      // Floor Platform y=3
      '-1,3,-1': 'wood',  '0,3,-1': 'wood',  '1,3,-1': 'wood',
      '-1,3,0': 'wood',   '0,3,0': 'wood',   '1,3,0': 'wood',
      '-1,3,1': 'wood',   '0,3,1': 'wood',   '1,3,1': 'wood',
      // Battlements y=4
      '-1,4,-1': 'stone',                    '1,4,-1': 'stone',
      '-1,4,1': 'stone',                     '1,4,1': 'stone',
    },
  },
  {
    id: 'floral-arch',
    name: 'Arco Fiorito',
    category: 'natura',
    icon: '🌸',
    description: 'Un romantico arco da giardino con colonne in legno e cupola di foglie intrecciate.',
    difficulty: 2,
    tips: 'Costruisci i due pilastri alti 4 blocchi e uniscili in alto con le foglie.',
    targetBlocks: {
      // Left pillar (y=0..3)
      '-2,0,0': 'wood',
      '-2,1,0': 'wood',
      '-2,2,0': 'wood',
      '-2,3,0': 'leaves',
      // Right pillar (y=0..3)
      '2,0,0': 'wood',
      '2,1,0': 'wood',
      '2,2,0': 'wood',
      '2,3,0': 'leaves',
      // Arch curve (y=3..5)
      '-1,3,0': 'leaves',
      '0,3,0': 'leaves',
      '1,3,0': 'leaves',
      '-1,4,0': 'leaves',
      '0,4,0': 'leaves',
      '1,4,0': 'leaves',
      '0,5,0': 'brick',
    },
  },
  {
    id: 'magic-potion',
    name: 'Pozione Magica',
    category: 'oggetti',
    icon: '🧪',
    description: 'Un\'ampolla alchemica in vetro trasparente contenente elisir misterioso e chiusa con tappo in legno.',
    difficulty: 2,
    tips: 'La base sferica è in vetro e mattoni/terra, con collo stretto e tappo in cima.',
    targetBlocks: {
      // Base y=0
      '0,0,0': 'glass',
      '-1,0,0': 'glass', '1,0,0': 'glass', '0,0,-1': 'glass', '0,0,1': 'glass',
      // Liquid sphere y=1
      '-1,1,-1': 'glass', '0,1,-1': 'glass', '1,1,-1': 'glass',
      '-1,1,0': 'glass',  '0,1,0': 'brick',  '1,1,0': 'glass',
      '-1,1,1': 'glass',  '0,1,1': 'glass',  '1,1,1': 'glass',
      // Liquid sphere mid y=2
      '-1,2,-1': 'glass', '0,2,-1': 'glass', '1,2,-1': 'glass',
      '-1,2,0': 'glass',  '0,2,0': 'brick',  '1,2,0': 'glass',
      '-1,2,1': 'glass',  '0,2,1': 'glass',  '1,2,1': 'glass',
      // Top dome y=3
      '0,3,0': 'glass',
      '-1,3,0': 'glass', '1,3,0': 'glass', '0,3,-1': 'glass', '0,3,1': 'glass',
      // Flask Neck y=4
      '0,4,0': 'glass',
      // Cork stopper y=5
      '0,5,0': 'wood',
    },
  },
  {
    id: 'pixel-sword',
    name: 'Spada da Cavaliere',
    category: 'oggetti',
    icon: '⚔️',
    description: 'Una spada medievale slanciata con elsa in legno, guardia in pietra e lama affilata.',
    difficulty: 2,
    tips: 'Costruisci l\'elsa verticale e aggiungi la guardia trasversale prima di allungare la lama.',
    targetBlocks: {
      // Pommel & Handle (y=0..1)
      '0,0,0': 'wood',
      '0,1,0': 'wood',
      // Crossguard (y=2)
      '-2,2,0': 'stone',
      '-1,2,0': 'stone',
      '0,2,0': 'wood',
      '1,2,0': 'stone',
      '2,2,0': 'stone',
      // Blade (y=3..6)
      '0,3,0': 'stone',
      '0,4,0': 'stone',
      '0,5,0': 'stone',
      '0,6,0': 'glass',
    },
  },
  {
    id: 'retro-rocket',
    name: 'Razzo Spaziale',
    category: 'oggetti',
    icon: '🚀',
    description: 'Un razzo esploratore con alette aerodinamiche, cabina trasparente e ogiva a punta.',
    difficulty: 3,
    tips: 'Posiziona con cura le 4 alette stabilizzatrici alla base prima di innalzare la fusoliera.',
    targetBlocks: {
      // Boosters / Fins y=0
      '-2,0,0': 'brick',
      '2,0,0': 'brick',
      '0,0,-2': 'brick',
      '0,0,2': 'brick',
      '0,0,0': 'stone',
      // Lower body y=1
      '-1,1,0': 'brick',
      '1,1,0': 'brick',
      '0,1,-1': 'brick',
      '0,1,1': 'brick',
      '0,1,0': 'wood',
      // Mid body y=2
      '0,2,0': 'wood',
      '-1,2,0': 'wood',
      '1,2,0': 'wood',
      '0,2,-1': 'wood',
      '0,2,1': 'wood',
      // Cockpit Window y=3
      '0,3,0': 'wood',
      '0,3,1': 'glass',
      '-1,3,0': 'wood',
      '1,3,0': 'wood',
      '0,3,-1': 'wood',
      // Upper cone y=4
      '0,4,0': 'brick',
      '-1,4,0': 'brick',
      '1,4,0': 'brick',
      '0,4,-1': 'brick',
      '0,4,1': 'brick',
      // Tip y=5
      '0,5,0': 'brick',
    },
  },
  {
    id: 'royal-throne',
    name: 'Trono Reale',
    category: 'oggetti',
    icon: '👑',
    description: 'Un maestoso seggio regale con braccioli in legno scolpito e alto schienale con inserto in vetro.',
    difficulty: 3,
    tips: 'La base e la seduta poggiano su 4 gambe angolari a terra.',
    targetBlocks: {
      // 4 Legs y=0
      '-1,0,-1': 'wood', '1,0,-1': 'wood',
      '-1,0,1': 'wood',  '1,0,1': 'wood',
      // Seat cushion y=1
      '-1,1,-1': 'brick', '0,1,-1': 'brick', '1,1,-1': 'brick',
      '-1,1,0': 'brick',  '0,1,0': 'brick',  '1,1,0': 'brick',
      '-1,1,1': 'brick',  '0,1,1': 'brick',  '1,1,1': 'brick',
      // Armrests & back start y=2
      '-1,2,-1': 'wood',  '0,2,-1': 'wood',  '1,2,-1': 'wood',
      '-1,2,0': 'wood',                      '1,2,0': 'wood',
      '-1,2,1': 'wood',                      '1,2,1': 'wood',
      // Backrest y=3
      '-1,3,-1': 'wood',  '0,3,-1': 'brick', '1,3,-1': 'wood',
      // Backrest top & Crown y=4, y=5
      '-1,4,-1': 'wood',  '0,4,-1': 'glass', '1,4,-1': 'wood',
      '0,5,-1': 'brick',
    },
  },
  {
    id: 'voxel-duck',
    name: 'Paperella Voxel',
    category: 'esperto',
    icon: '🦆',
    description: 'Una simpatica papera voxel tridimensionale con corpo tondo, coda, collo e becco.',
    difficulty: 3,
    tips: 'Costruisci il corpo 3x2 e poi aggiungi la testa che sporge in avanti con il becco in mattoni.',
    targetBlocks: {
      // Feet & belly y=0
      '-1,0,-1': 'wood', '0,0,-1': 'wood', '1,0,-1': 'wood',
      '-1,0,0': 'wood',  '0,0,0': 'wood',  '1,0,0': 'wood',
      '-1,0,1': 'wood',  '0,0,1': 'wood',  '1,0,1': 'wood',
      // Body & tail y=1
      '-1,1,-1': 'wood', '0,1,-1': 'wood', '1,1,-1': 'wood',
      '-1,1,0': 'wood',  '0,1,0': 'wood',  '1,1,0': 'wood',
      '-1,1,1': 'wood',  '0,1,1': 'wood',  '1,1,1': 'wood',
      '0,1,-2': 'wood', // Tail feather
      // Neck & Chest y=2
      '0,2,0': 'wood',
      '0,2,1': 'wood',
      '-1,2,1': 'wood',
      '1,2,1': 'wood',
      // Head & Beak y=3
      '0,3,1': 'wood',
      '0,3,2': 'brick', // Beak
      '-1,3,1': 'wood',
      '1,3,1': 'wood',
      '0,3,0': 'wood',
    },
  },
  {
    id: 'birthday-cake',
    name: 'Torta di Compleanno',
    category: 'esperto',
    icon: '🎂',
    description: 'Una golosa torta a due piani con decorazioni glassate e una candelina accesa.',
    difficulty: 3,
    tips: 'La base è un quadrato 4x4, il secondo piano è 2x2 e in cima risplende la candela.',
    targetBlocks: {
      // Layer 1 (4x4) y=0
      '-1,0,-1': 'brick', '0,0,-1': 'wood', '1,0,-1': 'wood', '2,0,-1': 'brick',
      '-1,0,0': 'wood',   '0,0,0': 'brick', '1,0,0': 'wood',  '2,0,0': 'wood',
      '-1,0,1': 'wood',   '0,0,1': 'wood',  '1,0,1': 'brick', '2,0,1': 'wood',
      '-1,0,2': 'brick',  '0,0,2': 'wood',  '1,0,2': 'wood',  '2,0,2': 'brick',
      // Layer 1 Icing y=1
      '-1,1,-1': 'glass', '0,1,-1': 'glass', '1,1,-1': 'glass', '2,1,-1': 'glass',
      '-1,1,0': 'glass',  '0,1,0': 'brick', '1,1,0': 'brick', '2,1,0': 'glass',
      '-1,1,1': 'glass',  '0,1,1': 'brick', '1,1,1': 'brick', '2,1,1': 'glass',
      '-1,1,2': 'glass',  '0,1,2': 'glass', '1,1,2': 'glass', '2,1,2': 'glass',
      // Layer 2 y=2
      '0,2,0': 'wood',   '1,2,0': 'brick',
      '0,2,1': 'brick',  '1,2,1': 'wood',
      // Layer 2 Icing y=3
      '0,3,0': 'glass',  '1,3,0': 'glass',
      '0,3,1': 'glass',  '1,3,1': 'glass',
      // Candle & Flame y=4, y=5
      '0,4,0': 'stone',
      '0,5,0': 'brick',
    },
  },
  {
    id: 'lighthouse',
    name: 'Faro Costiero',
    category: 'architettura',
    icon: '🗼',
    description: 'Un maestoso faro a righe alternate bianche e rosse con lanterna di cristallo e cupola.',
    difficulty: 3,
    tips: 'Alterna pietra e mattoni per creare le strisce del faro e posiziona il vetro sulla lanterna.',
    targetBlocks: {
      // Foundation y=0
      '-1,0,-1': 'stone', '0,0,-1': 'stone', '1,0,-1': 'stone',
      '-1,0,0': 'stone',  '0,0,0': 'stone',  '1,0,0': 'stone',
      '-1,0,1': 'stone',  '0,0,1': 'stone',  '1,0,1': 'stone',
      // Stripe 1 (Brick) y=1
      '-1,1,-1': 'brick', '0,1,-1': 'brick', '1,1,-1': 'brick',
      '-1,1,0': 'brick',  '0,1,0': 'stone',  '1,1,0': 'brick',
      '-1,1,1': 'brick',  '0,1,1': 'brick',  '1,1,1': 'brick',
      // Stripe 2 (Stone) y=2
      '-1,2,-1': 'stone', '0,2,-1': 'stone', '1,2,-1': 'stone',
      '-1,2,0': 'stone',  '0,2,0': 'stone',  '1,2,0': 'stone',
      '-1,2,1': 'stone',  '0,2,1': 'stone',  '1,2,1': 'stone',
      // Stripe 3 (Brick) y=3
      '-1,3,-1': 'brick', '0,3,-1': 'brick', '1,3,-1': 'brick',
      '-1,3,0': 'brick',  '0,3,0': 'stone',  '1,3,0': 'brick',
      '-1,3,1': 'brick',  '0,3,1': 'brick',  '1,3,1': 'brick',
      // Balcony Platform y=4
      '-1,4,-1': 'stone', '0,4,-1': 'stone', '1,4,-1': 'stone',
      '-1,4,0': 'stone',  '0,4,0': 'stone',  '1,4,0': 'stone',
      '-1,4,1': 'stone',  '0,4,1': 'stone',  '1,4,1': 'stone',
      // Lantern Chamber y=5
      '0,5,0': 'brick',
      '-1,5,0': 'glass', '1,5,0': 'glass', '0,5,-1': 'glass', '0,5,1': 'glass',
      // Lantern Roof y=6
      '0,6,0': 'stone',
    },
  },
  {
    id: 'sailboat',
    name: 'Barca a Vela',
    category: 'oggetti',
    icon: '⛵',
    description: 'Un piccolo veliero con scafo affusolato in legno, albero maestro e vela triangolare.',
    difficulty: 3,
    tips: 'Costruisci prima lo scafo con prua e poppa, poi innalza l\'albero e la vela in vetro.',
    targetBlocks: {
      // Keel & hull y=0
      '-2,0,0': 'wood',
      '-1,0,-1': 'wood', '-1,0,0': 'wood', '-1,0,1': 'wood',
      '0,0,-1': 'wood',  '0,0,0': 'wood',  '0,0,1': 'wood',
      '1,0,-1': 'wood',  '1,0,0': 'wood',  '1,0,1': 'wood',
      '2,0,0': 'wood',
      // Mast & Sail y=1
      '0,1,0': 'wood',
      '1,1,0': 'glass',
      // Mast & Sail y=2
      '0,2,0': 'wood',
      '1,2,0': 'glass',
      // Mast & Sail y=3
      '0,3,0': 'wood',
      '1,3,0': 'glass',
      // Mast top y=4
      '0,4,0': 'wood',
      '0,4,1': 'brick', // Flag
    },
  },
  {
    id: 'cute-panda',
    name: 'Cucciolo Panda',
    category: 'esperto',
    icon: '🐼',
    description: 'Un tenero panda voxel seduto con zampe, occhietti e orecchie scure.',
    difficulty: 3,
    tips: 'Usa la pietra per le parti scure (orecchie, zampe, occhi) e il legno/mattoni per il corpo chiaro.',
    targetBlocks: {
      // Feet & bottom y=0
      '-1,0,-1': 'stone', '0,0,-1': 'wood', '1,0,-1': 'stone',
      '-1,0,0': 'wood',   '0,0,0': 'wood',  '1,0,0': 'wood',
      '-1,0,1': 'stone',  '0,0,1': 'wood',  '1,0,1': 'stone',
      // Torso & arms y=1
      '-1,1,0': 'stone',  '0,1,0': 'wood',  '1,1,0': 'stone',
      '0,1,-1': 'wood',   '0,1,1': 'wood',
      // Head base y=2
      '-1,2,0': 'wood',   '0,2,0': 'wood',  '1,2,0': 'wood',
      '0,2,-1': 'wood',   '0,2,1': 'stone', // Snout
      // Face & Eyes y=3
      '-1,3,1': 'stone',  '0,3,1': 'wood',  '1,3,1': 'stone', // Eyes
      '-1,3,0': 'wood',   '0,3,0': 'wood',  '1,3,0': 'wood',
      '0,3,-1': 'wood',
      // Ears y=4
      '-1,4,0': 'stone',  '1,4,0': 'stone',
      '0,4,0': 'wood',
    },
  },
];
