const WEAPONS = {
  // Version 3.0
  "Geniuses' Greetings": {
    type: "Remembrance",
    base: { HP: 953, ATK: 476, DEF: 331 },
  },

  "Into the Unreachable Veil": {
    type: "Erudition",
    base: { HP: 952, ATK: 635, DEF: 463 },
  },

  "Reminiscence": {
    type: "Remembrance",
    base: { HP: 635, ATK: 423, DEF: 264 },
  },

  "Shadowburn": {
    type: "Remembrance",
    base: { HP: 846, ATK: 317, DEF: 264 },
  },

  "Sweat Now, Cry Less": {
    type: "Remembrance",
    base: { HP: 1058, ATK: 529, DEF: 198 },
  },

  "Time Woven Into Gold": {
    type: "Remembrance",
    base: { HP: 1058, ATK: 635, DEF: 397 },
  },

  "Victory In a Blink": {
    type: "Remembrance",
    base: { HP: 952, ATK: 476, DEF: 396 },
  },

  // Version 2.7
  "A Grounded Ascent": {
    type: "Harmony",
    base: { HP: 1164, ATK: 476, DEF: 529 },
  },
  
  "Long Road Leads Home": {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 661 },
  },
  
  // Version 2.6
  "Dream's Montage": {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Ninja Record: Sound Hunt": {
    type: "Destruction",
    base: { HP: 1058, ATK: 476, DEF: 264 },
  },
  
  "Ninjutsu Inscription: Dazzling Evilbreaker": {
    type: "Erudition",
    base: { HP: 952, ATK: 582, DEF: 529 },
  },
  
  // Version 2.5
  "I Venture Forth to Hunt": {
    type: "The Hunt",
    base: { HP: 952, ATK: 635, DEF: 463 },
  },
  
  "Scent Alone Stays True": {
    type: "Abundance",
    base: { HP: 1058, ATK: 529, DEF: 529 },
  },
  
  "Shadowed by Night": {
    type: "The Hunt",
    base: { HP: 846, ATK: 476, DEF: 396 },
  },
  
  // Version 2.4
  "Dance at Sunset": {
    type: "Destruction",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  "Poised to Bloom": {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Those Many Springs": {
    type: "Nihility",
    base: { HP: 952, ATK: 582, DEF: 529 },
  },
  
  // Version 2.3
  "After the Charmony Fall": {
    type: "Erudition",
    base: { HP: 846, ATK: 476, DEF: 396 },
  },
  
  "Eternal Calculus": {
    type: "Erudition",
    base: { HP: 1058, ATK: 529, DEF: 396 },
  },
  
  "Whereabouts Should Dreams Rest": {
    type: "Destruction",
    base: { HP: 1164, ATK: 476, DEF: 529 },
  },
  
  "Yet Hope Is Priceless": {
    type: "Erudition",
    base: { HP: 952, ATK: 582, DEF: 529 },
  },
  
  // Version 2.2
  "Boundless Choreo": {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Flowing Nightglow": {
    type: "Harmony",
    base: { HP: 952, ATK: 635, DEF: 463 },
  },
  
  "For Tomorrow's Journey": {
    type: "Harmony",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Sailing Towards A Second Life": {
    type: "The Hunt",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  // Version 2.1
  "Along the Passing Shore": {
    type: "Nihility",
    base: { HP: 1058, ATK: 635, DEF: 396 },
  },
  
  "Concert for Two": {
    type: "Preservation",
    base: { HP: 952, ATK: 370, DEF: 463 },
  },
  
  "Inherently Unjust Destiny": {
    type: "Preservation",
    base: { HP: 1058, ATK: 423, DEF: 661 },
  },
  
  // Version 2.0
  "Destiny's Threads Forewoven": {
    type: "Preservation",
    base: { HP: 952, ATK: 370, DEF: 463 },
  },
  
  "Dreamville Adventure": {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Earthly Escapade": {
    type: "Harmony",
    base: { HP: 1164, ATK: 529, DEF: 463 },
  },
  
  "Final Victor": {
    type: "The Hunt",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Flames Afar": {
    type: "Destruction",
    base: { HP: 1058, ATK: 476, DEF: 264 },
  },
  
  "Indelible Promise": {
    type: "Destruction",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "It's Showtime": {
    type: "Nihility",
    base: { HP: 1058, ATK: 476, DEF: 264 },
  },
  
  "Reforged Remembrance": {
    type: "Nihility",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  "The Day The Cosmos Fell": {
    type: "Erudition",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "What Is Real?": {
    type: "Abundance",
    base: { HP: 1058, ATK: 423, DEF: 330 },
  },
  
  // Version 1.6
  "Baptism of Pure Thought": {
    type: "The Hunt",
    base: { HP: 952, ATK: 582, DEF: 529 },
  },
  
  "Past Self in Mirror": {
    type: "Harmony",
    base: { HP: 1058, ATK: 529, DEF: 529 },
  },
  
  // Version 1.5
  "An Instant Before A Gaze": {
    type: "Erudition",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  "Hey, Over Here": {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Night of Fright": {
    type: "Abundance",
    base: { HP: 1164, ATK: 476, DEF: 529 },
  },
  
  // Version 1.4
  "I Shall Be My Own Sword": {
    type: "Destruction",
    base: { HP: 1164, ATK: 582, DEF: 396 },
  },
  
  "Worrisome, Blissful": {
    type: "The Hunt",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  // Version 1.3
  "Brighter Than the Sun": {
    type: "Destruction",
    base: { HP: 1058, ATK: 635, DEF: 396 },
  },
  
  "She Already Shut Her Eyes": {
    type: "Preservation",
    base: { HP: 1270, ATK: 423, DEF: 529 },
  },
  
  "Solitary Healing": {
    type: "Nihility",
    base: { HP: 1058, ATK: 529, DEF: 396 },
  },
  
  // Version 1.2
  "Patience Is All You Need": {
    type: "Nihility",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  "The Unreachable Side": {
    type: "Destruction",
    base: { HP: 1270, ATK: 582, DEF: 330 },
  },
  
  // Version 1.1
  "Before the Tutorial Mission Starts": {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Echoes of the Coffin": {
    type: "Abundance",
    base: { HP: 1164, ATK: 582, DEF: 396 },
  },
  
  "Incessant Rain": {
    type: "Nihility",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  // Version 1.0
  "Adversarial": {
    type: "The Hunt",
    base: { HP: 740, ATK: 370, DEF: 264 },
  },
  
  "Amber": {
    type: "Preservation",
    base: { HP: 846, ATK: 264, DEF: 330 },
  },
  
  "Arrows": {
    type: "The Hunt",
    base: { HP: 846, ATK: 317, DEF: 264 },
  },
  
  "A Secret Vow": {
    type: "Destruction",
    base: { HP: 1058, ATK: 476, DEF: 264 },
  },
  
  "Before Dawn": {
    type: "Erudition",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  "But the Battle Isn't Over": {
    type: "Harmony",
    base: { HP: 1164, ATK: 529, DEF: 463 },
  },
  
  "Carve the Moon, Weave the Clouds": {
    type: "Harmony",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Chorus": {
    type: "Harmony",
    base: { HP: 846, ATK: 317, DEF: 264 },
  },
  
  "Collapsing Sky": {
    type: "Destruction",
    base: { HP: 846, ATK: 370, DEF: 198 },
  },
  
  "Cornucopia": {
    type: "Abundance",
    base: { HP: 952, ATK: 264, DEF: 264 },
  },
  
  "Cruising in the Stellar Sea": {
    type: "The Hunt",
    base: { HP: 952, ATK: 529, DEF: 463 },
  },
  
  "Dance! Dance! Dance!": {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Darting Arrow": {
    type: "The Hunt",
    base: { HP: 740, ATK: 370, DEF: 264 },
  },
  
  "Data Bank": {
    type: "Erudition",
    base: { HP: 740, ATK: 370, DEF: 264 },
  },
  
  "Day One of My New Life": {
    type: "Preservation",
    base: { HP: 952, ATK: 370, DEF: 463 },
  },
  
  "Defense": {
    type: "Preservation",
    base: { HP: 952, ATK: 264, DEF: 264 },
  },
  
  "Eyes of the Prey": {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Fermata": {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Fine Fruit": {
    type: "Abundance",
    base: { HP: 952, ATK: 317, DEF: 198 },
  },
  
  "Geniuses' Repose": {
    type: "Erudition",
    base: { HP: 846, ATK: 476, DEF: 396 },
  },
  
  "Good Night and Sleep Well": {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Hidden Shadow": {
    type: "Nihility",
    base: { HP: 846, ATK: 317, DEF: 264 },
  },
  
  "In the Name of the World": {
    type: "Nihility",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  "In the Night": {
    type: "The Hunt",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  "Landau's Choice": {
    type: "Preservation",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Loop": {
    type: "Nihility",
    base: { HP: 846, ATK: 317, DEF: 264 },
  },
  
  "Make the World Clamor": {
    type: "Erudition",
    base: { HP: 846, ATK: 476, DEF: 396 },
  },
  
  "Mediation": {
    type: "Harmony",
    base: { HP: 846, ATK: 317, DEF: 264 },
  },
  
  "Memories of the Past": {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Meshing Cogs": {
    type: "Harmony",
    base: { HP: 846, ATK: 317, DEF: 264 },
  },
  
  "Moment of Victory": {
    type: "Preservation",
    base: { HP: 1058, ATK: 476, DEF: 595 },
  },
  
  "Multiplication": {
    type: "Abundance",
    base: { HP: 952, ATK: 317, DEF: 198 },
  },
  
  "Mutual Demise": {
    type: "Destruction",
    base: { HP: 846, ATK: 370, DEF: 198 },
  },
  
  "Night on the Milky Way": {
    type: "Erudition",
    base: { HP: 1164, ATK: 582, DEF: 396 },
  },
  
  "Nowhere to Run": {
    type: "Destruction",
    base: { HP: 952, ATK: 529, DEF: 264 },
  },
  
  "Only Silence Remains": {
    type: "The Hunt",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "On the Fall of an Aeon": {
    type: "Destruction",
    base: { HP: 1058, ATK: 529, DEF: 396 },
  },
  
  "Passkey": {
    type: "Erudition",
    base: { HP: 740, ATK: 370, DEF: 264 },
  },
  
  "Past and Future": {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Perfect Timing": {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Pioneering": {
    type: "Preservation",
    base: { HP: 952, ATK: 264, DEF: 264 },
  },
  
  "Planetary Rendezvous": {
    type: "Harmony",
    base: { HP: 1058, ATK: 423, DEF: 330 },
  },
  
  "Post-Op Conversation": {
    type: "Abundance",
    base: { HP: 1058, ATK: 423, DEF: 330 },
  },
  
  "Quid Pro Quo": {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Resolution Shines As Pearls of Sweat": {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Return to Darkness": {
    type: "The Hunt",
    base: { HP: 846, ATK: 529, DEF: 330 },
  },
  
  "River Flows in Spring": {
    type: "The Hunt",
    base: { HP: 846, ATK: 476, DEF: 396 },
  },
  
  "Sagacity": {
    type: "Erudition",
    base: { HP: 740, ATK: 370, DEF: 264 },
  },
  
  "Shared Feeling": {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
  },
  
  "Shattered Home": {
    type: "Destruction",
    base: { HP: 846, ATK: 370, DEF: 198 },
  },
  
  "Sleep Like the Dead": {
    type: "The Hunt",
    base: { HP: 1058, ATK: 582, DEF: 463 },
  },
  
  "Something Irreplaceable": {
    type: "Destruction",
    base: { HP: 1164, ATK: 582, DEF: 396 },
  },
  
  "Subscribe for More!": {
    type: "The Hunt",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Swordplay": {
    type: "The Hunt",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Texture of Memories": {
    type: "Preservation",
    base: { HP: 1058, ATK: 423, DEF: 529 },
  },
  
  "The Birth of the Self": {
    type: "Erudition",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "The Moles Welcome You": {
    type: "Destruction",
    base: { HP: 1058, ATK: 476, DEF: 264 },
  },
  
  "The Seriousness of Breakfast": {
    type: "Erudition",
    base: { HP: 846, ATK: 476, DEF: 396 },
  },
  
  "This Is Me!": {
    type: "Preservation",
    base: { HP: 846, ATK: 370, DEF: 529 },
  },
  
  "Time Waits for No One": {
    type: "Abundance",
    base: { HP: 1270, ATK: 476, DEF: 463 },
  },
  
  "Today Is Another Peaceful Day": {
    type: "Erudition",
    base: { HP: 846, ATK: 529, DEF: 330 },
  },
  
  "Trend of the Universal Market": {
    type: "Preservation",
    base: { HP: 1058, ATK: 370, DEF: 396 },
  },
  
  "Under the Blue Sky": {
    type: "Destruction",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
  
  "Void": {
    type: "Nihility",
    base: { HP: 846, ATK: 317, DEF: 264 },
  },
  
  "Warmth Shortens Cold Nights": {
    type: "Abundance",
    base: { HP: 1058, ATK: 370, DEF: 396 },
  },
  
  "We Are Wildfire": {
    type: "Preservation",
    base: { HP: 740, ATK: 476, DEF: 463 },
  },
  
  "We Will Meet Again": {
    type: "Nihility",
    base: { HP: 846, ATK: 529, DEF: 330 },
  },
  
  "Woof! Walk Time!": {
    type: "Destruction",
    base: { HP: 952, ATK: 476, DEF: 330 },
  },
};

export default WEAPONS;
