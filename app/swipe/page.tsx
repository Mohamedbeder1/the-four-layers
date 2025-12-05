"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

type GaugeKey = "independance" | "budget" | "durabilite" | "inclusion";

type GaugeState = Record<GaugeKey, number>;

type Choice = {
  label: string;
  deltas: GaugeState;
  tone: "positive" | "negative";
  isCorrect: boolean;
};

type Card = {
  id: string;
  title: string;
  situation: string;
  left: Choice;
  right: Choice;
};

type FlyingBadge = {
  id: string;
  text: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
};

const initialGauges: GaugeState = {
  independance: 50,
  budget: 50,
  durabilite: 50,
  inclusion: 50,
};

const gaugeCopy: Record<
  GaugeKey,
  { label: string; color: string; icon: string; helper: string }
> = {
  independance: {
    label: "Indépendance",
    color: "var(--accent)",
    icon: "🛰️",
    helper: "Moins de dépendance aux Big Tech",
  },
  budget: {
    label: "Budget",
    color: "var(--info)",
    icon: "💶",
    helper: "Maîtrise des coûts",
  },
  durabilite: {
    label: "Durabilité",
    color: "var(--durable)",
    icon: "🌱",
    helper: "Impact écologique",
  },
  inclusion: {
    label: "Inclusion",
    color: "var(--inclusion)",
    icon: "🤝",
    helper: "Accessibilité et équité",
  },
};

const cards: Card[] = [
  {
    id: "office",
    title: "Licences bureautiques",
    situation: 'Microsoft augmente les licences Office de 20 % pour le lycée.',
    left: {
      label: "On paye, tout le monde a l'habitude.",
      tone: "negative",
      isCorrect: false,
      deltas: { independance: -20, budget: -15, durabilite: 0, inclusion: 5 },
    },
    right: {
      label: "On installe LibreOffice via La Forge avec formation express.",
      tone: "positive",
      isCorrect: true,
      deltas: { independance: 25, budget: 10, durabilite: 10, inclusion: 5 },
    },
  },
  {
    id: "cloud",
    title: "Stockage et partage de fichiers",
    situation: "Les équipes partagent tout via Google Drive.",
    left: {
      label: "On déploie Nextcloud sur l'infra publique locale.",
      tone: "positive",
      isCorrect: true,
      deltas: { independance: 20, budget: 10, durabilite: 15, inclusion: 10 },
    },
    right: {
      label: "On reste sur Drive, c'est rapide.",
      tone: "negative",
      isCorrect: false,
      deltas: { independance: -15, budget: -5, durabilite: -5, inclusion: 5 },
    },
  },
  {
    id: "devices",
    title: "Parc d'appareils",
    situation: "La mairie propose d'acheter des tablettes fermées.",
    left: {
      label: "On reconditionne des PC et on installe une distribution libre.",
      tone: "positive",
      isCorrect: true,
      deltas: { independance: 15, budget: 15, durabilite: 20, inclusion: 5 },
    },
    right: {
      label: "On commande des tablettes propriétaires.",
      tone: "negative",
      isCorrect: false,
      deltas: { independance: -15, budget: -20, durabilite: -10, inclusion: 5 },
    },
  },
  {
    id: "chat",
    title: "Messagerie des classes",
    situation: "Les enseignants veulent un groupe pour échanger vite.",
    left: {
      label: "On crée un groupe WhatsApp.",
      tone: "negative",
      isCorrect: false,
      deltas: { independance: -10, budget: 0, durabilite: -5, inclusion: -10 },
    },
    right: {
      label: "On ouvre un salon Matrix/Element pour l'établissement.",
      tone: "positive",
      isCorrect: true,
      deltas: { independance: 15, budget: 5, durabilite: 5, inclusion: 20 },
    },
  },
  {
    id: "security",
    title: "Sécurité numérique",
    situation: "L'équipe IT veut renforcer la protection des postes.",
    left: {
      label: "On déploie une pile libre (Wazuh) + hygiène numérique pour tous.",
      tone: "positive",
      isCorrect: true,
      deltas: { independance: 10, budget: 5, durabilite: 5, inclusion: 5 },
    },
    right: {
      label: "Suite antivirus cloud payante et propriétaire.",
      tone: "negative",
      isCorrect: false,
      deltas: { independance: -5, budget: -10, durabilite: -5, inclusion: 0 },
    },
  },
  {
    id: "pedago",
    title: "Suite pédagogique",
    situation: "Le collège cherche une plateforme pour les devoirs.",
    left: {
      label: "Chromebooks + Google Classroom, prêt à l'emploi.",
      tone: "negative",
      isCorrect: false,
      deltas: { independance: -25, budget: -10, durabilite: -10, inclusion: 0 },
    },
    right: {
      label: "Moodle hébergé localement avec modules d'accessibilité.",
      tone: "positive",
      isCorrect: true,
      deltas: { independance: 20, budget: 5, durabilite: 5, inclusion: 15 },
    },
  },
];

