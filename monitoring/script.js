// Monitoring JavaScript
let autoRefresh = true;
let refreshInterval;
let currentFilter = 'all';
let currentAlertFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
  loadMonitoringData();
  loadShipmentTimeline();
  loadAlerts();
  startAutoRefresh();
});

function loadMonitoringData() {
  // Update live stats
  const liveScans = Math.floor(Math.random() * 500) + 200;
  document.getElementById('liveScans').textContent = liveScans.toLocaleString();
  
  const activeShips = shipments.filter(s => s.status !== 'Delivered').length;
  document.getElementById('activeShipments').textContent = activeShips;
  
  const pendingAlerts = alerts.filter(a => a.severity === 'high' || a.severity === 'medium').length;
  document.getElementById('pendingAlerts').textContent = pendingAlerts;
  
  // Update scan trend
  const trendValue = Math.floor(Math.random() * 30) + 5;
  document.getElementById('scanTrend').textContent = `+${trendValue}%`;
}

function loadShipmentTimeline() {
  const timeline = document.getElementById('shipmentTimeline');
  
  // Create timeline items from shipments
  let timelineItems = [];
  
  shipments.forEach(shipment => {
    const pharmacy = pharmacies.find(p => p.id === shipment.pharmacyId);
    const batch = batches.find(b => b.id === shipment.batchId);
    
    if (shipment.tracking) {
      shipment.tracking.forEach((track, index) => {
        timelineItems.push({
          id: `${shipment.id}-${index}`,
          shipmentId: shipment.id,
          status: track.status.toLowerCase().replace(' ', ''),
          title: `${batch ? batch.name : 'Unknown'} - ${track.status}`,
          description: `Shipment ${shipment.id} to ${pharmacy ? pharmacy.name : 'Unknown Pharmacy'}`,
          location: track.location,
          time: track.date,
          statusClass: getTimelineStatusClass(track.status)
        });
      });
    }
  });
  
  // Sort by date (newest first)
  timelineItems.sort((a, b) => new Date(b.time) - new Date(a.time));
  
  // Filter if needed
  if (currentFilter !== 'all') {
    timelineItems = timelineItems.filter(item => {
      if (currentFilter === 'transit') return item.status === 'intransit';
      if (currentFilter === 'delivered') return item.status === 'delivered';
      return true;
    });
  }
  
  timeline.innerHTML = timelineItems.map(item => `
    <div class="timeline-item ${item.statusClass}" data-status="${item.status}">
      <div class="timeline-content">
        <div class="timeline-header">
          <h4 class="timeline-title">${item.title}</h4>
          <span class="timeline-time">${formatRelativeTime(item.time)}</span>
        </div>
        <p class="timeline-description">${item.description}</p>
        <div class="timeline-status">
          <span class="status-badge ${getStatusBadgeClass(item.status)}">
            ${item.status.replace('intransit', 'In Transit')}
          </span>
          <span class="text-secondary" style="margin-left: 1rem;">
            <i class="fas fa-map-marker-alt"></i>
            ${item.location}
          </span>
        </div>
      </div>
    </div>
  `).join('');
  
  if (timelineItems.length === 0) {
    timeline.innerHTML = `
      <div class="text-center" style="padding: 2rem; color: var(--text-secondary);">
        <i class="fas fa-timeline" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <p>No shipment activities found for the selected filter.</p>
      </div>
    `;
  }
}

