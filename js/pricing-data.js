// Genki station pricing — locked source of truth.
// Lite vs Standard differ ONLY in visit cadence and reload quantity;
// hardware and 70/30 product mix are identical across tiers.
// Setup fee is one-time at activation and excludes products.

(function () {
  const PRICING = {
    counter: {
      name: 'Counter',
      nameKey: 'station_counter_name',
      descriptorKey: 'station_counter_descriptor',
      setupFee: 1190,
      sweetSpot: { lite: '25–35', standard: '35–60' },
      lite:     { price: 890,   visits: 4, products: 220  },
      standard: { price: 1290,  visits: 8, products: 440  }
    },
    towerDry: {
      name: 'Tower Dry',
      nameKey: 'station_tower_dry_name',
      descriptorKey: 'station_tower_dry_descriptor',
      setupFee: 2290,
      sweetSpot: { lite: '60–80', standard: '80–120' },
      lite:     { price: 1490,  visits: 4, products: 540  },
      standard: { price: 2290,  visits: 8, products: 1000 }
    },
    towerFridge: {
      name: 'Tower Fridge',
      nameKey: 'station_tower_fridge_name',
      descriptorKey: 'station_tower_fridge_descriptor',
      setupFee: 2590,
      sweetSpot: { lite: '80–120', standard: '100–150' },
      lite:     { price: 1990,  visits: 4, products: 720  },
      standard: { price: 2790,  visits: 8, products: 1300 }
    },
    hub: {
      name: 'Hub',
      nameKey: 'station_hub_name',
      descriptorKey: 'station_hub_descriptor',
      setupFee: 5990,
      sweetSpot: { lite: '150–200', standard: '250–400' },
      lite:     { price: 4490,  visits: 6,  products: 2000 },
      standard: { price: 8490,  visits: 12, products: 5000 }
    }
  };

  window.PRICING = PRICING;
})();
