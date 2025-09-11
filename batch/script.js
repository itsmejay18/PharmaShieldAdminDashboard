// Batch Management JavaScript
let currentBatches = [...batches]; // Create a copy to work with

document.addEventListener('DOMContentLoaded', function() {
  loadBatchTable();
});

function loadBatchTable() {
  const tbody = document.getElementById('batchTableBody');
  
  tbody.innerHTML = currentBatches.map(batch => `
    <tr>
      <td><strong>${batch.id}</strong></td>
      <td>${batch.name}</td>
      <td>${batch.lot}</td>
      <td>${formatDate(batch.expiry)}</td>
      <td>${batch.qty.toLocaleString()}</td>
      <td>
        <span class="status-badge ${getStatusClass(batch.status)}">
          ${batch.status}
        </span>
      </td>
      <td>
        <div class="batch-actions">
          <button class="btn btn-sm btn-primary" onclick="generateQR('${batch.id}')">
            <i class="fas fa-qrcode"></i>
            QR
          </button>
          <button class="btn btn-sm btn-secondary" onclick="editBatch('${batch.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteBatch('${batch.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function getStatusClass(status) {
  const statusMap = {
    'Available': 'active',
    'Assigned': 'transit',
    'Expired': 'expired',
    'Depleted': 'inactive'
  };
  return statusMap[status] || 'pending';
}

function openAddBatchModal() {
  document.getElementById('addBatchModal').classList.add('show');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

function addBatch() {
  const form = document.getElementById('addBatchForm');
  const formData = new FormData(form);
  
  const medicineName = document.getElementById('medicineName').value.trim();
  const lotNumber = document.getElementById('lotNumber').value.trim();
  const expiryDate = document.getElementById('expiryDate').value;
  const quantity = parseInt(document.getElementById('quantity').value);

  if (!medicineName || !lotNumber || !expiryDate || !quantity) {
    alert('Please fill in all fields');
    return;
  }

  // Generate new batch ID
  const newBatchId = `B-${String(currentBatches.length + 101).padStart(3, '0')}`;
  
  const newBatch = {
    id: newBatchId,
    name: medicineName,
    lot: lotNumber,
    expiry: expiryDate,
    qty: quantity,
    status: 'Available'
  };

  currentBatches.push(newBatch);
  loadBatchTable();
  closeModal('addBatchModal');
  form.reset();

  // Show success notification
  showNotification(`Batch ${newBatchId} added successfully!`, 'success');
}

function editBatch(batchId) {
  const batch = currentBatches.find(b => b.id === batchId);
  if (!batch) return;

  // Pre-fill form with current values
  document.getElementById('medicineName').value = batch.name;
  document.getElementById('lotNumber').value = batch.lot;
  document.getElementById('expiryDate').value = batch.expiry;
  document.getElementById('quantity').value = batch.qty;

  // Change modal title and button text
  document.querySelector('#addBatchModal .modal-title').textContent = 'Edit Batch';
  const addButton = document.querySelector('#addBatchModal .modal-footer .btn-primary');
  addButton.textContent = 'Update Batch';
  addButton.onclick = () => updateBatch(batchId);

  openAddBatchModal();
}

function updateBatch(batchId) {
  const medicineName = document.getElementById('medicineName').value.trim();
  const lotNumber = document.getElementById('lotNumber').value.trim();
  const expiryDate = document.getElementById('expiryDate').value;
  const quantity = parseInt(document.getElementById('quantity').value);

  if (!medicineName || !lotNumber || !expiryDate || !quantity) {
    alert('Please fill in all fields');
    return;
  }

  const batchIndex = currentBatches.findIndex(b => b.id === batchId);
  if (batchIndex !== -1) {
    currentBatches[batchIndex] = {
      ...currentBatches[batchIndex],
      name: medicineName,
      lot: lotNumber,
      expiry: expiryDate,
      qty: quantity
    };

    loadBatchTable();
    closeModal('addBatchModal');
    resetModal();

    showNotification(`Batch ${batchId} updated successfully!`, 'success');
  }
}

function deleteBatch(batchId) {
  if (confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
    const batchIndex = currentBatches.findIndex(b => b.id === batchId);
    if (batchIndex !== -1) {
      currentBatches.splice(batchIndex, 1);
      loadBatchTable();
      showNotification(`Batch ${batchId} deleted successfully!`, 'warning');
    }
  }
}

function generateQR(batchId) {
  const batch = currentBatches.find(b => b.id === batchId);
  if (!batch) return;

  // Simulate QR code generation
  const shipmentQR = document.getElementById('shipmentQR');
  const unitQR = document.getElementById('unitQR');

  // Add generated QR content
  shipmentQR.innerHTML = `
    <canvas id="shipmentCanvas" width="150" height="150"></canvas>
    <p>Shipment: ${batch.id}-SHIP</p>
  `;

  unitQR.innerHTML = `
    <canvas id="unitCanvas" width="150" height="150"></canvas>
    <p>Unit: ${batch.id}-UNIT</p>
  `;

  // Generate simple QR-like patterns on canvas
  generateQRPattern('shipmentCanvas', `SHIP-${batch.id}`);
  generateQRPattern('unitCanvas', `UNIT-${batch.id}`);

  document.getElementById('qrModal').classList.add('show');
  showNotification(`QR codes generated for batch ${batch.id}`, 'success');
}

function generateQRPattern(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const size = 150;
  const moduleCount = 25;
  const moduleSize = size / moduleCount;

  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Generate pattern based on data
  ctx.fillStyle = '#000000';
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // Simple pattern generation based on data hash
      const hash = hashCode(data + row + col);
      if (hash % 2 === 0) {
        ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
      }
    }
  }

  // Add positioning squares (corners)
  drawPositionSquare(ctx, 0, 0, moduleSize);
  drawPositionSquare(ctx, (moduleCount - 7) * moduleSize, 0, moduleSize);
  drawPositionSquare(ctx, 0, (moduleCount - 7) * moduleSize, moduleSize);
}

function drawPositionSquare(ctx, x, y, moduleSize) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function downloadQR(type) {
  const canvasId = type === 'shipment' ? 'shipmentCanvas' : 'unitCanvas';
  const canvas = document.getElementById(canvasId);
  
  if (canvas) {
    const link = document.createElement('a');
    link.download = `qr-code-${type}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} QR code downloaded!`, 'success');
  }
}

function resetModal() {
  // Reset modal to add mode
  document.querySelector('#addBatchModal .modal-title').textContent = 'Add New Batch';
  const addButton = document.querySelector('#addBatchModal .modal-footer .btn-primary');
  addButton.textContent = 'Add Batch';
  addButton.onclick = addBatch;
  document.getElementById('addBatchForm').reset();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showNotification(message, type = 'success') {
  // Use the global notification system
  if (window.adminApp) {
    window.adminApp.showNotification(message, type);
  } else {
    alert(message);
  }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
  }
});