// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  loadDashboardData();
  initCharts();
  loadRecentAlerts();
});

function loadDashboardData() {
  // Update stat cards with data from dummy-data.js
  document.getElementById('totalBatches').textContent = batches.length;
  document.getElementById('activeShipments').textContent = shipments.filter(s => s.status !== 'Delivered').length;
  document.getElementById('totalPharmacies').textContent = pharmacies.length;
  document.getElementById('flaggedIncidents').textContent = alerts.filter(a => a.severity === 'high').length;
}

function initCharts() {
  // Recent Scan Activity Chart (Line Chart)
  const scanCtx = document.getElementById('scanChart').getContext('2d');
  new Chart(scanCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Valid Scans',
        data: [120, 190, 300, 500, 200, 300, 450],
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }, {
        label: 'Flagged Scans',
        data: [12, 19, 15, 25, 18, 22, 28],
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  // Scan Status Distribution Chart (Doughnut Chart)
  const statusCtx = document.getElementById('statusChart').getContext('2d');
  new Chart(statusCtx, {
    type: 'doughnut',
    data: {
      labels: ['Valid Scans', 'Duplicate', 'Expired', 'Suspicious'],
      datasets: [{
        data: [85, 8, 4, 3],
        backgroundColor: [
          '#2ecc71',
          '#f59e0b', 
          '#dc2626',
          '#8b5cf6'
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        }
      }
    }
  });
}

function loadRecentAlerts() {
  const alertsContainer = document.getElementById('recentAlerts');
  
  if (alerts.length === 0) {
    alertsContainer.innerHTML = `
      <div class="text-center" style="padding: 2rem; color: var(--text-secondary);">
        <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; color: var(--success-green);"></i>
        <p>No recent alerts. System is operating normally.</p>
      </div>
    `;
    return;
  }

  // Show only the latest 3 alerts
  const recentAlerts = alerts.slice(0, 3);
  
  alertsContainer.innerHTML = recentAlerts.map(alert => {
    const severityClass = alert.severity;
    const iconMap = {
      duplicate: 'fa-copy',
      expired: 'fa-clock',
      suspicious: 'fa-exclamation-triangle',
      system: 'fa-cog'
    };
    
    return `
      <div class="alert-item ${severityClass}">
        <div class="alert-icon ${severityClass === 'high' ? 'red' : severityClass === 'medium' ? 'orange' : 'green'}">
          <i class="fas ${iconMap[alert.type] || 'fa-info-circle'}"></i>
        </div>
        <div class="alert-content">
          <h5>${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert</h5>
          <p>${alert.message}</p>
          <div class="alert-meta">
            <i class="fas fa-calendar"></i>
            <span>${formatDate(alert.date)}</span>
            <span class="status-badge ${severityClass === 'high' ? 'expired' : severityClass === 'medium' ? 'pending' : 'active'}">
              ${alert.severity.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}