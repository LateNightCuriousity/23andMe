// app.js (data model)
// Replace [Her Name] with her name and optionally add image paths (e.g., "photos/joy.jpg").
// Images are optional; leave img: "" to show a simple emoji/placeholder.

const experience = {
  meta: {
    title: "23 & Me",
    subtitle: "[Her Name] Edition",
    totalTraits: 6
  },

  screens: {
    welcome: {
      title: "23 & Me",
      subtitle: "[Her Name] Edition",
      text: "Sequencing kindness, laughter, and an alarming love for sweet treats.",
      cta: "Begin sequencing"
    },

    sequencing: {
      title: "Sequencing…",
      steps: [
        "Collecting samples… (consensually)",
        "Analyzing joy markers…",
        "Cross-referencing laugh frequency…",
        "Running birthday calibration… 🎂",
        "Finalizing report…"
      ],
      completeCta: "View results"
    },

    results: {
      title: "Your Results",
      subtitle: "Tap each trait to view the findings."
    },

    finalResult: {
      title: "Final Result",
      headline: "100%: My favorite person.",
      text:
        "Happy 23rd birthday. I love doing life with you — the big moments, the small ones, and everything in between.",
      cta: "View origins"
    },

    map: {
      title: "Origins",
      subtitle: "Two places. One incredible person.",
      instruction: "There’s one more result…",
      legend: [
        { label: "Korea", value: "50%", key: "korea", color: "blue" },
        { label: "America", value: "50%", key: "usa", color: "blue" }
      ],

      regions: {
        korea: {
          label: "Korea — 50%",
          title: "Korea — 50%",
          body:
            "A year to watching more K-dramas together, learning new words, and eating dotori-muk (acorn jelly) even if I pretend not to love it as much as you do.",
          footer: "Heritage. Comfort. Home on a screen."
        },

        usa: {
          label: "America — 50%",
          title: "America — 50%",
          body:
            "A year to more candlelight concerts, sweet treats, and making memories with you right here in Acworth, GA.",
          footer: "The life you’re building."
        },

        usMoon: {
          locked: true, // set to false when unlocked
          label: "Us — 100%",
          title: "Us — 100%",
          body:
            "Not bound by borders. Not limited by percentages. Just you and me — choosing each other, again and again.",
          footer: "Happy 23rd birthday."
        }
      },

      unlock: {
        // copy for the “reveal” interaction (Option B)
        prompt: "Tap to reveal the missing result",
        onUnlockLegendItem: { label: "Us", value: "100%", key: "usMoon", color: "blue" },
        showConfetti: true
      }
    }
  },

  traits: [
    {
      id: "joy-gene",
      percent: "19%",
      title: "Joy Gene",
      finding: "You have a rare ability to make ordinary moments feel lighter.",
      evidence: "Somehow, even the quiet days with you feel like the good ones.",
      labNote: "Subject laughs first, worries later.",
      img: "" // e.g., "photos/joy.jpg"
    },
    {
      id: "care-factor",
      percent: "18%",
      title: "Care Factor",
      finding: "You notice the small things — and you show up for them.",
      evidence: "Checking in, remembering details, making space for people without being asked.",
      labNote: "Care expressed consistently, never loudly.",
      img: ""
    },
    {
      id: "glow",
      percent: "16%",
      title: "Glow",
      finding: "Confidence and kindness reinforce each other.",
      evidence: "You light up when you’re being fully yourself — and it’s contagious.",
      labNote: "Glow increases in comfortable clothes and good company.",
      img: ""
    },
    {
      id: "sweet-tooth",
      percent: "15%",
      title: "Sweet Tooth",
      finding: "Strong affinity for desserts and cozy treats.",
      evidence: "Shared sweets, late-night snacks, and the belief that dessert is never optional.",
      labNote: "Research ongoing. No upper limit observed.",
      img: ""
    },
    {
      id: "future-traveler",
      percent: "14%",
      title: "Future Traveler",
      finding: "Curiosity-driven, adventure-inclined.",
      evidence: 'You collect places, stories, and “we should go there someday” moments.',
      labNote: "Suitcase permanently half-packed (emotionally).",
      img: ""
    },
    {
      id: "drama-resistance",
      percent: "11%",
      title: "Drama Resistance (inconclusive)",
      finding: "Calm under pressure… until provoked by minor inconveniences.",
      evidence: "Mostly unbothered. Occasionally very bothered.",
      labNote: "Results vary. Still adorable.",
      img: ""
    }
  ]
};
