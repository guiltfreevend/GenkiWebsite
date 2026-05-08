// Genki station pricing — locked source of truth.
// Lite vs Standard differ ONLY in visit cadence and reload quantity;
// hardware and product quality are identical across tiers.
// Setup fee is one-time at activation and excludes products.
// sweetSpot.{lite,standard}.{min,max,default} drive the per-card headcount slider.

(function () {
  const PRICING = {
    desk: {
      name: 'Desk',
      nameKey: 'station_desk_name',
      descriptorKey: 'station_desk_descriptor',
      setupFee: 1190,
      sweetSpot: {
        lite:     { min: 25, max: 35, default: 30 },
        standard: { min: 35, max: 60, default: 45 }
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
        lite:     { min: 60, max: 80,  default: 70  },
        standard: { min: 80, max: 120, default: 100 }
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
        lite:     { min: 80,  max: 120, default: 100 },
        standard: { min: 100, max: 150, default: 125 }
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
        lite:     { min: 150, max: 200, default: 175 },
        standard: { min: 250, max: 400, default: 325 }
      },
      lite:     { price: 4490,  visits: 6,  products: 2000 },
      standard: { price: 8490,  visits: 12, products: 5000 }
    }
  };

  window.PRICING = PRICING;
})();
