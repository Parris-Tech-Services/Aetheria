import { LoreEntry } from "./types";

export const LoreData: Record<string, LoreEntry> = {
  // WORLD HISTORY
  ancient_kingdoms: {
    id: "ancient_kingdoms",
    title: "The Ancient Kingdoms",
    text: "Long ago, Aetheria was a land of great civilizations. The Verdant Kingdoms ruled the western forests, the Ashborn Empire controlled the eastern plains, and the Deepkin dwelled beneath the mountains. These powers flourished for millennia, connected through trade, culture, and shared prosperity.",
    category: "history",
    discoverable: true,
    discoveredBy: "dialogue:mira_wanderer",
  },

  fall_of_kingdoms: {
    id: "fall_of_kingdoms",
    title: "The Fall of the Kingdoms",
    text: "Centuries ago, a dark sorcerer rose to power. He was once a mortal mage, but through forbidden rituals, he extended his life indefinitely and began amassing power. He called himself the Hollow King—not from vanity, but from the emptiness in his soul. One by one, he conquered the kingdoms, turning their leaders to undeath and their peoples to thralls.",
    category: "history",
    discoverable: true,
    discoveredBy: "dialogue:elara_mossbind",
  },

  the_hollow_king: {
    id: "the_hollow_king",
    title: "The Hollow King",
    text: "The Hollow King is an immortal lich who has ruled death for centuries. He feeds on the life force of others to maintain his form. His power is nearly absolute, but legend says he can be defeated if someone reaches his throne chamber and claims his crown. Few have tried. None have succeeded.",
    category: "legend",
    discoverable: true,
    discoveredBy: "dialogue:aldric_priest",
  },

  spring_spirits: {
    id: "spring_spirits",
    text: "The Spring Spirits were ancient guardians of nature, guardians of growth and renewal. They blessed the land and made Aetheria fertile. When the Hollow King rose to power, he desecrated their temples and corrupted their gifts. Now, only remnants of their blessings remain in rare herbs and magical artifacts.",
    title: "The Spring Spirits",
    category: "legend",
    discoverable: true,
    discoveredBy: "interact:item:crumbled_journal",
  },

  the_ashfields: {
    id: "the_ashfields",
    title: "The Ashfields",
    text: "The Ashfields were once the heart of the Ashborn Empire, a prosperous trade hub. When the Hollow King attacked, the kingdom fell in a single day of terrible magic. Now, the land is a wasteland of burned ruins and ash. Yet, survivors still hide in the remnants, and treasures await those brave enough to search.",
    category: "history",
    discoverable: true,
    discoveredBy: "dialogue:mira_wanderer",
  },

  the_rotted_barrow: {
    id: "the_rotted_barrow",
    title: "The Rotted Barrow",
    text: "An ancient temple dedicated to the Spring Spirits, the Rotted Barrow once was a holy place. The Hollow King defiled it, turning it into a crypt of undead. Now, shambling corpses and skeletal warriors guard treasures from ages past. The altar at its heart is said to hold a seal that can unlock the Boss Chamber.",
    category: "history",
    discoverable: true,
    discoveredBy: "quest:clear_barrow",
  },

  // ARTIFACTS
  blessed_amulet_lore: {
    id: "blessed_amulet_lore",
    title: "The Blessed Amulet",
    text: "This amulet was blessed by priests of the Spring Spirits long ago. It provides protection against necrotic magic and grants the wearer resistance to undeath. It is said to be one of the few artifacts that can harm the Hollow King directly.",
    category: "artifact",
    discoverable: true,
    discoveredBy: "quest:aldric_priest",
  },

  fenwick_hammer_lore: {
    id: "fenwick_hammer_lore",
    title: "Fenwick's Masterwork Hammer",
    text: "Forged by Old Fenwick himself, this hammer has been passed down through generations of blacksmiths. It is enchanted to be especially effective against constructs and undead. Fenwick considers it his most prized possession.",
    category: "artifact",
    discoverable: true,
    discoveredBy: "quest:fenwick_hammer",
  },

  shadow_blade_lore: {
    id: "shadow_blade_lore",
    title: "The Shadow Blade",
    text: "An otherworldly weapon forged in shadow magic. This blade is most effective when wielded in darkness or dim light. It is said to have been wielded by a legendary assassin who fought against the Hollow King.",
    category: "artifact",
    discoverable: true,
    discoveredBy: "item:shadow_blade",
  },

  // FACTIONS
  verdant_circle: {
    id: "verdant_circle",
    title: "The Verdant Circle",
    text: "An ancient order of druids and nature mages dedicated to preserving the work of the Spring Spirits. Though most have been destroyed, remnants still exist. Elara Mossbind is said to have connections to this order.",
    category: "faction",
    discoverable: true,
    discoveredBy: "dialogue:elara_mossbind",
  },

  order_of_ember: {
    id: "order_of_ember",
    title: "The Order of the Ember Crown",
    text: "A militant order dedicated to resistance against the Hollow King. They recruit warriors and adventurers to fight back. The Guard Captain Theron has ties to this order.",
    category: "faction",
    discoverable: true,
    discoveredBy: "dialogue:theron_captain",
  },

  silent_archivists: {
    id: "silent_archivists",
    title: "The Silent Archivists",
    text: "A secretive group of scholars who preserve knowledge of the world. They are said to have libraries hidden throughout Aetheria. The Ashen Oracle may have connections to them.",
    category: "faction",
    discoverable: true,
    discoveredBy: "item:crumbled_journal",
  },
};