function loadAlerts() {
  const alertsList = document.getElementById('alertsList');
  
  let filteredAlerts = [...alerts];
  
  if (currentAlertFilter !== 'all') {
    filteredAlerts = alerts.filter(alert => alert.severity === currentAlertFilter);
  }
  
  // Sort by date (newest first)
  filteredAlerts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  alertsList.innerHTML = filteredAlerts.map(alert => `
    <div class="monitoring-alert ${alert.severity}" data-severity="${alert.severity}">
      <div class="alert-icon ${alert.severity === 'high' ? 'red' : alert.severity === 'medium' ? 'orange' : 'green'}">
        <i class="fas ${getAlertIcon(alert.type)}"></i>
      </div>
      <div class="alert-content">
        <h4 class="alert-title">${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert</h4>
        <p class="alert-message">${alert.message}</p>
        <div class="alert-meta">
          <span>
            <i class="fas fa-calendar"></i>
            ${formatRelativeTime(alert.date)}
          </span>
          <span class="status-badge ${alert.severity === 'high' ? 'expired' : alert.severity === 'medium' ? 'pending' : 'active'}">
            ${alert.severity.toUpperCase()}
          </span>
        </div>
      </div>
      <div class="alert-actions">
        <button class="btn btn-sm btn-secondary" onclick="acknowledgeAlert(${alert.id})">
          <i class="fas fa-check"></i>
        </button>
        <button class="btn btn-sm btn-secondary" onclick="viewAlertDetails(${alert.id})">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  if (filteredAlerts.length === 0) {
    alertsList.innerHTML = `
      <div class="text-center" style="padding: 2rem; color: var(--text-secondary);">
        <i class="fas fa-shield-check" style="font-size: 3rem; margin-bottom: 1rem; color: var(--success-green);"></i>
        <p>No alerts found for the selected filter. System is secure!</p>
      </div>
    `;
  }
}

function getTimelineStatusClass(status) {
  const statusMap = {
    'Created': 'created',
    'In Transit': 'transit',
    'Delivered': 'delivered',
    'Received': 'received',
    'Dispensed': 'dispensed'
  };
  return statusMap[status] || 'created';
}

function getStatusBadgeClass(status) {
  const statusMap = {
    'created': 'pending',
    'intransit': 'transit',
    'delivered': 'delivered',
    'received': 'active',
    'dispensed': 'active'
  };
  return statusMap[status] || 'pending';
}

function getAlertIcon(type) {
  const iconMap = {
    duplicate: 'fa-copy',
    expired: 'fa-clock',
    suspicious: 'fa-exclamation-triangle',
    system: 'fa-cog'
  };
  return iconMap[type] || 'fa-info-circle';
}

function filterTimeline(filter) {
  currentFilter = filter;
  
  // Update button states
  document.querySelectorAll('.card-header .btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  loadShipmentTimeline();
}

function filterAlerts(severity) {
  currentAlertFilter = severity;
  
  // Update button states
  document.querySelectorAll('.alert-filter .btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  loadAlerts();
}

function acknowledgeAlert(alertId) {
  if (confirm('Mark this alert as acknowledged?')) {
    // In a real app, this would send to backend
    showNotification('Alert acknowledged successfully', 'success');
    
    // Remove from UI
    const alertElement = document.querySelector(`[onclick="acknowledgeAlert(${alertId})"]`).closest('.monitoring-alert');
    if (alertElement) {
      alertElement.style.opacity = '0.5';
      alertElement.style.pointerEvents = 'none';
    }
  }
}

function viewAlertDetails(alertId) {
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert(`Alert Details:\n\nType: ${alert.type}\nSeverity: ${alert.severity}\nMessage: ${alert.message}\nDate: ${alert.date}`);
  }
}

function refreshMonitoring() {
  const refreshBtn = document.getElementById('refreshBtn');
  const icon = refreshBtn.querySelector('i');
  
  autoRefresh = !autoRefresh;
  
  if (autoRefresh) {
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Auto Refresh: ON';
    refreshBtn.classList.remove('btn-secondary');
    refreshBtn.classList.add('btn-primary');
    startAutoRefresh();
  } else {
    refreshBtn.innerHTML = '<i class="fas fa-pause"></i> Auto Refresh: OFF';
    refreshBtn.classList.remove('btn-primary');
    refreshBtn.classList.add('btn-secondary');
    stopAutoRefresh();
  }
  
  // Manual refresh
  icon.classList.add('auto-refresh');
  setTimeout(() => icon.classList.remove('auto-refresh'), 1000);
  
  loadMonitoringData();
  loadShipmentTimeline();
  
  // Add some random new alerts occasionally
  if (Math.random() < 0.3) {
    simulateNewAlert();
  }
  
  showNotification('Monitoring data refreshed', 'success');
}

function startAutoRefresh() {
  if (refreshInterval) clearInterval(refreshInterval);
  
  refreshInterval = setInterval(() => {
    if (autoRefresh) {
      loadMonitoringData();
      
      // Occasionally refresh timeline and alerts
      if (Math.random() < 0.4) {
        loadShipmentTimeline();
      }
      
      if (Math.random() < 0.2) {
        simulateNewAlert();
        loadAlerts();
      }
    }
  }, 10000); // Refresh every 10 seconds
}

function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

function simulateNewAlert() {
  const alertTypes = ['duplicate', 'suspicious', 'system'];
  const severities = ['high', 'medium', 'low'];
  const messages = [
    'Multiple scan attempts detected from same location',
    'Unusual scanning pattern detected',
    'System performance warning',
    'Batch verification failed',
    'Network connectivity restored'
  ];
  
  const newAlert = {
    id: alerts.length + 1,
    type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    date: new Date().toISOString().split('T')[0]
  };
  
  alerts.unshift(newAlert);
  
  // Keep only latest 20 alerts
  if (alerts.length > 20) {
    alerts.splice(20);
  }
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 7) {
    return date.toLocaleDateString();
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

function showNotification(message, type = 'success') {
  if (window.adminApp) {
    window.adminApp.showNotification(message, type);
  } else {
    console.log(`${type}: ${message}`);
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopAutoRefresh();
});