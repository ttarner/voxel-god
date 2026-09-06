import { Language, BlockType, TimeOfDay, WeatherType, SymmetryMode } from '../types';

const LANGUAGE_STORAGE_KEY = 'voxel_app_language_v1';

/**
 * Detect browser language:
 * 1. Checks localStorage for saved user preference ('it' or 'en')
 * 2. Checks navigator.languages array and navigator.language
 * 3. Returns 'it' if Italian is detected, otherwise defaults to 'en'
 */
export function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'it' || saved === 'en') {
      return saved;
    }

    // Check navigator.languages
    const browserLanguages = typeof navigator !== 'undefined'
      ? (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || (navigator as any).userLanguage || ''])
      : ['en'];

    for (const lang of browserLanguages) {
      if (lang && typeof lang === 'string') {
        const lower = lang.toLowerCase();
        if (lower.startsWith('it')) {
          return 'it';
        }
      }
    }
  } catch {
    // fallback safe
  }
  return 'en';
}

export function persistLanguage(lang: Language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // safe
  }
}

export const TRANSLATIONS = {
  it: {
    // App identity
    appTitle: 'Voxel Studio',
    appSubtitle: 'Mondo Pastello 3D',

    // TopBar & Header
    menu: 'Menu',
    sandboxMode: 'Libera',
    challengeMode: 'Sfide',
    sandboxTitle: 'Modalità Libera Sandbox',
    challengeTitle: 'Modalità Sfide Puzzle',
    collectionTitle: 'Raccolta Configurazioni Puzzle',
    undo: 'Annulla (Ctrl+Z)',
    redo: 'Ripeti (Ctrl+Y)',
    environment: 'Ambiente',
    environmentTitle: 'Ambiente & Luce 3D',
    weatherTitle: 'Meteo Dinamico',
    gridShow: 'Mostra Griglia',
    gridHide: 'Nascondi Griglia',
    grid: 'Griglia',
    sfxTitle: 'Effetti Sonori',
    ambientMusicTitle: 'Soundscape Ambient',
    hapticsTitle: 'Feedback Aptico (Vibrazione)',
    colorStudio: 'Studio Colori & Materiali',
    takeSnapshot: 'Salva Foto',
    snapshotSuccess: 'Foto Salvata!',
    worldTemplates: 'Modelli Sandbox',
    helpAndInfo: 'Controlli & Info',
    moreTools: 'Altri Strumenti & Impostazioni',
    initialScreen: 'Schermata Iniziale',
    language: 'Lingua',
    active: 'Attivo',
    disabled: 'Disattivato',
    visible: 'Visibile',
    hidden: 'Nascosta',

    // Weather
    weatherClear: 'Sereno',
    weatherRain: 'Pioggia',
    weatherSnow: 'Neve',

    // Lighting
    lightingPresets: 'Preset di Illuminazione',
    ambientLight3D: 'Luce 3D',
    sunrise: 'Alba',
    sunriseDesc: 'Luce dorata radente e cielo pastello rosato',
    noon: 'Mezzogiorno',
    noonDesc: 'Sole radioso zenitale e massima brillantezza',
    twilight: 'Crepuscolo',
    twilightDesc: 'Sfumature calde porpora, arancio e corallo',
    night: 'Notte',
    nightDesc: 'Luna argentea, atmosfera profonda e stelle scintillanti',

    // Hotbar
    build: 'Costruisci',
    destroy: 'Distruggi',
    brushSize: 'Dimensione pennello',
    dragContinuous: 'Trascina',
    dragTooltip: 'Trascina per disegnare/posizionare blocchi continui',
    symmetry: 'Simmetria',
    symmetryOff: 'Nessuna',
    symmetryX: 'Asse X',
    symmetryZ: 'Asse Z',
    symmetryBoth: 'Asse X+Z',

    // Zoom Controls
    zoomControls: 'Controlli Zoom a 1 Dito',
    openZoomControls: 'Apri controlli zoom',
    collapseZoom: 'Comprimi zoom',
    zoomInTooltip: 'Zoom In (1 Dito / Tieni premuto)',
    zoomOutTooltip: 'Zoom Out (1 Dito / Tieni premuto)',
    zoomScrubberTooltip: 'Trascina con 1 dito per zoomare',
    centerCameraTooltip: 'Ripristina visuale al centro',

    // Initial Screen
    initialMenuTitle: 'Voxel Studio',
    initialMenuSubtitle: 'Pastel 3D World',
    menuStart: 'Start',
    menuOptions: 'Options',
    menuQuit: 'Quit',
    menuQuitConfirm: 'Vuoi uscire dalla sessione?',
    menuConfirm: 'Conferma',
    menuCancel: 'Annulla',
    menuShuffleBg: 'Cambia Modello 3D',
    freeCreation: 'Creazione Libera',
    freeCreationDesc: 'Mondo aperto senza limiti',
    selectModePrompt: 'Scegli la modalità di gioco',
    enterSandbox: 'Avvia Creazione Libera',
    playChallenge: 'Gioca Sfida 3D',
    continueChallenge: 'Continua Sfida',
    browseChallenges: 'Catalogo Sfide',
    completedChallengesCount: '{completed}/{total} completate',
    blocksCountStatus: '{count} blocchi posizionati',
    challengesTitle: 'Modalità Sfide 3D',
    continueChallengePrompt: 'Continua la sfida in corso',
    challenge3DDesc: 'Puzzle 3D con guida olografica',
    presetsBtn: 'Preset Mondi',
    presetsBtnDesc: 'Modelli pronti',
    paletteBtn: 'Tavolozza',
    paletteBtnDesc: 'Colori pastello',
    catalogBtn: 'Catalogo Sfide',
    guideBtn: 'Guida Comandi',
    enter3DPrompt: 'Tocca per entrare nel mondo 3D →',
    soundOn: 'Audio On',
    soundMute: 'Muto',

    // Zoom Controls
    zoomIn: 'Zoom In (1 Dito / Tieni premuto)',
    zoomOut: 'Zoom Out (1 Dito / Tieni premuto)',
    zoomCenter: 'Centra Isola & Resetta Vista',
    zoomScrubber: 'Trascina con 1 dito per zoomare',
    zoomExpand: 'Controlli Zoom a 1 Dito',
    zoomCollapse: 'Comprimi zoom',

    // Challenge HUD
    challengeCompletedBadge: 'Fatto',
    exitToSandbox: 'Torna a Sandbox Libero',
    restartChallenge: 'Ricomincia da Capo',
    hideGhostGuide: 'Nascondi Guida Olografica',
    showGhostGuide: 'Mostra Guida Olografica',
    nextRandomChallenge: 'Prossima Sfida Casuale',
    allBlocksCorrect: 'Configurazione completata al 100%!',
    remainingBlocks: '{missing} mancanti',
    wrongBlocks: '{wrong} errati',
    blocksNeeded: 'Blocchi Richiesti',
    blueprintGuideTip: 'Tocca un blocco richiesto per selezionarlo e posizionalo seguendo la sagoma olografica.',

    // Challenge Celebration Modal
    puzzleSolvedTitle: 'Configurazione Risolta!',
    puzzleSolvedDesc: 'Hai posizionato tutti i blocchi al posto esatto con successo!',
    solvedTitle: 'Configurazione Risolta!',
    solvedDesc: 'Hai posizionato tutti i blocchi al posto esatto con successo!',
    addedToCollection: 'Aggiunto alla Raccolta',
    modelsCompletedProgress: '{completed} su {total} modelli completati',
    modelsCompleted: '{completed} su {total} completati',
    viewCollection: 'Vedi Raccolta',
    seeCollection: 'Vedi Raccolta',
    freeModeBtn: 'Modalità Libera',

    // Challenge Collection Modal
    collectionModalTitle: 'Raccolta Configurazioni Puzzle',
    collectionModalSubtitle: 'Metti i blocchi al posto giusto e completa tutti i modelli voxel.',
    collectionSubtitle: 'Metti i blocchi al posto giusto e completa tutti i modelli voxel.',
    collectionProgress: 'Progressi Raccolta:',
    modelsOfTotal: '{completed} su {total} Modelli',
    filterAll: 'Tutte',
    filterTodo: 'Da Fare',
    filterCompleted: 'Completate',
    allFilter: 'Tutte',
    toDoFilter: 'Da Fare',
    completedFilter: 'Completate',
    randomPuzzleBtn: 'Sfida a Sorpresa',
    startChallengeBtn: 'Inizia Sfida',
    resumeChallengeBtn: 'Continua Sfida',
    inProgressBadge: 'In Corso',
    completedBadge: 'Completato',
    difficultyLabel: 'Difficoltà:',
    blocksLabel: 'blocchi',
    noChallengesFound: 'Nessuna sfida trovata con questo filtro.',

    // Presets Modal
    templatesModalTitle: 'Modelli Mondo (World Templates)',
    clearWorldTitle: 'Svuota l\'intera mappa',
    confirmClearPrompt: 'Vuoi svuotare tutto il mondo?',
    confirmClearYes: 'Sì, svuota',
    confirmClearCancel: 'Annulla',

    // Shared & Controls
    randomChallenge: 'Sfida a Sorpresa',
    blocksRequired: '{count} blocchi',
    inProgress: 'In Corso',
    replay: 'Rigioca',
    buildChallenge: 'Costruisci',
    exit: 'Esci',
    expandDetails: 'Espandi dettagli',
    collapseDetails: 'Comprimi dettagli',
    extraMismatch: 'Blocchi errati o extra: {count}',
    materials: 'Materiali',
    selectBlock: 'Seleziona blocco',
    ghostGuideHide: 'Nascondi guida fantasma',
    ghostGuideShow: 'Mostra guida fantasma',
    guideOn: 'Guida ON',
    guideOff: 'Guida OFF',
    reset: 'Ripristina',
    close: 'Chiudi',
    weather: 'Meteo',
    mainMenuBtn: 'Schermata Iniziale',
    exitToMenu: 'Esci al Menu',

    // Color Studio
    colorStudioTitle: 'Studio Colori & Materiali Pastello',
    colorStudioSubtitle: 'Personalizza l\'estetica e le sfumature dei tuoi voxel',
    tabThemes: 'Tavolozze a Tema',
    tabCustom: 'Personalizza Singolo Blocco',
    applyThemePrompt: 'Applica una palette pastello armoniosa a tutto il mondo:',
    applyThemeTap: 'Tocca per applicare',
    themeActive: 'Attiva',
    customColorPrompt: 'Scegli il blocco da ricolorare:',
    pastelShades: 'Sfumature Pastello Pronte',
    customHex: 'Colore Personalizzato (HEX / Selettore)',
    resetColors: 'Ripristina Colori Originali',
    activeColorLabel: 'Colore Attivo:',

    // Help Modal
    helpTitle: 'Controlli & Impostazioni',
    graphicsSettingsTitle: 'Estetica & Grafica 3D',
    bloomLabel: 'Bagliore Soffice (Dreamy Bloom)',
    bloomDesc: 'Dona ai blocchi voxel un\'illuminazione morbida ed eterea in perfetto stile pastello.',
    bloomIntensityLabel: 'Intensità Dreamy Glow',
    audioSettingsTitle: 'Impostazioni Volume Audio',
    ambientMusicLabel: 'Musica Ambientale',
    sfxLabel: 'Effetti Sonori (SFX)',
    ambientVolumeDesc: 'Regola il livello del tappeto musicale d\'atmosfera 3D.',
    sfxVolumeDesc: 'Regola il volume del posizionamento blocchi, strumenti e campane.',
    helpEnvironmentTitle: 'Ambiente & Luce 3D (Alba, Mezzogiorno, Crepuscolo, Notte)',
    helpEnvironmentDesc: 'Accedi al sottomenu "Ambiente" dalla barra in alto per selezionare preset di illuminazione ambientali e condizioni meteo live.',
    helpSymmetryTitle: 'Costruzione Simmetrica (Asse X, Z o X+Z)',
    helpSymmetryDesc: 'Specchia automaticamente i blocchi posizionati sul lato opposto dell’origine per velocizzare la costruzione architettonica (Tasto M).',
    helpBrushTitle: 'Dimensione Pennello (1x1, 2x2, 3x3)',
    helpBrushDesc: 'Scegli la dimensione del raggio per creare pavimenti, muri e intere aree in un colpo solo.',
    helpDragTitle: 'Modalità Trascina / Disegna',
    helpDragDesc: 'Attiva il tasto "Trascina" per dipingere o scavare blocchi in modo continuo tenendo premuto.',
    helpWeatherTitle: 'Meteo Dinamico (Pioggia & Neve)',
    helpWeatherDesc: 'Attiva precipitazioni minimaliste con atmosfera e cielo soffusi personalizzabili dalla barra in alto.',
    helpHapticsTitle: 'Feedback Aptico & Tattile',
    helpHapticsDesc: 'Vibrazioni differenziate e realistiche al posizionamento, distruzione di blocchi, cambio strumenti e vittoria dei puzzle.',
    helpRotateTitle: 'Ruota Visuale (1 dito / tasto sinistro)',
    helpRotateDesc: 'Ruota l’angolo della telecamera per osservare l’isola da qualsiasi prospettiva.',
    helpPanTitle: 'Sposta & Panoramica (2 dita)',
    helpPanDesc: 'Sposta la visuale orizzontalmente o verticalmente.',
    helpZoomTitle: 'Zoom a 1 Dito o Pizzica a 2 Dita',
    helpZoomDesc: 'Doppio tocco e trascina in alto/basso con un solo dito, usa la barra laterale (+/- / slider), oppure pizzica con 2 dita.',
    helpProTip: 'Consiglio Rapido: Selezionando 3x3 e attivando Trascina puoi creare intere superfici o scavare rapidamente su qualsiasi dispositivo!',

    // Block Labels & Descriptions
    block_grass_label: 'Erba',
    block_grass_desc: 'Manto erboso soffice e fresco',
    block_dirt_label: 'Terra',
    block_dirt_desc: 'Argilla bruna e calda terra fertile',
    block_stone_label: 'Pietra',
    block_stone_desc: 'Roccia naturale grigio perla levigata',
    block_wood_label: 'Legno',
    block_wood_desc: 'Calda essenza di cedro mielato',
    block_brick_label: 'Mattoni',
    block_brick_desc: 'Solido blocco in terracotta rosata',
    block_glass_label: 'Vetro',
    block_glass_desc: 'Vetro pastello celeste semitrasparente',
    block_water_label: 'Acqua',
    block_water_desc: 'Acqua cristallina di sorgente calmante',
    block_leaves_label: 'Foglie',
    block_leaves_desc: 'Fogliame primaverile rigoglioso',
    block_tree_label: 'Albero',
    block_tree_desc: 'Genera un tronco in legno con chioma',

    // Categories
    cat_principiante: 'Principiante',
    cat_natura: 'Natura',
    cat_architettura: 'Architettura',
    cat_oggetti: 'Oggetti',
    cat_esperto: 'Esperto',

    // Presets
    preset_starter_name: 'Isola Galleggiante',
    preset_starter_desc: 'Un\'accogliente isola pastello fluttuante con albero, ruscello e prato',
    preset_oasis_name: 'Laghetto & Fontana',
    preset_oasis_desc: 'Un’oasi rilassante con piscina d’acqua cristallina, fontana e ninfee',
    preset_cottage_name: 'Cottage Accogliente',
    preset_cottage_desc: 'Una graziosa casetta in mattoni con tetto in legno e camino',
    preset_shrine_name: 'Santuario Zen',
    preset_shrine_desc: 'Un giardino pacifico con portale torii e alberelli bonsai',
    preset_flat_name: 'Prato Pianeggiante',
    preset_flat_desc: 'Una superficie 9x9 pulita in erba pronta per costruire liberamente',
    preset_empty_name: 'Tela Vuota',
    preset_empty_desc: 'Spazio completamente sgombro per partire da zero',

    // Themes
    theme_classic_name: 'Classico Pastello',
    theme_classic_desc: 'Toni naturali e freschi con morbide sfumature bilanciate',
    theme_sakura_name: 'Sakura & Caramella',
    theme_sakura_desc: 'Sfumature delicate rosa ciliegio, lilla e toni floreali',
    theme_nordic_name: 'Nordico & Salvia',
    theme_nordic_desc: 'Essenze botaniche minimali, ardesia chiara e toni salvia freddi',
    theme_sunset_peach_name: 'Tramonto & Pesca',
    theme_sunset_peach_desc: 'Atmosfera calda all’albicocca, terracotta e legno ambrato',
    theme_cyber_vapor_name: 'Vaporwave Etereo',
    theme_cyber_vapor_desc: 'Colori celesti, menta pastello e lavanda crepuscolare',
    
    // UI Helpers
    stepChooseBlock: '1. Scegli il blocco da ricolorare',
    stepTouchPastel: '2. Oppure tocca un campione pastello',
    touchColorWheel: 'Tocca per la ruota colori libera',
    doneBtn: 'Fatto',
    resetBtn: 'Ripristina',
    closeModal: 'Chiudi finestra',
  },

  en: {
    // App identity
    appTitle: 'Voxel Studio',
    appSubtitle: 'Pastel 3D World',

    // TopBar & Header
    menu: 'Menu',
    sandboxMode: 'Sandbox',
    challengeMode: 'Challenges',
    sandboxTitle: 'Creative Sandbox Mode',
    challengeTitle: '3D Puzzle Challenges Mode',
    collectionTitle: 'Puzzle Challenges Collection',
    undo: 'Undo (Ctrl+Z)',
    redo: 'Redo (Ctrl+Y)',
    environment: 'Environment',
    environmentTitle: '3D Environment & Lighting',
    weatherTitle: 'Dynamic Weather',
    gridShow: 'Show Grid',
    gridHide: 'Hide Grid',
    grid: 'Grid',
    sfxTitle: 'Sound Effects',
    ambientMusicTitle: 'Ambient Soundscape',
    hapticsTitle: 'Haptic Feedback (Vibration)',
    colorStudio: 'Colors & Materials Studio',
    takeSnapshot: 'Save Photo',
    snapshotSuccess: 'Photo Saved!',
    worldTemplates: 'Sandbox Templates',
    helpAndInfo: 'Controls & Info',
    moreTools: 'More Tools & Settings',
    initialScreen: 'Start Screen',
    language: 'Language',
    active: 'Active',
    disabled: 'Disabled',
    visible: 'Visible',
    hidden: 'Hidden',

    // Weather
    weatherClear: 'Clear',
    weatherRain: 'Rain',
    weatherSnow: 'Snow',

    // Lighting
    lightingPresets: 'Lighting Presets',
    ambientLight3D: '3D Light',
    sunrise: 'Sunrise',
    sunriseDesc: 'Golden low sun and soft pink pastel morning sky',
    noon: 'Noon',
    noonDesc: 'Bright overhead sun with maximum crisp clarity',
    twilight: 'Twilight',
    twilightDesc: 'Warm purple, amber orange and coral sunset glow',
    night: 'Night',
    nightDesc: 'Silver moon, deep midnight atmosphere and twinkling stars',

    // Hotbar
    build: 'Build',
    destroy: 'Destroy',
    brushSize: 'Brush size',
    dragContinuous: 'Drag',
    dragTooltip: 'Drag to draw / place continuous blocks',
    symmetry: 'Symmetry',
    symmetryOff: 'None',
    symmetryX: 'X Axis',
    symmetryZ: 'Z Axis',
    symmetryBoth: 'X+Z Axis',

    // Initial Screen
    initialMenuTitle: 'Voxel Studio',
    initialMenuSubtitle: 'Pastel 3D World',
    menuStart: 'Start',
    menuOptions: 'Options',
    menuQuit: 'Quit',
    menuQuitConfirm: 'Do you want to quit the session?',
    menuConfirm: 'Confirm',
    menuCancel: 'Cancel',
    menuShuffleBg: 'Change 3D Model',
    freeCreation: 'Free Building',
    freeCreationDesc: 'Limitless creative open world',
    selectModePrompt: 'Choose Game Mode',
    enterSandbox: 'Enter Free Sandbox',
    playChallenge: 'Play 3D Challenge',
    continueChallenge: 'Continue Challenge',
    browseChallenges: 'Challenge Catalog',
    completedChallengesCount: '{completed}/{total} completed',
    blocksCountStatus: '{count} blocks placed',
    challengesTitle: '3D Challenges Mode',
    continueChallengePrompt: 'Continue active challenge',
    challenge3DDesc: '3D puzzles with holographic blueprint',
    presetsBtn: 'World Presets',
    presetsBtnDesc: 'Ready-made scenes',
    paletteBtn: 'Palette',
    paletteBtnDesc: 'Pastel colors',
    catalogBtn: 'Challenge Catalog',
    guideBtn: 'Controls Guide',
    enter3DPrompt: 'Tap to enter 3D world →',
    soundOn: 'Audio On',
    soundMute: 'Muted',

    // Zoom Controls
    zoomIn: 'Zoom In (1 Finger / Hold)',
    zoomOut: 'Zoom Out (1 Finger / Hold)',
    zoomCenter: 'Center Island & Reset View',
    zoomScrubber: 'Drag with 1 finger to zoom',
    zoomExpand: '1-Finger Zoom Controls',
    zoomCollapse: 'Collapse zoom',

    // Challenge HUD
    challengeCompletedBadge: 'Done',
    exitToSandbox: 'Back to Free Sandbox',
    restartChallenge: 'Restart from Scratch',
    hideGhostGuide: 'Hide Hologram Guide',
    showGhostGuide: 'Show Hologram Guide',
    nextRandomChallenge: 'Next Random Challenge',
    allBlocksCorrect: 'Configuration 100% completed!',
    remainingBlocks: '{missing} missing',
    wrongBlocks: '{wrong} wrong',
    blocksNeeded: 'Required Blocks',
    blueprintGuideTip: 'Tap any required block to select it and place it following the holographic blueprint.',

    // Challenge Celebration Modal
    puzzleSolvedTitle: 'Puzzle Solved!',
    puzzleSolvedDesc: 'You successfully placed every voxel block in its exact position!',
    solvedTitle: 'Configuration Solved!',
    solvedDesc: 'You placed all blocks in the exact positions successfully!',
    addedToCollection: 'Added to Collection',
    modelsCompletedProgress: '{completed} of {total} models completed',
    modelsCompleted: '{completed} of {total} completed',
    viewCollection: 'View Collection',
    seeCollection: 'View Collection',
    freeModeBtn: 'Free Mode',

    // Challenge Collection Modal
    collectionModalTitle: 'Puzzle Challenges Collection',
    collectionModalSubtitle: 'Place blocks in the right spots and complete all voxel models.',
    collectionSubtitle: 'Place blocks in the right spots and complete all voxel models.',
    collectionProgress: 'Collection Progress:',
    modelsOfTotal: '{completed} of {total} Models',
    filterAll: 'All',
    filterTodo: 'To Do',
    filterCompleted: 'Completed',
    allFilter: 'All',
    toDoFilter: 'To Do',
    completedFilter: 'Completed',
    randomPuzzleBtn: 'Surprise Challenge',
    startChallengeBtn: 'Start Challenge',
    resumeChallengeBtn: 'Continue Challenge',
    inProgressBadge: 'In Progress',
    completedBadge: 'Completed',
    difficultyLabel: 'Difficulty:',
    blocksLabel: 'blocks',
    noChallengesFound: 'No challenges found with this filter.',

    // Presets Modal
    templatesModalTitle: 'World Templates (Presets)',
    clearWorldTitle: 'Clear Entire Map',
    confirmClearPrompt: 'Clear all blocks in this world?',
    confirmClearYes: 'Yes, Clear All',
    confirmClearCancel: 'Cancel',

    // Shared & Controls
    randomChallenge: 'Random Challenge',
    blocksRequired: '{count} blocks',
    inProgress: 'In Progress',
    replay: 'Replay',
    buildChallenge: 'Build',
    exit: 'Exit',
    expandDetails: 'Expand details',
    collapseDetails: 'Collapse details',
    extraMismatch: 'Incorrect or extra blocks: {count}',
    materials: 'Materials',
    selectBlock: 'Select block',
    ghostGuideHide: 'Hide ghost blueprint',
    ghostGuideShow: 'Show ghost blueprint',
    guideOn: 'Guide ON',
    guideOff: 'Guide OFF',
    reset: 'Reset',
    close: 'Close',
    weather: 'Weather',
    mainMenuBtn: 'Initial Screen',
    exitToMenu: 'Exit to Menu',

    // Color Studio
    colorStudioTitle: 'Pastel Colors & Materials Studio',
    colorStudioSubtitle: 'Customize the aesthetics and shades of your voxels',
    tabThemes: 'Themed Palettes',
    tabCustom: 'Customize Single Block',
    applyThemePrompt: 'Apply a harmonious pastel palette to the whole world:',
    applyThemeTap: 'Tap to apply',
    themeActive: 'Active',
    customColorPrompt: 'Choose block to recolor:',
    pastelShades: 'Curated Pastel Swatches',
    customHex: 'Custom Color (HEX / Color Picker)',
    resetColors: 'Reset Original Colors',
    activeColorLabel: 'Active Color:',

    // Help Modal
    helpTitle: 'Controls & Settings',
    graphicsSettingsTitle: '3D Visuals & Aesthetics',
    bloomLabel: 'Dreamy Bloom Glow',
    bloomDesc: 'Infuses voxel blocks with a soft, ethereal pastel glow and pillowy light dispersion.',
    bloomIntensityLabel: 'Dreamy Glow Intensity',
    audioSettingsTitle: 'Audio Volume Settings',
    ambientMusicLabel: 'Ambient Music',
    sfxLabel: 'Sound Effects (SFX)',
    ambientVolumeDesc: 'Adjust the 3D atmospheric music soundscape volume.',
    sfxVolumeDesc: 'Adjust block placement, tools, and chime volume.',
    helpEnvironmentTitle: '3D Environment & Light (Sunrise, Noon, Twilight, Night)',
    helpEnvironmentDesc: 'Access the "Environment" submenu in the top bar to choose lighting presets and live weather.',
    helpSymmetryTitle: 'Symmetric Building (X, Z or X+Z Axis)',
    helpSymmetryDesc: 'Automatically mirror blocks on the opposite side of the origin to speed up architectural builds (Key: M).',
    helpBrushTitle: 'Brush Size (1x1, 2x2, 3x3)',
    helpBrushDesc: 'Choose radius size to build large floors, walls, and structures in one click.',
    helpDragTitle: 'Continuous Drag Mode',
    helpDragDesc: 'Enable "Drag" to paint or dig blocks continuously while holding down.',
    helpWeatherTitle: 'Dynamic Weather (Rain & Snow)',
    helpWeatherDesc: 'Turn on soft weather precipitation and atmospheric mist from the top bar.',
    helpHapticsTitle: 'Haptic & Tactile Feedback',
    helpHapticsDesc: 'Realistic tactile vibrations on block placement, destruction, tool switching and puzzle victories.',
    helpRotateTitle: 'Rotate Camera (1 finger / Left click)',
    helpRotateDesc: 'Rotate the camera angle to view your island from any perspective.',
    helpPanTitle: 'Pan & Move (2 fingers / Right click)',
    helpPanDesc: 'Move the view horizontally or vertically.',
    helpZoomTitle: '1-Finger Zoom or 2-Finger Pinch',
    helpZoomDesc: 'Double tap and drag up/down with 1 finger, use the floating zoom bar, or pinch with 2 fingers.',
    helpProTip: 'Pro Tip: Select 3x3 and enable Drag to quickly create entire floors or dig out areas on any device!',

    // Block Labels & Descriptions
    block_grass_label: 'Grass',
    block_grass_desc: 'Soft lush topsoil with fresh green grass',
    block_dirt_label: 'Dirt',
    block_dirt_desc: 'Rich warm earthen brown fertile clay',
    block_stone_label: 'Stone',
    block_stone_desc: 'Smooth light grey natural rock',
    block_wood_label: 'Wood',
    block_wood_desc: 'Warm honey cedar wood grain',
    block_brick_label: 'Brick',
    block_brick_desc: 'Warm terracotta masonry block',
    block_glass_label: 'Glass',
    block_glass_desc: 'Semi-transparent pastel sky glass',
    block_water_label: 'Water',
    block_water_desc: 'Crystal clear calm aqua spring water',
    block_leaves_label: 'Leaves',
    block_leaves_desc: 'Vibrant spring tree foliage',
    block_tree_label: 'Tree',
    block_tree_desc: 'Spawns a wood trunk with foliage canopy',

    // Categories
    cat_principiante: 'Beginner',
    cat_natura: 'Nature',
    cat_architettura: 'Architecture',
    cat_oggetti: 'Objects',
    cat_esperto: 'Expert',

    // Presets
    preset_starter_name: 'Floating Island',
    preset_starter_desc: 'A cozy pastel floating isle with tree, stream, and flora',
    preset_oasis_name: 'Lake & Fountain',
    preset_oasis_desc: 'A calming oasis with crystal clear water, water lilies and fountain',
    preset_cottage_name: 'Cozy Cottage',
    preset_cottage_desc: 'A warm brick cottage with cedar roof and chimney',
    preset_shrine_name: 'Zen Shrine',
    preset_shrine_desc: 'A peaceful garden with sacred arch and bonsai trees',
    preset_flat_name: 'Flat Meadow',
    preset_flat_desc: 'A clean 9x9 grass building plate for sandbox freedom',
    preset_empty_name: 'Empty Canvas',
    preset_empty_desc: 'A completely clear ground to start from scratch',

    // Themes
    theme_classic_name: 'Classic Pastel',
    theme_classic_desc: 'Natural, fresh tones with soft, balanced shades',
    theme_sakura_name: 'Sakura & Candy',
    theme_sakura_desc: 'Delicate cherry pink, soft lilac and floral tones',
    theme_nordic_name: 'Nordic & Sage',
    theme_nordic_desc: 'Minimal botanical essence, light slate and cool sage tones',
    theme_sunset_peach_name: 'Sunset & Peach',
    theme_sunset_peach_desc: 'Warm apricot ambiance, terracotta and amber cedar',
    theme_cyber_vapor_name: 'Ethereal Vaporwave',
    theme_cyber_vapor_desc: 'Pastel celestial mint, violet glow and twilight lavender',
    
    // UI Helpers
    stepChooseBlock: '1. Choose block to recolor',
    stepTouchPastel: '2. Or tap a curated pastel swatch',
    touchColorWheel: 'Tap for free color wheel',
    doneBtn: 'Done',
    resetBtn: 'Reset',
    closeModal: 'Close window',
  },
};

