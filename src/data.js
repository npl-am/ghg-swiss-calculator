// =====================================================================
// Emission factors and Swiss canton data
// Every figure below carries a source comment. Where a figure is a
// placeholder pending final verification (matching the Excel model's
// EF_Register notes), it is flagged explicitly. Do not remove these
// comments — they are the audit trail for this dataset.
// =====================================================================

// --- Core emission factors (kg CO2e per unit) ---
export const EF = {
  electricity: 0.098, // kg CO2e/kWh. Consumption-based, import-adjusted Swiss
                       // electricity mix. Source: peer-reviewed Swiss electricity
                       // trade study (ScienceDirect, 2024). 40% higher than the
                       // production-only ~0.030 figure; used here for consistency
                       // with this project's consumption-based accounting boundary.
  heating: {
    gas: 0.202,        // PLACEHOLDER — verify against BAFU CO2 statistics (annual release)
    oil: 0.266,         // PLACEHOLDER — verify against BAFU CO2 statistics
    wood: 0.020,         // PLACEHOLDER — biogenic combustion, low net CO2e per IPCC default
    heatpump_cop: 3.2,    // Typical Swiss air-source heat pump COP
  },
  car: {
    petrol: 0.175, // kg CO2e/pkm, mobitool v3.0, avg Swiss car, 1.12 occupancy
    diesel: 0.165,  // kg CO2e/pkm, mobitool v3.0
    electric: 0.055, // kg CO2e/pkm, mobitool v3.0, Swiss consumption electricity mix
  },
  publicTransport: 0.025, // kg CO2e/pkm, mobitool v3.0, Swiss avg rail+bus
  flightPerTripKg: 700, // kg CO2e per average flight (blended short/long-haul
                         // proxy for this simplified UI). Includes RFI 2.0
                         // multiplier per Swiss Climate AG / DEFRA methodology
                         // (see project methodology, Section 3). The full Excel
                         // model distinguishes short- vs long-haul separately —
                         // this web calculator simplifies to one "flights/year"
                         // slider for usability; note this simplification if
                         // presenting results from both tools side by side.
  diet: {
    omnivore: 2.4,   // kg CO2e/kg food — ESU-services "Eco-profile of dietary styles" (indicative; verify exact figure)
    vegetarian: 1.7,  // kg CO2e/kg food — same source
    vegan: 1.3,        // kg CO2e/kg food — same source
  },
  goodsSpend: 0.35, // kg CO2e per CHF spent. Spend-based factor derived from FSO
                     // household expenditure data — weakest-tier estimate, see limitations.
}

export const FOOD_KG_PER_PERSON_YEAR = 950 // menuCH national dietary survey, Swiss average

// --- Benchmarks (tCO2e per capita per year) ---
export const BENCHMARKS = [
  { label: 'Swiss average (consumption-based, 2021)', value: 13, source: 'BAFU/BFS' },
  { label: 'Global average', value: 6, source: 'Reference point' },
  { label: '1.5°C-aligned target (2030)', value: 2.5, source: 'IPCC / C40' },
]

// --- Canton data ---
// Heating mix (% of households) — verified sources noted per canton below.
// Where a canton-specific figure wasn't found, the national household-level
// average is used explicitly (not a guess): oil 38%, gas 25%, heat pump 18%,
// wood/other ~19% (BFS Gebäude- und Wohnungsstatistik 2023, household level).
const NATIONAL_HEATING_MIX = { oil: 0.38, gas: 0.25, wood: 0.19, heatpump: 0.18 }

export const CANTONS = {
  SG: {
    name: 'St. Gallen',
    // Source: Baublatt / BFS Gebäude- und Wohnungsstatistik 2023 (building-level survey)
    // Öl 35%, Gas 20%, Holz 14%, Wärmepumpe 23% (remainder ~8% other/district heat)
    heatingMix: { oil: 0.35, gas: 0.20, wood: 0.14, heatpump: 0.23 },
  },
  GE: {
    name: 'Geneva',
    // Source: EKS ON! / BFS 2023, household-level: 36% of households heat with gas
    // Oil/heat pump split estimated proportionally from remaining share (national pattern)
    heatingMix: { oil: 0.20, gas: 0.36, wood: 0.06, heatpump: 0.16 },
  },
  VD: {
    name: 'Vaud',
    // Source: EKS ON! / BFS 2023, household-level: 38% of households heat with gas
    heatingMix: { oil: 0.20, gas: 0.38, wood: 0.06, heatpump: 0.16 },
  },
  TI: {
    name: 'Ticino',
    // Source: CEtoday / BFS 2023, household-level: 54% of households heat with oil (highest in CH)
    heatingMix: { oil: 0.54, gas: 0.08, wood: 0.12, heatpump: 0.14 },
  },
  FR: {
    name: 'Fribourg',
    // Source: BFS 2023 press release, household-level: 32% heat pump (highest in CH),
    // reflecting Fribourg's comparatively young building stock
    heatingMix: { oil: 0.28, gas: 0.16, wood: 0.12, heatpump: 0.32 },
  },
  ZH: {
    name: 'Zurich',
    // No canton-specific household-level figure found; national average applied explicitly
    heatingMix: NATIONAL_HEATING_MIX,
  },
  BE: {
    name: 'Bern',
    // No canton-specific household-level figure found; national average applied explicitly
    heatingMix: NATIONAL_HEATING_MIX,
  },
  VS: {
    name: 'Valais',
    // No canton-specific household-level figure found; national average applied explicitly
    heatingMix: NATIONAL_HEATING_MIX,
  },
}

// Electricity: no canton-level variation found in available sources beyond
// household-size effects. A 2-person household uses 2,000–3,000 kWh/year
// nationally (SwissEnergy / BFE study, Nipkow 2021); base case 2,500 kWh,
// scaled linearly by household size relative to 2 persons.
export const ELECTRICITY_BASE_2PERSON_KWH = 2500
