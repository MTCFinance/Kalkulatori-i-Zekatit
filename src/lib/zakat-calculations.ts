export type CalculatorLanguageCode = "sq" | "en";
export type NisabBasisValue = "Ari" | "Argjendi" | "Vlerë manuale";

export const toNumber = (value: string) => {
  const number = Number(value.replace(",", "."));

  return Number.isFinite(number) && number > 0 ? number : 0;
};

export const money = (value: number, currency: string) =>
  `${value.toFixed(2)} ${currency}`;

export const numberText = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const rateText = (value: number) => Number(value.toFixed(4)).toString();

export const calculateSheepGoatZakatDue = (total: number) =>
  total < 40
    ? 0
    : total <= 120
      ? 1
      : total <= 200
        ? 2
        : total <= 399
          ? 3
          : Math.floor(total / 100);

const formatCattleBuffaloZakatOption = (
  tabiCount: number,
  musinnahCount: number,
) => {
  const parts = [];

  if (musinnahCount > 0) {
    parts.push(`${musinnahCount} musinnah`);
  }

  if (tabiCount > 0) {
    parts.push(`${tabiCount} tabi’/tabi’ah`);
  }

  return parts.join(" + ");
};

export const calculateCattleBuffaloZakatText = (
  total: number,
  language: CalculatorLanguageCode,
  noCattleZakatLabel: string,
) => {
  if (total < 30) {
    return noCattleZakatLabel;
  }

  let bestCovered = 0;
  const options: string[] = [];

  for (let tabiCount = 0; tabiCount <= Math.floor(total / 30); tabiCount += 1) {
    for (
      let musinnahCount = 0;
      musinnahCount <= Math.floor(total / 40);
      musinnahCount += 1
    ) {
      const covered = tabiCount * 30 + musinnahCount * 40;

      if (covered > total || covered < 30) {
        continue;
      }

      const remainder = total - covered;

      if (remainder >= 30) {
        continue;
      }

      if (covered > bestCovered) {
        bestCovered = covered;
        options.length = 0;
      }

      if (covered === bestCovered) {
        options.push(formatCattleBuffaloZakatOption(tabiCount, musinnahCount));
      }
    }
  }

  const separator = language === "en" ? " or " : " ose ";
  const suffix =
    language === "en"
      ? `(from ${total} valid animals)`
      : `(nga ${total} frymë të vlefshme)`;

  return `${options.join(separator)} ${suffix}`;
};

const camelZakatTerms = {
  sq: {
    bintMakhad: "bint makhad — deve femër që ka hyrë në vitin e dytë",
    bintLabun: "bint labun — deve femër që ka hyrë në vitin e tretë",
    hiqqah: "hiqqah — deve femër që ka hyrë në vitin e katërt",
    jadhaah: "jadha’ah — deve femër që ka hyrë në vitin e pestë",
  },
  en: {
    bintMakhad: "bint makhad — female camel in her second year",
    bintLabun: "bint labun — female camel in her third year",
    hiqqah: "hiqqah — female camel in her fourth year",
    jadhaah: "jadha’ah — female camel in her fifth year",
  },
};

const formatCamelZakatOption = (
  bintLabunCount: number,
  hiqqahCount: number,
  language: CalculatorLanguageCode,
) => {
  const parts = [];
  const terms = camelZakatTerms[language];

  if (bintLabunCount > 0) {
    parts.push(`${bintLabunCount} ${terms.bintLabun}`);
  }

  if (hiqqahCount > 0) {
    parts.push(`${hiqqahCount} ${terms.hiqqah}`);
  }

  return parts.join(" + ");
};

export const calculateCamelZakatText = (
  total: number,
  language: CalculatorLanguageCode,
  noCamelZakatLabel: string,
) => {
  if (total < 5) {
    return noCamelZakatLabel;
  }

  const terms = camelZakatTerms[language];
  const suffix =
    language === "en"
      ? `(from ${total} valid camels)`
      : `(nga ${total} frymë të vlefshme)`;

  if (total <= 9) {
    return `1 dele/dhi ${suffix}`;
  }

  if (total <= 14) {
    return `2 dele/dhi ${suffix}`;
  }

  if (total <= 19) {
    return `3 dele/dhi ${suffix}`;
  }

  if (total <= 24) {
    return `4 dele/dhi ${suffix}`;
  }

  if (total <= 35) {
    return `1 ${terms.bintMakhad} ${suffix}`;
  }

  if (total <= 45) {
    return `1 ${terms.bintLabun} ${suffix}`;
  }

  if (total <= 60) {
    return `1 ${terms.hiqqah} ${suffix}`;
  }

  if (total <= 75) {
    return `1 ${terms.jadhaah} ${suffix}`;
  }

  if (total <= 90) {
    return `2 ${terms.bintLabun} ${suffix}`;
  }

  if (total <= 120) {
    return `2 ${terms.hiqqah} ${suffix}`;
  }

  const options: string[] = [];

  for (
    let bintLabunCount = 0;
    bintLabunCount <= Math.floor(total / 40);
    bintLabunCount += 1
  ) {
    for (
      let hiqqahCount = 0;
      hiqqahCount <= Math.floor(total / 50);
      hiqqahCount += 1
    ) {
      const covered = bintLabunCount * 40 + hiqqahCount * 50;
      const remainder = total - covered;

      if (covered >= 120 && remainder >= 0 && remainder <= 9) {
        options.push(
          formatCamelZakatOption(bintLabunCount, hiqqahCount, language),
        );
      }
    }
  }

  const multipleOptionsNote =
    options.length > 1
      ? language === "en"
        ? " — Multiple combinations are possible; verify the selected Sunni methodology."
        : " — Ekzistojnë kombinime të mundshme; verifiko metodologjinë sunite të zgjedhur."
      : "";
  const separator = language === "en" ? " or " : " ose ";

  return `${options.join(separator)} ${suffix}${multipleOptionsNote}`;
};

export const calculateNisabValue = ({
  basis,
  goldPrice,
  silverPrice,
  manualValue,
}: {
  basis: NisabBasisValue;
  goldPrice: number;
  silverPrice: number;
  manualValue: number;
}) =>
  basis === "Ari"
    ? goldPrice > 0
      ? 85 * goldPrice
      : 0
    : basis === "Argjendi"
      ? silverPrice > 0
        ? 595 * silverPrice
        : 0
      : manualValue;