export type TranslationKey = keyof typeof TRANSLATIONS.it;

export function t(key: TranslationKey, lang: Language, params?: Record<string, string | number>): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let text = dictionary[key] || TRANSLATIONS.en[key] || (key as string);

  if (params) {
    for (const [paramKey, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
    }
  }

  return text;
}

// Localized challenges dictionary
export const CHALLENGES_I18N: Record<
  string,
  {
    name: { it: string; en: string };
    description: { it: string; en: string };
    tips: { it: string; en: string };
  }
> = {
  'pixel-heart': {
    name: { it: 'Cuore Pixel', en: 'Pixel Heart' },
    description: {
      it: 'Un dolce cuore voxel. La sfida ideale per iniziare a prendere confidenza con le coordinate.',
      en: 'A cute voxel heart. The ideal starter challenge to get comfortable with coordinates.',
    },
    tips: {
      it: 'Inizia dal punto centrale inferiore sulla griglia e sali verso i due lobi simmetrici.',
      en: 'Start from the bottom center point on the grid and build up towards both symmetrical lobes.',
    },
  },
  'mini-tree': {
    name: { it: 'Albero Bonsai', en: 'Bonsai Tree' },
    description: {
      it: 'Un alberello armonioso con tronco in legno robusto e chioma di foglie rigogliose.',
      en: 'A harmonious miniature tree with sturdy wood trunk and leafy canopy.',
    },
    tips: {
      it: 'Costruisci prima il tronco di legno poggiato al suolo e poi espandi la chioma di foglie.',
      en: 'First erect the wooden trunk on the ground and then expand the leaf canopy.',
    },
  },
  'magic-mushroom': {
    name: { it: 'Fungo Magico', en: 'Magic Mushroom' },
    description: {
      it: 'Un fungo delle favole con gambo chiaro in legno e una cappella a cupola rossa in mattoni.',
      en: 'A fairy-tale mushroom with a pale wood stem and red brick domed cap.',
    },
    tips: {
      it: 'Innalza il gambo di legno a terra, poi crea la cappella 3x3 e il blocco apicale.',
      en: 'Raise the wood stem on the ground, then build the 3x3 cap and crown block.',
    },
  },
  'pixel-star': {
    name: { it: 'Stella d\'Oro', en: 'Golden Star' },
    description: {
      it: 'Una splendente stella a cinque punte in mattoni caldi da far brillare nel cielo.',
      en: 'A glowing five-pointed star made of warm blocks to shine in the sky.',
    },
    tips: {
      it: 'Parti dal fusto centrale e stendi i 4 raggi orizzontali e la punta superiore.',
      en: 'Start with the central core, extend the four lateral rays and finish with the top point.',
    },
  },
  'torii-gate': {
    name: { it: 'Portale Torii Shintoista', en: 'Shinto Torii Gate' },
    description: {
      it: 'Il sacro portale giapponese con colonne parallele e architrave orizzontale.',
      en: 'The sacred Japanese gate with parallel pillars and horizontal crossbeam.',
    },
    tips: {
      it: 'Innalza le due colonne a distanza di 4 blocchi e uniscile con la trave superiore sporgente.',
      en: 'Raise the two pillars 4 blocks apart and join them with the overhanging crossbeam.',
    },
  },
  'cozy-fireplace': {
    name: { it: 'Caminetto Accogliente', en: 'Cozy Fireplace' },
    description: {
      it: 'Un focolare in pietra con canna fumaria e cuore caldo per riscaldare l\'isola.',
      en: 'A stone fireplace with hearth and chimney to warm the island.',
    },
    tips: {
      it: 'Crea la base a U in pietra, posiziona il fuoco caldo e costruisci la cappa.',
      en: 'Create the U-shaped stone base, place the warm core and build the chimney stack.',
    },
  },
  'stone-fountain': {
    name: { it: 'Fontana a Zampillo', en: 'Jet Fountain' },
    description: {
      it: 'Una fontana ornamentale in pietra con vasca d\'acqua cristallina e pilastro centrale.',
      en: 'An ornamental stone fountain with crystal pool basin and central spire.',
    },
    tips: {
      it: 'Delimita la vasca esterna quadrata in pietra, riempi d\'acqua e alza la colonna centrale.',
      en: 'Outline the square stone basin, fill with water and elevate the central water pillar.',
    },
  },
  'desert-cactus': {
    name: { it: 'Cactus Saguaro', en: 'Saguaro Cactus' },
    description: {
      it: 'Un maestoso cactus del deserto con tronco slanciato e due bracci asimmetrici.',
      en: 'A desert saguaro cactus with a tall central stalk and asymmetric arms.',
    },
    tips: {
      it: 'Erigi il tronco centrale di 6 blocchi di foglie, poi fai ramificare i due bracci ad altezze diverse.',
      en: 'Erect the 6-block leaf trunk, then branch out the two arms at different heights.',
    },
  },
  'sail-boat': {
    name: { it: 'Barca a Vela', en: 'Sailboat' },
    description: {
      it: 'Uno scafo in legno affusolato con albero maestro e vela quadrata in pietra bianca.',
      en: 'A tapered wooden hull with mainmast and square white sail.',
    },
    tips: {
      it: 'Costruisci prima lo scafo piatto e la prua rialzata, poi innalza l\'albero e la vela.',
      en: 'Build the flat hull and raised bow first, then raise the mast and sail.',
    },
  },
  'medieval-tower': {
    name: { it: 'Torretta di Guardia', en: 'Watchtower' },
    description: {
      it: 'Una fortificazione medievale in pietra e mattoni con merlature e feritoie.',
      en: 'A stone and brick medieval fortification with battlements and arrow slits.',
    },
    tips: {
      it: 'Innalza le 4 pareti di pietra su 4 livelli, poi modella i 4 merli angolari in cima.',
      en: 'Raise the 4 stone walls 4 levels high, then crown the 4 corner battlements on top.',
    },
  },
  'cute-duck': {
    name: { it: 'Paperella Voxel', en: 'Voxel Duckling' },
    description: {
      it: 'Una simpatica anatroccola con corpo compatto, becco arancione e codina.',
      en: 'A cute little duck with compact body, orange beak and tail.',
    },
    tips: {
      it: 'Modella il corpo 3x2, aggiungi la testa rialzata e infine il becco sporgente.',
      en: 'Shape the 3x2 body, add the raised head and finish with the protruding beak.',
    },
  },
  'gem-sword': {
    name: { it: 'Spada Incantata', en: 'Enchanted Sword' },
    description: {
      it: 'Una leggendaria spada da eroe con elsa dorata in legno, guardia in mattoni e lama in pietra.',
      en: 'A legendary hero sword with wooden hilt, crossguard and stone blade.',
    },
    tips: {
      it: 'Inizia dal pomolo inferiore, crea la guardia a croce e sviluppa la lama verso l\'alto.',
      en: 'Start with the bottom pommel, create the crossguard and extend the blade upwards.',
    },
  },
  'pagoda-temple': {
    name: { it: 'Pagoda a Due Piani', en: 'Two-Tier Pagoda' },
    description: {
      it: 'Un sontuoso tempio orientale con basamento in pietra, pareti in legno e doppi tetti a pagoda.',
      en: 'An oriental temple with stone base, wooden walls and double flared pagoda roofs.',
    },
    tips: {
      it: 'Costruisci il primo piano, stendi il tetto intermedio sporgente, poi eleva il secondo piano.',
      en: 'Build the ground floor, spread the overhang eaves, then elevate the second floor.',
    },
  },
  'windmill-dutch': {
    name: { it: 'Mulino a Vento', en: 'Windmill' },
    description: {
      it: 'Un mulino a vento rustico con corpo conico e 4 grandi pale a croce in legno e pietra.',
      en: 'A rustic windmill with conical body and 4 large rotating cross blades.',
    },
    tips: {
      it: 'Innalza la torre circolare rastremata, coprila con la cupola e monta le pale a croce.',
      en: 'Raise the tapered circular tower, top it with the roof and mount the cross sails.',
    },
  },
  'glass-pyramid': {
    name: { it: 'Piramide di Cristallo', en: 'Crystal Glass Pyramid' },
    description: {
      it: 'Una meraviglia architettonica a gradoni concentrici in vetro pastello che riflette la luce 3D.',
      en: 'A concentric stepped architectural marvel made of pastel glass reflecting 3D light.',
    },
    tips: {
      it: 'Parti dalla base 7x7 in vetro e sali a gradoni (5x5, 3x3) fino al vertice apicale.',
      en: 'Start with the 7x7 glass base and step inward (5x5, 3x3) up to the pinnacle block.',
    },
  },
  'voxel-castle': {
    name: { it: 'Castello Reale con Torri', en: 'Royal Castle & Keeps' },
    description: {
      it: 'La sfida definitiva: un grande castello con mura merlate, quattro torri angolari e cortile interno.',
      en: 'The ultimate challenge: a grand castle with battlements, four corner keeps and courtyard.',
    },
    tips: {
      it: 'Costruisci prima il perimetro delle 4 torri angolari, collega le mura difensive e rifinisci i merli.',
      en: 'Build the 4 corner towers first, link the perimeter walls and detail the battlements.',
    },
  },
};

