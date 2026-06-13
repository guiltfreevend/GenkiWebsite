// Genki station pricing — locked source of truth.
// Lite vs Standard differ ONLY in visit cadence and reload quantity;
// hardware and product quality are identical across tiers.
// The activation fee (field: setupFee) is one-time and excludes products.
// sweetSpot.{lite,standard}.{min,max,default} drive the per-card "people in
// the office per day" slider (daily on-site attendance the station serves).

(function () {
  const PRICING = {
    desk: {
      name: 'Desk',
      nameKey: 'station_desk_name',
      descriptorKey: 'station_desk_descriptor',
      setupFee: 1190,
      sweetSpot: {
        lite:     { min: 6,  max: 14, default: 10 },
        standard: { min: 14, max: 26, default: 20 }
      },
      lite:     { price: 890,   visits: 4, products: 220  },
      standard: { price: 1290,  visits: 8, products: 440  }
    },
    towerDry: {
      name: 'Tower Dry',
      nameKey: 'station_tower_dry_name',
      descriptorKey: 'station_tower_dry_descriptor',
      setupFee: 2290,
      sweetSpot: {
        lite:     { min: 18, max: 32, default: 25 },
        standard: { min: 38, max: 58, default: 48 }
      },
      lite:     { price: 1490,  visits: 4, products: 540  },
      standard: { price: 2290,  visits: 8, products: 1000 }
    },
    towerFridge: {
      name: 'Tower Fridge',
      nameKey: 'station_tower_fridge_name',
      descriptorKey: 'station_tower_fridge_descriptor',
      setupFee: 2590,
      sweetSpot: {
        lite:     { min: 26, max: 44, default: 34 },
        standard: { min: 50, max: 74, default: 62 }
      },
      lite:     { price: 1990,  visits: 4, products: 720  },
      standard: { price: 2790,  visits: 8, products: 1300 }
    },
    hub: {
      name: 'Hub',
      nameKey: 'station_hub_name',
      descriptorKey: 'station_hub_descriptor',
      setupFee: 5990,
      sweetSpot: {
        lite:     { min: 70,  max: 120, default: 95  },
        standard: { min: 180, max: 300, default: 240 }
      },
      lite:     { price: 4490,  visits: 6,  products: 2000 },
      standard: { price: 8490,  visits: 12, products: 5000 }
    }
  };

  window.PRICING = PRICING;
})();
