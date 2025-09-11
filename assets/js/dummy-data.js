// PharmaShield Admin - Dummy Data
// Admin credentials (mock)
const ADMIN_CRED = { username: "admin", password: "pharmashield123" };

// Pharmacies
const pharmacies = [
  { 
    id: 1, 
    name: "GreenLife Pharmacy", 
    city: "Manila, Philippines", 
    coords: [14.5995, 120.9842], 
    status: "Active", 
    registered: "2024-01-15",
    history: [
      {shipId: "S-101", status: "Delivered", date: "2025-01-08"},
      {shipId: "S-105", status: "Delivered", date: "2025-01-05"}
    ] 
  },
  { 
    id: 2, 
    name: "HealthPlus Pharmacy", 
    city: "Cebu, Philippines", 
    coords: [10.3157, 123.8854], 
    status: "Active", 
    registered: "2024-02-20",
    history: [
      {shipId: "S-110", status: "In Transit", date: "2025-01-10"}
    ] 
  },
  { 
    id: 3, 
    name: "MedCare Center", 
    city: "Davao, Philippines", 
    coords: [7.1907, 125.4553], 
    status: "Active", 
    registered: "2024-03-10",
    history: [] 
  },
  { 
    id: 4, 
    name: "CityHealth Drugstore", 
    city: "Bangkok, Thailand", 
    coords: [13.7563, 100.5018], 
    status: "Active", 
    registered: "2024-04-01",
    history: [
      {shipId: "S-112", status: "Delivered", date: "2025-01-07"}
    ] 
  },
  { 
    id: 5, 
    name: "MediCore Pharmacy", 
    city: "Ho Chi Minh, Vietnam", 
    coords: [10.8231, 106.6297], 
    status: "Suspended", 
    registered: "2024-05-15",
    history: [] 
  }
];

// Users
const users = [
  { 
    id: 1, 
    name: "Ana Santos", 
    region: "NCR", 
    role: "Pharmacist", 
    status: "Active", 
    scans: [
      {batch: "B-101", date: "2025-01-11", incident: null},
      {batch: "B-103", date: "2025-01-09", incident: null}
    ] 
  },
  { 
    id: 2, 
    name: "John Cruz", 
    region: "Visayas", 
    role: "Customer", 
    status: "Active", 
    scans: [
      {batch: "B-102", date: "2025-01-08", incident: "duplicate"},
      {batch: "B-102", date: "2025-01-08", incident: "duplicate"}
    ] 
  },
  { 
    id: 3, 
    name: "Maria Rodriguez", 
    region: "Mindanao", 
    role: "Pharmacist", 
    status: "Active", 
    scans: [
      {batch: "B-104", date: "2025-01-10", incident: null}
    ] 
  },
  { 
    id: 4, 
    name: "David Kim", 
    region: "International", 
    role: "Inspector", 
    status: "Active", 
    scans: [
      {batch: "B-105", date: "2025-01-09", incident: "expired"}
    ] 
  }
];

// Batches
const batches = [
  { 
    id: "B-101", 
    name: "Paracetamol 500mg", 
    lot: "L-2025-001", 
    expiry: "2026-03-01", 
    qty: 1000, 
    status: "Available" 
  },
  { 
    id: "B-102", 
    name: "Amoxicillin 250mg", 
    lot: "L-2025-015", 
    expiry: "2025-11-01", 
    qty: 500, 
    status: "Assigned" 
  },
  { 
    id: "B-103", 
    name: "Ibuprofen 200mg", 
    lot: "L-2025-022", 
    expiry: "2026-08-15", 
    qty: 750, 
    status: "Available" 
  },
  { 
    id: "B-104", 
    name: "Aspirin 81mg", 
    lot: "L-2025-033", 
    expiry: "2026-12-01", 
    qty: 2000, 
    status: "Assigned" 
  },
  { 
    id: "B-105", 
    name: "Metformin 500mg", 
    lot: "L-2024-088", 
    expiry: "2024-12-01", 
    qty: 300, 
    status: "Expired" 
  }
];