const clampValue = (value: number) => Math.min(100, Math.max(0, value));

export default function SwipePage() {
  const [step, setStep] = useState<"welcome" | "play" | "result">("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gauges, setGauges] = useState<GaugeState>(initialGauges);
  const [displayedGauges, setDisplayedGauges] =
    useState<GaugeState>(initialGauges);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(
    null,
  );
  const [flyingBadges, setFlyingBadges] = useState<FlyingBadge[]>([]);
  const [pulseKeys, setPulseKeys] = useState<GaugeKey[]>([]);
  const [selectedCardCount, setSelectedCardCount] = useState<number>(6);
  const [selectedCards, setSelectedCards] = useState<Card[]>(cards);
  const pointerStartX = useRef<number | null>(null);
  const gaugeRefs = useRef<Record<GaugeKey, HTMLDivElement | null>>({
    independance: null,
    budget: null,
    durabilite: null,
    inclusion: null,
  });
  const choiceRefs = useRef<{
    left: HTMLButtonElement | null;
    right: HTMLButtonElement | null;
  }>({
    left: null,
    right: null,
  });
  const displayedRef = useRef(displayedGauges);
  const animationFrameRef = useRef<number | null>(null);

  const currentCard = selectedCards[currentIndex];
  const animationDurationMs = 900;

  useEffect(() => {
    displayedRef.current = displayedGauges;
  }, [displayedGauges]);

  const mood = useMemo(() => {
    const score = displayedGauges.independance;
    if (score < 40) {
      return {
        state: "sad",
        icon: "😟",
        label: "Stressé",
        tagline: "On est prisonniers des Big Tech...",
      };
    }
    if (score > 60) {
      return {
        state: "happy",
        icon: "😃",
        label: "Fier",
        tagline: "On devient un vrai village numérique résistant !",
      };
    }
    return {
      state: "neutral",
      icon: "😌",
      label: "Vigilant",
      tagline: "On fait ce qu'on peut, mais tout peut basculer.",
    };
  }, [displayedGauges.independance]);

  const profile = useMemo(() => {
    if (gauges.independance < 35) {
      return {
        label: "Établissement ultra-dépendant",
        tone: "negative",
        description:
          "La dépendance aux fournisseurs propriétaires est forte. Il est temps de rééquilibrer les choix numériques.",
      };
    }
    if (gauges.independance <= 70) {
      return {
        label: "Établissement en transition",
        tone: "neutral",
        description:
          "De belles pistes libres apparaissent, mais certains choix gardent une dépendance et un impact écologique perfectibles.",
      };
    }
    if (gauges.independance > 70 && gauges.durabilite > 60) {
      return {
        label: "Village Numérique Résistant 💪",
        tone: "positive",
        description:
          "Des choix alignés avec le NIRD : souveraineté, sobriété et inclusion progressent ensemble.",
      };
    }
    return {
      label: "Établissement aligné",
      tone: "positive",
      description:
        "Les choix sont majoritairement libres et responsables. Continuez à partager et à former la communauté.",
    };
  }, [gauges]);

  const leftGaugeOrder: GaugeKey[] = ["independance", "budget"];
  const rightGaugeOrder: GaugeKey[] = ["durabilite", "inclusion"];

  useEffect(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const from = displayedRef.current;
    const to = gauges;
    const duration = animationDurationMs;
    const start = performance.now();

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeOut(progress);
      const next: GaugeState = {
        independance: Math.round(
          from.independance +
            (to.independance - from.independance) * eased,
        ),
        budget: Math.round(from.budget + (to.budget - from.budget) * eased),
        durabilite: Math.round(
          from.durabilite + (to.durabilite - from.durabilite) * eased,
        ),
        inclusion: Math.round(
          from.inclusion + (to.inclusion - from.inclusion) * eased,
        ),
      };
      setDisplayedGauges(next);
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationDurationMs, gauges]);

  const createFlyingBadges = useCallback(
    (option: Choice, side: "left" | "right") => {
      const created: FlyingBadge[] = [];
      const base = choiceRefs.current[side];
      if (!base) return;
      const baseRect = base.getBoundingClientRect();
      (Object.keys(gaugeCopy) as GaugeKey[]).forEach((key, index, arr) => {
        const toEl = gaugeRefs.current[key];
        if (!toEl) return;
        const toRect = toEl.getBoundingClientRect();
        const spread = (index - (arr.length - 1) / 2) * 16;
        const heightOffset = 18 + index * 8;
        created.push({
          id: `${side}-${key}-${Date.now()}`,
          text: `${option.deltas[key] > 0 ? "+" : ""}${option.deltas[key]} pts`,
          from: {
            x: baseRect.left + baseRect.width / 2 + spread,
            y: baseRect.top + baseRect.height * 0.45 + heightOffset,
          },
          to: {
            x: toRect.left + toRect.width / 2,
            y: toRect.top + toRect.height / 2,
          },
          color:
            option.deltas[key] >= 0 ? "var(--accent-strong)" : "var(--warning)",
        });
      });

      if (created.length) {
        setFlyingBadges((previous) => [...previous, ...created]);
        setTimeout(() => {
          setFlyingBadges((previous) =>
            previous.filter(
              (badge) =>
                !created.some((createdBadge) => createdBadge.id === badge.id),
            ),
          );
        }, animationDurationMs + 140);
      }
    },
    [animationDurationMs],
  );

  const handleChoice = useCallback(
    (option: Choice, direction: "left" | "right") => {
      if (step !== "play" || isTransitioning) return;
      setIsTransitioning(true);
      setSwipeDirection(direction);
      setSelectedSide(direction);
      createFlyingBadges(option, direction);
      setPulseKeys(
        (Object.keys(gaugeCopy) as GaugeKey[]).filter(
          (key) => option.deltas[key] !== 0,
        ),
      );
      setTimeout(() => setPulseKeys([]), animationDurationMs);
      setGauges((previous) => {
        const next: GaugeState = { ...previous };
        (Object.keys(previous) as GaugeKey[]).forEach((key) => {
          next[key] = clampValue(previous[key] + option.deltas[key]);
        });
        return next;
      });

      const isLastCard = currentIndex === selectedCards.length - 1;

      setTimeout(() => {
        if (isLastCard) {
          setStep("result");
        } else {
          setCurrentIndex((value) => value + 1);
        }
        setSwipeDirection(null);
        setIsTransitioning(false);
        setSelectedSide(null);
      }, animationDurationMs);
    },
    [animationDurationMs, createFlyingBadges, currentIndex, isTransitioning, step, selectedCards],
  );

  useEffect(() => {
    if (step !== "play") return;

    const handleKey = (event: KeyboardEvent) => {
      if (isTransitioning) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleChoice(currentCard.left, "left");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleChoice(currentCard.right, "right");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentCard.left, currentCard.right, handleChoice, isTransitioning, step]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startGame = () => {
    // Shuffle cards and select the chosen number
    const shuffled = shuffleArray(cards);
    const selected = shuffled.slice(0, selectedCardCount);
    setSelectedCards(selected);
    setGauges(initialGauges);
    setDisplayedGauges(initialGauges);
    setCurrentIndex(0);
    setSwipeDirection(null);
    setIsTransitioning(false);
    setFlyingBadges([]);
    setPulseKeys([]);
    setSelectedSide(null);
    setStep("play");
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const deltaX = event.clientX - pointerStartX.current;
    if (Math.abs(deltaX) > 60) {
      const direction = deltaX > 0 ? "right" : "left";
      handleChoice(
        direction === "left" ? currentCard.left : currentCard.right,
        direction,
      );
    }
    pointerStartX.current = null;
  };

  const handlePointerLeave = () => {
    pointerStartX.current = null;
  };

  const resetToWelcome = () => {
    setGauges(initialGauges);
    setDisplayedGauges(initialGauges);
    setCurrentIndex(0);
    setSwipeDirection(null);
    setIsTransitioning(false);
    setFlyingBadges([]);
    setPulseKeys([]);
    setSelectedSide(null);
    setStep("welcome");
  };

  const progressText =
    step === "result"
      ? `Cartes jouées : ${selectedCards.length}/${selectedCards.length}`
      : `Carte ${currentIndex + 1}/${selectedCards.length}`;
  const showResult = selectedSide !== null;

  return (
    <div className={styles.page}>
      <div className={styles.noise} />
      <div className={styles.flyingLayer} aria-hidden="true">
        {flyingBadges.map((badge) => {
          const dx = `${badge.to.x - badge.from.x}px`;
          const dy = `${badge.to.y - badge.from.y}px`;
          return (
            <span
              key={badge.id}
              className={styles.flyingBadge}
              style={
                {
                  left: badge.from.x,
                  top: badge.from.y,
                  backgroundColor: badge.color,
                  color: "#fff",
                  "--dx": dx,
                  "--dy": dy,
                } as CSSProperties
              }
            >
              {badge.text}
            </span>
          );
        })}
      </div>
      <main className={styles.wrapper}>
        {/* <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.badge}>NIRD</div>
            <div>
              <p className={styles.kicker}>Swipe de la Décision</p>
              <h1>Le &quot;Tinder du Libre&quot;</h1>
            </div>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.status}>
              {step === "welcome"
                ? "Prêt à jouer"
                : step === "play"
                  ? "En cours"
                  : "Bilan"}
            </span>
            <span className={styles.progress}>{progressText}</span>
          </div>
        </header> */}

        {step === "welcome" && (
          <section className={styles.welcome}>
            <div className={styles.welcomeText}>
              <p className={styles.overline}>Jeu de Décisions</p>
              <h2>Testez vos choix numériques</h2>
              <p className={styles.lead}>
                Chaque carte présente un dilemme réel vécu par un établissement scolaire.
                Choisissez entre la facilité Big Tech (gauche) ou la voie libre et responsable (droite).
              </p>
              <ul className={styles.bullets}>
                <li>
                  <span>4 jauges dynamiques</span>
                  <small>Indépendance, budget, durabilité, inclusion</small>
                </li>
                <li>
                  <span>Contrôles intuitifs</span>
                  <small>Cliquez, swipez ou utilisez les flèches du clavier</small>
                </li>
                <li>
                  <span>Profil personnalisé</span>
                  <small>Découvrez votre niveau de résistance au Big Tech</small>
                </li>
              </ul>
              <div className={styles.actions}>
                <div className={styles.actionsRow}>
                  <select
                    className={styles.select}
                    value={selectedCardCount}
                    onChange={(e) => setSelectedCardCount(Number(e.target.value))}
                    disabled={step !== "welcome"}
                  >
                    {[2, 4, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 2 ? 'carte' : 'cartes'}
                      </option>
                    ))}
                  </select>
                  <button className={styles.primary} onClick={startGame}>
                    Commencer
                  </button>
                </div>
              </div>
              
            </div>
            <div className={styles.preview}>
              <div className={styles.previewCard}>
                <p className={styles.pill}>Exemple de Carte</p>
                <h3>Licences bureautiques</h3>
                <p className={styles.previewSituation}>
                  Microsoft augmente ses tarifs de 20%. Quelle décision prenez-vous ?
                </p>
                <div className={styles.previewChips}>
                  {Object.values(gaugeCopy).map((gauge) => (
                    <span key={gauge.label} className={styles.previewChip}>
                      {gauge.icon} {gauge.label}
                    </span>
                  ))}
                </div>
                <p className={styles.previewHint}>
                  Chaque choix impacte vos jauges différemment
                </p>
              </div>
            </div>
          </section>
        )}

        {step === "play" && (
          <section className={styles.play}>
            <div className={styles.gaugeLayout}>
              <div className={styles.gaugeColumn}>
                {leftGaugeOrder.map((key) => (
                  <div
                    key={key}
                    className={`${styles.gaugeCard} ${
                      pulseKeys.includes(key) ? styles.pulse : ""
                    }`}
                    ref={(element) => {
                      gaugeRefs.current[key] = element;
                    }}
                  >
                    <div className={styles.gaugeHeader}>
                      <span className={styles.gaugeIcon}>
                        {gaugeCopy[key].icon}
                      </span>
                      <div>
                        <p className={styles.gaugeLabel}>{gaugeCopy[key].label}</p>
                        <p className={styles.gaugeHelper}>
                          {gaugeCopy[key].helper}
                        </p>
                      </div>
                      <span className={styles.gaugeValue}>
                        {displayedGauges[key]}/100
                      </span>
                    </div>
                    <div className={styles.track}>
                      <div
                        className={styles.fill}
                        style={{
                          width: `${displayedGauges[key]}%`,
                          background: gaugeCopy[key].color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`${styles.avatarCircle} ${styles[`mood${mood.state}`]}`}
                aria-live="polite"
              >
                <div className={styles.avatarEmoji}>{mood.icon}</div>
                <p className={styles.avatarLabel}>{mood.label}</p>
                <p className={styles.avatarTagline}>{mood.tagline}</p>
              </div>

              <div className={styles.gaugeColumn}>
                {rightGaugeOrder.map((key) => (
                  <div
                    key={key}
                    className={`${styles.gaugeCard} ${
                      pulseKeys.includes(key) ? styles.pulse : ""
                    }`}
                    ref={(element) => {
                      gaugeRefs.current[key] = element;
                    }}
                  >
                    <div className={styles.gaugeHeader}>
                      <span className={styles.gaugeIcon}>
                        {gaugeCopy[key].icon}
                      </span>
                      <div>
                        <p className={styles.gaugeLabel}>{gaugeCopy[key].label}</p>
                        <p className={styles.gaugeHelper}>
                          {gaugeCopy[key].helper}
                        </p>
                      </div>
                      <span className={styles.gaugeValue}>
                        {displayedGauges[key]}/100
                      </span>
                    </div>
                    <div className={styles.track}>
                      <div
                        className={styles.fill}
                        style={{
                          width: `${displayedGauges[key]}%`,
                          background: gaugeCopy[key].color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`${styles.card} ${
                swipeDirection ? styles[`swipe${swipeDirection}`] : ""
              }`}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
            >
              <div className={styles.cardHeader}>
                <p className={styles.pill}>Situation #{currentIndex + 1}</p>
                <h2>{currentCard.title}</h2>
                <p className={styles.situation}>{currentCard.situation}</p>
              </div>
              <div className={styles.choices}>
                <button
                  className={`${styles.choice} ${
                    selectedSide === "left" ? styles.choiceSelected : ""
                  } ${
                    showResult && currentCard.left.isCorrect
                      ? styles.choiceCorrect
                      : ""
                  }`}
                  onClick={() => handleChoice(currentCard.left, "left")}
                  disabled={isTransitioning}
                  ref={(element) => {
                    choiceRefs.current.left = element;
                  }}
                >
                  <div className={styles.choiceTop}>
                    <span className={styles.choiceBadge}>Option A</span>
                    <span className={styles.deltaLabel}>Swipe gauche</span>
                    {showResult && currentCard.left.isCorrect && (
                      <span className={styles.correctMark} aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className={styles.choiceText}>{currentCard.left.label}</p>
                </button>
                <button
                  className={`${styles.choice} ${
                    selectedSide === "right" ? styles.choiceSelected : ""
                  } ${
                    showResult && currentCard.right.isCorrect
                      ? styles.choiceCorrect
                      : ""
                  }`}
                  onClick={() => handleChoice(currentCard.right, "right")}
                  disabled={isTransitioning}
                  ref={(element) => {
                    choiceRefs.current.right = element;
                  }}
                >
                  <div className={styles.choiceTop}>
                    <span className={styles.choiceBadge}>Option B</span>
                    <span className={styles.deltaLabel}>Swipe droite</span>
                    {showResult && currentCard.right.isCorrect && (
                      <span className={styles.correctMark} aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className={styles.choiceText}>{currentCard.right.label}</p>
                </button>
              </div>
            </div>
          </section>
        )}

        {step === "result" && (
          <section className={styles.result}>
            <div className={styles.resultCard}>
              <p className={styles.overline}>Résultat</p>
              <h2>{profile.label}</h2>
              
              {/* Medal Component */}
              {(() => {
                const averageScore = Math.round(
                  ((Object.keys(gauges) as GaugeKey[]).reduce((sum, key) => sum + gauges[key], 0)) /
                  (Object.keys(gauges) as GaugeKey[]).length
                );
                
                let medalColor = "#CD7F32"; // Bronze (default)
                let ribbonColor = "#B8860B";
                let medalLabel = "Bronze";
                let medalEmoji = "🥉";
                let glowColor = "rgba(205, 127, 50, 0.5)";
                
                if (averageScore >= 80) {
                  medalColor = "#FFD700"; // Gold
                  ribbonColor = "#FFA500";
                  medalLabel = "Or";
                  medalEmoji = "🥇";
                  glowColor = "rgba(255, 215, 0, 0.5)";
                } else if (averageScore >= 65) {
                  medalColor = "#C0C0C0"; // Silver
                  ribbonColor = "#A0A0A0";
                  medalLabel = "Argent";
                  medalEmoji = "🥈";
                  glowColor = "rgba(192, 192, 192, 0.5)";
                }
                
                return (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    margin: '1rem 0',
                    animation: 'fadeInScale 0.6s ease-out'
                  }}>
                    <style>{`
                      @keyframes fadeInScale {
                        from {
                          opacity: 0;
                          transform: scale(0.8);
                        }
                        to {
                          opacity: 1;
                          transform: scale(1);
                        }
                      }
                      @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                      }
                    `}</style>
                    
                    <div style={{ 
                      position: 'relative',
                      filter: `drop-shadow(0 0 20px ${glowColor})`
                    }}>
                      <svg 
                        width="110" 
                        height="140" 
                        viewBox="0 0 140 180" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ animation: 'float 3s ease-in-out infinite' }}
                      >
                        {/* Ribbon */}
                        <path
                          d="M50 15 L50 90 L70 72 L90 90 L90 15 Z"
                          fill={ribbonColor}
                          opacity="0.9"
                        />
                        <path
                          d="M50 15 L50 90 L70 72 L90 90 L90 15 Z"
                          stroke={medalColor}
                          strokeWidth="2"
                          fill="none"
                          opacity="0.7"
                        />
                        
                        {/* Glow Circle */}
                        <circle
                          cx="70"
                          cy="105"
                          r="42"
                          fill={glowColor}
                          opacity="0.4"
                        />
                        
                        {/* Medal Circle - Outer */}
                        <circle
                          cx="70"
                          cy="105"
                          r="38"
                          fill={medalColor}
                          stroke="#FFF"
                          strokeWidth="4"
                        />
                        
                        {/* Medal Circle - Middle */}
                        <circle
                          cx="70"
                          cy="105"
                          r="32"
                          fill="none"
                          stroke="#FFF"
                          strokeWidth="2"
                          opacity="0.6"
                        />
                        
                        {/* Medal Circle - Inner */}
                        <circle
                          cx="70"
                          cy="105"
                          r="26"
                          fill="none"
                          stroke="#FFF"
                          strokeWidth="1"
                          opacity="0.4"
                        />
                        
                        {/* Star Pattern */}
                        <path
                          d="M70 82 L73.5 93 L85 93 L75.5 100 L79 111 L70 104 L61 111 L64.5 100 L55 93 L66.5 93 Z"
                          fill="#FFF"
                          opacity="0.95"
                        />
                      </svg>
                    </div>
                    
                    <div style={{ 
                      marginTop: '1rem', 
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: medalColor,
                      textShadow: `0 2px 8px ${glowColor}, 0 0 20px ${glowColor}`,
                      letterSpacing: '0.5px'
                    }}>
                      {medalEmoji} Médaille {medalLabel}
                    </div>
                    
                    <div style={{ 
                      marginTop: '0.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'var(--text-main)',
                      textAlign: 'center'
                    }}>
                      Score moyen : <span style={{ color: medalColor, fontSize: '1.15rem' }}>{averageScore}</span>/100
                    </div>
                    
                    {averageScore >= 80 && (
                      <div style={{
                        marginTop: '0.25rem',
                        fontSize: '0.8rem',
                        color: 'var(--accent)',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        ✨ Performance exceptionnelle ! ✨
                      </div>
                    )}
                  </div>
                );
              })()}
              
              <p className={styles.lead}>{profile.description}</p>

              <div className={styles.resultGrid}>
                {(Object.keys(gaugeCopy) as GaugeKey[]).map((key) => (
                  <div key={key} className={styles.resultGauge}>
                    <div className={styles.resultGaugeTop}>
                      <span>{gaugeCopy[key].icon}</span>
                      <span>{gaugeCopy[key].label}</span>
                      <span className={styles.resultValue}>{gauges[key]}</span>
                    </div>
                    <div className={styles.track}>
                      <div
                        className={styles.fill}
                        style={{
                          width: `${gauges[key]}%`,
                          background: gaugeCopy[key].color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.actions}>
                <button className={styles.primary} onClick={startGame}>
                  Rejouer
                </button>
                <button className={styles.secondary} onClick={resetToWelcome}>
                  Retour
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

