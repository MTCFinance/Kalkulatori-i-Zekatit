export type SunniZakatSource = {
  id: string;
  title: string;
  reference: string;
  href: string;
  descriptionSq: string;
  descriptionEn: string;
};

export const sunniZakatSources: SunniZakatSource[] = [
  {
    id: "sheep-goats-camels",
    title: "Dele, dhi dhe deve",
    reference: "Sahih al-Bukhari 1454",
    href: "https://sunnah.com/bukhari:1454",
    descriptionSq:
      "Rregullat bazë për dele/dhi, deve dhe zekatin e argjendit.",
    descriptionEn:
      "Basic rules for sheep/goats, camels, and Zakat on silver.",
  },
  {
    id: "cattle-buffalo",
    title: "Lopë dhe buaj",
    reference: "Jami` at-Tirmidhi 622",
    href: "https://sunnah.com/tirmidhi:622",
    descriptionSq: "30 frymë: tabi’/tabi’ah; 40 frymë: musinnah.",
    descriptionEn: "30 animals: tabi’/tabi’ah; 40 animals: musinnah.",
  },
  {
    id: "crops-irrigation",
    title: "Të korra: ujitje natyrale ose me shpenzim",
    reference: "Sahih al-Bukhari 1483",
    href: "https://sunnah.com/bukhari:1483",
    descriptionSq:
      "10% për ujitje natyrale dhe 5% për ujitje me shpenzim.",
    descriptionEn: "10% for natural irrigation and 5% for irrigation with cost.",
  },
  {
    id: "monetary-nisab-lunar-year",
    title: "Nisabi monetar dhe viti hënor",
    reference: "Sunan Abi Dawud 1573",
    href: "https://sunnah.com/abudawud:1573",
    descriptionSq:
      "Referencë për 200 dirhemë, 20 dinarë dhe kalimin e vitit.",
    descriptionEn:
      "Reference for 200 dirhams, 20 dinars, and the passing of a year.",
  },
  {
    id: "crop-nisab",
    title: "Nisabi i të korrave",
    reference: "Sahih al-Bukhari 1447",
    href: "https://sunnah.com/bukhari:1447",
    descriptionSq: "Referencë për pesë wasq si prag i të korrave.",
    descriptionEn: "Reference for five wasq as the crop threshold.",
  },
];