// Shipments (distribution)
const shipments = [
  { 
    id: "S-101", 
    batchId: "B-101", 
    pharmacyId: 1, 
    created: "2025-01-05", 
    status: "Delivered",
    tracking: [
      {status: "Created", date: "2025-01-05", location: "Warehouse Manila"},
      {status: "In Transit", date: "2025-01-06", location: "Distribution Center"},
      {status: "Delivered", date: "2025-01-08", location: "GreenLife Pharmacy"}
    ]
  },
  { 
    id: "S-110", 
    batchId: "B-102", 
    pharmacyId: 2, 
    created: "2025-01-08", 
    status: "In Transit",
    tracking: [
      {status: "Created", date: "2025-01-08", location: "Warehouse Manila"},
      {status: "In Transit", date: "2025-01-10", location: "En route to Cebu"}
    ]
  },
  { 
    id: "S-105", 
    batchId: "B-103", 
    pharmacyId: 1, 
    created: "2025-01-03", 
    status: "Delivered",
    tracking: [
      {status: "Created", date: "2025-01-03", location: "Warehouse Manila"},
      {status: "In Transit", date: "2025-01-04", location: "Distribution Center"},
      {status: "Delivered", date: "2025-01-05", location: "GreenLife Pharmacy"}
    ]
  },
  { 
    id: "S-112", 
    batchId: "B-104", 
    pharmacyId: 4, 
    created: "2025-01-05", 
    status: "Delivered",
    tracking: [
      {status: "Created", date: "2025-01-05", location: "Warehouse Bangkok"},
      {status: "In Transit", date: "2025-01-06", location: "International Hub"},
      {status: "Delivered", date: "2025-01-07", location: "CityHealth Drugstore"}
    ]
  }
];

// Map markers (combine pharmacies + flagged users)
const markers = [
  { 
    id: "P1", 
    type: "pharmacy", 
    name: "GreenLife Pharmacy", 
    coords: [14.5995, 120.9842], 
    incident: null,
    lastScan: "2025-01-11"
  },
  { 
    id: "P2", 
    type: "pharmacy", 
    name: "HealthPlus Pharmacy", 
    coords: [10.3157, 123.8854], 
    incident: null,
    lastScan: "2025-01-10"
  },
  { 
    id: "P3", 
    type: "pharmacy", 
    name: "MedCare Center", 
    coords: [7.1907, 125.4553], 
    incident: null,
    lastScan: "2025-01-09"
  },
  { 
    id: "P4", 
    type: "pharmacy", 
    name: "CityHealth Drugstore", 
    coords: [13.7563, 100.5018], 
    incident: null,
    lastScan: "2025-01-09"
  },
  { 
    id: "P5", 
    type: "pharmacy", 
    name: "MediCore Pharmacy", 
    coords: [10.8231, 106.6297], 
    incident: "suspicious",
    lastScan: "2024-12-15"
  },
  { 
    id: "U2", 
    type: "user", 
    name: "John Cruz (Duplicate Scanner)", 
    coords: [10.3157, 123.8854], 
    incident: "duplicate",
    lastScan: "2025-01-08"
  },
  { 
    id: "U4", 
    type: "user", 
    name: "David Kim (Expired Token)", 
    coords: [13.7563, 100.5018], 
    incident: "expired",
    lastScan: "2025-01-09"
  }
];

// Alerts (monitoring)
const alerts = [
  { 
    id: 1, 
    type: "duplicate", 
    message: "Duplicate scan detected for batch B-102 by John Cruz at HealthPlus Pharmacy", 
    date: "2025-01-08",
    severity: "high"
  },
  { 
    id: 2, 
    type: "expired", 
    message: "Expired token detected for Batch B-105 by David Kim", 
    date: "2025-01-09",
    severity: "medium"
  },
  { 
    id: 3, 
    type: "suspicious", 
    message: "Suspicious scanning pattern detected at MediCore Pharmacy", 
    date: "2024-12-15",
    severity: "high"
  },
  { 
    id: 4, 
    type: "system", 
    message: "System maintenance completed successfully", 
    date: "2025-01-10",
    severity: "low"
  }
];

// Chart data
const chartData = {
  scansOverTime: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Valid Scans',
      data: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 3200, 2800, 3100, 2600, 2900],
      borderColor: '#2ecc71',
      backgroundColor: 'rgba(46, 204, 113, 0.1)',
      tension: 0.4
    }, {
      label: 'Flagged Scans',
      data: [45, 89, 120, 180, 95, 130, 165, 142, 118, 135, 122, 145],
      borderColor: '#dc2626',
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      tension: 0.4
    }]
  },
  anomaliesByRegion: {
    labels: ['NCR', 'Visayas', 'Mindanao', 'International'],
    datasets: [{
      label: 'Anomalies',
      data: [45, 89, 23, 67],
      backgroundColor: ['#dc2626', '#f59e0b', '#10b981', '#3b82f6'],
      borderWidth: 0
    }]
  },
  scanTypes: {
    labels: ['Valid Scans', 'Duplicate Scans', 'Expired Tokens', 'Suspicious Activity'],
    datasets: [{
      data: [85, 8, 4, 3],
      backgroundColor: ['#2ecc71', '#f59e0b', '#dc2626', '#8b5cf6'],
      borderWidth: 0
    }]
  }
};