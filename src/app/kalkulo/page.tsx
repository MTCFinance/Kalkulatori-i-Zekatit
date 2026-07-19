"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type CalculatorLanguage,
  type TranslationVars,
  translateCalculator,
} from "../../data/calculator-translations";
import { sunniZakatSources } from "../../data/sunni-zakat-sources";
import {
  calculateCamelZakatText,
  calculateCattleBuffaloZakatText,
  calculateNisabValue,
  calculateSheepGoatZakatDue,
  money,
  numberText,
  rateText,
  toNumber,
} from "../../lib/zakat-calculations";
import { createClient } from "../../lib/supabase/client";
import {
  type CloudCalculation,
  CloudCalculationError,
  createCloudCalculation,
  deleteCloudCalculation,
  listCloudCalculations,
} from "../../lib/supabase/cloud-calculations";
import styles from "./page.module.css";

const todayDateInputValue = () => {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 10);
};

const formatDateInputValue = (
  value: string | undefined,
  language: CalculatorLanguage,
) => {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return language === "en" ? value : `${day}.${month}.${year}`;
};

type CalculatorSectionId =
  | "section-nisab"
  | "section-money"
  | "section-fx"
  | "section-debts"
  | "section-metals"
  | "section-jewelry"
  | "section-crypto"
  | "section-livestock"
  | "section-crops"
  | "section-inventory"
  | "section-other-assets";

type ReadinessIssue = {
  id: string;
  text: string;
  sectionId: CalculatorSectionId;
};

const livestockAnimalOptions = [
  "Dele",
  "Dhi",
  "Lopë",
  "Buaj",
  "Deve",
  "Tjetër",
] as const;
type LivestockAnimal = "" | (typeof livestockAnimalOptions)[number];
type GrazingMostYear = "" | "yes" | "no";
const cropTypeOptions = [
  "Grurë",
  "Elb",
  "Oriz",
  "Misër",
  "Bishtajore",
  "Hurma",
  "Rrush / rrush i thatë",
  "Ullinj",
  "Tjetër",
] as const;
type CropType = "" | (typeof cropTypeOptions)[number];
type IrrigationType = "" | "natural" | "cost" | "mixed" | "unsure";
type NisabBasis = "Ari" | "Argjendi" | "Vlerë manuale";
type LunarYearStatus = "" | "yes" | "no" | "unsure";
type CryptoMethodology = "include" | "verify" | "unsure";
type FedLivestockMethodology = "majority" | "maliki" | "unsure";
type ReceivableStatus = "secure" | "doubtful";
type LiabilityType =
  | "Hua personale"
  | "Detyrim me këste / borxh brenda 12 muajve"
  | "Faturë ose detyrim biznesi"
  | "Detyrim karte"
  | "Tjetër";
type JewelryMethodology = "include" | "exclude" | "unsure";
type JewelryMaterial = "Ari" | "Argjend";
type JewelryPurity = "14K" | "18K" | "21K" | "22K" | "24K";
type JewelryPurpose =
  | "Përdorim personal"
  | "Kursim / ruajtje vlere"
  | "Për tregti";
type BusinessInventoryType =
  | "Mall për rishitje"
  | "Lëndë e parë për produkt që do të shitet"
  | "Produkt i përfunduar për shitje"
  | "Tokë / pronë e blerë vetëm për rishitje"
  | "Tjetër";
type ResaleStatus = "" | "yes" | "no" | "unsure";
const foreignCurrencyOptions = [
  "EUR",
  "USD",
  "CHF",
  "GBP",
  "ALL",
  "MKD",
  "RSD",
  "TRY",
  "SEK",
  "NOK",
  "DKK",
  "AED",
  "SAR",
  "CAD",
  "AUD",
  "Tjetër",
] as const;
type ForeignCurrencyCode = "" | (typeof foreignCurrencyOptions)[number];
type LivestockGroup = {
  id: number;
  animal: LivestockAnimal;
  otherAnimal: string;
  grazingCount: string;
  tradeCount: string;
  grazesMostYear: GrazingMostYear;
  tradeMarketValue: string;
};

const createLivestockGroup = (id: number): LivestockGroup => ({
  id,
  animal: "",
  otherAnimal: "",
  grazingCount: "",
  tradeCount: "",
  grazesMostYear: "",
  tradeMarketValue: "",
});

const isStandardLivestockAnimal = (animal: LivestockAnimal) =>
  animal === "Dele" ||
  animal === "Dhi" ||
  animal === "Lopë" ||
  animal === "Buaj" ||
  animal === "Deve";

type CropGroup = {
  id: number;
  crop: CropType;
  otherCrop: string;
  quantityKg: string;
  nisabKg: string;
  irrigation: IrrigationType;
};

type ForeignCurrencyRow = {
  id: number;
  currency: ForeignCurrencyCode;
  otherCurrency: string;
  amount: string;
  exchangeRateToEur: string;
};

type ReceivableRow = {
  id: number;
  description: string;
  amount: string;
  status: ReceivableStatus;
};

type LiabilityRow = {
  id: number;
  description: string;
  type: LiabilityType;
  amountDueWithinYear: string;
};

type JewelryItem = {
  id: number;
  material: JewelryMaterial;
  purity: JewelryPurity;
  weightGrams: string;
  purpose: JewelryPurpose;
  goldPrice24kPerGram: string;
  silverPricePerGram: string;
};

type JewelrySummary = {
  id: number;
  label: string;
  value: number;
  category: "includedPersonal" | "excludedPersonal" | "uncertain" | "asset";
};

type BusinessInventoryItem = {
  id: number;
  type: BusinessInventoryType;
  description: string;
  marketValue: string;
  heldForResale: ResaleStatus;
};

type BusinessInventorySummary = {
  id: number;
  label: string;
  value: number;
  included: boolean;
  complete: boolean;
};
type OtherAssetType =
  | "stocks"
  | "financialDeposit"
  | "businessParticipation"
  | "otherFinancial"
  | "other";
type OtherAssetTreatment = "include" | "exclude" | "verify";
type InvestmentPurpose =
  | ""
  | "trade"
  | "longTerm"
  | "companyPays"
  | "includeFull"
  | "unsure";
type InvestmentLoanType =
  | "none"
  | "interestFree"
  | "conventional"
  | "unsure";
type YesNoAnswer = "" | "yes" | "no";
type OtherAssetItem = {
  id: number;
  type: OtherAssetType;
  description: string;
  currentValue: string;
  treatment: OtherAssetTreatment;
  investmentPurpose?: InvestmentPurpose;
  zakatableAssetsPercentage?: string;
  dividendsHeld?: string;
  dividendsAlreadyInCash?: YesNoAnswer;
  loanType?: InvestmentLoanType;
  totalLoanOutstanding?: string;
  principalDueWithinYear?: string;
  principalAlreadyInDebts?: YesNoAnswer;
  interestDueWithinYear?: string;
};
type OtherAssetSummary = {
  id: number;
  label: string;
  value: number;
  treatment: OtherAssetTreatment;
  complete: boolean;
  hasValue: boolean;
  isInvestment: boolean;
  purpose: InvestmentPurpose;
  includedValue: number;
  excludedValue: number;
  verificationValue: number;
  includedDividends: number;
  loanType: InvestmentLoanType;
  principalDeduction: number;
  interestNotDeducted: number;
  hasConventionalLoan: boolean;
  loanNeedsVerification: boolean;
  principalAlreadyEntered: boolean;
};
type MonetaryZakatPayment = {
  id: number;
  paymentDate: string;
  amount: string;
  note: string;
};
type PlannedMonetaryZakatPayment = {
  id: number;
  plannedDate: string;
  amount: string;
  note: string;
};
type ZakatAllocationCategory =
  | "poorNeedy"
  | "administrators"
  | "hearts"
  | "slavery"
  | "debtors"
  | "cause"
  | "traveler";
type PlannedZakatAllocation = {
  id: number;
  category: ZakatAllocationCategory;
  description: string;
  amount: string;
  note: string;
};

type CropSummary = {
  id: number;
  cropName: string;
  quantityKg: number;
  nisabKg: number;
  irrigationLabel: string;
  rateLabel: string;
  zakatKg: number;
  message: string;
  calculated: boolean;
};

type SavedCalculationInputs = {
  calculationDate?: string;
  currency: string;
  hasMoney: boolean;
  hasGold: boolean;
  hasSilver: boolean;
  hasCrypto: boolean;
  hasLivestock: boolean;
  hasCrops: boolean;
  hasPersonalJewelry: boolean;
  hasBusinessInventory: boolean;
  nisabBasis: NisabBasis;
  lunarYearStatus: LunarYearStatus;
  nisab: string;
  cash: string;
  bank: string;
  savings: string;
  receivables: string;
  hasForeignCurrencies: boolean;
  goldPrice: string;
  goldType: string;
  jewelryRule: string;
  gold24: string;
  gold22: string;
  gold21: string;
  gold18: string;
  gold14: string;
  silverGrams: string;
  silverPrice: string;
  cryptoMethodology: CryptoMethodology;
  cryptoMarketValue: string;
  livestockGroups: LivestockGroup[];
  fedLivestockMethodology: FedLivestockMethodology;
  cropGroups: CropGroup[];
  foreignCurrencyRows: ForeignCurrencyRow[];
  receivableRows: ReceivableRow[];
  liabilityRows: LiabilityRow[];
  jewelryMethodology: JewelryMethodology;
  jewelryItems: JewelryItem[];
  businessInventoryItems: BusinessInventoryItem[];
  otherAssetItems?: OtherAssetItem[];
  monetaryZakatPayments?: MonetaryZakatPayment[];
  plannedMonetaryZakatPayments?: PlannedMonetaryZakatPayment[];
  plannedZakatAllocations?: PlannedZakatAllocation[];
};

type SavedCalculation = {
  id: string;
  name: string;
  savedAt: string;
  inputs: SavedCalculationInputs;
};

type SavedCalculationsBackup = {
  exportVersion: 1;
  exportedAt: string;
  savedCalculations: SavedCalculation[];
};

const savedCalculationsStorageKey = "zakat-calculator:saved-calculations";
const maxSavedCalculations = 10;
const savedCalculationsBackupVersion = 1;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isOptionalString = (value: unknown) =>
  value === undefined || typeof value === "string";

const isOtherAssetItem = (value: unknown): value is OtherAssetItem => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    typeof value.type === "string" &&
    typeof value.description === "string" &&
    typeof value.currentValue === "string" &&
    typeof value.treatment === "string" &&
    isOptionalString(value.investmentPurpose) &&
    isOptionalString(value.zakatableAssetsPercentage) &&
    isOptionalString(value.dividendsHeld) &&
    isOptionalString(value.dividendsAlreadyInCash) &&
    isOptionalString(value.loanType) &&
    isOptionalString(value.totalLoanOutstanding) &&
    isOptionalString(value.principalDueWithinYear) &&
    isOptionalString(value.principalAlreadyInDebts) &&
    isOptionalString(value.interestDueWithinYear)
  );
};

const savedCalculationStringInputKeys: (keyof SavedCalculationInputs)[] = [
  "currency",
  "nisabBasis",
  "lunarYearStatus",
  "nisab",
  "cash",
  "bank",
  "savings",
  "receivables",
  "goldPrice",
  "goldType",
  "jewelryRule",
  "gold24",
  "gold22",
  "gold21",
  "gold18",
  "gold14",
  "silverGrams",
  "silverPrice",
  "cryptoMethodology",
  "cryptoMarketValue",
  "fedLivestockMethodology",
  "jewelryMethodology",
];

const savedCalculationBooleanInputKeys: (keyof SavedCalculationInputs)[] = [
  "hasMoney",
  "hasGold",
  "hasSilver",
  "hasCrypto",
  "hasLivestock",
  "hasCrops",
  "hasPersonalJewelry",
  "hasBusinessInventory",
  "hasForeignCurrencies",
];

const savedCalculationArrayInputKeys: (keyof SavedCalculationInputs)[] = [
  "livestockGroups",
  "cropGroups",
  "foreignCurrencyRows",
  "receivableRows",
  "liabilityRows",
  "jewelryItems",
  "businessInventoryItems",
];

const isSavedCalculationInputs = (
  value: unknown,
): value is SavedCalculationInputs => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    savedCalculationStringInputKeys.every(
      (key) => typeof value[key] === "string",
    ) &&
    savedCalculationBooleanInputKeys.every(
      (key) => typeof value[key] === "boolean",
    ) &&
    savedCalculationArrayInputKeys.every((key) => Array.isArray(value[key])) &&
    (value.calculationDate === undefined ||
      typeof value.calculationDate === "string") &&
    (value.otherAssetItems === undefined ||
      (Array.isArray(value.otherAssetItems) &&
        value.otherAssetItems.every(isOtherAssetItem))) &&
    (value.monetaryZakatPayments === undefined ||
      Array.isArray(value.monetaryZakatPayments)) &&
    (value.plannedMonetaryZakatPayments === undefined ||
      Array.isArray(value.plannedMonetaryZakatPayments)) &&
    (value.plannedZakatAllocations === undefined ||
      Array.isArray(value.plannedZakatAllocations))
  );
};

const isSavedCalculation = (value: unknown): value is SavedCalculation => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.savedAt === "string" &&
    isSavedCalculationInputs(value.inputs)
  );
};

const isSavedCalculationsBackup = (
  value: unknown,
): value is SavedCalculationsBackup => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.exportVersion === savedCalculationsBackupVersion &&
    typeof value.exportedAt === "string" &&
    Array.isArray(value.savedCalculations) &&
    value.savedCalculations.every(isSavedCalculation)
  );
};

const savedCalculationDuplicateKey = (calculation: SavedCalculation) =>
  `${calculation.id}|${calculation.savedAt}|${calculation.name.trim()}`;

type CollapsibleCardProps = {
  title: string;
  description: string;
  summary?: string;
  hasWarning?: boolean;
  warningLabel: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

const CollapsibleCard = ({
  title,
  description,
  summary,
  hasWarning = false,
  warningLabel,
  defaultOpen = false,
  children,
}: CollapsibleCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 marker:hidden">
        <span className="min-w-0">
          <span className="block text-lg font-bold text-slate-950">
            {title}
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            {description}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-emerald-800">
            {summary && <span>{summary}</span>}
            {hasWarning && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                {warningLabel}
              </span>
            )}
          </span>
        </span>
        <span className="shrink-0 rounded-full border border-emerald-200 px-3 py-1 text-sm font-bold text-emerald-800 group-open:bg-emerald-700 group-open:text-white">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">-</span>
        </span>
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
};

const nextIdAfter = (items: { id: number }[], fallback: number) =>
  items.length > 0
    ? Math.max(...items.map((item) => item.id)) + 1
    : fallback;

const createCropGroup = (id: number): CropGroup => ({
  id,
  crop: "",
  otherCrop: "",
  quantityKg: "",
  nisabKg: "653",
  irrigation: "",
});

const createForeignCurrencyRow = (id: number): ForeignCurrencyRow => ({
  id,
  currency: "",
  otherCurrency: "",
  amount: "",
  exchangeRateToEur: "",
});

const createReceivableRow = (id: number): ReceivableRow => ({
  id,
  description: "",
  amount: "",
  status: "secure",
});

const createLiabilityRow = (id: number): LiabilityRow => ({
  id,
  description: "",
  type: "Hua personale",
  amountDueWithinYear: "",
});

const createJewelryItem = (id: number): JewelryItem => ({
  id,
  material: "Ari",
  purity: "22K",
  weightGrams: "",
  purpose: "Përdorim personal",
  goldPrice24kPerGram: "",
  silverPricePerGram: "",
});

const jewelryPurityFactors: Record<JewelryPurity, number> = {
  "14K": 14 / 24,
  "18K": 18 / 24,
  "21K": 21 / 24,
  "22K": 22 / 24,
  "24K": 1,
};

const createBusinessInventoryItem = (id: number): BusinessInventoryItem => ({
  id,
  type: "Mall për rishitje",
  description: "",
  marketValue: "",
  heldForResale: "",
});

const createOtherAssetItem = (id: number): OtherAssetItem => ({
  id,
  type: "stocks",
  description: "",
  currentValue: "",
  treatment: "verify",
  investmentPurpose: "",
  zakatableAssetsPercentage: "",
  dividendsHeld: "",
  dividendsAlreadyInCash: "",
  loanType: "none",
  totalLoanOutstanding: "",
  principalDueWithinYear: "",
  principalAlreadyInDebts: "",
  interestDueWithinYear: "",
});

const createMonetaryZakatPayment = (id: number): MonetaryZakatPayment => ({
  id,
  paymentDate: todayDateInputValue(),
  amount: "",
  note: "",
});

const createPlannedMonetaryZakatPayment = (
  id: number,
): PlannedMonetaryZakatPayment => ({
  id,
  plannedDate: todayDateInputValue(),
  amount: "",
  note: "",
});

const createPlannedZakatAllocation = (id: number): PlannedZakatAllocation => ({
  id,
  category: "poorNeedy",
  description: "",
  amount: "",
  note: "",
});

const normalizeAllocationCategory = (
  category: PlannedZakatAllocation["category"] | "poor" | "needy",
): ZakatAllocationCategory =>
  category === "poor" || category === "needy" ? "poorNeedy" : category;

const cropSummaryForGroup = (
  group: CropGroup,
  language: CalculatorLanguage,
): CropSummary => {
  const tr = (key: string, vars: TranslationVars = {}) =>
    translateCalculator(language, key, vars);
  const cropName =
    group.crop === "Tjetër"
      ? group.otherCrop || tr("common.other")
      : group.crop
        ? tr(`crop.type.${group.crop}`)
        : tr("crop.noType");
  const quantityKg = toNumber(group.quantityKg);
  const nisabKg = toNumber(group.nisabKg) || 653;
  const irrigationLabel = group.irrigation
    ? tr(`crop.irrigation.${group.irrigation}`)
    : tr("crop.noIrrigation");

  if (group.crop === "Tjetër") {
    return {
      id: group.id,
      cropName,
      quantityKg,
      nisabKg,
      irrigationLabel,
      rateLabel: "",
      zakatKg: 0,
      message: tr("crop.otherVerification"),
      calculated: false,
    };
  }

  if (!group.crop) {
    return {
      id: group.id,
      cropName,
      quantityKg,
      nisabKg,
      irrigationLabel,
      rateLabel: "",
      zakatKg: 0,
      message: tr("crop.chooseTypeMessage"),
      calculated: false,
    };
  }

  if (quantityKg < nisabKg) {
    return {
      id: group.id,
      cropName,
      quantityKg,
      nisabKg,
      irrigationLabel,
      rateLabel: "",
      zakatKg: 0,
      message: tr("crop.belowNisab"),
      calculated: false,
    };
  }

  if (group.irrigation === "natural") {
    return {
      id: group.id,
      cropName,
      quantityKg,
      nisabKg,
      irrigationLabel,
      rateLabel: "10%",
      zakatKg: quantityKg * 0.1,
      message: "",
      calculated: true,
    };
  }

  if (group.irrigation === "cost") {
    return {
      id: group.id,
      cropName,
      quantityKg,
      nisabKg,
      irrigationLabel,
      rateLabel: "5%",
      zakatKg: quantityKg * 0.05,
      message: "",
      calculated: true,
    };
  }

  if (group.irrigation === "mixed") {
    return {
      id: group.id,
      cropName,
      quantityKg,
      nisabKg,
      irrigationLabel,
      rateLabel: "7.5%",
      zakatKg: quantityKg * 0.075,
      message: "",
      calculated: true,
    };
  }

  if (group.irrigation === "unsure") {
    return {
      id: group.id,
      cropName,
      quantityKg,
      nisabKg,
      irrigationLabel,
      rateLabel: "",
      zakatKg: 0,
      message: tr("crop.unsureIrrigationNote"),
      calculated: false,
    };
  }

  return {
    id: group.id,
    cropName,
    quantityKg,
    nisabKg,
    irrigationLabel,
    rateLabel: "",
    zakatKg: 0,
    message: tr("crop.chooseIrrigationMessage"),
    calculated: false,
  };
};

