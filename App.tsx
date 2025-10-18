import React, { useState, useRef, useCallback, useEffect } from 'react';
import Teleprompter from './components/Teleprompter';
import Controls from './components/Controls';
import ScriptInput from './components/ScriptInput';
import Settings from './components/Settings';
import RemoteControl from './components/RemoteControl';
import AccessKeyModal from './components/AccessKeyModal';
import type { ScriptLine } from './types';
import { useSyncState } from './hooks/useSyncState';

const defaultScript = `
PRÓLOGO – "YO FUI CALOR"

MONO: Ustedes también... ¿lo recuerdan?
MONO: Yo fui calor... antes de que existiera el frío. Antes de que naciera la palabra "solo".
MONO: Esta memoria... no es solo mía. Es de todos nosotros.
VOZ NIÑO ANCESTRAL: "Mamá... mamá..."
MONO: ¿Escuchan? Ese grito... es el primer grito. El grito que partió el mundo en dos.
MONO: Antes de ese grito... no había "yo". No había "tú". Solo había... calor.
VOZ MATERNA ANCESTRAL: "Aquí estoy, hijo mío. Aquí estoy."
MONO: ¿Sienten eso en su piel? Esa voz... la primera voz. La voz antes del lenguaje.
MONO: Mi cabeza cabía entera en la palma de su mano. Como la cabeza de ustedes cabía en las manos de sus madres. Como cabrá la cabeza de los que vendrán.
MONO: El mundo no tenía bordes entonces. Solo había piel... y otra piel... y más piel.
MONO: Cuando se alejaba, su aliento era la única canción que el universo conocía.
MONO: Todo nuestro ser la seguía sin saber que se podía perder lo que parecía eterno.
MONO: Me aferraba. No con fuerza... sino como raíz que nace del centro de la Tierra. No había yo. Éramos uno. Como ustedes fueron uno. Como la especie fue una.
MONO: Y no sabíamos... que eso podía acabarse.
MONO: A veces la siento todavía. Cuando el viento me roza lento... cuando algo me toca sin avisar... regresa el recuerdo.
MONO: No solo mi recuerdo. El recuerdo de todos. De ese tiempo... en que fuimos solo calor.
MONO: Y nada dolía. Porque no sabíamos que existía el dolor.

ESCENA I – "EL REINO DEL CALOR"

MONO: ¿Recuerdan ustedes su reino? Hubo un tiempo en que no existía el borde.
MONO: Todo era contacto. La piel, el aliento, el calor... todo era uno.
VOZ MATERNA: "Ven acá, mi sol. Ven conmigo."
MONO: Escuchen esto... No había dentro ni fuera. Solo ritmo. Solo pulso.
MONO: ¿Sienten? Latíamos en el mismo compás.
VOZ NIÑO: "¡Nunca me voy a ir de aquí!"
VOZ MATERNA: "Nunca, mi amor. Nunca."
MONO: Sin miedo a perdernos. Sin saber que eso, algún día... iba a cambiar.
MONO: Ustedes saben de qué hablo... Crecíamos envueltos.
VOZ MATERNA: "Aquí estás seguro. Aquí siempre estarás seguro."
MONO: En ramas que no soltaban. En cuerpos que no se alejaban. En un hogar sin distancia.
VOZ NIÑO: "¡Mamá, mira! ¡Mamá, mira lo que hago!"
VOZ MATERNA: "Te veo, mi cielo. Siempre te veo."
MONO: Pero el ciclo se movía... Y yo... no escuché el crujido.
MONO: ¿Ustedes lo escucharon? No supe leer la grieta.
MONO: No vi el borde.
VOZ MATERNA: "Espérame aquí, mi amor..."
MONO: Hasta que un día...
MONO: Algo me soltó.

ESCENA II – "LA NOCHE EN QUE NO VOLVIÓ"

MONO: ¿Ustedes estuvieron ahí esa noche?
VOZ MATERNA: "Voy por agua, mi cielo. Espérame aquí."
MONO: Dijo que volvería.
VOZ MATERNA: "Siempre vuelvo, ¿verdad?"
VOZ NIÑO: "Sí, mamá. Siempre vuelves."
MONO: Siempre volvía. Después del agua. Después de la fruta. Después del canto.
MONO: Pero esta vez...
MONO: No volvió.
MONO: Esperé.
MONO: Con las manos extendidas.
MONO: Con la piel abierta.
VOZ NIÑO: "¡Mamá! ¡Mamá!"
MONO: Grité sin palabras.
VOZ NIÑO: "Mamá... por favor..."
MONO: Llamé sin nombre.
MONO: Me dormí abrazando el aire.
MONO: Y el aire... no supo abrazarme.
MONO: Desperté con frío.
MONO: El pecho sin ritmo.
MONO: La boca sin canto.
MONO: ¿Ustedes sabían llorar cuando eran pequeños?
MONO: No supe llorar.
MONO: Así que grité.
MONO: Grité hasta romperme por dentro.
MONO: Nunca volvió.
MONO: Y yo...
MONO: Me convertí en piedra con forma de cuerpo.

ESCENA III – "EL QUE PERDIÓ EL ABRIGO"

MONO: ¿Cuánto tiempo estuve así?
MONO: Mi abrigo se había ido.
MONO: Miren... no afuera. Desde dentro.
MONO: Cada hebra que perdía era un hilo del mundo que se rompía.
VOZ INTERIOR: "Tienes que moverte. Tienes que comer."
MONO: Dormí entre piedras.
MONO: ¿Saben ustedes qué es el frío de verdad?
VOZ INTERIOR: "Come lo que encuentres. No importa el sabor."
MONO: Comí raíces duras.
MONO: Sobreviví.
MONO: ¿Ven? Sobreviví.
MONO: Pero cada noche...
MONO: Cuando el viento rozaba mi espalda desnuda...
VOZ NIÑO: "Tengo frío, mamá..."
MONO: Una parte de mí moría otra vez.
MONO: Ustedes lo entienden, ¿verdad? No murió el cuerpo.
MONO: Murió el abrazo eterno.
MONO: Se rompió aquí.
MONO: Y aquí.
MONO: Y aquí.
MONO: Cada noche era un pequeño funeral. Del niño que fui. Del calor que conocí. Del mundo sin bordes.
MONO: Me convertí en el que perdió el abrigo. El que camina desnudo. El que sobrevive... pero no se.
MONO: ¿Conocen ustedes a alguien así?
MONO: Alguien que sobrevive... pero ya no sabe cómo sentir calor.

ESCENA IV – "LA FIEBRE DE LA PIEL"

MONO: Esperen... ¿sienten eso?
MONO: Algo empezó a arder... aquí.
MONO: Y aquí... y aquí...
MONO: No era calor. Era fiebre.
MONO: Una fiebre sin fuego.
VOZ INTERIOR: "¿Qué me pasa? ¿Qué me está pasando?"
MONO: Mi cuerpo gritaba.
MONO: Pero nadie lo escuchaba.
MONO: ¿Lo escuchan ustedes?
MONO: Ni siquiera yo.
MONO: Cada punto que tocaban... dolía.
VOZ INTERIOR: "¡No me toques! ¡No me toques!"
MONO: Pero al mismo tiempo...
VOZ INTERIOR: "Por favor... tócame."
MONO: ¿Conocen ustedes esta locura? Cada roce era una despedida no dicha.
MONO: La piel recordaba...
VOZ MATERNA: "Mi pequeño sol..."
MONO: Pero cuando trataba de sentir...
MONO: ¡Ardía!
MONO: Era como si mi piel fuera papel. Y cada contacto... la quemara.
MONO: ¿Saben lo que descubrí?
MONO: El cuerpo no olvida lo que la boca no supo decir.
MONO: "Adiós, mamá."
MONO: Nunca lo dije.
MONO: "Te extraño."
MONO: Nunca lo dije.
MONO: "Tengo miedo."
MONO: Nunca... nunca lo dije.
MONO: Entonces mi piel empezó a decirlo. Con fiebre. Con ardor. Con dolor.
MONO: Mi cuerpo se convirtió en la voz que no tuve.
MONO: Y por primera vez en mucho tiempo... alguien me escuchó.
MONO: Aunque fuera yo mismo.

ESCENA V – "LA HERIDA QUE CAMINA"

MONO: ¿Saben cuándo llegó la comprensión?
MONO: Lo supe entonces...
MONO: La herida caminaba conmigo.
MONO: No como un castigo.
VOZ INTERIOR: "Esto también es tuyo. Esto también te pertenece."
MONO: Sino como una marca. Una promesa.
MONO: ¿Ustedes han cargado alguna herida así? Una que los cambie... pero que también los haga quienes son.
MONO: Lo que arde, también calienta.
MONO: Lo que separa, también da forma.
MONO: Así fue como el fuego nació.
MONO: No para destruir...
MONO: Sino para recordar.
MONO: Algo cambió en mi interior. No solo en el corazón... sino más profundo.
MONO: Como si esa primera herida... hubiera reescrito algo en mí.
VOZ INTERIOR: "Las cosas que antes me rompían... ya no me rompen igual."
MONO: ¿Saben esa sensación? Cuando el dolor te enseña a dosificar el dolor.
MONO: La pérdida me volvió más fuerte... no por insensibilidad. Sino porque ahora sé distinguir qué duele de verdad... y qué no.
MONO: Como si mi cuerpo hubiera aprendido a protegerme desde adentro. A no sufrir por cada pequeña herida... porque ya conoce la herida grande.
MONO: Desde entonces...
MONO: Cada vez que alguien se va...
MONO: Mi piel recuerda la primera pérdida.
MONO: Pero también recuerda... que sobreviví.
MONO: Que la herida se convirtió en sabiduría. Que el fuego se convirtió en luz.
MONO: ¿Conocen esa transformación? Cuando el dolor deja de ser enemigo... y se convierte en maestro.
MONO: Esta llama...
MONO: Es la misma que me quemó. Pero ahora...
MONO: Ahora me da calor.
MONO: La herida camina conmigo. Ya no trato de curarla. La escucho.
MONO: Me dice cuándo alguien verdaderamente se acerca. Me dice cuándo alguien realmente se va. Me dice cuándo es seguro... volver a tocar.
MONO: ¿Tienen ustedes una herida así? Una que los proteja... mientras los enseña a amar.

ESCENA VI – "LA PIEL DEL OTRO"

MONO: Y entonces... la vi.
MONO: ¿Ustedes han sentido eso? Cuando alguien aparece... y algo en tu piel despierta.
MONO: No por deseo. Por memoria.
VOZ INTERIOR: "Quizás esta vez..."
MONO: Creí que esta vez el fuego no me quemaría.
MONO: "Hola..."
MONO: Su voz era suave. Como... como un eco de algo conocido.
ELLA: "¿Estás bien? Te ves... perdido."
MONO: "No perdido. Encontrando."
MONO: ¿Mentí? ¿O era verdad?
MONO: Cuando se acercó...
MONO: Mi piel recordó.
MONO: No a ella... sino a la ausencia. No su calor... sino el frío que quedó.
MONO: ¿Entienden lo que pasó? No era ella.
MONO: Era la madre que se fue.
MONO: Era el abrazo que nunca cerró su ciclo.
VOZ INTERIOR: "Quédate. Por favor, no te vayas como ella."
MONO: Pero le pedí demasiado.
ELLA: "No entiendo... ¿de qué hablas?"
MONO: "Perdón... perdón."
MONO: No fue amor.
MONO: Fue memoria disfrazada de amor.
MONO: ¿Cuántas veces hacemos eso? Amamos a quien no está a través de quien sí está.
MONO: Le pedí que fuera mi madre. Le pedí que sanara mi herida. Le pedí que llenara mi vacío.
MONO: Pero nadie puede cargar la sed de otro.
ELLA: "Necesito espacio..."
MONO: Y se fue.
MONO: Como tenía que irse.
MONO: ¿Saben cuándo aprendí a amar de verdad? Cuando dejé de pedirle al otro que fuera quien no era.
MONO: Cuando entendí que mi herida... era mía para sanar. No suya para cargar.
MONO: El fuego me enseñó: Puedes dar calor sin quemar al otro. Puedes recibir calor sin consumir al otro.
MONO: Fue mi última despedida disfrazada de encuentro. Mi último intento de regresar al útero.
MONO: Y cuando se fue... por primera vez no me rompí.
MONO: Porque ya estaba entero.

ESCENA VII – "LA PIEL QUE ABRAZA EL ADIÓS"

MONO: ¿Saben cuándo llegó la paz?
MONO: Cuando mi piel dejó de buscar.
MONO: Cuando dejó de gritar por lo que se fue. Cuando dejó de aferrarse a lo que llegaba.
MONO: Ahora sé... que puedo sentir sin fundirme.
MONO: Tocar sin poseer.
MONO: Amar sin miedo a perder.
MONO: ¿Ustedes han llegado ahí? A ese lugar donde el amor... ya no se parece al hambre.
MONO: He aprendido a amar... aunque duela.
MONO: Aunque se vaya.
MONO: Aunque no vuelva.
MONO: Porque el amor ya no vive en el otro.
MONO: Vive aquí. Conmigo.
MONO: ¿Saben lo que descubrí? Que nunca perdí a mi madre.
MONO: Solo perdí la ilusión de que ella era mi refugio.
MONO: Pero el refugio...
MONO: Siempre estuvo aquí.
VOZ INTERIOR: "Puedes irte cuando quieras. Puedes quedarte si quieres. Yo estaré bien."
MONO: ¿Escuchan esa diferencia? Ya no "No te vayas, por favor." Sino "Puedes irte si necesitas."
MONO: Ya no "Quédate para salvarme." Sino "Quédate si te hace feliz."
MONO: Mi piel aprendió una canción nueva.
MONO: La canción del abrazo libre. El que no atrapa. El que no ruega. El que simplemente... da.
MONO: Ese fuego...
MONO: Ya no me quema cuando amo. Porque ya no amo para curar mi herida.
MONO: Amo porque sé amar. Amo porque puedo amar. Amo porque elijo amar.
MONO: Y si el otro se va...
MONO: Lo bendigo en su camino.
MONO: Porque mi corazón ya no se va con él. Se queda conmigo.
MONO: ¿Conocen ustedes ese milagro? Cuando dejas de necesitar... y empiezas, simplemente, a amar.
MONO: Ahora mi piel abraza el adiós como abrazó el encuentro.
MONO: Con gratitud. Con respeto. Sin miedo.
MONO: Porque sé que lo que es mío... nunca se va.
MONO: Y lo que se va... nunca fue mío.

EPÍLOGO – "LA MEMORIA DEL CUERPO"

MONO: ¿Saben qué aprendí al final de todo esto?
MONO: Que mi cuerpo nunca mintió.
MONO: Cada ardor... cada fiebre... cada momento en que mi piel gritó...
MONO: Era mi cuerpo diciéndome la verdad que mi mente no quería escuchar.
MONO: "Algo se rompió", me decía. "Algo necesita sanar", me susurraba. "Algo quiere nacer", me recordaba.
MONO: Esta piel...
MONO: Guardó cada caricia que recibí. Cada ausencia que sentí. Cada encuentro que viví.
MONO: Y ahora... cuando toco a alguien...
MONO: Mi piel sabe distinguir.
MONO: Sabe cuál es el toque que cura. Cuál es el toque que lastima. Cuál es el toque que ama.
MONO: ¿Ustedes confían en su piel? ¿En lo que sus cuerpos les dicen?
MONO: Porque ella...
MONO: Nunca me engañó.
MONO: Cuando era niño y ardía por su ausencia... era real.
MONO: Cuando de joven mi piel se cerraba al contacto... era sabiduría.
MONO: Cuando después busqué en otros lo que había perdido... mi cuerpo me lo dijo con fiebre.
MONO: Y ahora que puedo amar libremente... mi piel se abre como flor al sol.
MONO: Cada vez que tu piel arde...
MONO: Escúchala.
MONO: Cada vez que tu cuerpo se contrae... respétalo.
MONO: Cada vez que algo en ti se abre... confía.
MONO: Porque tu cuerpo recuerda lo que tu mente olvida.
MONO: Recuerda que una vez fuiste abrazo.
MONO: Y que sobreviviste...
MONO: Para volver a tocar...
MONO: Con más conciencia.
MONO: Gracias por escuchar mi piel.
`.trim();


