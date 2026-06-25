import { EF, FOOD_KG_PER_PERSON_YEAR, CANTONS, ELECTRICITY_BASE_2PERSON_KWH } from './data.js'

// Dominant heating fuel for a canton — used to drive the calculator's
// single-fuel selector default. Households can override this in the UI.
export function dominantHeatingType(cantonCode) {
  const mix = CANTONS[cantonCode].heatingMix
  return Object.entries(mix).sort((a, b) => b[1] - a[1])[0][0]
}

export function calculateFootprint({
  cantonCode,
  householdSize,
  heatingType,
  dietType,
  carKm,
  carFuel,
  publicTransportKm,
  flightsPerYear,
  monthlySpendCHF,
}) {
  // --- Energy ---
  const electricityKwh = ELECTRICITY_BASE_2PERSON_KWH * (householdSize / 2)
  const electricityEmissions = electricityKwh * EF.electricity

  const heatingKwh = 4000 * householdSize // proxy basis, consistent with Excel model Inputs tab
  let heatingEmissions
  if (heatingType === 'heatpump') {
    heatingEmissions = (heatingKwh * EF.electricity) / EF.heating.heatpump_cop
  } else {
    heatingEmissions = heatingKwh * EF.heating[heatingType]
  }

  const energyTotal = electricityEmissions + heatingEmissions

  // --- Mobility ---
  const carEmissions = carKm * EF.car[carFuel]
  const ptEmissions = publicTransportKm * EF.publicTransport
  const flightEmissions = flightsPerYear * EF.flightPerTripKg // already in kg CO2e per trip
  const mobilityTotal = carEmissions + ptEmissions + flightEmissions

  // --- Food ---
  const foodTotal = FOOD_KG_PER_PERSON_YEAR * householdSize * EF.diet[dietType]

  // --- Goods & consumption ---
  const annualSpend = monthlySpendCHF * 12
  const goodsTotal = annualSpend * EF.goodsSpend

  const totalKg = energyTotal + mobilityTotal + foodTotal + goodsTotal
  const totalT = totalKg / 1000
  const perCapitaT = totalT / householdSize

  return {
    energy: energyTotal / 1000,
    mobility: mobilityTotal / 1000,
    food: foodTotal / 1000,
    goods: goodsTotal / 1000,
    total: totalT,
    perCapita: perCapitaT,
  }
}