function KalkuloPageContent({ isSimpleMode }: { isSimpleMode: boolean }) {
  const [language, setLanguage] = useState<CalculatorLanguage>("sq");
  const [calculationDate, setCalculationDate] = useState(todayDateInputValue);
  const [currency, setCurrency] = useState("EUR");
  const t = (
    key: string,
    vars: Record<string, string | number> = {},
  ) => translateCalculator(language, key, vars);

  const [hasMoney, setHasMoney] = useState(true);
  const [hasGold, setHasGold] = useState(false);
  const [hasSilver, setHasSilver] = useState(false);
  const [hasCrypto, setHasCrypto] = useState(false);
  const [hasLivestock, setHasLivestock] = useState(false);
  const [hasCrops, setHasCrops] = useState(false);
  const [hasPersonalJewelry, setHasPersonalJewelry] = useState(false);
  const [hasBusinessInventory, setHasBusinessInventory] = useState(false);

  const [nisabBasis, setNisabBasis] = useState<NisabBasis>("Ari");
  const [lunarYearStatus, setLunarYearStatus] =
    useState<LunarYearStatus>("");
  const [nisab, setNisab] = useState("");
  const [cash, setCash] = useState("");
  const [bank, setBank] = useState("");
  const [savings, setSavings] = useState("");
  const [receivables, setReceivables] = useState("");
  const [hasForeignCurrencies, setHasForeignCurrencies] = useState(false);

  const [goldPrice, setGoldPrice] = useState("");
  const [goldType, setGoldType] = useState("investment");
const [jewelryRule, setJewelryRule] = useState("include");
  const [gold24, setGold24] = useState("");
  const [gold22, setGold22] = useState("");
  const [gold21, setGold21] = useState("");
  const [gold18, setGold18] = useState("");
  const [gold14, setGold14] = useState("");

  const [silverGrams, setSilverGrams] = useState("");
  const [silverPrice, setSilverPrice] = useState("");
  const [metalsProvider, setMetalsProvider] = useState("");
  const [metalsUpdatedAt, setMetalsUpdatedAt] = useState("");
  const [metalsMessage, setMetalsMessage] = useState("");
  const [isFetchingMetals, setIsFetchingMetals] = useState(false);

  const [cryptoMethodology, setCryptoMethodology] =
    useState<CryptoMethodology>("include");
  const [cryptoMarketValue, setCryptoMarketValue] = useState("");

  const [livestockGroups, setLivestockGroups] = useState<LivestockGroup[]>([
    createLivestockGroup(1),
  ]);
  const [fedLivestockMethodology, setFedLivestockMethodology] =
    useState<FedLivestockMethodology>("majority");
  const [nextLivestockGroupId, setNextLivestockGroupId] = useState(2);
  const [cropGroups, setCropGroups] = useState<CropGroup[]>([
    createCropGroup(1),
  ]);
  const [nextCropGroupId, setNextCropGroupId] = useState(2);
  const [foreignCurrencyRows, setForeignCurrencyRows] = useState<
    ForeignCurrencyRow[]
  >([createForeignCurrencyRow(1)]);
  const [nextForeignCurrencyRowId, setNextForeignCurrencyRowId] = useState(2);
  const [fxProvider, setFxProvider] = useState("");
  const [fxUpdatedAt, setFxUpdatedAt] = useState("");
  const [fxError, setFxError] = useState("");
  const [isFetchingFx, setIsFetchingFx] = useState(false);
  const [receivableRows, setReceivableRows] = useState<ReceivableRow[]>([]);
  const [nextReceivableRowId, setNextReceivableRowId] = useState(1);
  const [liabilityRows, setLiabilityRows] = useState<LiabilityRow[]>([]);
  const [nextLiabilityRowId, setNextLiabilityRowId] = useState(1);
  const [jewelryMethodology, setJewelryMethodology] =
    useState<JewelryMethodology>("unsure");
  const [jewelryItems, setJewelryItems] = useState<JewelryItem[]>([
    createJewelryItem(1),
  ]);
  const [nextJewelryItemId, setNextJewelryItemId] = useState(2);
  const [businessInventoryItems, setBusinessInventoryItems] = useState<
    BusinessInventoryItem[]
  >([createBusinessInventoryItem(1)]);
  const [nextBusinessInventoryItemId, setNextBusinessInventoryItemId] =
    useState(2);
  const [otherAssetItems, setOtherAssetItems] = useState<OtherAssetItem[]>([]);
  const [nextOtherAssetItemId, setNextOtherAssetItemId] = useState(1);
  const [monetaryZakatPayments, setMonetaryZakatPayments] = useState<
    MonetaryZakatPayment[]
  >([]);
  const [nextMonetaryZakatPaymentId, setNextMonetaryZakatPaymentId] =
    useState(1);
  const [
    plannedMonetaryZakatPayments,
    setPlannedMonetaryZakatPayments,
  ] = useState<PlannedMonetaryZakatPayment[]>([]);
  const [
    nextPlannedMonetaryZakatPaymentId,
    setNextPlannedMonetaryZakatPaymentId,
  ] = useState(1);
  const [plannedPaymentAmount, setPlannedPaymentAmount] = useState("");
  const [plannedPaymentDate, setPlannedPaymentDate] = useState(
    todayDateInputValue,
  );
  const [plannedPaymentNote, setPlannedPaymentNote] = useState("");
  const [plannedZakatAllocations, setPlannedZakatAllocations] = useState<
    PlannedZakatAllocation[]
  >([]);
  const [nextPlannedZakatAllocationId, setNextPlannedZakatAllocationId] =
    useState(1);
  const [savedCalculations, setSavedCalculations] = useState<
    SavedCalculation[]
  >([]);
  const [saveCalculationName, setSaveCalculationName] = useState("");
  const [savedCalculationMessage, setSavedCalculationMessage] = useState("");
  const [cloudCalculations, setCloudCalculations] = useState<
    CloudCalculation[]
  >([]);
  const [cloudUserEmail, setCloudUserEmail] = useState<string | null>(null);
  const [cloudCalculationName, setCloudCalculationName] = useState("");
  const [cloudCalculationMessage, setCloudCalculationMessage] = useState("");
  const [isCheckingCloudAuth, setIsCheckingCloudAuth] = useState(true);
  const [isLoadingCloudCalculations, setIsLoadingCloudCalculations] =
    useState(false);
  const [isSavingCloudCalculation, setIsSavingCloudCalculation] =
    useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const importBackupInputRef = useRef<HTMLInputElement>(null);

  const livestockAnimalLabel = (animal: LivestockAnimal) =>
    animal ? t(`livestock.animal.${animal}`) : "";
  const cropTypeLabel = (crop: CropType) => (crop ? t(`crop.type.${crop}`) : "");
  const materialLabel = (material: JewelryMaterial) =>
    material === "Ari" ? t("nisab.gold") : t("nisab.silver");
  const otherAssetTypeLabel = (type: OtherAssetType) =>
    t(`otherAssets.type.${type}`);
  const otherAssetTreatmentLabel = (treatment: OtherAssetTreatment) =>
    t(`otherAssets.treatment.${treatment}`);
  const investmentPurposeLabel = (purpose: InvestmentPurpose) =>
    purpose
      ? t(`otherAssets.purpose.${purpose}`)
      : t("otherAssets.purpose.placeholder");
  const investmentLoanTypeLabel = (loanType: InvestmentLoanType) =>
    t(`otherAssets.loan.${loanType}`);
  const allocationCategoryLabel = (
    category: ZakatAllocationCategory | "poor" | "needy",
  ) => t(`allocations.category.${normalizeAllocationCategory(category)}`);

  const persistSavedCalculations = (nextSaved: SavedCalculation[]) => {
    window.localStorage.setItem(
      savedCalculationsStorageKey,
      JSON.stringify(nextSaved),
    );
    setSavedCalculations(nextSaved);
  };

  useEffect(() => {
    const loadSavedCalculations = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(savedCalculationsStorageKey);

        if (stored) {
          const parsed = JSON.parse(stored) as unknown;

          if (Array.isArray(parsed)) {
            setSavedCalculations(
              parsed.filter(isSavedCalculation).slice(0, maxSavedCalculations),
            );
          }
        }
      } catch {
        setSavedCalculationMessage(
          translateCalculator("sq", "saved.loadError"),
        );
      }
    }, 0);

    return () => window.clearTimeout(loadSavedCalculations);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadCloudSession = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (!isActive) {
          return;
        }

        if (error || !data.user) {
          setCloudUserEmail(null);
          setCloudCalculations([]);
          return;
        }

        setCloudUserEmail(data.user.email ?? "");
        setIsLoadingCloudCalculations(true);

        try {
          const rows = await listCloudCalculations();

          if (isActive) {
            setCloudCalculations(rows);
          }
        } catch {
          if (isActive) {
            setCloudCalculationMessage(
              translateCalculator("sq", "cloud.error.load"),
            );
          }
        } finally {
          if (isActive) {
            setIsLoadingCloudCalculations(false);
          }
        }
      } catch {
        if (isActive) {
          setCloudUserEmail(null);
          setCloudCalculations([]);
        }
      } finally {
        if (isActive) {
          setIsCheckingCloudAuth(false);
        }
      }
    };

    void loadCloudSession();

    return () => {
      isActive = false;
    };
  }, []);

  const currentSavedInputs = (): SavedCalculationInputs => ({
    calculationDate,
    currency,
    hasMoney,
    hasGold,
    hasSilver,
    hasCrypto,
    hasLivestock,
    hasCrops,
    hasPersonalJewelry,
    hasBusinessInventory,
    nisabBasis,
    lunarYearStatus,
    nisab,
    cash,
    bank,
    savings,
    receivables,
    hasForeignCurrencies,
    goldPrice,
    goldType,
    jewelryRule,
    gold24,
    gold22,
    gold21,
    gold18,
    gold14,
    silverGrams,
    silverPrice,
    cryptoMethodology,
    cryptoMarketValue,
    livestockGroups,
    fedLivestockMethodology,
    cropGroups,
    foreignCurrencyRows,
    receivableRows,
    liabilityRows,
    jewelryMethodology,
    jewelryItems,
    businessInventoryItems,
    otherAssetItems,
    monetaryZakatPayments,
    plannedMonetaryZakatPayments,
    plannedZakatAllocations,
  });

  const resetCurrentCalculation = () => {
    setCalculationDate(todayDateInputValue());
    setCurrency("EUR");
    setHasMoney(true);
    setHasGold(false);
    setHasSilver(false);
    setHasCrypto(false);
    setHasLivestock(false);
    setHasCrops(false);
    setHasPersonalJewelry(false);
    setHasBusinessInventory(false);
    setNisabBasis("Ari");
    setLunarYearStatus("");
    setNisab("");
    setCash("");
    setBank("");
    setSavings("");
    setReceivables("");
    setHasForeignCurrencies(false);
    setGoldPrice("");
    setGoldType("investment");
    setJewelryRule("include");
    setGold24("");
    setGold22("");
    setGold21("");
    setGold18("");
    setGold14("");
    setSilverGrams("");
    setSilverPrice("");
    setMetalsProvider("");
    setMetalsUpdatedAt("");
    setMetalsMessage("");
    setIsFetchingMetals(false);
    setCryptoMethodology("include");
    setCryptoMarketValue("");
    setLivestockGroups([createLivestockGroup(1)]);
    setFedLivestockMethodology("majority");
    setNextLivestockGroupId(2);
    setCropGroups([createCropGroup(1)]);
    setNextCropGroupId(2);
    setForeignCurrencyRows([createForeignCurrencyRow(1)]);
    setNextForeignCurrencyRowId(2);
    setFxProvider("");
    setFxUpdatedAt("");
    setFxError("");
    setIsFetchingFx(false);
    setReceivableRows([]);
    setNextReceivableRowId(1);
    setLiabilityRows([]);
    setNextLiabilityRowId(1);
    setJewelryMethodology("unsure");
    setJewelryItems([createJewelryItem(1)]);
    setNextJewelryItemId(2);
    setBusinessInventoryItems([createBusinessInventoryItem(1)]);
    setNextBusinessInventoryItemId(2);
    setOtherAssetItems([]);
    setNextOtherAssetItemId(1);
    setMonetaryZakatPayments([]);
    setNextMonetaryZakatPaymentId(1);
    setPlannedMonetaryZakatPayments([]);
    setNextPlannedMonetaryZakatPaymentId(1);
    setPlannedPaymentAmount("");
    setPlannedPaymentDate(todayDateInputValue());
    setPlannedPaymentNote("");
    setPlannedZakatAllocations([]);
    setNextPlannedZakatAllocationId(1);
    setIsResetConfirmOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveCalculation = () => {
    if (savedCalculations.length >= maxSavedCalculations) {
      setSavedCalculationMessage(t("saved.limitMessage"));
      return;
    }

    const newCalculation: SavedCalculation = {
      id: window.crypto.randomUUID(),
      name: saveCalculationName.trim(),
      savedAt: new Date().toISOString(),
      inputs: currentSavedInputs(),
    };
    const nextSaved: SavedCalculation[] = [
      newCalculation,
      ...savedCalculations,
    ];

    try {
      persistSavedCalculations(nextSaved);
      setSaveCalculationName("");
      setSavedCalculationMessage(t("saved.savedMessage"));
    } catch {
      setSavedCalculationMessage(t("saved.saveError"));
    }
  };

  const handleOpenSavedCalculation = (calculation: SavedCalculation) => {
    const { inputs } = calculation;

    setCalculationDate(inputs.calculationDate ?? "");
    setCurrency(inputs.currency);
    setHasMoney(inputs.hasMoney);
    setHasGold(inputs.hasGold);
    setHasSilver(inputs.hasSilver);
    setHasCrypto(inputs.hasCrypto);
    setHasLivestock(inputs.hasLivestock);
    setHasCrops(inputs.hasCrops);
    setHasPersonalJewelry(inputs.hasPersonalJewelry);
    setHasBusinessInventory(inputs.hasBusinessInventory);
    setNisabBasis(inputs.nisabBasis);
    setLunarYearStatus(inputs.lunarYearStatus);
    setNisab(inputs.nisab);
    setCash(inputs.cash);
    setBank(inputs.bank);
    setSavings(inputs.savings);
    setReceivables(inputs.receivables);
    setHasForeignCurrencies(inputs.hasForeignCurrencies);
    setGoldPrice(inputs.goldPrice);
    setGoldType(inputs.goldType);
    setJewelryRule(inputs.jewelryRule);
    setGold24(inputs.gold24);
    setGold22(inputs.gold22);
    setGold21(inputs.gold21);
    setGold18(inputs.gold18);
    setGold14(inputs.gold14);
    setSilverGrams(inputs.silverGrams);
    setSilverPrice(inputs.silverPrice);
    setCryptoMethodology(inputs.cryptoMethodology);
    setCryptoMarketValue(inputs.cryptoMarketValue);
    setLivestockGroups(inputs.livestockGroups);
    setFedLivestockMethodology(inputs.fedLivestockMethodology);
    setCropGroups(inputs.cropGroups);
    setForeignCurrencyRows(inputs.foreignCurrencyRows);
    setReceivableRows(inputs.receivableRows);
    setLiabilityRows(inputs.liabilityRows);
    setJewelryMethodology(inputs.jewelryMethodology);
    setJewelryItems(inputs.jewelryItems);
    setBusinessInventoryItems(inputs.businessInventoryItems);
    setOtherAssetItems(inputs.otherAssetItems ?? []);
    setMonetaryZakatPayments(inputs.monetaryZakatPayments ?? []);
    setPlannedMonetaryZakatPayments(
      inputs.plannedMonetaryZakatPayments ?? [],
    );
    setPlannedZakatAllocations(
      (inputs.plannedZakatAllocations ?? []).map((allocation) => ({
        ...allocation,
        category: normalizeAllocationCategory(
          allocation.category as ZakatAllocationCategory | "poor" | "needy",
        ),
      })),
    );
    setNextLivestockGroupId(nextIdAfter(inputs.livestockGroups, 1));
    setNextCropGroupId(nextIdAfter(inputs.cropGroups, 1));
    setNextForeignCurrencyRowId(nextIdAfter(inputs.foreignCurrencyRows, 1));
    setNextReceivableRowId(nextIdAfter(inputs.receivableRows, 1));
    setNextLiabilityRowId(nextIdAfter(inputs.liabilityRows, 1));
    setNextJewelryItemId(nextIdAfter(inputs.jewelryItems, 1));
    setNextBusinessInventoryItemId(
      nextIdAfter(inputs.businessInventoryItems, 1),
    );
    setNextOtherAssetItemId(nextIdAfter(inputs.otherAssetItems ?? [], 1));
    setNextMonetaryZakatPaymentId(
      nextIdAfter(inputs.monetaryZakatPayments ?? [], 1),
    );
    setNextPlannedMonetaryZakatPaymentId(
      nextIdAfter(inputs.plannedMonetaryZakatPayments ?? [], 1),
    );
    setNextPlannedZakatAllocationId(
      nextIdAfter(inputs.plannedZakatAllocations ?? [], 1),
    );
    setMetalsProvider("");
    setMetalsUpdatedAt("");
    setMetalsMessage("");
    setFxProvider("");
    setFxUpdatedAt("");
    setFxError("");
    setSavedCalculationMessage(t("saved.openedMessage"));
  };

  const handleDeleteSavedCalculation = (id: string) => {
    if (!window.confirm(t("saved.deleteConfirm"))) {
      return;
    }

    const nextSaved = savedCalculations.filter(
      (calculation) => calculation.id !== id,
    );
    persistSavedCalculations(nextSaved);
    setSavedCalculationMessage(t("saved.deletedMessage"));
  };

  const handleDeleteAllSavedCalculations = () => {
    if (!window.confirm(t("saved.deleteAllConfirm"))) {
      return;
    }

    persistSavedCalculations([]);
    setSavedCalculationMessage(t("saved.deletedAllMessage"));
  };

  const handleExportSavedCalculations = () => {
    if (savedCalculations.length === 0) {
      setSavedCalculationMessage(t("saved.exportEmpty"));
      return;
    }

    const backup: SavedCalculationsBackup = {
      exportVersion: savedCalculationsBackupVersion,
      exportedAt: new Date().toISOString(),
      savedCalculations,
    };
    const backupJson = JSON.stringify(backup, null, 2);
    const backupBlob = new Blob([backupJson], { type: "application/json" });
    const backupUrl = window.URL.createObjectURL(backupBlob);
    const downloadLink = document.createElement("a");
    const backupDate = new Date().toISOString().slice(0, 10);

    downloadLink.href = backupUrl;
    downloadLink.download = `zakat-calculator-backup-${backupDate}.json`;
    downloadLink.click();
    window.URL.revokeObjectURL(backupUrl);
    setSavedCalculationMessage(t("saved.exportedMessage"));
  };

  const handleImportBackupFile = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const fileText = await file.text();
      let parsedBackup: unknown;

      try {
        parsedBackup = JSON.parse(fileText);
      } catch {
        setSavedCalculationMessage(t("saved.importInvalidJson"));
        return;
      }

      if (!isSavedCalculationsBackup(parsedBackup)) {
        setSavedCalculationMessage(t("saved.importInvalidBackup"));
        return;
      }

      const existingKeys = new Set(
        savedCalculations.map(savedCalculationDuplicateKey),
      );
      const importedKeys = new Set<string>();
      const newImportedCalculations = parsedBackup.savedCalculations.filter(
        (calculation) => {
          const duplicateKey = savedCalculationDuplicateKey(calculation);

          if (existingKeys.has(duplicateKey) || importedKeys.has(duplicateKey)) {
            return false;
          }

          importedKeys.add(duplicateKey);
          return true;
        },
      );

      if (newImportedCalculations.length === 0) {
        setSavedCalculationMessage(t("saved.importNoNew"));
        return;
      }

      if (
        savedCalculations.length + newImportedCalculations.length >
        maxSavedCalculations
      ) {
        setSavedCalculationMessage(t("saved.importLimitMessage"));
        return;
      }

      persistSavedCalculations([
        ...newImportedCalculations,
        ...savedCalculations,
      ]);
      setSavedCalculationMessage(
        t("saved.importedMessage", { count: newImportedCalculations.length }),
      );
    } catch {
      setSavedCalculationMessage(t("saved.importReadError"));
    } finally {
      event.target.value = "";
    }
  };

  const refreshCloudCalculations = async () => {
    setIsLoadingCloudCalculations(true);
    setCloudCalculationMessage("");

    try {
      const rows = await listCloudCalculations();
      setCloudCalculations(rows);
    } catch (error) {
      if (
        error instanceof CloudCalculationError &&
        error.code === "unauthenticated"
      ) {
        setCloudUserEmail(null);
        setCloudCalculations([]);
        setCloudCalculationMessage(t("cloud.error.unauthenticated"));
      } else {
        setCloudCalculationMessage(t("cloud.error.load"));
      }
    } finally {
      setIsLoadingCloudCalculations(false);
    }
  };

  const handleSaveCloudCalculation = async () => {
    if (!cloudUserEmail) {
      setCloudCalculationMessage(t("cloud.error.unauthenticated"));
      return;
    }

    setIsSavingCloudCalculation(true);
    setCloudCalculationMessage("");

    try {
      const payload = { ...currentSavedInputs() } as Record<string, unknown>;
      await createCloudCalculation({
        name: cloudCalculationName,
        calculationDate,
        payload,
      });
      setCloudCalculationName("");
      setCloudCalculationMessage(t("cloud.saved"));
      setCloudCalculations(await listCloudCalculations());
    } catch (error) {
      if (
        error instanceof CloudCalculationError &&
        error.code === "unauthenticated"
      ) {
        setCloudUserEmail(null);
        setCloudCalculations([]);
        setCloudCalculationMessage(t("cloud.error.unauthenticated"));
      } else {
        setCloudCalculationMessage(t("cloud.error.save"));
      }
    } finally {
      setIsSavingCloudCalculation(false);
    }
  };

  const handleOpenCloudCalculation = (calculation: CloudCalculation) => {
    if (!isRecord(calculation.payload)) {
      setCloudCalculationMessage(t("cloud.error.invalidPayload"));
      return;
    }

    const payload = {
      ...calculation.payload,
      calculationDate:
        calculation.calculation_date ??
        calculation.payload.calculationDate ??
        "",
    };

    if (!isSavedCalculationInputs(payload)) {
      setCloudCalculationMessage(t("cloud.error.invalidPayload"));
      return;
    }

    handleOpenSavedCalculation({
      id: calculation.id,
      name: calculation.name ?? "",
      savedAt: calculation.updated_at,
      inputs: payload,
    });
    setSavedCalculationMessage("");
    setCloudCalculationMessage(t("cloud.opened"));
  };

  const handleDeleteCloudCalculation = async (calculationId: string) => {
    if (!window.confirm(t("cloud.deleteConfirm"))) {
      return;
    }

    setCloudCalculationMessage("");

    try {
      await deleteCloudCalculation(calculationId);
      setCloudCalculationMessage(t("cloud.deleted"));
      setCloudCalculations(await listCloudCalculations());
    } catch (error) {
      if (
        error instanceof CloudCalculationError &&
        error.code === "unauthenticated"
      ) {
        setCloudUserEmail(null);
        setCloudCalculations([]);
        setCloudCalculationMessage(t("cloud.error.unauthenticated"));
      } else {
        setCloudCalculationMessage(t("cloud.error.delete"));
      }
    }
  };

  const formatSavedDate = (savedAt: string) =>
    new Date(savedAt).toLocaleString(language === "en" ? "en-US" : "sq-AL");
  const formatSavedCalculationDate = (dateValue?: string) =>
    formatDateInputValue(dateValue, language) || t("calculationDate.notSaved");

  const scrollToCalculatorSection = (sectionId: CalculatorSectionId) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCurrencyChange = (nextCurrency: string) => {
    setCurrency(nextCurrency);
    setForeignCurrencyRows((current) =>
      current.map((row) =>
        row.currency === nextCurrency
          ? createForeignCurrencyRow(row.id)
          : row,
      ),
    );
  };

  const updateLivestockGroup = (
    id: number,
    updates: Partial<LivestockGroup>,
  ) => {
    setLivestockGroups((current) =>
      current.map((group) =>
        group.id === id
          ? {
              ...group,
              ...updates,
            }
          : group,
      ),
    );
  };

  const addLivestockGroup = () => {
    setLivestockGroups((current) => [
      ...current,
      createLivestockGroup(nextLivestockGroupId),
    ]);
    setNextLivestockGroupId((current) => current + 1);
  };

  const removeLivestockGroup = (id: number) => {
    setLivestockGroups((current) =>
      current.length === 1
        ? [createLivestockGroup(current[0].id)]
        : current.filter((group) => group.id !== id),
    );
  };

  const updateCropGroup = (id: number, updates: Partial<CropGroup>) => {
    setCropGroups((current) =>
      current.map((group) =>
        group.id === id
          ? {
              ...group,
              ...updates,
            }
          : group,
      ),
    );
  };

  const addCropGroup = () => {
    setCropGroups((current) => [...current, createCropGroup(nextCropGroupId)]);
    setNextCropGroupId((current) => current + 1);
  };

  const removeCropGroup = (id: number) => {
    setCropGroups((current) =>
      current.length === 1
        ? [createCropGroup(current[0].id)]
        : current.filter((group) => group.id !== id),
    );
  };

  const updateForeignCurrencyRow = (
    id: number,
    updates: Partial<ForeignCurrencyRow>,
  ) => {
    setForeignCurrencyRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              ...updates,
            }
          : row,
      ),
    );
  };

  const addForeignCurrencyRow = () => {
    setForeignCurrencyRows((current) => [
      ...current,
      createForeignCurrencyRow(nextForeignCurrencyRowId),
    ]);
    setNextForeignCurrencyRowId((current) => current + 1);
  };

  const removeForeignCurrencyRow = (id: number) => {
    setForeignCurrencyRows((current) =>
      current.length === 1
        ? [createForeignCurrencyRow(current[0].id)]
        : current.filter((row) => row.id !== id),
    );
  };

  const fetchAutomaticMetalPrices = async () => {
    setIsFetchingMetals(true);
    setMetalsMessage("");

    try {
      const response = await fetch("/api/metals");

      if (!response.ok) {
        throw new Error("Metals request failed");
      }

      const data = (await response.json()) as {
        provider?: string;
        updatedAt?: string | null;
        gold24kEurPerGram?: number | null;
        silverEurPerGram?: number | null;
        status?: "ok" | "not_configured" | "unavailable";
      };

      if (data.status === "not_configured") {
        setMetalsProvider("");
        setMetalsUpdatedAt("");
        setMetalsMessage(t("metals.notConfigured"));
        return;
      }

      if (data.status !== "ok") {
        setMetalsMessage(t("metals.unavailable"));
        return;
      }

      const hasValidGold =
        typeof data.gold24kEurPerGram === "number" &&
        Number.isFinite(data.gold24kEurPerGram) &&
        data.gold24kEurPerGram > 0;
      const hasValidSilver =
        typeof data.silverEurPerGram === "number" &&
        Number.isFinite(data.silverEurPerGram) &&
        data.silverEurPerGram > 0;

      if (!hasValidGold || !hasValidSilver) {
        setMetalsMessage(t("metals.unavailable"));
        return;
      }

      setGoldPrice(data.gold24kEurPerGram!.toFixed(2));
      setSilverPrice(data.silverEurPerGram!.toFixed(4));
      setMetalsProvider(data.provider ?? "Metals.Dev");
      setMetalsUpdatedAt(data.updatedAt ?? "");
    } catch {
      setMetalsMessage(t("metals.unavailable"));
    } finally {
      setIsFetchingMetals(false);
    }
  };

  const fetchAutomaticFxRates = async () => {
    setIsFetchingFx(true);
    setFxError("");

    try {
      const response = await fetch("/api/fx");

      if (!response.ok) {
        throw new Error("FX request failed");
      }

      const data = (await response.json()) as {
        updatedAt?: string;
        provider?: string;
        ratesToEur?: Record<string, number>;
      };
      const ratesToEur = data.ratesToEur ?? {};

      setForeignCurrencyRows((current) =>
        current.map((row) => {
          if (
            row.currency === "" ||
            row.currency === "Tjetër" ||
            row.currency === currency
          ) {
            return row;
          }

          const rateToEur = ratesToEur[row.currency];

          if (!Number.isFinite(rateToEur) || rateToEur <= 0) {
            return row;
          }

          return {
            ...row,
            exchangeRateToEur: rateToEur.toFixed(6),
          };
        }),
      );
      setFxProvider(data.provider ?? "Frankfurter");
      setFxUpdatedAt(data.updatedAt ?? "");
    } catch {
      setFxError(t("fx.unavailable"));
    } finally {
      setIsFetchingFx(false);
    }
  };

  const updateReceivableRow = (
    id: number,
    updates: Partial<ReceivableRow>,
  ) => {
    setReceivableRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              ...updates,
            }
          : row,
      ),
    );
  };

  const addReceivableRow = () => {
    setReceivableRows((current) => [
      ...current,
      createReceivableRow(nextReceivableRowId),
    ]);
    setNextReceivableRowId((current) => current + 1);
  };

  const removeReceivableRow = (id: number) => {
    setReceivableRows((current) => current.filter((row) => row.id !== id));
  };

  const updateLiabilityRow = (id: number, updates: Partial<LiabilityRow>) => {
    setLiabilityRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              ...updates,
            }
          : row,
      ),
    );
  };

  const addLiabilityRow = () => {
    setLiabilityRows((current) => [
      ...current,
      createLiabilityRow(nextLiabilityRowId),
    ]);
    setNextLiabilityRowId((current) => current + 1);
  };

  const removeLiabilityRow = (id: number) => {
    setLiabilityRows((current) => current.filter((row) => row.id !== id));
  };

  const updateJewelryItem = (id: number, updates: Partial<JewelryItem>) => {
    setJewelryItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
    );
  };

  const addJewelryItem = () => {
    setJewelryItems((current) => [
      ...current,
      createJewelryItem(nextJewelryItemId),
    ]);
    setNextJewelryItemId((current) => current + 1);
  };

  const removeJewelryItem = (id: number) => {
    setJewelryItems((current) =>
      current.length === 1
        ? [createJewelryItem(current[0].id)]
        : current.filter((item) => item.id !== id),
    );
  };

  const updateBusinessInventoryItem = (
    id: number,
    updates: Partial<BusinessInventoryItem>,
  ) => {
    setBusinessInventoryItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
    );
  };

  const addBusinessInventoryItem = () => {
    setBusinessInventoryItems((current) => [
      ...current,
      createBusinessInventoryItem(nextBusinessInventoryItemId),
    ]);
    setNextBusinessInventoryItemId((current) => current + 1);
  };

  const removeBusinessInventoryItem = (id: number) => {
    setBusinessInventoryItems((current) =>
      current.length === 1
        ? [createBusinessInventoryItem(current[0].id)]
        : current.filter((item) => item.id !== id),
    );
  };

  const updateOtherAssetItem = (
    id: number,
    updates: Partial<OtherAssetItem>,
  ) => {
    setOtherAssetItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
    );
  };

  const addOtherAssetItem = () => {
    setOtherAssetItems((current) => [
      ...current,
      createOtherAssetItem(nextOtherAssetItemId),
    ]);
    setNextOtherAssetItemId((current) => current + 1);
  };

  const removeOtherAssetItem = (id: number) => {
    setOtherAssetItems((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const updateMonetaryZakatPayment = (
    id: number,
    updates: Partial<MonetaryZakatPayment>,
  ) => {
    setMonetaryZakatPayments((current) =>
      current.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              ...updates,
            }
          : payment,
      ),
    );
  };

  const addMonetaryZakatPayment = () => {
    setMonetaryZakatPayments((current) => [
      ...current,
      createMonetaryZakatPayment(nextMonetaryZakatPaymentId),
    ]);
    setNextMonetaryZakatPaymentId((current) => current + 1);
  };

  const removeMonetaryZakatPayment = (id: number) => {
    setMonetaryZakatPayments((current) =>
      current.filter((payment) => payment.id !== id),
    );
  };

  const addPlannedMonetaryZakatPayment = () => {
    const amount = toNumber(plannedPaymentAmount);

    if (plannedPaymentAmount.trim() === "" || amount <= 0) {
      return;
    }

    setPlannedMonetaryZakatPayments((current) => [
      ...current,
      {
        ...createPlannedMonetaryZakatPayment(
          nextPlannedMonetaryZakatPaymentId,
        ),
        plannedDate: plannedPaymentDate,
        amount: plannedPaymentAmount,
        note: plannedPaymentNote,
      },
    ]);
    setNextPlannedMonetaryZakatPaymentId((current) => current + 1);
    setPlannedPaymentAmount("");
    setPlannedPaymentDate(todayDateInputValue());
    setPlannedPaymentNote("");
  };

  const removePlannedMonetaryZakatPayment = (id: number) => {
    setPlannedMonetaryZakatPayments((current) =>
      current.filter((payment) => payment.id !== id),
    );
  };

  const markPlannedPaymentAsPaid = (payment: PlannedMonetaryZakatPayment) => {
    if (!window.confirm(t("plannedPayments.confirmMarkPaid"))) {
      return;
    }

    setMonetaryZakatPayments((current) => [
      ...current,
      {
        id: nextMonetaryZakatPaymentId,
        paymentDate: payment.plannedDate,
        amount: payment.amount,
        note: payment.note,
      },
    ]);
    setNextMonetaryZakatPaymentId((current) => current + 1);
    removePlannedMonetaryZakatPayment(payment.id);
  };

  const updatePlannedZakatAllocation = (
    id: number,
    updates: Partial<PlannedZakatAllocation>,
  ) => {
    setPlannedZakatAllocations((current) =>
      current.map((allocation) =>
        allocation.id === id
          ? {
              ...allocation,
              ...updates,
            }
          : allocation,
      ),
    );
  };

  const addPlannedZakatAllocation = () => {
    setPlannedZakatAllocations((current) => [
      ...current,
      createPlannedZakatAllocation(nextPlannedZakatAllocationId),
    ]);
    setNextPlannedZakatAllocationId((current) => current + 1);
  };

  const removePlannedZakatAllocation = (id: number) => {
    setPlannedZakatAllocations((current) =>
      current.filter((allocation) => allocation.id !== id),
    );
  };

  const availableForeignCurrencyOptions = foreignCurrencyOptions.filter(
    (option) => option === "Tjetër" || option !== currency,
  );

  const foreignCurrencySummaries = hasForeignCurrencies
    ? foreignCurrencyRows.map((row) => {
        const amount = toNumber(row.amount);
        const rate =
          row.currency === currency ? 1 : toNumber(row.exchangeRateToEur);
        const hasAmount = row.amount.trim() !== "";
        const hasRate =
          row.currency === currency || row.exchangeRateToEur.trim() !== "";
        const isValid =
          hasAmount &&
          hasRate &&
          amount >= 0 &&
          (amount === 0 || rate > 0) &&
          row.currency !== "" &&
          (row.currency !== "Tjetër" || row.otherCurrency.trim() !== "");
          const label =
            row.currency === "Tjetër"
              ? row.otherCurrency.trim() || t("common.other")
              : row.currency || t("fx.currency");

        return {
          id: row.id,
          label,
          amount,
          rate,
          equivalentEur: isValid ? amount * rate : 0,
          isValid,
        };
      })
    : [];
  const foreignCurrencyTotalEur = foreignCurrencySummaries.reduce(
    (total, row) => (row.isValid ? total + row.equivalentEur : total),
    0,
  );
  const otherAssetSummaries: OtherAssetSummary[] = otherAssetItems.map(
    (item) => {
      const value = toNumber(item.currentValue);
      const hasValue = item.currentValue.trim() !== "" && value >= 0;
      const isInvestment =
        item.type === "stocks" || item.type === "businessParticipation";
      const purpose = item.investmentPurpose ?? "";
      const percentageText = item.zakatableAssetsPercentage ?? "";
      const percentage = toNumber(percentageText);
      const hasValidPercentage =
        percentageText.trim() !== "" &&
        Number.isFinite(Number(percentageText)) &&
        percentage >= 0 &&
        percentage <= 100;
      const dividends = Math.max(toNumber(item.dividendsHeld ?? ""), 0);
      const dividendsHaveAnswer =
        dividends <= 0 ||
        item.dividendsAlreadyInCash === "yes" ||
        item.dividendsAlreadyInCash === "no";
      const loanType = item.loanType ?? "none";
      const principal = Math.max(
        toNumber(item.principalDueWithinYear ?? ""),
        0,
      );
      const principalHasAnswer =
        loanType === "none" ||
        loanType === "unsure" ||
        principal <= 0 ||
        item.principalAlreadyInDebts === "yes" ||
        item.principalAlreadyInDebts === "no";
      const descriptionComplete =
        !hasValue || value === 0 || item.description.trim() !== "";
      const purposeComplete = !isInvestment || purpose !== "";
      const complete =
        descriptionComplete &&
        purposeComplete &&
        dividendsHaveAnswer &&
        principalHasAnswer;
      const label =
        item.description.trim() || otherAssetTypeLabel(item.type);
      let treatment = item.treatment;
      let includedValue = 0;
      let excludedValue = 0;
      let verificationValue = 0;

      if (!isInvestment || purpose === "") {
        // Older saved rows did not have an investment purpose. Preserve their
        // existing value treatment until the user chooses the new field.
        includedValue =
          item.treatment === "include" && descriptionComplete && hasValue
            ? value
            : 0;
        excludedValue =
          item.treatment === "exclude" && descriptionComplete && hasValue
            ? value
            : 0;
        verificationValue =
          item.treatment === "verify" && descriptionComplete && hasValue
            ? value
            : 0;
      } else if (purpose === "trade" || purpose === "includeFull") {
        treatment = "include";
        includedValue = descriptionComplete && hasValue ? value : 0;
      } else if (purpose === "longTerm") {
        if (hasValidPercentage) {
          treatment = "include";
          includedValue =
            descriptionComplete && hasValue ? (value * percentage) / 100 : 0;
          excludedValue =
            descriptionComplete && hasValue ? value - includedValue : 0;
        } else {
          treatment = "verify";
          verificationValue = descriptionComplete && hasValue ? value : 0;
        }
      } else if (purpose === "companyPays") {
        treatment = "exclude";
        excludedValue = descriptionComplete && hasValue ? value : 0;
      } else {
        treatment = "verify";
        verificationValue = descriptionComplete && hasValue ? value : 0;
      }

      const includedDividends =
        isInvestment &&
        dividends > 0 &&
        item.dividendsAlreadyInCash === "no"
          ? dividends
          : 0;
      const principalAlreadyEntered = item.principalAlreadyInDebts === "yes";
      const principalDeduction =
        isInvestment &&
        (loanType === "interestFree" || loanType === "conventional") &&
        item.principalAlreadyInDebts === "no"
          ? principal
          : 0;
      const interestNotDeducted =
        isInvestment && loanType === "conventional"
          ? Math.max(toNumber(item.interestDueWithinYear ?? ""), 0)
          : 0;

      return {
        id: item.id,
        label,
        value: descriptionComplete && hasValue ? value : 0,
        treatment,
        complete,
        hasValue,
        isInvestment,
        purpose,
        includedValue,
        excludedValue,
        verificationValue,
        includedDividends,
        loanType,
        principalDeduction,
        interestNotDeducted,
        hasConventionalLoan: isInvestment && loanType === "conventional",
        loanNeedsVerification: isInvestment && loanType === "unsure",
        principalAlreadyEntered,
      };
    },
  );
  const includedOtherAssetsValue = otherAssetSummaries.reduce(
    (total, item) => total + item.includedValue + item.includedDividends,
    0,
  );
  const excludedOtherAssetsValue = otherAssetSummaries.reduce(
    (total, item) => total + item.excludedValue,
    0,
  );
  const verificationOtherAssetsValue = otherAssetSummaries.reduce(
    (total, item) => total + item.verificationValue,
    0,
  );
  const includedInvestmentValue = otherAssetSummaries.reduce(
    (total, item) => total + (item.isInvestment ? item.includedValue : 0),
    0,
  );
  const includedInvestmentDividends = otherAssetSummaries.reduce(
    (total, item) => total + item.includedDividends,
    0,
  );
  const deductedInvestmentLoanPrincipal = otherAssetSummaries.reduce(
    (total, item) => total + item.principalDeduction,
    0,
  );
  const undeductedInvestmentInterest = otherAssetSummaries.reduce(
    (total, item) => total + item.interestNotDeducted,
    0,
  );
  const hasConventionalInvestmentLoan = otherAssetSummaries.some(
    (item) => item.hasConventionalLoan,
  );

  const baseMoneyTotal = hasMoney
    ? toNumber(cash) +
      toNumber(bank) +
      toNumber(savings) +
      toNumber(receivables)
    : 0;
  const moneyTotal = hasMoney
    ? baseMoneyTotal + foreignCurrencyTotalEur + includedOtherAssetsValue
    : includedOtherAssetsValue;
  const includedSecureReceivables = receivableRows.reduce((total, row) => {
    const amount = toNumber(row.amount);

    return row.status === "secure" && row.amount.trim() !== "" && amount >= 0
      ? total + amount
      : total;
  }, 0);
  const deductibleLiabilitiesFromRows = liabilityRows.reduce((total, row) => {
    const amount = toNumber(row.amountDueWithinYear);

    return row.amountDueWithinYear.trim() !== "" && amount >= 0
      ? total + amount
      : total;
  }, 0);

  const goldPureGrams = hasGold
    ? toNumber(gold24) +
      (toNumber(gold22) * 22) / 24 +
      (toNumber(gold21) * 21) / 24 +
      (toNumber(gold18) * 18) / 24 +
      (toNumber(gold14) * 14) / 24
    : 0;

  const goldValue = goldPureGrams * toNumber(goldPrice);

  const silverValue = hasSilver
    ? toNumber(silverGrams) * toNumber(silverPrice)
    : 0;

  const jewelrySummaries: JewelrySummary[] = hasPersonalJewelry
    ? jewelryItems.map((item) => {
        const weight = toNumber(item.weightGrams);
        const value =
          item.material === "Ari"
            ? weight *
              jewelryPurityFactors[item.purity] *
              toNumber(item.goldPrice24kPerGram)
            : weight * toNumber(item.silverPricePerGram);
        const label = `${materialLabel(item.material)} ${
          item.material === "Ari" ? item.purity : ""
        } ${weight.toFixed(2)} g`.trim();
        const category =
          item.purpose === "Kursim / ruajtje vlere" ||
          item.purpose === "Për tregti"
            ? "asset"
            : jewelryMethodology === "include"
              ? "includedPersonal"
              : jewelryMethodology === "exclude"
                ? "excludedPersonal"
                : "uncertain";

        return {
          id: item.id,
          label,
          value,
          category,
        };
      })
    : [];
  const includedPersonalJewelryValue = jewelrySummaries.reduce(
    (total, item) =>
      item.category === "includedPersonal" ? total + item.value : total,
    0,
  );
  const excludedPersonalJewelryValue = jewelrySummaries.reduce(
    (total, item) =>
      item.category === "excludedPersonal" ? total + item.value : total,
    0,
  );
  const uncertainJewelryValue = jewelrySummaries.reduce(
    (total, item) => (item.category === "uncertain" ? total + item.value : total),
    0,
  );
  const investmentTradeJewelryValue = jewelrySummaries.reduce(
    (total, item) => (item.category === "asset" ? total + item.value : total),
    0,
  );
  const zakatableJewelryValue =
    includedPersonalJewelryValue + investmentTradeJewelryValue;

  const businessInventorySummaries: BusinessInventorySummary[] =
    hasBusinessInventory
      ? businessInventoryItems.map((item) => {
          const value = toNumber(item.marketValue);
          const hasValue = item.marketValue.trim() !== "" && value >= 0;
          const complete =
            hasValue &&
            (value === 0 || item.description.trim() !== "") &&
            (item.type !== "Tjetër" || item.heldForResale !== "");
          const included =
            complete &&
            (item.type === "Mall për rishitje" ||
              item.type === "Lëndë e parë për produkt që do të shitet" ||
              item.type === "Produkt i përfunduar për shitje" ||
              item.type === "Tokë / pronë e blerë vetëm për rishitje" ||
              (item.type === "Tjetër" && item.heldForResale === "yes"));
          const label = item.description.trim() || item.type;

          return {
            id: item.id,
            label,
            value: complete ? value : 0,
            included,
            complete,
          };
        })
      : [];
  const includedBusinessInventoryValue = businessInventorySummaries.reduce(
    (total, item) => (item.included ? total + item.value : total),
    0,
  );

  const cryptoValue = hasCrypto ? toNumber(cryptoMarketValue) : 0;
  const cryptoIncludedValue =
    hasCrypto && cryptoMethodology === "include" ? cryptoValue : 0;
  const cryptoVerificationValue =
    hasCrypto && cryptoMethodology !== "include" ? cryptoValue : 0;

  const tradeLivestockValue = hasLivestock
    ? livestockGroups.reduce(
        (total, group) =>
          toNumber(group.tradeCount) > 0
            ? total + toNumber(group.tradeMarketValue)
            : total,
        0,
      )
    : 0;
  const isCountablePhysicalLivestockGroup = (group: LivestockGroup) =>
    isStandardLivestockAnimal(group.animal) &&
    toNumber(group.grazingCount) > 0 &&
    (group.grazesMostYear === "yes" ||
      (group.grazesMostYear === "no" &&
        fedLivestockMethodology === "maliki"));
  const fedLivestockIncludedByMaliki =
    hasLivestock &&
    fedLivestockMethodology === "maliki" &&
    livestockGroups.some(
      (group) =>
        isStandardLivestockAnimal(group.animal) &&
        toNumber(group.grazingCount) > 0 &&
        group.grazesMostYear === "no",
    );
  const fedLivestockMajorityExcluded =
    hasLivestock &&
    fedLivestockMethodology === "majority" &&
    livestockGroups.some(
      (group) =>
        isStandardLivestockAnimal(group.animal) &&
        toNumber(group.grazingCount) > 0 &&
        group.grazesMostYear === "no",
    );
  const fedLivestockRequiresMethodology =
    hasLivestock &&
    livestockGroups.some(
      (group) =>
        isStandardLivestockAnimal(group.animal) &&
        toNumber(group.grazingCount) > 0 &&
        group.grazesMostYear === "no",
    );
  const fedLivestockMethodologyLabel =
    fedLivestockMethodology === "majority"
      ? "Shumica sunite"
      : fedLivestockMethodology === "maliki"
        ? "Maliki"
        : "Nuk jam i sigurt";

  const grazingSheepGoatTotal = hasLivestock
    ? livestockGroups.reduce(
        (total, group) =>
          (group.animal === "Dele" || group.animal === "Dhi") &&
          isCountablePhysicalLivestockGroup(group)
            ? total + toNumber(group.grazingCount)
            : total,
        0,
      )
    : 0;
  const grazingSheepTotal = hasLivestock
    ? livestockGroups.reduce(
        (total, group) =>
          group.animal === "Dele" &&
          isCountablePhysicalLivestockGroup(group)
            ? total + toNumber(group.grazingCount)
            : total,
        0,
      )
    : 0;
  const grazingGoatTotal = hasLivestock
    ? livestockGroups.reduce(
        (total, group) =>
          group.animal === "Dhi" &&
          isCountablePhysicalLivestockGroup(group)
            ? total + toNumber(group.grazingCount)
            : total,
        0,
      )
    : 0;
  const grazingCattleBuffaloTotal = hasLivestock
    ? livestockGroups.reduce(
        (total, group) =>
          (group.animal === "Lopë" || group.animal === "Buaj") &&
          isCountablePhysicalLivestockGroup(group)
            ? total + toNumber(group.grazingCount)
            : total,
        0,
      )
    : 0;
  const grazingCattleTotal = hasLivestock
    ? livestockGroups.reduce(
        (total, group) =>
          group.animal === "Lopë" &&
          isCountablePhysicalLivestockGroup(group)
            ? total + toNumber(group.grazingCount)
            : total,
        0,
      )
    : 0;
  const grazingBuffaloTotal = hasLivestock
    ? livestockGroups.reduce(
        (total, group) =>
          group.animal === "Buaj" &&
          isCountablePhysicalLivestockGroup(group)
            ? total + toNumber(group.grazingCount)
            : total,
        0,
      )
    : 0;
  const grazingCamelTotal = hasLivestock
    ? livestockGroups.reduce(
        (total, group) =>
          group.animal === "Deve" &&
          isCountablePhysicalLivestockGroup(group)
            ? total + toNumber(group.grazingCount)
            : total,
        0,
      )
    : 0;
  const verificationLivestockCount = hasLivestock
    ? livestockGroups.reduce(
        (total, group) =>
          toNumber(group.grazingCount) > 0 &&
          (group.animal === "Tjetër" ||
            (group.grazesMostYear === "no" &&
              fedLivestockMethodology === "unsure"))
            ? total + toNumber(group.grazingCount)
            : total,
        0,
      )
    : 0;
  const verificationLivestockSummary = hasLivestock
    ? livestockGroups
        .filter(
          (group) =>
            toNumber(group.grazingCount) > 0 &&
            (group.animal === "Tjetër" ||
              (group.grazesMostYear === "no" &&
                fedLivestockMethodology === "unsure")),
        )
        .map(
          (group) => {
            const animal =
              group.animal === "Tjetër"
                ? group.otherAnimal || t("common.other")
                : livestockAnimalLabel(group.animal) || t("livestock.noType");
            return `${animal}: ${toNumber(group.grazingCount)}`;
          },
        )
        .join(", ")
    : "";
  const sheepGoatZakatDue =
    calculateSheepGoatZakatDue(grazingSheepGoatTotal);
  const sheepGoatZakatText =
    grazingSheepGoatTotal < 40
      ? t("livestock.noSheepGoatZakat")
      : t("livestock.sheepGoatZakat", {
          count: sheepGoatZakatDue,
          total: grazingSheepGoatTotal,
        });
  const cattleBuffaloPhysicalZakatText = calculateCattleBuffaloZakatText(
    grazingCattleBuffaloTotal,
    language,
    t("livestock.noCattleZakat"),
  );
  const camelPhysicalZakatText = calculateCamelZakatText(
    grazingCamelTotal,
    language,
    t("livestock.noCamelZakat"),
  );
  const livestockCountLabel = fedLivestockIncludedByMaliki
    ? t("livestock.countableAnimals")
    : t("report.grazingAnimals");
  const sheepGoatSummaryLabel = fedLivestockIncludedByMaliki
    ? t("summary.sheepGoatsCountable")
    : t("summary.sheepGoats");
  const sheepGoatZakatLabel = fedLivestockIncludedByMaliki
    ? t("summary.sheepGoatZakatCountable")
    : t("summary.sheepGoatZakat");
  const cattleBuffaloSummaryLabel = fedLivestockIncludedByMaliki
    ? t("summary.cattleBuffaloCountable")
    : t("summary.cattleBuffalo");
  const cattleBuffaloZakatLabel = fedLivestockIncludedByMaliki
    ? t("summary.cattleBuffaloZakatCountable")
    : t("summary.cattleBuffaloZakat");
  const camelSummaryLabel = fedLivestockIncludedByMaliki
    ? t("summary.camelsCountable")
    : t("summary.camels");
  const camelZakatLabel = fedLivestockIncludedByMaliki
    ? t("summary.camelZakatCountable")
    : t("summary.camelZakat");
  const livestockReportTitle = fedLivestockIncludedByMaliki
    ? t("report.livestockCountableTitle")
    : t("report.livestockTitle");
  const cropSummaries = hasCrops
    ? cropGroups.map((group) => cropSummaryForGroup(group, language))
    : [];

  const totalAssets =
    moneyTotal +
    goldValue +
    silverValue +
    cryptoIncludedValue +
    tradeLivestockValue +
    zakatableJewelryValue +
    includedBusinessInventoryValue;
  const deductibleLiabilities =
    deductibleLiabilitiesFromRows + deductedInvestmentLoanPrincipal;
  const netAssets = Math.max(
    totalAssets + includedSecureReceivables - deductibleLiabilities,
    0,
  );

  const goldNisabPrice = toNumber(goldPrice);
  const silverNisabPrice = toNumber(silverPrice);
  const manualNisabValue = toNumber(nisab);
  const calculatedNisabEur = calculateNisabValue({
    basis: nisabBasis,
    goldPrice: goldNisabPrice,
    silverPrice: silverNisabPrice,
    manualValue: manualNisabValue,
  });
  const nisabIsValid = calculatedNisabEur > 0;
  const reachedNisab = nisabIsValid && netAssets >= calculatedNisabEur;
  const nisabFormulaText =
    nisabBasis === "Ari" && goldNisabPrice > 0
      ? `85 g × ${goldNisabPrice.toFixed(2)} EUR/g = ${money(calculatedNisabEur, "EUR")}`
      : nisabBasis === "Argjendi" && silverNisabPrice > 0
        ? `595 g × ${silverNisabPrice.toFixed(2)} EUR/g = ${money(calculatedNisabEur, "EUR")}`
        : "";
  const nisabBasisSummary =
    nisabBasis === "Ari"
      ? t("nisab.goldSummary")
      : nisabBasis === "Argjendi"
        ? t("nisab.silverSummary")
        : t("nisab.manual");
  const lunarYearConfirmed = lunarYearStatus === "yes";
  const zakat = reachedNisab && lunarYearConfirmed ? netAssets * 0.025 : 0;
  const lunarYearLabel =
    lunarYearStatus === "yes"
      ? t("common.yes")
      : lunarYearStatus === "no"
        ? t("common.no")
        : lunarYearStatus === "unsure"
          ? t("common.unsure")
          : t("summary.needsCompletion");
  const monetaryStatus =
    !nisabIsValid || !lunarYearConfirmed
      ? t("status.incomplete")
      : reachedNisab
        ? t("status.above")
        : t("status.below");
  const monetaryZakatResult =
    !nisabIsValid || !lunarYearConfirmed ? "—" : money(zakat, currency);
  const calculationDateText =
    formatDateInputValue(calculationDate, language) ||
    t("calculationDate.notSaved");
  const showFinalMonetaryZakat = nisabIsValid && lunarYearConfirmed;
  const monetaryZakatPaidTotal = monetaryZakatPayments.reduce((total, payment) => {
    const amount = toNumber(payment.amount);

    return payment.amount.trim() !== "" && amount > 0 ? total + amount : total;
  }, 0);
  const monetaryZakatRemaining = Math.max(zakat - monetaryZakatPaidTotal, 0);
  const monetaryZakatPaymentsExceed =
    showFinalMonetaryZakat && monetaryZakatPaidTotal > zakat;
  const plannedMonetaryZakatTotal = plannedMonetaryZakatPayments.reduce(
    (total, payment) => {
      const amount = toNumber(payment.amount);

      return payment.amount.trim() !== "" && amount > 0
        ? total + amount
        : total;
    },
    0,
  );
  const plannedMonetaryZakatPaymentsExceed =
    showFinalMonetaryZakat &&
    plannedMonetaryZakatTotal > monetaryZakatRemaining;
  const plannedAllocationTotal = plannedZakatAllocations.reduce(
    (total, allocation) => {
      const amount = toNumber(allocation.amount);

      return allocation.amount.trim() !== "" && amount > 0
        ? total + amount
        : total;
    },
    0,
  );
  const plannedAllocationRemaining = Math.max(zakat - plannedAllocationTotal, 0);
  const plannedAllocationExceeds =
    showFinalMonetaryZakat && plannedAllocationTotal > zakat;
  const allocationVerificationCategories: ZakatAllocationCategory[] = [
    "administrators",
    "hearts",
    "slavery",
    "cause",
  ];
  const positivePlannedZakatAllocations = plannedZakatAllocations.filter(
    (allocation) => toNumber(allocation.amount) > 0,
  );
  const reportCropSummaries = cropSummaries.filter(
    (summary) => summary.cropName !== "Pa lloj" || summary.quantityKg > 0,
  );
  const reportVerificationItems = [
    ...(verificationLivestockSummary
      ? [`${t("report.livestockVerification")}: ${verificationLivestockSummary}`]
      : []),
    ...reportCropSummaries
      .filter(
        (summary) =>
          !summary.calculated &&
          (summary.message.toLowerCase().includes("verifikim") ||
            summary.message.toLowerCase().includes("paqart") ||
            summary.message.toLowerCase().includes("verification") ||
            summary.message.toLowerCase().includes("unclear")),
      )
      .map(
        (summary) =>
          `${summary.cropName}: ${summary.message || t("report.needsCheck")}`,
      ),
    ...(uncertainJewelryValue > 0
      ? [
          `${t("report.jewelryVerification")}: ${money(
            uncertainJewelryValue,
            currency,
          )}`,
        ]
      : []),
    ...(cryptoVerificationValue > 0
      ? [
          cryptoMethodology === "unsure"
            ? `${t("report.cryptoVerification")}: ${money(
                cryptoVerificationValue,
                currency,
              )} — ${t("crypto.unsureWarning")}`
            : `${t("report.cryptoVerification")}: ${money(
                cryptoVerificationValue,
                currency,
              )}`,
        ]
      : []),
    ...(verificationOtherAssetsValue > 0
      ? [
          `${t("report.otherAssetsVerification")}: ${money(
            verificationOtherAssetsValue,
            currency,
          )}`,
        ]
      : []),
    ...(hasConventionalInvestmentLoan
      ? [t("readiness.issue.investmentLoanInterest")]
      : []),
    ...(otherAssetSummaries.some((item) => item.loanNeedsVerification)
      ? [t("readiness.issue.investmentLoanUnsure")]
      : []),
  ];
  const jewelryMethodologyReportLabel =
    jewelryMethodology === "include"
      ? t("methodology.included")
      : jewelryMethodology === "exclude"
        ? t("methodology.excluded")
        : t("methodology.needsMethodology");
  const fedLivestockMethodologyReportLabel =
    fedLivestockMethodology === "unsure"
      ? t("methodology.needsVerification")
      : fedLivestockMethodologyLabel;
  const cryptoMethodologyReportLabel =
    cryptoMethodology === "include"
      ? t("methodology.included")
      : t("methodology.needsVerification");
  const cropIrrigationReportItems = reportCropSummaries.map(
    (summary) => `${summary.cropName}: ${summary.irrigationLabel}`,
  );
  const methodologyReportItems = [
    {
      label: t("summary.nisabBasis"),
      value: nisabBasisSummary,
    },
    ...(hasPersonalJewelry
      ? [
          {
            label: t("jewelry.title"),
            value: jewelryMethodologyReportLabel,
          },
        ]
      : []),
    ...(hasLivestock
      ? [
          {
            label: t("livestock.fedMethodologyShortTitle"),
            value: fedLivestockMethodologyReportLabel,
          },
        ]
      : []),
    ...(hasCrypto
      ? [
          {
            label: t("crypto.title"),
            value: cryptoMethodologyReportLabel,
          },
        ]
      : []),
    ...(hasCrops && cropIrrigationReportItems.length > 0
      ? [
          {
            label: t("methodology.cropsIrrigation"),
            value: cropIrrigationReportItems.join("; "),
          },
        ]
      : []),
  ];
  const warningLabel =
    language === "en" ? "Required field" : "Fushë obligative";
  const inactiveSummary =
    language === "en"
      ? "Activate if you have assets in this category"
      : "Aktivizo nëse keni pasuri të kësaj kategorie";
  const groupsLabel = language === "en" ? "groups" : "grupe";
  const cropsLabel = language === "en" ? "crops" : "të korra";
  const savedLabel =
    language === "en" ? "saved calculations" : "llogaritje të ruajtura";
  const moneySectionSummary = money(baseMoneyTotal, currency);
  const fxSectionSummary = hasForeignCurrencies
    ? money(foreignCurrencyTotalEur, currency)
    : inactiveSummary;
  const metalsSectionSummary = money(
    goldValue + silverValue,
    currency,
  );
  const jewelrySectionSummary = hasPersonalJewelry
    ? money(
        zakatableJewelryValue + excludedPersonalJewelryValue + uncertainJewelryValue,
        currency,
      )
    : inactiveSummary;
  const cryptoSectionSummary = hasCrypto
    ? money(cryptoIncludedValue + cryptoVerificationValue, currency)
    : inactiveSummary;
  const debtsSectionSummary = money(deductibleLiabilities, currency);
  const inventorySectionSummary = hasBusinessInventory
    ? money(includedBusinessInventoryValue, currency)
    : inactiveSummary;
  const otherAssetsSectionSummary =
    otherAssetItems.length > 0
      ? money(
          includedOtherAssetsValue +
            excludedOtherAssetsValue +
            verificationOtherAssetsValue,
          currency,
        )
      : inactiveSummary;
  const livestockSectionSummary = hasLivestock
    ? `${livestockGroups.length} ${groupsLabel}`
    : inactiveSummary;
  const cropSectionSummary = hasCrops
    ? `${cropGroups.length} ${cropsLabel}`
    : inactiveSummary;
  const nisabSectionSummary = nisabIsValid
    ? money(calculatedNisabEur, "EUR")
    : t("summary.needsCompletion");
  const savedSectionSummary = `${savedCalculations.length} ${savedLabel}`;
  const reportSectionSummary = monetaryZakatResult;
  const fxSectionHasWarning =
    hasForeignCurrencies &&
    foreignCurrencySummaries.some((summary) => !summary.isValid);
  const metalsSectionHasWarning =
    hasGold && goldType === "jewelry";
  const jewelrySectionHasWarning =
    hasPersonalJewelry &&
    (jewelryMethodology === "unsure" || uncertainJewelryValue > 0);
  const cryptoSectionHasWarning =
    hasCrypto && cryptoMethodology !== "include" && toNumber(cryptoMarketValue) > 0;
  const debtsSectionHasWarning = receivableRows.some(
    (row) => row.status === "doubtful" && toNumber(row.amount) > 0,
  );
  const inventorySectionHasWarning =
    hasBusinessInventory &&
    businessInventorySummaries.some((summary) => !summary.complete);
  const otherAssetsSectionHasWarning =
    otherAssetSummaries.some((summary) => !summary.complete) ||
    verificationOtherAssetsValue > 0 ||
    hasConventionalInvestmentLoan ||
    otherAssetSummaries.some(
      (summary) =>
        summary.loanNeedsVerification ||
        summary.purpose === "unsure" ||
        (summary.purpose === "longTerm" && summary.treatment === "verify"),
    );
  const livestockSectionHasWarning =
    hasLivestock &&
    (fedLivestockRequiresMethodology || verificationLivestockCount > 0);
  const cropSectionHasWarning =
    hasCrops &&
    cropSummaries.some(
      (summary) =>
        !summary.calculated &&
        (summary.message.toLowerCase().includes("verifikim") ||
          summary.message.toLowerCase().includes("paqart") ||
          summary.message.toLowerCase().includes("verification") ||
          summary.message.toLowerCase().includes("unclear")),
    );
  const nisabSectionHasWarning = !nisabIsValid || !lunarYearConfirmed;
  const reportSectionHasWarning = reportVerificationItems.length > 0;
  const hasEnteredGoldWeight =
    toNumber(gold24) > 0 ||
    toNumber(gold22) > 0 ||
    toNumber(gold21) > 0 ||
    toNumber(gold18) > 0 ||
    toNumber(gold14) > 0;
  const readinessCompletionIssues: ReadinessIssue[] = [
    ...(!nisabIsValid
      ? [
          {
            id: "nisab-value",
            text: t("readiness.issue.nisab"),
            sectionId: "section-nisab" as const,
          },
        ]
      : []),
    ...(!lunarYearConfirmed
      ? [
          {
            id: "lunar-year",
            text: t("readiness.issue.lunarYear"),
            sectionId: "section-nisab" as const,
          },
        ]
      : []),
    ...(hasMoney &&
    hasForeignCurrencies &&
    foreignCurrencyRows.some((row) => {
      const hasAnyEntry =
        row.amount.trim() !== "" ||
        row.exchangeRateToEur.trim() !== "" ||
        row.currency !== "" ||
        row.otherCurrency.trim() !== "";
      const amount = toNumber(row.amount);
      const rate = row.currency === currency ? 1 : toNumber(row.exchangeRateToEur);

      return (
        hasAnyEntry &&
        (row.amount.trim() === "" ||
          amount <= 0 ||
          row.currency === "" ||
          (row.currency === "Tjetër" && row.otherCurrency.trim() === "") ||
          (row.currency !== currency &&
            (row.exchangeRateToEur.trim() === "" || rate <= 0)))
      );
    })
      ? [
          {
            id: "foreign-currency-row",
            text: t("readiness.issue.fx"),
            sectionId: "section-fx" as const,
          },
        ]
      : []),
    ...(hasGold && (!hasEnteredGoldWeight || goldNisabPrice <= 0)
      ? [
          {
            id: "gold-fields",
            text: t("readiness.issue.gold"),
            sectionId: "section-metals" as const,
          },
        ]
      : []),
    ...(hasSilver && (toNumber(silverGrams) <= 0 || silverNisabPrice <= 0)
      ? [
          {
            id: "silver-fields",
            text: t("readiness.issue.silver"),
            sectionId: "section-metals" as const,
          },
        ]
      : []),
    ...(hasPersonalJewelry &&
    jewelryItems.some((item) => {
      const weight = toNumber(item.weightGrams);
      const price =
        item.material === "Ari"
          ? toNumber(item.goldPrice24kPerGram)
          : toNumber(item.silverPricePerGram);

      return weight <= 0 || price <= 0;
    })
      ? [
          {
            id: "jewelry-fields",
            text: t("readiness.issue.jewelryFields"),
            sectionId: "section-jewelry" as const,
          },
        ]
      : []),
    ...(hasCrypto && toNumber(cryptoMarketValue) <= 0
      ? [
          {
            id: "crypto-value",
            text: t("readiness.issue.cryptoValue"),
            sectionId: "section-crypto" as const,
          },
        ]
      : []),
    ...(hasBusinessInventory &&
    businessInventorySummaries.some((summary) => !summary.complete)
      ? [
          {
            id: "inventory-fields",
            text: t("readiness.issue.inventory"),
            sectionId: "section-inventory" as const,
          },
        ]
      : []),
    ...(otherAssetItems.some((item) => {
      const hasDescriptionIssue =
        toNumber(item.currentValue) > 0 && item.description.trim() === "";
      const hasDividendAnswerIssue =
        (item.type === "stocks" || item.type === "businessParticipation") &&
        toNumber(item.dividendsHeld ?? "") > 0 &&
        item.dividendsAlreadyInCash !== "yes" &&
        item.dividendsAlreadyInCash !== "no";
      const hasPrincipalAnswerIssue =
        (item.loanType === "interestFree" ||
          item.loanType === "conventional") &&
        toNumber(item.principalDueWithinYear ?? "") > 0 &&
        item.principalAlreadyInDebts !== "yes" &&
        item.principalAlreadyInDebts !== "no";

      return (
        hasDescriptionIssue ||
        hasDividendAnswerIssue ||
        hasPrincipalAnswerIssue
      );
    })
      ? [
          {
            id: "other-assets-fields",
            text: t("readiness.issue.otherAssets"),
            sectionId: "section-other-assets" as const,
          },
        ]
      : []),
    ...(otherAssetItems.some(
      (item) =>
        (item.type === "stocks" || item.type === "businessParticipation") &&
        !item.investmentPurpose,
    )
      ? [
          {
            id: "investment-purpose",
            text: t("readiness.issue.investmentPurpose"),
            sectionId: "section-other-assets" as const,
          },
        ]
      : []),
    ...(hasLivestock &&
    livestockGroups.some(
      (group) => toNumber(group.tradeCount) > 0 && toNumber(group.tradeMarketValue) <= 0,
    )
      ? [
          {
            id: "livestock-trade-value",
            text: t("readiness.issue.tradeLivestock"),
            sectionId: "section-livestock" as const,
          },
        ]
      : []),
    ...(hasLivestock &&
    livestockGroups.some(
      (group) =>
        toNumber(group.grazingCount) > 0 &&
        (group.animal === "" || group.grazesMostYear === ""),
    )
      ? [
          {
            id: "livestock-grazing-fields",
            text: t("readiness.issue.grazingLivestock"),
            sectionId: "section-livestock" as const,
          },
        ]
      : []),
    ...(hasCrops &&
    cropGroups.some((group) => {
      const hasQuantity = group.quantityKg.trim() !== "" && toNumber(group.quantityKg) > 0;

      return (
        hasQuantity &&
        (toNumber(group.nisabKg) <= 0 || group.irrigation === "" || group.crop === "")
      );
    })
      ? [
          {
            id: "crop-fields",
            text: t("readiness.issue.crops"),
            sectionId: "section-crops" as const,
          },
        ]
      : []),
  ];
  const readinessVerificationIssues: ReadinessIssue[] = [
    ...(otherAssetItems.some((item) => {
      if (
        (item.type !== "stocks" && item.type !== "businessParticipation") ||
        item.investmentPurpose !== "longTerm"
      ) {
        return false;
      }

      const percentageText = item.zakatableAssetsPercentage ?? "";
      const percentage = toNumber(percentageText);

      return (
        percentageText.trim() === "" ||
        !Number.isFinite(Number(percentageText)) ||
        percentage < 0 ||
        percentage > 100
      );
    })
      ? [
          {
            id: "investment-percentage",
            text: t("readiness.issue.investmentPercentage"),
            sectionId: "section-other-assets" as const,
          },
        ]
      : []),
    ...(hasConventionalInvestmentLoan
      ? [
          {
            id: "investment-loan-interest",
            text: t("readiness.issue.investmentLoanInterest"),
            sectionId: "section-other-assets" as const,
          },
        ]
      : []),
    ...(otherAssetSummaries.some((item) => item.loanNeedsVerification)
      ? [
          {
            id: "investment-loan-unsure",
            text: t("readiness.issue.investmentLoanUnsure"),
            sectionId: "section-other-assets" as const,
          },
        ]
      : []),
    ...(otherAssetSummaries.some(
      (item) => item.principalAlreadyEntered && item.value >= 0 &&
        toNumber(
          otherAssetItems.find((asset) => asset.id === item.id)
            ?.principalDueWithinYear ?? "",
        ) > 0,
    )
      ? [
          {
            id: "investment-principal-duplicate",
            text: t("readiness.issue.investmentPrincipalDuplicate"),
            sectionId: "section-other-assets" as const,
          },
        ]
      : []),
    ...(hasCrypto && cryptoMethodology !== "include"
      ? [
          {
            id: "crypto-methodology",
            text: t("readiness.issue.cryptoMethodology"),
            sectionId: "section-crypto" as const,
          },
        ]
      : []),
    ...(hasPersonalJewelry && jewelryMethodology === "unsure"
      ? [
          {
            id: "jewelry-methodology",
            text: t("readiness.issue.jewelryMethodology"),
            sectionId: "section-jewelry" as const,
          },
        ]
      : []),
    ...(hasLivestock &&
    fedLivestockMethodology === "unsure" &&
    fedLivestockRequiresMethodology
      ? [
          {
            id: "fed-livestock-methodology",
            text: t("readiness.issue.fedLivestock"),
            sectionId: "section-livestock" as const,
          },
        ]
      : []),
    ...(hasLivestock &&
    livestockGroups.some(
      (group) =>
        group.animal === "Tjetër" &&
        (toNumber(group.grazingCount) > 0 || toNumber(group.tradeCount) > 0),
    )
      ? [
          {
            id: "other-livestock",
            text: t("readiness.issue.otherLivestock"),
            sectionId: "section-livestock" as const,
          },
        ]
      : []),
    ...(hasCrops &&
    cropGroups.some(
      (group) => group.crop === "Tjetër" && toNumber(group.quantityKg) > 0,
    )
      ? [
          {
            id: "other-crop",
            text: t("readiness.issue.otherCrop"),
            sectionId: "section-crops" as const,
          },
        ]
      : []),
    ...(hasCrops &&
    cropGroups.some(
      (group) => group.irrigation === "unsure" && toNumber(group.quantityKg) > 0,
    )
      ? [
          {
            id: "unclear-irrigation",
            text: t("readiness.issue.unclearIrrigation"),
            sectionId: "section-crops" as const,
          },
        ]
      : []),
    ...(debtsSectionHasWarning
      ? [
          {
            id: "doubtful-receivables",
            text: t("readiness.issue.doubtfulReceivables"),
            sectionId: "section-debts" as const,
          },
        ]
      : []),
    ...(otherAssetSummaries.some(
      (summary) =>
        summary.purpose === "unsure" ||
        (summary.verificationValue > 0 &&
          (!summary.isInvestment || summary.purpose !== "")),
    )
      ? [
          {
            id: "other-assets-methodology",
            text: t("readiness.issue.otherAssetsMethodology"),
            sectionId: "section-other-assets" as const,
          },
        ]
      : []),
    ...(hasGold && goldType === "jewelry" && hasEnteredGoldWeight
      ? [
          {
            id: "gold-jewelry-methodology",
            text: t("readiness.issue.goldJewelry"),
            sectionId: "section-metals" as const,
          },
        ]
      : []),
  ];
  const readinessStatus =
    readinessVerificationIssues.length > 0
      ? "verification"
      : readinessCompletionIssues.length > 0
        ? "incomplete"
        : "ready";
  const readinessStatusLabel =
    readinessStatus === "ready"
      ? t("readiness.status.ready")
      : readinessStatus === "incomplete"
        ? t("readiness.status.incomplete")
        : t("readiness.status.verification");
  const readinessStatusClass =
    readinessStatus === "ready"
      ? "bg-emerald-100 text-emerald-950 ring-emerald-200"
      : readinessStatus === "incomplete"
        ? "bg-amber-100 text-amber-950 ring-amber-200"
        : "bg-rose-100 text-rose-950 ring-rose-200";
  const readinessIssueGroups = [
    {
      id: "completion",
      title: t("readiness.group.completion"),
      issues: readinessCompletionIssues,
    },
    {
      id: "verification",
      title: t("readiness.group.verification"),
      issues: readinessVerificationIssues,
    },
  ].filter((group) => group.issues.length > 0);

  return (
    <main className={`${styles.shell} ${isSimpleMode ? styles.simpleMode : ""} min-h-screen px-4 py-6 text-slate-900 sm:px-6 md:py-10`}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.brand} aria-label={t("brand.homeAria")}>
            <span className={styles.brandMark} aria-hidden="true">Z</span>
            <span>
              <strong>Zekat</strong>
              <small>{t("brand.tagline")}</small>
            </span>
          </Link>

          <nav className={styles.topActions} aria-label={t("nav.primaryAria")}>
            <Link href="/" className={styles.navLink}>
              {t("nav.back")}
            </Link>
            <Link href="/kalkulo?mode=full" className={styles.accountLink}>
              {t("nav.fullCalculation")}
            </Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroOrnament} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true">✓</span>
              {t("hero.kicker")}
            </p>

            <h1 className={styles.heroTitle}>{t("hero.title")}</h1>

            <p className={styles.heroDescription}>{t("hero.description")}</p>

            <p className={styles.modeNotice}>
              {t(isSimpleMode ? "hero.simpleMode" : "hero.fullMode")}
            </p>

            {isSimpleMode && (
              <Link href="/kalkulo?mode=full" className={styles.upgradeLink}>
                {t("hero.openFull")}
              </Link>
            )}

            <div className={styles.trustRow} aria-label={t("hero.featuresAria")}>
              <span>{t("hero.feature.clear")}</span>
              <span>{t("hero.feature.secure")}</span>
              <span>{t("hero.feature.steps")}</span>
            </div>
          </div>

          <div className={styles.heroControlCard}>
            <div className={styles.controlCardHeader}>
              <span className={styles.controlIcon} aria-hidden="true">01</span>
              <div>
                <p>{t("preferences.title")}</p>
                <strong>{t("preferences.start")}</strong>
              </div>
            </div>

            <label className={styles.languageControl}>
              {t("language.label")}
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as CalculatorLanguage)
                }
              >
                <option value="sq">{t("language.sq")}</option>
                <option value="en">{t("language.en")}</option>
              </select>
            </label>

            <p className={styles.privacyNote}>
              <span aria-hidden="true">●</span>
              {t("privacy.device")}
            </p>
          </div>
        </section>

        <section className={`${styles.infoCard} mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm`}>
          <h2 className="text-lg font-bold text-slate-950">
            {t("usageGuide.title")}
          </h2>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            <li>1. {t("usageGuide.step1")}</li>
            <li>2. {t("usageGuide.step2")}</li>
            <li>3. {t("usageGuide.step3")}</li>
          </ol>
          <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-900">
            {t("usageGuide.note")}
          </p>
        </section>

        <section className={`${styles.dateCard} mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100`}>
          <h2 className="text-lg font-bold text-slate-950">
            {t("calculationDate.title")}
          </h2>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            {t("calculationDate.label")}
            <input
              type="date"
              value={calculationDate}
              onChange={(event) => setCalculationDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 sm:max-w-xs"
            />
          </label>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {t("calculationDate.helper")}
          </p>
        </section>

        <section className={`${styles.installCard} mt-6 rounded-2xl border border-emerald-200 bg-emerald-700 p-5 text-emerald-50 shadow-sm print:hidden`}>
          <h2 className="text-lg font-bold">{t("install.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-emerald-50">
            {t("install.text")}
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-50">
            <li>{t("install.android")}</li>
            <li>{t("install.iphone")}</li>
          </ul>
          <p className="mt-3 rounded-xl bg-emerald-900/30 px-3 py-2 text-sm leading-6 text-emerald-50">
            {t("install.offlineNote")}
          </p>
          <Link
            href="/instalo"
            className="mt-4 inline-flex rounded-xl bg-amber-200 px-4 py-2.5 text-sm font-black text-slate-900 transition hover:bg-white"
          >
            {t("install.open")}
          </Link>
        </section>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("main-result-summary")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="mt-4 w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-900 sm:w-auto"
        >
          {t("summary.jump")}
        </button>

        <button
          type="button"
          onClick={() => setIsResetConfirmOpen(true)}
          className="mt-3 w-full rounded-xl border border-emerald-700 bg-white px-4 py-3 text-sm font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 sm:ml-3 sm:w-auto"
        >
          {t("reset.startNew")}
        </button>

        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5 py-8 print:hidden">
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-emerald-100"
            >
              <p className="text-base font-semibold leading-7 text-slate-900">
                {t("reset.confirm")}
              </p>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 sm:w-auto"
                >
                  {t("reset.cancelButton")}
                </button>

                <button
                  type="button"
                  onClick={resetCurrentCalculation}
                  className="w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-900 sm:w-auto"
                >
                  {t("reset.confirmButton")}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="space-y-5">
            <div id="section-inventory" className="scroll-mt-6">
              <CollapsibleCard
                title={t("inventory.title")}
                description={t("inventory.helper")}
                summary={inventorySectionSummary}
                hasWarning={inventorySectionHasWarning}
                warningLabel={warningLabel}
              >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {t("inventory.title")}
                  </h2>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={hasBusinessInventory}
                    onChange={(event) =>
                      setHasBusinessInventory(event.target.checked)
                    }
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">{t("common.activate")}</span>
                </label>
              </div>

              {hasBusinessInventory && (
                <div className="mt-5 space-y-4">
                  <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                    {t("inventory.reminder")}
                  </p>

                  {businessInventoryItems.map((item, index) => {
                    const summary = businessInventorySummaries.find(
                      (entry) => entry.id === item.id,
                    );
                    const isExcluded =
                      summary?.complete === true && summary.included === false;

                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-emerald-100 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-semibold">
                            {t("inventory.item", { index: index + 1 })}
                          </h3>

                          <button
                            type="button"
                            onClick={() => removeBusinessInventoryItem(item.id)}
                            className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                          >
                            {t("common.remove")}
                          </button>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <label className="block text-sm font-semibold text-slate-700">
                            {t("inventory.type")}
                            <select
                              value={item.type}
                              onChange={(event) =>
                                updateBusinessInventoryItem(item.id, {
                                  type: event.target
                                    .value as BusinessInventoryType,
                                  heldForResale:
                                    event.target.value === "Tjetër"
                                      ? item.heldForResale
                                      : "",
                                })
                              }
                              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                            >
                              <option value="Mall për rishitje">
                                {t("inventory.resaleGoods")}
                              </option>
                              <option value="Lëndë e parë për produkt që do të shitet">
                                {t("inventory.rawMaterial")}
                              </option>
                              <option value="Produkt i përfunduar për shitje">
                                {t("inventory.finishedGoods")}
                              </option>
                              <option value="Tokë / pronë e blerë vetëm për rishitje">
                                {t("inventory.resaleProperty")}
                              </option>
                              <option value="Tjetër">{t("common.other")}</option>
                            </select>
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("common.description")}
                            <input
                              type="text"
                              required={toNumber(item.marketValue) > 0}
                              value={item.description}
                              onChange={(event) =>
                                updateBusinessInventoryItem(item.id, {
                                  description: event.target.value,
                                })
                              }
                              placeholder={t("inventory.descriptionPlaceholder")}
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("inventory.marketValue", { currency })}
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.marketValue}
                              onChange={(event) =>
                                updateBusinessInventoryItem(item.id, {
                                  marketValue: event.target.value,
                                })
                              }
                              placeholder="0.00"
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          {item.type === "Tjetër" && (
                            <label className="block text-sm font-semibold text-slate-700">
                              {t("inventory.heldForResale")}
                              <select
                                required
                                value={item.heldForResale}
                                onChange={(event) =>
                                  updateBusinessInventoryItem(item.id, {
                                    heldForResale: event.target
                                      .value as ResaleStatus,
                                  })
                                }
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                              >
                                <option value="">{t("common.choose")}</option>
                                <option value="yes">{t("common.yes")}</option>
                                <option value="no">{t("common.no")}</option>
                                <option value="unsure">
                                  {t("common.unsure")}
                                </option>
                              </select>
                            </label>
                          )}

                          <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700 lg:col-span-2">
                            {t("common.value", {
                              value: money(summary?.value || 0, currency),
                            })}
                          </div>
                        </div>

                        {isExcluded && (
                          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                            {t("inventory.excludedNote")}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={addBusinessInventoryItem}
                    className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                  >
                    {t("inventory.add")}
                  </button>

                  <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                    {t("inventory.note")}
                  </p>
                </div>
              )}
              </CollapsibleCard>
            </div>

            <div id="section-other-assets" className="scroll-mt-6">
              <CollapsibleCard
                title={t("otherAssets.title")}
                description={t("otherAssets.helper")}
                summary={otherAssetsSectionSummary}
                hasWarning={otherAssetsSectionHasWarning}
                warningLabel={warningLabel}
              >
                <h2 className="text-xl font-bold">
                  {t("otherAssets.title")}
                </h2>

                <div className="mt-5 space-y-4">
                  {otherAssetItems.map((item, index) => {
                    const summary = otherAssetSummaries.find(
                      (entry) => entry.id === item.id,
                    );
                    const isInvestment =
                      item.type === "stocks" ||
                      item.type === "businessParticipation";

                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-emerald-100 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-semibold">
                            {t("otherAssets.item", { index: index + 1 })}
                          </h3>

                          <button
                            type="button"
                            onClick={() => removeOtherAssetItem(item.id)}
                            className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                          >
                            {t("common.remove")}
                          </button>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <label className="block text-sm font-semibold text-slate-700">
                            {t("otherAssets.type")}
                            <select
                              value={item.type}
                              onChange={(event) =>
                                updateOtherAssetItem(item.id, {
                                  type: event.target.value as OtherAssetType,
                                })
                              }
                              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                            >
                              <option value="stocks">
                                {t("otherAssets.type.stocks")}
                              </option>
                              <option value="financialDeposit">
                                {t("otherAssets.type.financialDeposit")}
                              </option>
                              <option value="businessParticipation">
                                {t("otherAssets.type.businessParticipation")}
                              </option>
                              <option value="otherFinancial">
                                {t("otherAssets.type.otherFinancial")}
                              </option>
                              <option value="other">
                                {t("otherAssets.type.other")}
                              </option>
                            </select>
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("otherAssets.description")}
                            <input
                              type="text"
                              required={toNumber(item.currentValue) > 0}
                              value={item.description}
                              onChange={(event) =>
                                updateOtherAssetItem(item.id, {
                                  description: event.target.value,
                                })
                              }
                              placeholder={t("otherAssets.descriptionPlaceholder")}
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t(
                              isInvestment
                                ? "otherAssets.investmentCurrentValue"
                                : "otherAssets.currentValue",
                            )}
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.currentValue}
                              onChange={(event) =>
                                updateOtherAssetItem(item.id, {
                                  currentValue: event.target.value,
                                })
                              }
                              placeholder="0.00"
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          {isInvestment ? (
                            <label className="block text-sm font-semibold text-slate-700">
                              {t("otherAssets.investmentPurpose")}
                              <select
                                value={item.investmentPurpose ?? ""}
                                onChange={(event) =>
                                  updateOtherAssetItem(item.id, {
                                    investmentPurpose: event.target
                                      .value as InvestmentPurpose,
                                  })
                                }
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                              >
                                <option value="">
                                  {t("otherAssets.purpose.placeholder")}
                                </option>
                                <option value="trade">
                                  {t("otherAssets.purpose.trade")}
                                </option>
                                <option value="longTerm">
                                  {t("otherAssets.purpose.longTerm")}
                                </option>
                                <option value="companyPays">
                                  {t("otherAssets.purpose.companyPays")}
                                </option>
                                <option value="includeFull">
                                  {t("otherAssets.purpose.includeFull")}
                                </option>
                                <option value="unsure">
                                  {t("otherAssets.purpose.unsure")}
                                </option>
                              </select>
                            </label>
                          ) : (
                            <label className="block text-sm font-semibold text-slate-700">
                              {t("otherAssets.treatment")}
                              <select
                                value={item.treatment}
                                onChange={(event) =>
                                  updateOtherAssetItem(item.id, {
                                    treatment: event.target
                                      .value as OtherAssetTreatment,
                                  })
                                }
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                              >
                                <option value="include">
                                  {t("otherAssets.treatment.include")}
                                </option>
                                <option value="exclude">
                                  {t("otherAssets.treatment.exclude")}
                                </option>
                                <option value="verify">
                                  {t("otherAssets.treatment.verify")}
                                </option>
                              </select>
                            </label>
                          )}

                          {isInvestment &&
                            item.investmentPurpose === "longTerm" && (
                              <label className="block text-sm font-semibold text-slate-700">
                                {t("otherAssets.zakatablePercentage")}
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  value={item.zakatableAssetsPercentage ?? ""}
                                  onChange={(event) =>
                                    updateOtherAssetItem(item.id, {
                                      zakatableAssetsPercentage:
                                        event.target.value,
                                    })
                                  }
                                  placeholder="0-100"
                                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                />
                              </label>
                            )}

                          {isInvestment && (
                            <>
                              <label className="block text-sm font-semibold text-slate-700">
                                {t("otherAssets.dividendsHeld")}
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.dividendsHeld ?? ""}
                                  onChange={(event) =>
                                    updateOtherAssetItem(item.id, {
                                      dividendsHeld: event.target.value,
                                    })
                                  }
                                  placeholder="0.00"
                                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                />
                              </label>

                              <label className="block text-sm font-semibold text-slate-700">
                                {t("otherAssets.dividendsInCash")}
                                <select
                                  value={item.dividendsAlreadyInCash ?? ""}
                                  onChange={(event) =>
                                    updateOtherAssetItem(item.id, {
                                      dividendsAlreadyInCash: event.target
                                        .value as YesNoAnswer,
                                    })
                                  }
                                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                                >
                                  <option value="">—</option>
                                  <option value="yes">{t("common.yes")}</option>
                                  <option value="no">{t("common.no")}</option>
                                </select>
                              </label>

                              <label className="block text-sm font-semibold text-slate-700 lg:col-span-2">
                                {t("otherAssets.loanQuestion")}
                                <select
                                  value={item.loanType ?? "none"}
                                  onChange={(event) =>
                                    updateOtherAssetItem(item.id, {
                                      loanType: event.target
                                        .value as InvestmentLoanType,
                                    })
                                  }
                                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                                >
                                  <option value="none">
                                    {t("otherAssets.loan.none")}
                                  </option>
                                  <option value="interestFree">
                                    {t("otherAssets.loan.interestFree")}
                                  </option>
                                  <option value="conventional">
                                    {t("otherAssets.loan.conventional")}
                                  </option>
                                  <option value="unsure">
                                    {t("otherAssets.loan.unsure")}
                                  </option>
                                </select>
                              </label>

                              {(item.loanType ?? "none") !== "none" && (
                                <>
                                  <label className="block text-sm font-semibold text-slate-700">
                                    {t("otherAssets.totalLoanOutstanding")}
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={item.totalLoanOutstanding ?? ""}
                                      onChange={(event) =>
                                        updateOtherAssetItem(item.id, {
                                          totalLoanOutstanding:
                                            event.target.value,
                                        })
                                      }
                                      placeholder="0.00"
                                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                    />
                                    <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
                                      {t("otherAssets.totalLoanInformative")}
                                    </span>
                                  </label>

                                  <label className="block text-sm font-semibold text-slate-700">
                                    {t("otherAssets.principalDue")}
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={item.principalDueWithinYear ?? ""}
                                      onChange={(event) =>
                                        updateOtherAssetItem(item.id, {
                                          principalDueWithinYear:
                                            event.target.value,
                                        })
                                      }
                                      placeholder="0.00"
                                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                    />
                                  </label>

                                  <label className="block text-sm font-semibold text-slate-700 lg:col-span-2">
                                    {t("otherAssets.principalAlreadyInDebts")}
                                    <select
                                      value={item.principalAlreadyInDebts ?? ""}
                                      onChange={(event) =>
                                        updateOtherAssetItem(item.id, {
                                          principalAlreadyInDebts: event.target
                                            .value as YesNoAnswer,
                                        })
                                      }
                                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                                    >
                                      <option value="">—</option>
                                      <option value="no">{t("common.no")}</option>
                                      <option value="yes">{t("common.yes")}</option>
                                    </select>
                                  </label>
                                </>
                              )}

                              {item.loanType === "conventional" && (
                                <label className="block text-sm font-semibold text-slate-700 lg:col-span-2">
                                  {t("otherAssets.interestDue")}
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.interestDueWithinYear ?? ""}
                                    onChange={(event) =>
                                      updateOtherAssetItem(item.id, {
                                        interestDueWithinYear:
                                          event.target.value,
                                      })
                                    }
                                    placeholder="0.00"
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                  />
                                </label>
                              )}
                            </>
                          )}

                          <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700 lg:col-span-2">
                            {t("common.value", {
                              value: money(
                                (summary?.includedValue || 0) +
                                  (summary?.includedDividends || 0),
                                currency,
                              ),
                            })}
                          </div>
                        </div>

                        {item.investmentPurpose === "companyPays" && (
                          <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                            {t("otherAssets.companyPaysNote")}
                          </p>
                        )}

                        {item.investmentPurpose === "longTerm" &&
                          summary?.treatment === "verify" && (
                            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                              {t("otherAssets.percentageVerification")}
                            </p>
                          )}

                        {item.loanType === "conventional" && (
                          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-300">
                            {t("otherAssets.ribaWarning")}
                          </p>
                        )}

                        {item.loanType === "unsure" && (
                          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-300">
                            {t("otherAssets.loanUnsureWarning")}
                          </p>
                        )}

                        {toNumber(item.currentValue) > 0 &&
                          item.description.trim() === "" && (
                          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                            {t("otherAssets.descriptionRequired")}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={addOtherAssetItem}
                    className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                  >
                    {t("otherAssets.add")}
                  </button>

                  <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                    {t("otherAssets.note")}
                  </p>
                </div>
              </CollapsibleCard>
            </div>

            <div id="section-nisab" className="scroll-mt-6">
              <CollapsibleCard
                title={t("nisab.title")}
                description={t("nisab.helper")}
                summary={nisabSectionSummary}
                hasWarning={nisabSectionHasWarning}
                warningLabel={warningLabel}
              >
              <h2 className="text-xl font-bold">{t("nisab.title")}</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("nisab.currency")}
                  <select
                    value={currency}
                    onChange={(event) => handleCurrencyChange(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <option value="EUR">EUR</option>
                    <option value="CHF">CHF</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  {t("nisab.basis")}
                  <select
                    value={nisabBasis}
                    onChange={(event) =>
                      setNisabBasis(event.target.value as NisabBasis)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <option value="Ari">{t("nisab.goldOption")}</option>
                    <option value="Argjendi">
                      {t("nisab.silverOption")}
                    </option>
                    <option value="Vlerë manuale">
                      {t("nisab.manualOption")}
                    </option>
                  </select>
                </label>

                {nisabBasis === "Ari" && (
                  <>
                    <label className="text-sm font-semibold text-slate-700">
                      {t("nisab.goldAmount")}
                      <input
                        type="text"
                        value="85 g"
                        readOnly
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3"
                      />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      {t("nisab.goldPrice", { currency: "EUR" })}
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                        {t("common.required")}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={goldPrice}
                        onChange={(event) => setGoldPrice(event.target.value)}
                        placeholder={t("placeholder.example70")}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                      />
                    </label>
                  </>
                )}

                {nisabBasis === "Argjendi" && (
                  <>
                    <label className="text-sm font-semibold text-slate-700">
                      {t("nisab.silverAmount")}
                      <input
                        type="text"
                        value="595 g"
                        readOnly
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3"
                      />
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      {t("nisab.silverPrice", { currency: "EUR" })}
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                        {t("common.required")}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={silverPrice}
                        onChange={(event) => setSilverPrice(event.target.value)}
                        placeholder={t("placeholder.example085")}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                      />
                    </label>
                  </>
                )}

                {nisabBasis === "Vlerë manuale" && (
                  <label className="text-sm font-semibold text-slate-700">
                    {t("nisab.manualValue", { currency: "EUR" })}
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                      {t("common.required")}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={nisab}
                      onChange={(event) => setNisab(event.target.value)}
                      placeholder={t("placeholder.example5000")}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                    <span className="mt-2 block text-xs leading-5 text-slate-500">
                      {t("nisab.manualHelper")}
                    </span>
                  </label>
                )}

                {nisabFormulaText && (
                  <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700 sm:col-span-2">
                    {nisabFormulaText}
                  </div>
                )}

                <label className="text-sm font-semibold text-slate-700">
                  {t("nisab.lunarYear")}
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                    {t("common.required")}
                  </span>
                  <select
                    required
                    value={lunarYearStatus}
                    onChange={(event) =>
                      setLunarYearStatus(event.target.value as LunarYearStatus)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <option value="">{t("common.choose")}</option>
                    <option value="yes">{t("common.yes")}</option>
                    <option value="no">{t("common.no")}</option>
                    <option value="unsure">{t("common.unsure")}</option>
                  </select>
                </label>
              </div>

              {(!nisabIsValid || !lunarYearConfirmed) && (
                <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                  {!nisabIsValid
                    ? t("nisab.needNisab")
                    : t("nisab.needYear")}
                </p>
              )}

              <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                {t("nisab.note")}
              </p>
              </CollapsibleCard>
            </div>

            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
              <h2 className="text-xl font-bold">{t("assets.title")}</h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4">
                  <input
                    type="checkbox"
                    checked={hasMoney}
                    onChange={(event) => setHasMoney(event.target.checked)}
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">{t("assets.money")}</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4">
                  <input
                    type="checkbox"
                    checked={hasGold}
                    onChange={(event) => setHasGold(event.target.checked)}
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">
                    {t("assets.goldJewelry")}
                  </span>
                </label>

                <label className={`${styles.fullOnly} flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4`}>
                  <input
                    type="checkbox"
                    checked={hasSilver}
                    onChange={(event) => setHasSilver(event.target.checked)}
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">{t("assets.silver")}</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4">
                  <input
                    type="checkbox"
                    checked={hasPersonalJewelry}
                    onChange={(event) =>
                      setHasPersonalJewelry(event.target.checked)
                    }
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">
                    {t("assets.personalJewelry")}
                  </span>
                </label>

                <label className={`${styles.fullOnly} flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4`}>
                  <input
                    type="checkbox"
                    checked={hasCrypto}
                    onChange={(event) => setHasCrypto(event.target.checked)}
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">{t("assets.crypto")}</span>
                </label>

                <label className={`${styles.fullOnly} flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4`}>
                  <input
                    type="checkbox"
                    checked={hasLivestock}
                    onChange={(event) => setHasLivestock(event.target.checked)}
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">{t("assets.livestock")}</span>
                </label>

                <label className={`${styles.fullOnly} flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-100 p-4`}>
                  <input
                    type="checkbox"
                    checked={hasCrops}
                    onChange={(event) => setHasCrops(event.target.checked)}
                    className="h-5 w-5 accent-emerald-700"
                  />
                  <span className="font-semibold">{t("assets.crops")}</span>
                </label>
              </div>

              {isSimpleMode && (
                <div className={styles.lockedCategories}>
                  <div>
                    <strong>{t("simple.lockedTitle")}</strong>
                    <p>{t("simple.lockedText")}</p>
                  </div>
                  <Link href="/kalkulo?mode=full">
                    {t("nav.fullCalculation")}
                  </Link>
                </div>
              )}
            </section>

            {hasMoney && (
              <div id="section-money" className="scroll-mt-6">
                <CollapsibleCard
                  title={t("money.title")}
                  description={t("hero.description")}
                  summary={moneySectionSummary}
                  warningLabel={warningLabel}
                  defaultOpen
                >
                <h2 className="text-xl font-bold">{t("money.title")}</h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    {t("money.cash")}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cash}
                      onChange={(event) => setCash(event.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    {t("money.bank")}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={bank}
                      onChange={(event) => setBank(event.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    {t("money.savings")}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={savings}
                      onChange={(event) => setSavings(event.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className={`${styles.fullOnly} text-sm font-semibold text-slate-700`}>
                    {t("money.receivablesOld")}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={receivables}
                      onChange={(event) => setReceivables(event.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>
                </div>

                <div id="section-fx" className="scroll-mt-6">
                  <CollapsibleCard
                    title={t("fx.title")}
                    description={t("fx.helper", { currency })}
                    summary={fxSectionSummary}
                    hasWarning={fxSectionHasWarning}
                    warningLabel={warningLabel}
                  >
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={hasForeignCurrencies}
                      onChange={(event) =>
                        setHasForeignCurrencies(event.target.checked)
                      }
                      className="h-5 w-5 accent-emerald-700"
                    />
                    <span className="font-semibold">{t("fx.title")}</span>
                  </label>

                  {hasForeignCurrencies && (
                    <div className="mt-4 space-y-4">
                      <p className="text-sm leading-6 text-slate-600">
                        {t("fx.helper", { currency })}
                      </p>

                      <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-slate-600">
                          {fxProvider && (
                            <p>
                              {t("fx.source")}: {fxProvider}
                              {fxUpdatedAt ? ` — ${fxUpdatedAt}` : ""}
                            </p>
                          )}

                          {fxError && (
                            <p className="font-semibold text-amber-800">
                              {fxError}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={fetchAutomaticFxRates}
                          disabled={isFetchingFx}
                          className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400 sm:w-auto"
                        >
                          {isFetchingFx ? t("fx.loading") : t("fx.button")}
                        </button>
                      </div>

                      {foreignCurrencyRows.map((row, index) => {
                        const summary = foreignCurrencySummaries.find(
                          (item) => item.id === row.id,
                        );
                        const rateValue =
                          row.currency === currency
                            ? "1.00"
                            : row.exchangeRateToEur;

                        return (
                          <div
                            key={row.id}
                            className="rounded-xl border border-slate-200 p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <h3 className="font-semibold">
                                {t("fx.row", { index: index + 1 })}
                              </h3>

                              <button
                                type="button"
                                onClick={() =>
                                  removeForeignCurrencyRow(row.id)
                                }
                                className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                              >
                                {t("common.remove")}
                              </button>
                            </div>

                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                              <label className="block text-sm font-semibold text-slate-700">
                                {t("fx.currency")}
                                <select
                                  value={row.currency}
                                  onChange={(event) => {
                                    const nextCurrency = event.target
                                      .value as ForeignCurrencyCode;
                                    updateForeignCurrencyRow(row.id, {
                                      currency: nextCurrency,
                                      otherCurrency:
                                        nextCurrency === "Tjetër"
                                          ? row.otherCurrency
                                          : "",
                                      exchangeRateToEur:
                                        nextCurrency === currency
                                          ? "1"
                                          : row.exchangeRateToEur,
                                    });
                                  }}
                                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                                >
                                  <option value="">{t("common.choose")}</option>
                                  {availableForeignCurrencyOptions.map(
                                    (option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </label>

                              {row.currency === "Tjetër" && (
                                <label className="block text-sm font-semibold text-slate-700">
                                  {t("fx.custom")}
                                  <input
                                    type="text"
                                    required
                                    value={row.otherCurrency}
                                    onChange={(event) =>
                                      updateForeignCurrencyRow(row.id, {
                                        otherCurrency: event.target.value,
                                      })
                                    }
                                    placeholder={t("placeholder.exampleJpy")}
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                  />
                                </label>
                              )}

                              <label className="block text-sm font-semibold text-slate-700">
                                {t("fx.amount")}
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={row.amount}
                                  onChange={(event) =>
                                    updateForeignCurrencyRow(row.id, {
                                      amount: event.target.value,
                                    })
                                  }
                                  placeholder="0.00"
                                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                />
                              </label>

                              <label className="block text-sm font-semibold text-slate-700">
                                {t("fx.rate", { currency })}
                                <input
                                  type="number"
                                  min="0"
                                  step="0.0001"
                                  disabled={row.currency === currency}
                                  value={rateValue}
                                  onChange={(event) =>
                                    updateForeignCurrencyRow(row.id, {
                                      exchangeRateToEur: event.target.value,
                                    })
                                  }
                                  placeholder={t("placeholder.example092")}
                                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 disabled:bg-slate-100"
                                />
                              </label>
                            </div>

                            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">
                              {t("fx.equivalent", {
                                value: money(
                                  summary?.equivalentEur || 0,
                                  currency,
                                ),
                              })}
                            </p>

                            {summary && !summary.isValid && (
                              <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                                {t("fx.incomplete", { currency })}
                              </p>
                            )}
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={addForeignCurrencyRow}
                        className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                      >
                        {t("fx.add")}
                      </button>
                    </div>
                  )}
                  </CollapsibleCard>
                </div>
                </CollapsibleCard>
              </div>
            )}

            <div id="section-debts" className="scroll-mt-6">
              <CollapsibleCard
                title={t("debts.title")}
                description={t("debts.methodologyNote")}
                summary={debtsSectionSummary}
                hasWarning={debtsSectionHasWarning}
                warningLabel={warningLabel}
              >
              <h2 className="text-xl font-bold">
                {t("debts.title")}
              </h2>

              <div className="mt-5 grid gap-5">
                <div className="rounded-xl border border-emerald-100 p-4">
                  <h3 className="font-bold">
                    {t("debts.receivablesTitle")}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t("debts.receivablesHelper")}
                  </p>

                  <div className="mt-4 space-y-4">
                    {receivableRows.map((row, index) => (
                      <div
                        key={row.id}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h4 className="font-semibold">
                            {t("debts.receivableRow", { index: index + 1 })}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeReceivableRow(row.id)}
                            className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                          >
                            {t("common.remove")}
                          </button>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-3">
                          <label className="block text-sm font-semibold text-slate-700">
                            {t("common.description")}
                            <input
                              type="text"
                              value={row.description}
                              onChange={(event) =>
                                updateReceivableRow(row.id, {
                                  description: event.target.value,
                                })
                              }
                              placeholder={t("debts.receivablePlaceholder")}
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("debts.amount", { currency })}
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.amount}
                              onChange={(event) =>
                                updateReceivableRow(row.id, {
                                  amount: event.target.value,
                                })
                              }
                              placeholder="0.00"
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("debts.status")}
                            <select
                              value={row.status}
                              onChange={(event) =>
                                updateReceivableRow(row.id, {
                                  status: event.target.value as ReceivableStatus,
                                })
                              }
                              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                            >
                              <option value="secure">
                                {t("debts.secure")}
                              </option>
                              <option value="doubtful">
                                {t("debts.doubtful")}
                              </option>
                            </select>
                          </label>
                        </div>

                        {row.status === "doubtful" && (
                          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                            {t("debts.doubtfulNote")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addReceivableRow}
                    className="mt-4 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                  >
                    {t("debts.addReceivable")}
                  </button>

                  <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
                    {t("debts.includedReceivables", {
                      value: money(includedSecureReceivables, currency),
                    })}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-100 p-4">
                  <h3 className="font-bold">{t("debts.liabilitiesTitle")}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t("debts.liabilitiesHelper")}
                  </p>

                  <div className="mt-4 space-y-4">
                    {liabilityRows.map((row, index) => (
                      <div
                        key={row.id}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h4 className="font-semibold">
                            {t("debts.liabilityRow", { index: index + 1 })}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeLiabilityRow(row.id)}
                            className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                          >
                            {t("common.remove")}
                          </button>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-3">
                          <label className="block text-sm font-semibold text-slate-700">
                            {t("common.description")}
                            <input
                              type="text"
                              value={row.description}
                              onChange={(event) =>
                                updateLiabilityRow(row.id, {
                                  description: event.target.value,
                                })
                              }
                              placeholder={t("common.optionalDescription")}
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("debts.type")}
                            <select
                              value={row.type}
                              onChange={(event) =>
                                updateLiabilityRow(row.id, {
                                  type: event.target.value as LiabilityType,
                                })
                              }
                              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                            >
                              <option value="Hua personale">
                                {t("debts.personalLoan")}
                              </option>
                              <option value="Detyrim me këste / borxh brenda 12 muajve">
                                {t("debts.installment")}
                              </option>
                              <option value="Faturë ose detyrim biznesi">
                                {t("debts.businessBill")}
                              </option>
                              <option value="Detyrim karte">
                                {t("debts.card")}
                              </option>
                              <option value="Tjetër">{t("common.other")}</option>
                            </select>
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("debts.dueWithinYear", { currency })}
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.amountDueWithinYear}
                              onChange={(event) =>
                                updateLiabilityRow(row.id, {
                                  amountDueWithinYear: event.target.value,
                                })
                              }
                              placeholder="0.00"
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addLiabilityRow}
                    className="mt-4 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                  >
                    {t("debts.addLiability")}
                  </button>

                  <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">
                    {t("debts.deductible", {
                      value: money(deductibleLiabilities, currency),
                    })}
                  </p>
                </div>
              </div>

              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                {t("debts.methodologyNote")}
              </p>
              </CollapsibleCard>
            </div>

            {(hasGold || hasSilver) && (
              <div id="section-metals" className="scroll-mt-6">
                <CollapsibleCard
                  title={t("metals.title")}
                  description={t("jewelry.helper")}
                  summary={metalsSectionSummary}
                  hasWarning={metalsSectionHasWarning}
                  warningLabel={warningLabel}
                >
                {(hasGold || hasSilver) && (
              <section className="rounded-xl border border-emerald-100 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm leading-6 text-slate-600">
                    {metalsProvider && (
                      <>
                        <p className="font-semibold text-slate-800">
                          {t("metals.source")}
                        </p>
                        {metalsUpdatedAt && (
                          <p>
                            {t("metals.updated")}: {metalsUpdatedAt}
                          </p>
                        )}
                      </>
                    )}

                    {metalsMessage && (
                      <p className="rounded-xl bg-amber-50 p-3 font-semibold text-amber-900 ring-1 ring-amber-200">
                        {metalsMessage}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={fetchAutomaticMetalPrices}
                    disabled={isFetchingMetals}
                    className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400 sm:w-auto"
                  >
                    {isFetchingMetals
                      ? t("metals.loading")
                      : t("metals.button")}
                  </button>
                </div>
              </section>
                )}

            {hasGold && (
              <section className="rounded-xl border border-emerald-100 p-4">
                <h2 className="text-xl font-bold">{t("gold.title")}</h2>

<div className="mt-5 grid gap-4 sm:grid-cols-2">
  <label className="text-sm font-semibold text-slate-700">
    {t("gold.type")}
    <select
      value={goldType}
      onChange={(event) => setGoldType(event.target.value)}
      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
    >
      <option value="investment">{t("gold.investment")}</option>
      <option value="jewelry">{t("gold.personalJewelry")}</option>
    </select>
  </label>

  {goldType === "jewelry" && (
    <label className="text-sm font-semibold text-slate-700">
      {t("gold.treatment")}
      <select
        value={jewelryRule}
        onChange={(event) => setJewelryRule(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
      >
        <option value="include">{t("gold.include")}</option>
        <option value="exclude">
          {t("gold.exclude")}
        </option>
      </select>
    </label>
  )}
</div>
                {goldType === "jewelry" && (
                  <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                    {t("gold.warning")}
                  </p>
                )}
                <label className="mt-5 block text-sm font-semibold text-slate-700">
                  {t("gold.price", { currency })}
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={goldPrice}
                    onChange={(event) => setGoldPrice(event.target.value)}
                    placeholder={t("placeholder.example95")}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                  />
                </label>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    {t("gold.grams", { karat: "24K" })}
                    <input
                      type="number"
                      min="0"
                      value={gold24}
                      onChange={(event) => setGold24(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    {t("gold.grams", { karat: "22K" })}
                    <input
                      type="number"
                      min="0"
                      value={gold22}
                      onChange={(event) => setGold22(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    {t("gold.grams", { karat: "21K" })}
                    <input
                      type="number"
                      min="0"
                      value={gold21}
                      onChange={(event) => setGold21(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    {t("gold.grams", { karat: "18K" })}
                    <input
                      type="number"
                      min="0"
                      value={gold18}
                      onChange={(event) => setGold18(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    {t("gold.grams", { karat: "14K" })}
                    <input
                      type="number"
                      min="0"
                      value={gold14}
                      onChange={(event) => setGold14(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {t("gold.note")}
                </p>
              </section>
            )}

            {hasSilver && (
              <section className="rounded-xl border border-emerald-100 p-4">
                <h2 className="text-xl font-bold">{t("silver.title")}</h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    {t("silver.grams")}
                    <input
                      type="number"
                      min="0"
                      value={silverGrams}
                      onChange={(event) => setSilverGrams(event.target.value)}
                      placeholder="0"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    {t("silver.price", { currency })}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={silverPrice}
                      onChange={(event) => setSilverPrice(event.target.value)}
                      placeholder={t("placeholder.example110")}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>
                </div>
              </section>
            )}

                </CollapsibleCard>
              </div>
            )}

            {hasPersonalJewelry && (
              <div id="section-jewelry" className="scroll-mt-6">
                <CollapsibleCard
                  title={t("jewelry.title")}
                  description={t("jewelry.helper")}
                  summary={jewelrySectionSummary}
                  hasWarning={jewelrySectionHasWarning}
                  warningLabel={warningLabel}
                >
                  <h2 className="text-xl font-bold">{t("jewelry.title")}</h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {t("jewelry.helper")}
                  </p>

                  <div className="mt-5 grid gap-3">
                    <label className="rounded-xl border border-emerald-100 p-4">
                      <span className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="jewelry-methodology"
                          checked={jewelryMethodology === "include"}
                          onChange={() => setJewelryMethodology("include")}
                          className="mt-1 h-5 w-5 accent-emerald-700"
                        />
                        <span>
                          <span className="block font-semibold">
                            {t("jewelry.includePersonal")}
                          </span>
                          <span className="text-sm text-slate-500">
                            {t("jewelry.hanafi")}
                          </span>
                        </span>
                      </span>
                    </label>

                    <label className="rounded-xl border border-emerald-100 p-4">
                      <span className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="jewelry-methodology"
                          checked={jewelryMethodology === "exclude"}
                          onChange={() => setJewelryMethodology("exclude")}
                          className="mt-1 h-5 w-5 accent-emerald-700"
                        />
                        <span>
                          <span className="block font-semibold">
                            {t("jewelry.excludePersonal")}
                          </span>
                          <span className="text-sm text-slate-500">
                            {t("jewelry.malikiShafiHanbali")}
                          </span>
                        </span>
                      </span>
                    </label>

                    <label className="rounded-xl border border-emerald-100 p-4">
                      <span className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="jewelry-methodology"
                          checked={jewelryMethodology === "unsure"}
                          onChange={() => setJewelryMethodology("unsure")}
                          className="mt-1 h-5 w-5 accent-emerald-700"
                        />
                        <span>
                          <span className="block font-semibold">
                            {t("common.unsure")}
                          </span>
                          <span className="text-sm text-slate-500">
                            {t("jewelry.unsureHelper")}
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>

                  {jewelryMethodology === "unsure" && (
                    <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                      {t("jewelry.warning")}
                    </p>
                  )}

                  <div className="mt-5 space-y-4">
                    {jewelryItems.map((item, index) => {
                      const summary = jewelrySummaries.find(
                        (entry) => entry.id === item.id,
                      );
                      const itemValue = summary?.value || 0;

                      return (
                        <div
                          key={item.id}
                          className="rounded-xl border border-emerald-100 p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-semibold">
                              {t("jewelry.item", { index: index + 1 })}
                            </h3>

                            <button
                              type="button"
                              onClick={() => removeJewelryItem(item.id)}
                              className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                            >
                              {t("common.remove")}
                            </button>
                          </div>

                          <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            <label className="block text-sm font-semibold text-slate-700">
                              {t("jewelry.material")}
                              <select
                                value={item.material}
                                onChange={(event) =>
                                  updateJewelryItem(item.id, {
                                    material: event.target.value as JewelryMaterial,
                                  })
                                }
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                              >
                                <option value="Ari">{t("nisab.gold")}</option>
                                <option value="Argjend">
                                  {t("nisab.silver")}
                                </option>
                              </select>
                            </label>

                            {item.material === "Ari" && (
                              <label className="block text-sm font-semibold text-slate-700">
                                {t("jewelry.purity")}
                                <select
                                  value={item.purity}
                                  onChange={(event) =>
                                    updateJewelryItem(item.id, {
                                      purity: event.target
                                        .value as JewelryPurity,
                                    })
                                  }
                                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                                >
                                  <option value="14K">14K</option>
                                  <option value="18K">18K</option>
                                  <option value="21K">21K</option>
                                  <option value="22K">22K</option>
                                  <option value="24K">24K</option>
                                </select>
                              </label>
                            )}

                            <label className="block text-sm font-semibold text-slate-700">
                              {t("jewelry.weight")}
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.weightGrams}
                                onChange={(event) =>
                                  updateJewelryItem(item.id, {
                                    weightGrams: event.target.value,
                                  })
                                }
                                placeholder="0"
                                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                              />
                            </label>

                            <label className="block text-sm font-semibold text-slate-700">
                              {t("jewelry.purpose")}
                              <select
                                value={item.purpose}
                                onChange={(event) =>
                                  updateJewelryItem(item.id, {
                                    purpose: event.target
                                      .value as JewelryPurpose,
                                  })
                                }
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                              >
                                <option value="Përdorim personal">
                                  {t("jewelry.personalUse")}
                                </option>
                                <option value="Kursim / ruajtje vlere">
                                  {t("jewelry.savings")}
                                </option>
                                <option value="Për tregti">
                                  {t("jewelry.trade")}
                                </option>
                              </select>
                            </label>

                            {item.material === "Ari" ? (
                              <label className="block text-sm font-semibold text-slate-700">
                                {t("jewelry.goldPrice", { currency })}
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  required={toNumber(item.weightGrams) > 0}
                                  value={item.goldPrice24kPerGram}
                                  onChange={(event) =>
                                    updateJewelryItem(item.id, {
                                      goldPrice24kPerGram: event.target.value,
                                    })
                                  }
                                  placeholder="0.00"
                                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                />
                              </label>
                            ) : (
                              <label className="block text-sm font-semibold text-slate-700">
                                {t("jewelry.silverPrice", { currency })}
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  required={toNumber(item.weightGrams) > 0}
                                  value={item.silverPricePerGram}
                                  onChange={(event) =>
                                    updateJewelryItem(item.id, {
                                      silverPricePerGram: event.target.value,
                                    })
                                  }
                                  placeholder="0.00"
                                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                />
                              </label>
                            )}

                            <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700 lg:col-span-2">
                              {t("common.value", {
                                value: money(itemValue, currency),
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={addJewelryItem}
                    className="mt-4 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                  >
                    {t("jewelry.add")}
                  </button>

                  <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                    {t("jewelry.note")}
                  </p>
                </CollapsibleCard>
              </div>
            )}

            {hasCrypto && (
              <div id="section-crypto" className="scroll-mt-6">
                <CollapsibleCard
                  title={t("crypto.title")}
                  description={t("crypto.note")}
                  summary={cryptoSectionSummary}
                  hasWarning={cryptoSectionHasWarning}
                  warningLabel={warningLabel}
                >
                <h2 className="text-xl font-bold">{t("crypto.title")}</h2>

                <div className="mt-5 grid gap-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    {t("crypto.methodologyTitle")}
                    <select
                      value={cryptoMethodology}
                      onChange={(event) =>
                        setCryptoMethodology(
                          event.target.value as CryptoMethodology,
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <option value="include">{t("crypto.include")}</option>
                      <option value="verify">{t("crypto.verify")}</option>
                      <option value="unsure">{t("crypto.unsure")}</option>
                    </select>
                  </label>

                  <label className="block text-sm font-semibold text-slate-700">
                    {t("crypto.marketValue", { currency })}
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cryptoMarketValue}
                      onChange={(e) => setCryptoMarketValue(e.target.value)}
                      placeholder="0.00"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>
                </div>

                {cryptoMethodology === "unsure" && (
                  <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                    {t("crypto.unsureWarning")}
                  </p>
                )}

                <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                  {t("crypto.note")}
                </p>
                </CollapsibleCard>
              </div>
            )}

            {hasLivestock && (
              <div id="section-livestock" className="scroll-mt-6">
                <CollapsibleCard
                  title={t("livestock.title")}
                  description={t("livestock.methodologyNote")}
                  summary={livestockSectionSummary}
                  hasWarning={livestockSectionHasWarning}
                  warningLabel={warningLabel}
                >
                <h2 className="text-xl font-bold">{t("livestock.title")}</h2>

                <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    {t("livestock.fedMethodologyShortTitle")}
                    <select
                      value={fedLivestockMethodology}
                      onChange={(event) =>
                        setFedLivestockMethodology(
                          event.target.value as FedLivestockMethodology,
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <option value="majority">{t("livestock.fedMajorityShort")}</option>
                      <option value="maliki">{t("livestock.fedMalikiShortOption")}</option>
                      <option value="unsure">{t("common.unsure")}</option>
                    </select>
                  </label>

                  {fedLivestockMajorityExcluded && (
                    <p className="mt-3 rounded-xl bg-white p-3 text-sm leading-6 text-emerald-900">
                      {t("livestock.fedMajorityNote")}
                    </p>
                  )}

                  {fedLivestockMethodology === "unsure" &&
                    fedLivestockRequiresMethodology && (
                    <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                      {t("livestock.fedUnsureNote")}
                    </p>
                  )}
                </div>

                <div className="mt-5 space-y-4">
                  {livestockGroups.map((group, index) => {
                    return (
                      <div
                        key={group.id}
                        className="rounded-xl border border-emerald-100 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-semibold">
                            {t("livestock.group", { index: index + 1 })}
                          </h3>

                          <button
                            type="button"
                            onClick={() => removeLivestockGroup(group.id)}
                            className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                          >
                            {t("common.remove")}
                          </button>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <label className="block text-sm font-semibold text-slate-700">
                            {t("livestock.animalType")}
                            <select
                              required
                              value={group.animal}
                              onChange={(event) =>
                                updateLivestockGroup(group.id, {
                                  animal: event.target.value as LivestockAnimal,
                                  otherAnimal:
                                    event.target.value === "Tjetër"
                                      ? group.otherAnimal
                                      : "",
                                })
                              }
                              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                            >
                              <option value="">{t("common.choose")}</option>
                              {livestockAnimalOptions.map((animal) => (
                                <option key={animal} value={animal}>
                                  {livestockAnimalLabel(animal)}
                                </option>
                              ))}
                            </select>
                          </label>

                          {group.animal === "Tjetër" && (
                            <label className="block text-sm font-semibold text-slate-700">
                              {t("livestock.otherAnimal")}
                              <input
                                type="text"
                                required
                                value={group.otherAnimal}
                                onChange={(event) =>
                                  updateLivestockGroup(group.id, {
                                    otherAnimal: event.target.value,
                                  })
                                }
                                placeholder={t("livestock.otherAnimalPlaceholder")}
                                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                              />
                            </label>
                          )}

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("livestock.grazingCount")}
                            <input
                              type="number"
                              min="0"
                              value={group.grazingCount}
                              onChange={(event) =>
                                updateLivestockGroup(group.id, {
                                  grazingCount: event.target.value,
                                })
                              }
                              placeholder="0"
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("livestock.tradeCount")}
                            <input
                              type="number"
                              min="0"
                              value={group.tradeCount}
                              onChange={(event) =>
                                updateLivestockGroup(group.id, {
                                  tradeCount: event.target.value,
                                })
                              }
                              placeholder="0"
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700 lg:col-span-2">
                            {t("livestock.totalAnimals")}:{" "}
                            {toNumber(group.grazingCount) +
                              toNumber(group.tradeCount)}
                          </div>

                          {toNumber(group.grazingCount) > 0 && (
                            <div className="space-y-3 lg:col-span-2">
                              <label className="block text-sm font-semibold text-slate-700">
                                {t("livestock.grazesMostYear")}
                                <select
                                  required
                                  value={group.grazesMostYear}
                                  onChange={(event) =>
                                    updateLivestockGroup(group.id, {
                                      grazesMostYear: event.target
                                        .value as GrazingMostYear,
                                    })
                                  }
                                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                                >
                                  <option value="">{t("common.choose")}</option>
                                  <option value="yes">
                                    {t("livestock.grazingYes")}
                                  </option>
                                  <option value="no">
                                    {t("livestock.grazingNo")}
                                  </option>
                                </select>
                              </label>

                              {group.grazesMostYear === "no" &&
                                fedLivestockMethodology === "majority" &&
                                isStandardLivestockAnimal(group.animal) && (
                                  <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                                    {t("livestock.fedMajorityNote")}
                                  </p>
                                )}

                              {group.grazesMostYear === "no" &&
                                fedLivestockMethodology === "maliki" &&
                                isStandardLivestockAnimal(group.animal) && (
                                  <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                                    {t("livestock.fedMalikiNote")}
                                  </p>
                                )}

                              {group.animal === "Tjetër" && (
                                <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                                  {t("livestock.otherVerification")}
                                </p>
                              )}

                              {group.grazesMostYear === "no" &&
                                fedLivestockMethodology === "unsure" &&
                                isStandardLivestockAnimal(group.animal) && (
                                <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                                  {t("livestock.fedUnsureNote")}
                                </p>
                              )}
                            </div>
                          )}

                          {toNumber(group.tradeCount) > 0 && (
                            <label className="block text-sm font-semibold text-slate-700 lg:col-span-2">
                              {t("livestock.tradeMarketValue")}
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={group.tradeMarketValue}
                                onChange={(event) =>
                                  updateLivestockGroup(group.id, {
                                    tradeMarketValue: event.target.value,
                                  })
                                }
                                placeholder="0.00"
                                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={addLivestockGroup}
                  className="mt-4 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                >
                  {t("livestock.addGroup")}
                </button>

                <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                  {t("livestock.methodologyNote")}
                </p>

                <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                  {t("livestock.sheepTradeNote")}
                </p>

                <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                  {t("livestock.cattleBuffaloNote")}
                </p>

                <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                  {t("livestock.camelNote")}
                </p>
                </CollapsibleCard>
              </div>
            )}

            {hasCrops && (
              <div id="section-crops" className="scroll-mt-6">
                <CollapsibleCard
                  title={t("crop.sectionTitle")}
                  description={t("crop.note")}
                  summary={cropSectionSummary}
                  hasWarning={cropSectionHasWarning}
                  warningLabel={warningLabel}
                >
                <h2 className="text-xl font-bold">{t("crop.sectionTitle")}</h2>

                <div className="mt-5 space-y-4">
                  {cropGroups.map((group, index) => (
                    <div
                      key={group.id}
                      className="rounded-xl border border-emerald-100 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-semibold">
                          {t("crop.item", { index: index + 1 })}
                        </h3>

                        <button
                          type="button"
                          onClick={() => removeCropGroup(group.id)}
                          className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                        >
                          {t("common.remove")}
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          {t("crop.type")}
                          <select
                            required
                            value={group.crop}
                            onChange={(event) =>
                              updateCropGroup(group.id, {
                                crop: event.target.value as CropType,
                                otherCrop:
                                  event.target.value === "Tjetër"
                                    ? group.otherCrop
                                    : "",
                              })
                            }
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                          >
                            <option value="">{t("common.choose")}</option>
                            {cropTypeOptions.map((crop) => (
                              <option key={crop} value={crop}>
                                {cropTypeLabel(crop)}
                              </option>
                            ))}
                          </select>
                        </label>

                        {group.crop === "Tjetër" && (
                          <label className="block text-sm font-semibold text-slate-700">
                            {t("crop.otherType")}
                            <input
                              type="text"
                              required
                              value={group.otherCrop}
                              onChange={(event) =>
                                updateCropGroup(group.id, {
                                  otherCrop: event.target.value,
                                })
                              }
                              placeholder={t("crop.otherTypePlaceholder")}
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>
                        )}

                        <label className="block text-sm font-semibold text-slate-700">
                          {t("crop.quantity")}
                          <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={group.quantityKg}
                              onChange={(event) =>
                                updateCropGroup(group.id, {
                                  quantityKg: event.target.value,
                                })
                              }
                              placeholder="0"
                              className="w-full px-4 py-3 outline-none"
                            />
                            <span className="flex items-center bg-slate-50 px-4 text-sm font-bold text-slate-600">
                              kg
                            </span>
                          </div>
                        </label>

                        <label className="block text-sm font-semibold text-slate-700">
                          {t("crop.nisabKg")}
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={group.nisabKg}
                            onChange={(event) =>
                              updateCropGroup(group.id, {
                                nisabKg: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                          />
                          <span className="mt-2 block text-xs leading-5 text-slate-500">
                            {t("crop.nisabHelper")}
                          </span>
                        </label>

                        <label className="block text-sm font-semibold text-slate-700 lg:col-span-2">
                          {t("crop.irrigation")}
                          <select
                            required
                            value={group.irrigation}
                            onChange={(event) =>
                              updateCropGroup(group.id, {
                                irrigation: event.target
                                  .value as IrrigationType,
                              })
                            }
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                          >
                            <option value="">{t("common.choose")}</option>
                            <option value="natural">
                              {t("crop.irrigation.natural")} — 10%
                            </option>
                            <option value="cost">
                              {t("crop.irrigation.cost")} — 5%
                            </option>
                            <option value="mixed">
                              {t("crop.irrigation.mixed")} — 7.5%
                            </option>
                            <option value="unsure">
                              {t("common.unsure")}
                            </option>
                          </select>
                        </label>

                        {group.crop === "Tjetër" && (
                          <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200 lg:col-span-2">
                            {t("crop.otherVerification")}
                          </p>
                        )}

                        {group.irrigation === "unsure" && (
                          <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200 lg:col-span-2">
                            {t("crop.unsureIrrigationNote")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addCropGroup}
                  className="mt-4 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                >
                  {t("crop.add")}
                </button>

                <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                  {t("crop.note")}
                </p>
                </CollapsibleCard>
              </div>
            )}

          </div>

          <aside
            id="main-result-summary"
            className="scroll-mt-6 h-fit rounded-2xl bg-emerald-800 p-6 text-white shadow-lg lg:sticky lg:top-6"
          >
            <p className="text-sm font-semibold text-emerald-100">
              {t("summary.title")}
            </p>

            <section className="mt-4 rounded-xl bg-white p-4 text-slate-900 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-bold">
                    {t("readiness.title")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {t("readiness.note")}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${readinessStatusClass}`}
                >
                  {readinessStatusLabel}
                </span>
              </div>

              {readinessIssueGroups.length > 0 && (
                <div className="mt-4 space-y-4">
                  {readinessIssueGroups.map((group) => (
                    <div key={group.id}>
                      <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                        {group.title}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {group.issues.map((issue) => (
                          <li
                            key={issue.id}
                            className="rounded-lg border border-slate-200 p-3 text-sm leading-6"
                          >
                            <p>{issue.text}</p>
                            <button
                              type="button"
                              onClick={() =>
                                scrollToCalculatorSection(issue.sectionId)
                              }
                              className="mt-2 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50"
                            >
                              {t("readiness.goToSection")}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="mt-6 space-y-4 border-b border-emerald-700 pb-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.cashSavings")}
                </span>
                <strong>{money(baseMoneyTotal, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.foreignCurrencies", { currency })}
                </span>
                <strong>{money(foreignCurrencyTotalEur, currency)}</strong>
              </div>

              {foreignCurrencySummaries
                .filter((row) => row.isValid)
                .map((row) => (
                  <div
                    key={row.id}
                    className="flex justify-between gap-4 pl-3 text-xs text-emerald-100"
                  >
                    <span>
                      {row.label} {numberText(row.amount)} ×{" "}
                      {rateText(row.rate)} =
                    </span>
                    <strong>{money(row.equivalentEur, currency)}</strong>
                  </div>
                ))}

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.otherAssetsIncluded")}
                </span>
                <strong>{money(includedOtherAssetsValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.otherAssetsExcluded")}
                </span>
                <strong>{money(excludedOtherAssetsValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.otherAssetsVerification")}
                </span>
                <strong>{money(verificationOtherAssetsValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.investmentsIncluded")}
                </span>
                <strong>{money(includedInvestmentValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.dividendsIncluded")}
                </span>
                <strong>{money(includedInvestmentDividends, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.investmentPrincipalDeducted")}
                </span>
                <strong>
                  - {money(deductedInvestmentLoanPrincipal, currency)}
                </strong>
              </div>

              {hasConventionalInvestmentLoan && (
                <div className="flex justify-between gap-4 text-amber-200">
                  <span>{t("summary.interestLoanVerification")}</span>
                  <strong>{t("report.needsCheck")}</strong>
                </div>
              )}

              {hasConventionalInvestmentLoan && (
                <div className="flex justify-between gap-4 text-amber-200">
                  <span>{t("summary.interestNotDeducted")}</span>
                  <strong>
                    {money(undeductedInvestmentInterest, currency)}
                  </strong>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.pureGold")}
                </span>
                <strong>{goldPureGrams.toFixed(2)} g</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.goldValue")}
                </span>
                <strong>{money(goldValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.silverValue")}
                </span>
                <strong>{money(silverValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.personalJewelryIncluded")}
                </span>
                <strong>{money(includedPersonalJewelryValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.personalJewelryExcluded")}
                </span>
                <strong>{money(excludedPersonalJewelryValue, currency)}</strong>
              </div>

              {jewelrySummaries
                .filter((item) => item.category === "excludedPersonal")
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 pl-3 text-xs text-emerald-100"
                  >
                    <span>{item.label}</span>
                    <strong>{money(item.value, currency)}</strong>
                  </div>
                ))}

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.jewelryNeedsMethod")}
                </span>
                <strong>{money(uncertainJewelryValue, currency)}</strong>
              </div>

              {jewelrySummaries
                .filter((item) => item.category === "uncertain")
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 pl-3 text-xs text-emerald-100"
                  >
                    <span>{item.label}</span>
                    <strong>{money(item.value, currency)}</strong>
                  </div>
                ))}

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.jewelryTrade")}
                </span>
                <strong>{money(investmentTradeJewelryValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.cryptoIncluded")}
                </span>
                <strong>{money(cryptoIncludedValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.cryptoVerification")}
                </span>
                <strong>{money(cryptoVerificationValue, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.tradeLivestock")}
                </span>
                <strong>{money(tradeLivestockValue, currency)}</strong>
              </div>

              {hasLivestock && (
                <div className="flex justify-between gap-4">
                  <span className="text-emerald-100">
                    {t("livestock.fedMethodologyShortTitle")}
                  </span>
                  <strong className="text-right">
                    {fedLivestockMethodologyLabel}
                  </strong>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.businessInventory")}
                </span>
                <strong>
                  {money(includedBusinessInventoryValue, currency)}
                </strong>
              </div>

              {businessInventorySummaries
                .filter((item) => item.included)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 pl-3 text-xs text-emerald-100"
                  >
                    <span>{item.label}</span>
                    <strong>{money(item.value, currency)}</strong>
                  </div>
                ))}

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {sheepGoatSummaryLabel}
                </span>
                <strong className="text-right">
                  {grazingSheepGoatTotal} ({t("livestock.animal.Dele")}:{" "}
                  {grazingSheepTotal}, {t("livestock.animal.Dhi")}:{" "}
                  {grazingGoatTotal})
                  {fedLivestockIncludedByMaliki
                    ? ` (${t("livestock.fedMalikiShort")})`
                    : ""}
                </strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {sheepGoatZakatLabel}
                </span>
                <strong className="text-right">{sheepGoatZakatText}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {cattleBuffaloSummaryLabel}
                </span>
                <strong className="text-right">
                  {t("livestock.validCount", {
                    total: grazingCattleBuffaloTotal,
                  })}{" "}
                  — {t("livestock.animal.Lopë")}: {grazingCattleTotal},{" "}
                  {t("livestock.animal.Buaj")}: {grazingBuffaloTotal}
                  {fedLivestockIncludedByMaliki
                    ? ` (${t("livestock.fedMalikiShort")})`
                    : ""}
                </strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {cattleBuffaloZakatLabel}
                </span>
                <strong className="text-right">
                  {cattleBuffaloPhysicalZakatText}
                </strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">{camelSummaryLabel}</span>
                <strong>
                  {t("livestock.validCount", { total: grazingCamelTotal })}
                  {fedLivestockIncludedByMaliki
                    ? ` (${t("livestock.fedMalikiShort")})`
                    : ""}
                </strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {camelZakatLabel}
                </span>
                <strong className="text-right">{camelPhysicalZakatText}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.needsVerification")}
                </span>
                <strong className="text-right">
                  {verificationLivestockSummary
                    ? `${verificationLivestockCount} (${verificationLivestockSummary})`
                    : "0"}
                </strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.assetsBeforeDebts")}
                </span>
                <strong>{money(totalAssets, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.includedReceivables")}
                </span>
                <strong>+ {money(includedSecureReceivables, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.deductibleDebts")}
                </span>
                <strong>- {money(deductibleLiabilities, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.nisabBasis")}
                </span>
                <strong>{nisabBasisSummary}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("report.calculatedNisab")}
                </span>
                <strong>
                  {nisabIsValid
                    ? money(calculatedNisabEur, "EUR")
                    : t("summary.needsCompletion")}
                </strong>
              </div>

              {nisabFormulaText && (
                <div className="flex justify-between gap-4 pl-3 text-xs text-emerald-100">
                  <span>{t("summary.formula")}</span>
                  <strong className="text-right">{nisabFormulaText}</strong>
                </div>
              )}

              <div className="flex justify-between gap-4 font-bold">
                <span>{t("summary.netAssets")}</span>
                <strong>{money(netAssets, currency)}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">
                  {t("summary.lunarYear")}
                </span>
                <strong>{lunarYearLabel}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-emerald-100">{t("summary.status")}</span>
                <strong>{monetaryStatus}</strong>
              </div>

              <div className="flex justify-between gap-4 font-bold">
                <span>{t("summary.monetaryZakat")}</span>
                <strong>{monetaryZakatResult}</strong>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-emerald-100">
                {t("summary.calculatedMonetary")}
              </p>

              <p className="mt-2 text-4xl font-bold">
                {monetaryZakatResult}
              </p>

              {!nisabIsValid ? (
                <p className="mt-4 rounded-xl bg-amber-300/15 p-3 text-sm leading-6 text-amber-100">
                  {t("nisab.needNisab")}
                </p>
              ) : !lunarYearConfirmed ? (
                <p className="mt-4 rounded-xl bg-amber-300/15 p-3 text-sm leading-6 text-amber-100">
                  {t("nisab.needYear")}
                </p>
              ) : reachedNisab ? (
                <p className="mt-4 rounded-xl bg-emerald-700 p-3 text-sm leading-6 text-emerald-50">
                  {t("summary.aboveNisab")}
                </p>
              ) : (
                <p className="mt-4 rounded-xl bg-emerald-700 p-3 text-sm leading-6 text-emerald-50">
                  {t("summary.belowNisab")}
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-emerald-700 pt-6">
              <p className="text-sm font-semibold text-emerald-100">
                {t("summary.zakatReport")}
              </p>

              <div className="mt-4 space-y-3 rounded-xl bg-emerald-700 p-4 text-sm leading-6 text-emerald-50">
                <p className="font-bold">{t("summary.countableAssets")}</p>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.cashSavings")} =</span>
                  <strong>{money(baseMoneyTotal, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.foreignCurrencies", { currency })} =</span>
                  <strong>{money(foreignCurrencyTotalEur, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.otherAssetsIncluded")} =</span>
                  <strong>{money(includedOtherAssetsValue, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.otherAssetsExcluded")} =</span>
                  <strong>{money(excludedOtherAssetsValue, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.otherAssetsVerification")} =</span>
                  <strong>
                    {money(verificationOtherAssetsValue, currency)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.investmentsIncluded")} =</span>
                  <strong>{money(includedInvestmentValue, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.dividendsIncluded")} =</span>
                  <strong>
                    {money(includedInvestmentDividends, currency)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.investmentPrincipalDeducted")} =</span>
                  <strong>
                    - {money(deductedInvestmentLoanPrincipal, currency)}
                  </strong>
                </div>

                {hasConventionalInvestmentLoan && (
                  <div className="flex justify-between gap-4 text-amber-200">
                    <span>{t("summary.interestLoanVerification")}</span>
                    <strong>{t("report.needsCheck")}</strong>
                  </div>
                )}

                {hasConventionalInvestmentLoan && (
                  <div className="flex justify-between gap-4 text-amber-200">
                    <span>{t("summary.interestNotDeducted")} =</span>
                    <strong>
                      {money(undeductedInvestmentInterest, currency)}
                    </strong>
                  </div>
                )}

                <div className="flex justify-between gap-4">
                  <span>{t("nisab.gold")} =</span>
                  <strong>{money(goldValue, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("nisab.silver")} =</span>
                  <strong>{money(silverValue, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.personalJewelryIncluded")} =</span>
                  <strong>{money(zakatableJewelryValue, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.cryptoIncluded")} =</span>
                  <strong>{money(cryptoIncludedValue, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.cryptoVerification")} =</span>
                  <strong>{money(cryptoVerificationValue, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.tradeLivestock")} =</span>
                  <strong>{money(tradeLivestockValue, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.businessInventory")} =</span>
                  <strong>
                    {money(includedBusinessInventoryValue, currency)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4 border-t border-emerald-600 pt-3">
                  <span>{t("summary.deductibleDebts")} =</span>
                  <strong>- {money(deductibleLiabilities, currency)}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span>{t("summary.includedReceivables")} =</span>
                  <strong>
                    + {money(includedSecureReceivables, currency)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4 font-bold">
                  <span>{t("summary.netAssets")} =</span>
                  <strong>{money(netAssets, currency)}</strong>
                </div>

                <div className="border-t border-emerald-600 pt-3">
                  <p className="font-bold">{t("summary.youOwe")}</p>

                  <div className="mt-2 flex justify-between gap-4">
                    <span>{t("summary.monetaryZakat")} =</span>
                    <strong>{monetaryZakatResult}</strong>
                  </div>

                  {hasLivestock && (
                    <>
                      <div className="mt-2 flex justify-between gap-4">
                        <span>{sheepGoatSummaryLabel} =</span>
                        <strong className="text-right">
                          {sheepGoatZakatText}
                        </strong>
                      </div>

                      <div className="mt-2 flex justify-between gap-4">
                        <span>{cattleBuffaloSummaryLabel} =</span>
                        <strong className="text-right">
                          {cattleBuffaloPhysicalZakatText}
                        </strong>
                      </div>

                      <div className="mt-2 flex justify-between gap-4">
                        <span>{camelSummaryLabel} =</span>
                        <strong className="text-right">
                          {camelPhysicalZakatText}
                        </strong>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {hasCrops && (
              <div className="mt-6 border-t border-emerald-700 pt-6">
                <p className="text-sm font-semibold text-emerald-100">
                  {t("crop.title")}
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  {cropSummaries.map((summary) => (
                    <div
                      key={summary.id}
                      className="rounded-xl bg-emerald-700 p-3 leading-6 text-emerald-50"
                    >
                      {summary.calculated ? (
                        <>
                          <p>
                            <strong>{summary.cropName}</strong> —{" "}
                            {summary.quantityKg} kg —{" "}
                            {summary.irrigationLabel} — {summary.rateLabel} —{" "}
                            {t("report.zakat")}: {summary.zakatKg.toFixed(2)} kg
                          </p>

                          {summary.rateLabel === "7.5%" && (
                            <p className="mt-2 text-emerald-100">
                              {t("crop.mixedRateNote")}
                            </p>
                          )}
                        </>
                      ) : (
                        <p>
                          <strong>{summary.cropName}</strong> —{" "}
                          {summary.quantityKg} kg — {t("nisab.basis")}:{" "}
                          {summary.nisabKg} kg — {summary.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className={`${styles.fullOnly} mt-8 print:hidden`}>
        <CollapsibleCard
          title={t("saved.listTitle")}
          description={t("saved.helper")}
          summary={savedSectionSummary}
          warningLabel={warningLabel}
        >
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {t("saved.title")}
              </h2>

              <label className="mt-5 block text-sm font-semibold text-slate-700">
                {t("saved.nameLabel")}
                <input
                  type="text"
                  value={saveCalculationName}
                  onChange={(event) =>
                    setSaveCalculationName(event.target.value)
                  }
                  placeholder={t("saved.unnamed")}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                />
              </label>

              <button
                type="button"
                onClick={handleSaveCalculation}
                className="mt-4 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
              >
                {t("saved.saveButton")}
              </button>

              <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                {t("saved.helper")}
              </p>

              <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-100">
                {t("saved.localStorageLabel")}
              </p>

              {savedCalculationMessage && (
                <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                  {savedCalculationMessage}
                </p>
              )}
            </div>

            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-slate-950">
                  {t("saved.listTitle")}
                </h3>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleExportSavedCalculations}
                    className="w-full rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                  >
                    {t("saved.export")}
                  </button>
                  <button
                    type="button"
                    onClick={() => importBackupInputRef.current?.click()}
                    className="w-full rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 sm:w-auto"
                  >
                    {t("saved.import")}
                  </button>
                  {savedCalculations.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteAllSavedCalculations}
                      className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                    >
                      {t("saved.deleteAll")}
                    </button>
                  )}
                </div>
              </div>

              <input
                ref={importBackupInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackupFile}
                className="hidden"
              />

              <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                {t("saved.backupPrivacy")}
              </p>

              {savedCalculations.length === 0 ? (
                <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                  {t("saved.empty")}
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {savedCalculations.map((calculation) => (
                    <div
                      key={calculation.id}
                      className="rounded-xl border border-emerald-100 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {calculation.name || t("saved.unnamed")}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {t("calculationDate.savedLabel")}:{" "}
                            {formatSavedCalculationDate(
                              calculation.inputs.calculationDate,
                            )}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {t("saved.savedAt")}:{" "}
                            {formatSavedDate(calculation.savedAt)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenSavedCalculation(calculation)
                            }
                            className="w-full rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                          >
                            {t("saved.open")}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteSavedCalculation(calculation.id)
                            }
                            className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                          >
                            {t("saved.delete")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CollapsibleCard>
        </div>

        <div className={`${styles.fullOnly} mt-8 print:hidden`}>
          <CollapsibleCard
            title={t("cloud.title")}
            description={t("cloud.helper")}
            summary={
              isCheckingCloudAuth
                ? t("cloud.checking")
                : cloudUserEmail
                  ? t("cloud.count", { count: cloudCalculations.length })
                  : t("cloud.signedOutSummary")
            }
            warningLabel={warningLabel}
          >
            {isCheckingCloudAuth ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                {t("cloud.checking")}
              </p>
            ) : !cloudUserEmail ? (
              <div>
                <p className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                  {t("cloud.loginMessage")}
                </p>
                <Link
                  href="/hyr"
                  className="mt-4 inline-flex w-full justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                >
                  {t("cloud.loginButton")}
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    {t("cloud.title")}
                  </h2>

                  <p className="mt-4 rounded-xl bg-sky-50 p-3 text-sm font-semibold text-sky-950 ring-1 ring-sky-100">
                    {t("cloud.account", { email: cloudUserEmail })}
                  </p>

                  <label className="mt-5 block text-sm font-semibold text-slate-700">
                    {t("cloud.nameLabel")}
                    <input
                      type="text"
                      value={cloudCalculationName}
                      onChange={(event) =>
                        setCloudCalculationName(event.target.value)
                      }
                      placeholder={t("cloud.unnamed")}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                    />
                  </label>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleSaveCloudCalculation}
                      disabled={isSavingCloudCalculation}
                      className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {isSavingCloudCalculation
                        ? t("cloud.saving")
                        : t("cloud.saveButton")}
                    </button>
                    <button
                      type="button"
                      onClick={refreshCloudCalculations}
                      disabled={isLoadingCloudCalculations}
                      className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {isLoadingCloudCalculations
                        ? t("cloud.loading")
                        : t("cloud.refreshButton")}
                    </button>
                  </div>

                  <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                    {t("cloud.manualSaveNote")}
                  </p>

                  {cloudCalculationMessage && (
                    <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                      {cloudCalculationMessage}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {t("cloud.listTitle")}
                  </h3>

                  {isLoadingCloudCalculations ? (
                    <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                      {t("cloud.loading")}
                    </p>
                  ) : cloudCalculations.length === 0 ? (
                    <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                      {t("cloud.empty")}
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {cloudCalculations.map((calculation) => (
                        <div
                          key={calculation.id}
                          className="rounded-xl border border-sky-100 p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="font-semibold text-slate-950">
                                {calculation.name || t("cloud.unnamed")}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {t("calculationDate.savedLabel")}: {" "}
                                {formatSavedCalculationDate(
                                  calculation.calculation_date ?? undefined,
                                )}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {t("cloud.updatedAt")}: {" "}
                                {formatSavedDate(calculation.updated_at)}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenCloudCalculation(calculation)
                                }
                                className="w-full rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                              >
                                {t("cloud.open")}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCloudCalculation(calculation.id)
                                }
                                className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                              >
                                {t("cloud.delete")}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CollapsibleCard>
        </div>

        <div className={`${styles.fullOnly} mt-8 print:shadow-none`}>
        <CollapsibleCard
          title={t("report.title")}
          description={t("report.disclaimer")}
          summary={reportSectionSummary}
          hasWarning={reportSectionHasWarning}
          warningLabel={warningLabel}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                {t("report.date", { date: calculationDateText })}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {t("report.title")}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 print:hidden sm:w-auto"
            >
              {t("report.print")}
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-white p-4">
              <h3 className="font-bold text-emerald-950">
                {t("methodology.title")}
              </h3>

              <dl className="mt-4 space-y-3 text-sm">
                {methodologyReportItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between gap-4"
                  >
                    <dt className="text-slate-600">{item.label}</dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                {t("methodology.reportNote")}
              </p>
            </div>

            <details
              open
              className="rounded-xl border border-emerald-100 bg-white p-4"
            >
              <summary className="cursor-pointer list-none font-bold text-emerald-950 marker:hidden">
                {t("sources.title")}
              </summary>

              <div className="mt-4 space-y-3">
                {sunniZakatSources.map((source) => (
                  <div
                    key={source.id}
                    className="rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-950"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-bold">{source.title}</p>
                        <p className="text-emerald-900">{source.reference}</p>
                      </div>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-800 hover:underline"
                      >
                        {t("sources.open")}
                      </a>
                    </div>
                    <p className="mt-2">
                      {language === "en"
                        ? source.descriptionEn
                        : source.descriptionSq}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-100">
                <p className="font-bold">{t("sources.verificationTitle")}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>{t("sources.cryptoVerification")}</li>
                  <li>{t("sources.jewelryVerification")}</li>
                  <li>{t("sources.debtsVerification")}</li>
                  <li>{t("sources.fedLivestockVerification")}</li>
                  <li>{t("sources.specialCropsVerification")}</li>
                </ul>
              </div>
            </details>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <h3 className="font-bold text-emerald-950">
                {t("report.monetaryTitle")}
              </h3>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.assetsBeforeDebts")}
                  </dt>
                  <dd className="font-semibold">{money(totalAssets, currency)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.cryptoIncluded")}
                  </dt>
                  <dd className="font-semibold">
                    {money(cryptoIncludedValue, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.cryptoVerification")}
                  </dt>
                  <dd className="font-semibold">
                    {money(cryptoVerificationValue, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.otherAssetsIncluded")}
                  </dt>
                  <dd className="font-semibold">
                    {money(includedOtherAssetsValue, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.otherAssetsExcluded")}
                  </dt>
                  <dd className="font-semibold">
                    {money(excludedOtherAssetsValue, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.otherAssetsVerification")}
                  </dt>
                  <dd className="font-semibold">
                    {money(verificationOtherAssetsValue, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.investmentsIncluded")}
                  </dt>
                  <dd className="font-semibold">
                    {money(includedInvestmentValue, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.dividendsIncluded")}
                  </dt>
                  <dd className="font-semibold">
                    {money(includedInvestmentDividends, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.investmentPrincipalDeducted")}
                  </dt>
                  <dd className="font-semibold">
                    - {money(deductedInvestmentLoanPrincipal, currency)}
                  </dd>
                </div>
                {hasConventionalInvestmentLoan && (
                  <div className="flex justify-between gap-4 text-amber-900">
                    <dt>{t("summary.interestLoanVerification")}</dt>
                    <dd className="font-semibold">{t("report.needsCheck")}</dd>
                  </div>
                )}
                {hasConventionalInvestmentLoan && (
                  <div className="flex justify-between gap-4 text-amber-900">
                    <dt>{t("summary.interestNotDeducted")}</dt>
                    <dd className="font-semibold">
                      {money(undeductedInvestmentInterest, currency)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.includedReceivables")}
                  </dt>
                  <dd className="font-semibold">
                    + {money(includedSecureReceivables, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("summary.deductibleDebts")}
                  </dt>
                  <dd className="font-semibold">
                    - {money(deductibleLiabilities, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-emerald-200 pt-3">
                  <dt className="font-semibold text-slate-700">
                    {t("summary.netAssets")}
                  </dt>
                  <dd className="font-bold">{money(netAssets, currency)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">{t("summary.nisabBasis")}</dt>
                  <dd className="font-semibold text-right">
                    {nisabBasisSummary}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">
                    {t("report.calculatedNisab")}
                  </dt>
                  <dd className="font-semibold">
                    {nisabIsValid
                      ? money(calculatedNisabEur, "EUR")
                      : t("summary.needsCompletion")}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">{t("summary.lunarYear")}</dt>
                  <dd className="font-semibold">{lunarYearLabel}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">{t("summary.status")}</dt>
                  <dd className="font-semibold">{monetaryStatus}</dd>
                </div>
                {showFinalMonetaryZakat && (
                  <div className="flex justify-between gap-4 rounded-lg bg-emerald-700 px-3 py-2 text-white">
                    <dt>{t("summary.monetaryZakat")}</dt>
                    <dd className="font-bold">{monetaryZakatResult}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-white p-4">
              <h3 className="font-bold text-emerald-950">
                {t("payments.title")}
              </h3>

              {!showFinalMonetaryZakat ? (
                <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                  {t("payments.inactive")}
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-600">
                        {t("payments.required")}
                      </dt>
                      <dd className="font-semibold">
                        {money(zakat, currency)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-600">
                        {t("payments.totalPaid")}
                      </dt>
                      <dd className="font-semibold">
                        {money(monetaryZakatPaidTotal, currency)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-emerald-100 pt-3">
                      <dt className="font-semibold text-slate-700">
                        {t("payments.remaining")}
                      </dt>
                      <dd className="font-bold">
                        {money(monetaryZakatRemaining, currency)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-600">
                        {t("plannedPayments.total")}
                      </dt>
                      <dd className="font-semibold">
                        {money(plannedMonetaryZakatTotal, currency)}
                      </dd>
                    </div>
                  </dl>

                  {monetaryZakatPaymentsExceed && (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-100">
                      {t("payments.exceeds")}
                    </p>
                  )}

                  {plannedMonetaryZakatPaymentsExceed && (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-100">
                      {t("plannedPayments.exceeds")}
                    </p>
                  )}

                  <div className="space-y-3 print:hidden">
                    {monetaryZakatPayments.map((payment, index) => (
                      <div
                        key={payment.id}
                        className="rounded-xl border border-emerald-100 p-3"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-semibold text-slate-900">
                            {t("payments.item", { index: index + 1 })}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              removeMonetaryZakatPayment(payment.id)
                            }
                            className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                          >
                            {t("payments.remove")}
                          </button>
                        </div>

                        <div className="mt-3 grid gap-3 lg:grid-cols-2">
                          <label className="block text-sm font-semibold text-slate-700">
                            {t("payments.date")}
                            <input
                              type="date"
                              value={payment.paymentDate}
                              onChange={(event) =>
                                updateMonetaryZakatPayment(payment.id, {
                                  paymentDate: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          <label className="block text-sm font-semibold text-slate-700">
                            {t("payments.amount")}
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={payment.amount}
                              onChange={(event) =>
                                updateMonetaryZakatPayment(payment.id, {
                                  amount: event.target.value,
                                })
                              }
                              placeholder="0.00"
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>

                          <label className="block text-sm font-semibold text-slate-700 lg:col-span-2">
                            {t("payments.note")}
                            <input
                              type="text"
                              value={payment.note}
                              onChange={(event) =>
                                updateMonetaryZakatPayment(payment.id, {
                                  note: event.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                            />
                          </label>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addMonetaryZakatPayment}
                      className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                    >
                      {t("payments.add")}
                    </button>
                  </div>

                  {monetaryZakatPayments.length > 0 && (
                    <div className="hidden space-y-2 text-sm print:block">
                      {monetaryZakatPayments.map((payment) => (
                        <p key={payment.id}>
                          {formatDateInputValue(payment.paymentDate, language)}:{" "}
                          {money(Math.max(toNumber(payment.amount), 0), currency)}
                          {payment.note.trim()
                            ? ` - ${payment.note.trim()}`
                            : ""}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="rounded-xl border border-emerald-100 p-4">
                    <h4 className="font-bold text-emerald-950">
                      {t("plannedPayments.title")}
                    </h4>

                    <div className="mt-4 grid gap-3 lg:grid-cols-2 print:hidden">
                      <label className="block text-sm font-semibold text-slate-700">
                        {t("plannedPayments.amount")}
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={plannedPaymentAmount}
                          onChange={(event) =>
                            setPlannedPaymentAmount(event.target.value)
                          }
                          placeholder="0.00"
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                        />
                      </label>

                      <label className="block text-sm font-semibold text-slate-700">
                        {t("plannedPayments.date")}
                        <input
                          type="date"
                          value={plannedPaymentDate}
                          onChange={(event) =>
                            setPlannedPaymentDate(event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                        />
                      </label>

                      <label className="block text-sm font-semibold text-slate-700 lg:col-span-2">
                        {t("plannedPayments.note")}
                        <input
                          type="text"
                          value={plannedPaymentNote}
                          onChange={(event) =>
                            setPlannedPaymentNote(event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={addPlannedMonetaryZakatPayment}
                        className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                      >
                        {t("plannedPayments.register")}
                      </button>
                    </div>

                    {plannedMonetaryZakatPayments.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {plannedMonetaryZakatPayments.map((payment) => (
                          <div
                            key={payment.id}
                            className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-950"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="font-bold">
                                  {formatDateInputValue(
                                    payment.plannedDate,
                                    language,
                                  )}{" "}
                                  -{" "}
                                  {money(
                                    Math.max(toNumber(payment.amount), 0),
                                    currency,
                                  )}
                                </p>
                                {payment.note.trim() && (
                                  <p>{payment.note.trim()}</p>
                                )}
                              </div>

                              <div className="flex flex-col gap-2 print:hidden sm:flex-row">
                                <button
                                  type="button"
                                  onClick={() =>
                                    markPlannedPaymentAsPaid(payment)
                                  }
                                  className="w-full rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800 sm:w-auto"
                                >
                                  {t("plannedPayments.markPaid")}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removePlannedMonetaryZakatPayment(
                                      payment.id,
                                    )
                                  }
                                  className="w-full rounded-xl border border-amber-200 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-50 sm:w-auto"
                                >
                                  {t("plannedPayments.remove")}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-100">
                      {t("plannedPayments.noteText")}
                    </p>
                  </div>

                  <p className="rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                    {t("payments.noteText")}
                  </p>
                </div>
              )}
            </div>

            {showFinalMonetaryZakat && (
              <div className="rounded-xl border border-emerald-100 bg-white p-4">
                <h3 className="font-bold text-emerald-950">
                  {t("allocations.title")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t("allocations.helper")}
                </p>
                <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                  {t("allocations.transparencyNote")}
                </p>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">
                      {t("allocations.required")}
                    </dt>
                    <dd className="font-semibold">{money(zakat, currency)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">
                      {t("allocations.planned")}
                    </dt>
                    <dd className="font-semibold">
                      {money(plannedAllocationTotal, currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-emerald-100 pt-3">
                    <dt className="font-semibold text-slate-700">
                      {t("allocations.remaining")}
                    </dt>
                    <dd className="font-bold">
                      {money(plannedAllocationRemaining, currency)}
                    </dd>
                  </div>
                </dl>

                {plannedAllocationExceeds && (
                  <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-100">
                    {t("allocations.exceeds")}
                  </p>
                )}

                {plannedZakatAllocations.length === 0 && (
                  <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                    {t("allocations.empty")}
                  </p>
                )}

                <div className="mt-4 space-y-3 print:hidden">
                  {plannedZakatAllocations.map((allocation, index) => (
                    <div
                      key={allocation.id}
                      className="rounded-xl border border-emerald-100 p-3"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-semibold text-slate-900">
                          {t("allocations.item", { index: index + 1 })}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            removePlannedZakatAllocation(allocation.id)
                          }
                          className="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50 sm:w-auto"
                        >
                          {t("allocations.remove")}
                        </button>
                      </div>

                      <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          {t("allocations.category")}
                          <select
                            value={allocation.category}
                            onChange={(event) =>
                              updatePlannedZakatAllocation(allocation.id, {
                                category: event.target
                                  .value as ZakatAllocationCategory,
                              })
                            }
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"
                          >
                            <option value="poorNeedy">
                              {t("allocations.category.poorNeedy")}
                            </option>
                            <option value="administrators">
                              {t("allocations.category.administrators")}
                            </option>
                            <option value="hearts">
                              {t("allocations.category.hearts")}
                            </option>
                            <option value="slavery">
                              {t("allocations.category.slavery")}
                            </option>
                            <option value="debtors">
                              {t("allocations.category.debtors")}
                            </option>
                            <option value="cause">
                              {t("allocations.category.cause")}
                            </option>
                            <option value="traveler">
                              {t("allocations.category.traveler")}
                            </option>
                          </select>
                          {allocation.category === "poorNeedy" && (
                            <span className="mt-2 block text-xs leading-5 text-slate-500">
                              {t("allocations.category.poorNeedyHelper")}
                            </span>
                          )}
                        </label>

                        <label className="block text-sm font-semibold text-slate-700">
                          {t("allocations.description")}
                          <input
                            type="text"
                            value={allocation.description}
                            onChange={(event) =>
                              updatePlannedZakatAllocation(allocation.id, {
                                description: event.target.value,
                              })
                            }
                            placeholder={t("allocations.descriptionPlaceholder")}
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                          />
                        </label>

                        <label className="block text-sm font-semibold text-slate-700">
                          {t("allocations.amount")}
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={allocation.amount}
                            onChange={(event) => {
                              const nextAmount = event.target.value;

                              if (Number(nextAmount) < 0) {
                                return;
                              }

                              updatePlannedZakatAllocation(allocation.id, {
                                amount: nextAmount,
                              });
                            }}
                            placeholder="0.00"
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                          />
                        </label>

                        <label className="block text-sm font-semibold text-slate-700">
                          {t("allocations.note")}
                          <input
                            type="text"
                            value={allocation.note}
                            onChange={(event) =>
                              updatePlannedZakatAllocation(allocation.id, {
                                note: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                          />
                        </label>
                      </div>

                      {allocationVerificationCategories.includes(
                        allocation.category,
                      ) && (
                        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-100">
                          {t("allocations.categoryVerification")}
                        </p>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addPlannedZakatAllocation}
                    className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 sm:w-auto"
                  >
                    {t("allocations.add")}
                  </button>
                </div>

                {positivePlannedZakatAllocations.length > 0 && (
                  <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                    <h4 className="font-bold">
                      {t("allocations.reportTitle")}
                    </h4>
                    <p className="mt-1 text-sm">
                      {t("allocations.reportCoverage")}
                    </p>
                    <div className="mt-3 space-y-2">
                      {positivePlannedZakatAllocations.map((allocation) => (
                        <div
                          key={allocation.id}
                          className="flex justify-between gap-4"
                        >
                          <span>
                            {allocationCategoryLabel(allocation.category)}
                            {allocation.description.trim()
                              ? ` - ${allocation.description.trim()}`
                              : ""}
                            {allocation.note.trim()
                              ? ` (${allocation.note.trim()})`
                              : ""}
                          </span>
                          <strong>
                            {money(toNumber(allocation.amount), currency)}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                  {t("allocations.sourceNote")}
                </p>
              </div>
            )}

            {otherAssetSummaries.length > 0 && (
              <div className="rounded-xl border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-950">
                  {t("otherAssets.reportTitle")}
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  {otherAssetSummaries.map((item) =>
                    item.isInvestment ? (
                      <div
                        key={item.id}
                        className="rounded-lg bg-slate-50 p-3"
                      >
                        <p className="font-bold text-slate-800">{item.label}</p>
                        <dl className="mt-2 space-y-1.5">
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-600">
                              {t("report.investmentTreatment")}
                            </dt>
                            <dd className="text-right font-semibold">
                              {investmentPurposeLabel(item.purpose)}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-600">
                              {t("report.investmentIncluded")}
                            </dt>
                            <dd className="font-semibold">
                              {money(item.includedValue, currency)}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-600">
                              {t("report.investmentExcluded")}
                            </dt>
                            <dd className="font-semibold">
                              {money(
                                item.excludedValue + item.verificationValue,
                                currency,
                              )}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-600">
                              {t("summary.dividendsIncluded")}
                            </dt>
                            <dd className="font-semibold">
                              {money(item.includedDividends, currency)}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-600">
                              {t("report.loanType")}
                            </dt>
                            <dd className="text-right font-semibold">
                              {investmentLoanTypeLabel(item.loanType)}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-600">
                              {t("report.principalDeduction")}
                            </dt>
                            <dd className="font-semibold">
                              - {money(item.principalDeduction, currency)}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-600">
                              {t("report.interestNotDeducted")}
                            </dt>
                            <dd className="font-semibold">
                              {money(item.interestNotDeducted, currency)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ) : (
                      <div
                        key={item.id}
                        className="flex justify-between gap-4"
                      >
                        <span className="text-slate-600">
                          {item.label} -{" "}
                          {otherAssetTreatmentLabel(item.treatment)}
                        </span>
                        <strong>{money(item.value, currency)}</strong>
                      </div>
                    ),
                  )}
                </div>

                {hasConventionalInvestmentLoan && (
                  <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950 ring-1 ring-amber-200">
                    {t("report.ribaNote")}
                  </p>
                )}
              </div>
            )}

            {hasLivestock &&
              (grazingSheepGoatTotal > 0 ||
                grazingCattleBuffaloTotal > 0 ||
                grazingCamelTotal > 0 ||
                fedLivestockRequiresMethodology) && (
              <div className="rounded-xl border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-950">
                  {livestockReportTitle}
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <p>
                    {t("livestock.fedMethodologyShortTitle")}:{" "}
                    <strong>{fedLivestockMethodologyLabel}</strong>
                  </p>

                  {fedLivestockMajorityExcluded && (
                    <p>{t("livestock.fedMajorityNote")}</p>
                  )}

                  {grazingSheepGoatTotal > 0 && (
                    <p>
                      {t("report.sheepGoats")}: {grazingSheepGoatTotal}{" "}
                      {livestockCountLabel} → {sheepGoatZakatText}
                    </p>
                  )}
                  {grazingCattleBuffaloTotal > 0 && (
                    <p>
                      {t("report.cattleBuffalo")}:{" "}
                      {grazingCattleBuffaloTotal} {livestockCountLabel} →{" "}
                      {cattleBuffaloPhysicalZakatText}
                    </p>
                  )}
                  {grazingCamelTotal > 0 && (
                    <p>
                      {t("report.camels")}: {grazingCamelTotal}{" "}
                      {livestockCountLabel} → {camelPhysicalZakatText}
                    </p>
                  )}
                </div>
              </div>
            )}

            {reportCropSummaries.length > 0 && (
              <div className="rounded-xl border border-emerald-100 p-4">
                <h3 className="font-bold text-emerald-950">
                  {t("report.cropTitle")}
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  {reportCropSummaries.map((summary) => (
                    <p key={summary.id}>
                      {summary.cropName}: {summary.quantityKg} kg →{" "}
                      {summary.calculated
                        ? `${summary.zakatKg.toFixed(2)} kg ${t("report.zakat")}`
                        : summary.message}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {reportVerificationItems.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="font-bold text-amber-950">
                  {t("report.verificationTitle")}
                </h3>

                <ul className="mt-4 space-y-2 text-sm text-amber-950">
                  {reportVerificationItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
            {t("report.disclaimer")}
          </p>
        </CollapsibleCard>
        </div>

        <footer className={styles.credit}>
          {t("footer.preparedBy")} <strong>Besnik Kaleci</strong>
        </footer>
      </div>
    </main>
  );
}

function CalculatorModeBoundary() {
  const searchParams = useSearchParams();
  const isSimpleMode = searchParams.get("mode") !== "full";

  return (
    <KalkuloPageContent
      key={isSimpleMode ? "simple" : "full"}
      isSimpleMode={isSimpleMode}
    />
  );
}

export default function KalkuloPage() {
  return (
    <Suspense
      fallback={
        <main className={`${styles.shell} min-h-screen px-4 py-6 sm:px-6 md:py-10`}>
          <div className={styles.container}>
            <p className="rounded-2xl bg-white p-6 text-center text-sm font-semibold text-emerald-900 shadow-sm">
              Duke hapur kalkulatorin...
            </p>
          </div>
        </main>
      }
    >
      <CalculatorModeBoundary />
    </Suspense>
  );
}