export function getLocalizedChallenge(challengeOrId: any, lang: Language): any {
  if (!challengeOrId) return null;
  const id = typeof challengeOrId === 'string' ? challengeOrId : challengeOrId.id;
  const trans = CHALLENGES_I18N[id];
  
  if (typeof challengeOrId === 'object') {
    if (!trans) return challengeOrId;
    return {
      ...challengeOrId,
      name: trans.name[lang] || trans.name.en || challengeOrId.name,
      description: trans.description[lang] || trans.description.en || challengeOrId.description,
      tips: trans.tips[lang] || trans.tips.en || challengeOrId.tips,
    };
  }

  if (!trans) return null;
  return {
    name: trans.name[lang] || trans.name.en,
    description: trans.description[lang] || trans.description.en,
    tips: trans.tips[lang] || trans.tips.en,
  };
}

export function getLocalizedPreset(presetOrId: any, lang: Language): any {
  if (!presetOrId) return null;
  const id = typeof presetOrId === 'string' ? presetOrId : presetOrId.id;
  const nameKey = `preset_${id}_name` as TranslationKey;
  const descKey = `preset_${id}_desc` as TranslationKey;

  const name = t(nameKey, lang);
  const description = t(descKey, lang);

  if (typeof presetOrId === 'object') {
    return {
      ...presetOrId,
      name: name !== nameKey ? name : presetOrId.name,
      description: description !== descKey ? description : presetOrId.description,
    };
  }

  return { name, description };
}

export function getLocalizedTheme(themeOrId: any, lang: Language): any {
  if (!themeOrId) return null;
  const id = typeof themeOrId === 'string' ? themeOrId : themeOrId.id;
  const nameKey = `theme_${id}_name` as TranslationKey;
  const descKey = `theme_${id}_desc` as TranslationKey;

  const name = t(nameKey, lang);
  const description = t(descKey, lang);

  if (typeof themeOrId === 'object') {
    return {
      ...themeOrId,
      name: name !== nameKey ? name : themeOrId.name,
      description: description !== descKey ? description : themeOrId.description,
    };
  }

  return { name, description };
}

export function getLocalizedBlockLabel(blockType: BlockType, lang: Language): string {
  const key = `block_${blockType}_label` as TranslationKey;
  return t(key, lang);
}