// Local parser to replace the Gemini API call
const parseScriptLocally = (scriptText: string): ScriptLine[] => {
  return scriptText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const colonIndex = line.indexOf(':');
      // Heuristic: if a colon exists, the part before it is short and in ALL CAPS,
      // it's likely a character's dialogue line.
      if (colonIndex > 0 && colonIndex < 35) {
        const character = line.substring(0, colonIndex).trim();
        if (character === character.toUpperCase()) {
            return {
                character: character,
                dialogue: line.substring(colonIndex + 1).trim(),
            };
        }
      }
      // Otherwise, treat as a stage direction, scene heading, or narrator line.
      return {
        character: 'NARRATOR',
        dialogue: line,
      };
    });
};


function App() {
  // Get initial role from URL params or localStorage
  const getInitialRole = (): 'host' | 'controller' | 'viewer' => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role') as 'host' | 'controller' | 'viewer' | null;
    if (roleParam) return roleParam;

    const savedRole = localStorage.getItem('teleprompter-role') as 'host' | 'controller' | 'viewer' | null;
    return savedRole || 'host';
  };

  // Synced state across devices
  const {
    state: isPlaying,
    setState: setIsPlaying,
    syncStatus,
    changeRole
  } = useSyncState('teleprompter-isPlaying', false, true, getInitialRole());

  const {
    state: speed,
    setState: setSpeed
  } = useSyncState('teleprompter-speed', 50, true, getInitialRole());

  const {
    state: currentPosition,
    setState: setCurrentPosition
  } = useSyncState('teleprompter-position', 0, true, getInitialRole());

  // Local state (not synced)
  const [isScriptEditorOpen, setIsScriptEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRemoteControlOpen, setIsRemoteControlOpen] = useState(false);
  const [isAccessKeyModalOpen, setIsAccessKeyModalOpen] = useState(false);
  const [accessKey, setAccessKey] = useState<string>(() => {
    return localStorage.getItem('teleprompter-accessKey') || '';
  });
  const [accessKeyError, setAccessKeyError] = useState<string | undefined>();

  // Check if access key exists on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('teleprompter-accessKey');
    if (!savedKey) {
      setIsAccessKeyModalOpen(true);
    }
  }, []);

  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('teleprompter-fontSize');
    return saved ? parseInt(saved) : 48;
  });
  const [backgroundColor, setBackgroundColor] = useState<string>(() => {
    return localStorage.getItem('teleprompter-background') || 'black';
  });
  const [margins, setMargins] = useState<number>(() => {
    const saved = localStorage.getItem('teleprompter-margins');
    return saved ? parseInt(saved) : 0;
  });
  const [cueIndicatorStyle, setCueIndicatorStyle] = useState<string>(() => {
    return localStorage.getItem('teleprompter-cueIndicator') || 'line';
  });
  const [mirrorMode, setMirrorMode] = useState<string>(() => {
    return localStorage.getItem('teleprompter-mirrorMode') || 'normal';
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load script from localStorage or use default
  const [currentScript, setCurrentScript] = useState<string>(() => {
    const saved = localStorage.getItem('teleprompter-script');
    return saved || defaultScript;
  });

  // Parse the script
  const scriptLines = parseScriptLocally(currentScript);

  // Save script to localStorage when it changes
  const handleSaveScript = useCallback((newScript: string) => {
    setCurrentScript(newScript);
    localStorage.setItem('teleprompter-script', newScript);
    // Reset position when script changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setCurrentPosition(0);
    }
    setIsPlaying(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => {
      const newIsPlaying = !prev;
      if (newIsPlaying && !startTime) {
        // Start timer when play begins
        setStartTime(Date.now());
      } else if (!newIsPlaying) {
        // Keep the start time for pause/resume
        // Don't reset startTime here
      }
      return newIsPlaying;
    });
  }, [startTime]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const handleFontSizeChange = useCallback((newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem('teleprompter-fontSize', newSize.toString());
  }, []);

  const handleBackgroundChange = useCallback((newColor: string) => {
    setBackgroundColor(newColor);
    localStorage.setItem('teleprompter-background', newColor);
  }, []);

  const handleMarginsChange = useCallback((newMargins: number) => {
    setMargins(newMargins);
    localStorage.setItem('teleprompter-margins', newMargins.toString());
  }, []);

  const handleCueIndicatorChange = useCallback((newStyle: string) => {
    setCueIndicatorStyle(newStyle);
    localStorage.setItem('teleprompter-cueIndicator', newStyle);
  }, []);

  const handleMirrorModeChange = useCallback((newMode: string) => {
    setMirrorMode(newMode);
    localStorage.setItem('teleprompter-mirrorMode', newMode);
  }, []);

  const handleReset = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // For vertical mirror mode, start from the bottom (which appears as top)
      if (mirrorMode === 'vertical') {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      } else {
        container.scrollTop = 0;
      }
      setCurrentPosition(container.scrollTop);
    }
    setIsPlaying(false);
    setStartTime(null); // Reset timer
  }, [mirrorMode]);

  // Update current position when scrolling manually (minimal interference)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setCurrentPosition(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle spacebar for play/pause
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      
      // Ignore if user is typing in a textarea or input
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        return;
      }

      // Check for spacebar (both key and keyCode for compatibility)
      if (event.key === ' ' || event.code === 'Space' || event.keyCode === 32) {
        // Don't trigger if script editor is open
        if (isScriptEditorOpen) {
          return;
        }
        
        event.preventDefault(); // Prevent page scroll
        event.stopPropagation();
        setIsPlaying(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyPress, { capture: true });
  }, [isScriptEditorOpen]);

  // Handle access key submission
  const handleAccessKeySubmit = (key: string) => {
    // Save key to localStorage and state
    localStorage.setItem('teleprompter-accessKey', key);
    setAccessKey(key);
    setAccessKeyError(undefined);
    setIsAccessKeyModalOpen(false);
    
    // TODO: The key will be used by useSyncState hook automatically
    console.log('🔑 Access key saved:', key);
  };

  // Handle access key modal close
  const handleAccessKeyClose = () => {
    if (accessKey) {
      setIsAccessKeyModalOpen(false);
    } else {
      setAccessKeyError('Necesitas ingresar una clave para continuar');
    }
  };

  return (
    <>
      <Teleprompter 
        lines={scriptLines} 
        isPlaying={isPlaying} 
        speed={speed} 
        scrollContainerRef={scrollContainerRef}
        currentPosition={currentPosition}
        fontSize={fontSize}
        backgroundColor={backgroundColor}
        margins={margins}
        cueIndicatorStyle={cueIndicatorStyle}
        mirrorMode={mirrorMode}
        startTime={startTime}
      />
      <Controls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        onReset={handleReset}
        onEditScript={() => setIsScriptEditorOpen(true)}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRemoteControl={() => setIsRemoteControlOpen(true)}
        syncStatus={syncStatus}
      />
      <ScriptInput
        isOpen={isScriptEditorOpen}
        onClose={() => setIsScriptEditorOpen(false)}
        currentScript={currentScript}
        onSave={handleSaveScript}
      />
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        backgroundColor={backgroundColor}
        onBackgroundChange={handleBackgroundChange}
        margins={margins}
        onMarginsChange={handleMarginsChange}
        cueIndicatorStyle={cueIndicatorStyle}
        onCueIndicatorChange={handleCueIndicatorChange}
        mirrorMode={mirrorMode}
        onMirrorModeChange={handleMirrorModeChange}
      />
      <RemoteControl
        isOpen={isRemoteControlOpen}
        onClose={() => setIsRemoteControlOpen(false)}
        syncStatus={syncStatus}
        onChangeRole={changeRole}
      />
      <AccessKeyModal
        isOpen={isAccessKeyModalOpen}
        onSubmit={handleAccessKeySubmit}
        onClose={handleAccessKeyClose}
        error={accessKeyError}
      />
    </>
  );
}

export default App;
