/**
 * RENSON FARM INVENTORY - MAIN APPLICATION
 * Frontend Logic for Dashboard, Forms, and Data Management
 */

// ==================== DASHBOARD PAGE ====================
async function initDashboard() {
    try {
        const receipts = await getReceipts();
        
        // Calculate totals
        const totalExpenses = receipts.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
        const thisMonth = getThisMonthTotal(receipts);
        const thisYear = getThisYearTotal(receipts);

        // Update stat cards
        document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('totalReceipts').textContent = receipts.length;
        document.getElementById('thisMonth').textContent = formatCurrency(thisMonth);
        document.getElementById('thisYear').textContent = formatCurrency(thisYear);

        // Update recent transactions
        updateRecentTransactions(receipts.slice(0, 6));

        // Update category summary
        updateCategorySummary(receipts);

        // Setup filter handlers
        setupFilterHandlers('dashboard');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

function getThisMonthTotal(receipts) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return receipts
        .filter(r => {
            const date = new Date(r.receipt_date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
}

function getThisYearTotal(receipts) {
    const now = new Date();
    const currentYear = now.getFullYear();

    return receipts
        .filter(r => {
            const date = new Date(r.receipt_date);
            return date.getFullYear() === currentYear;
        })
        .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
}

function updateRecentTransactions(receipts) {
    const container = document.getElementById('transactionsContainer');
    
    if (receipts.length === 0) {
        container.innerHTML = '<p class="no-data">No transactions yet. Add your first receipt!</p>';
        return;
    }

    container.innerHTML = receipts.map(receipt => `
        <div class="transaction-item">
            <div class="transaction-date">${formatDate(receipt.receipt_date)}</div>
            <div class="transaction-details">${escapeHtml(receipt.details)}</div>
            <div class="transaction-category">${receipt.category}</div>
            <div class="transaction-amount">${formatCurrency(receipt.amount)}</div>
        </div>
    `).join('');
}

function updateCategorySummary(receipts) {
    const categoryMap = {};
    
    receipts.forEach(receipt => {
        const category = receipt.category || 'Other';
        if (!categoryMap[category]) {
            categoryMap[category] = 0;
        }
        categoryMap[category] += parseFloat(receipt.amount) || 0;
    });

    const container = document.getElementById('categorySummary');
    
    if (Object.keys(categoryMap).length === 0) {
        container.innerHTML = '<p class="no-data">No data available</p>';
        return;
    }

    container.innerHTML = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => `
            <div class="category-card">
                <div class="category-name">${category}</div>
                <div class="category-amount">${formatCurrency(amount)}</div>
            </div>
        `).join('');
}

// ==================== ADD RECEIPT PAGE ====================
async function initAddReceiptPage() {
    // Set default date to today
    document.getElementById('receiptDate').valueAsDate = new Date();

    // Camera and upload handlers
    document.getElementById('cameraBtn').addEventListener('click', () => {
        document.getElementById('cameraInput').click();
    });

    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('photoInput').click();
    });

    document.getElementById('photoInput').addEventListener('change', (e) => {
        handlePhotoSelect(e.target.files[0]);
    });

    document.getElementById('cameraInput').addEventListener('change', (e) => {
        handlePhotoSelect(e.target.files[0]);
    });

    document.getElementById('clearPhotoBtn').addEventListener('click', () => {
        clearPhoto();
    });

    // Form submission
    document.getElementById('receiptForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveReceipt();
    });
}

let selectedPhotoFile = null;

function handlePhotoSelect(file) {
    if (!file || !file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }

    selectedPhotoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('previewImage');
        const placeholder = document.querySelector('.placeholder');
        img.src = e.target.result;
        img.style.display = 'block';
        placeholder.style.display = 'none';
        document.getElementById('clearPhotoBtn').style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
}

function clearPhoto() {
    selectedPhotoFile = null;
    document.getElementById('previewImage').src = '';
    document.getElementById('previewImage').style.display = 'none';
    document.querySelector('.placeholder').style.display = 'block';
    document.getElementById('photoInput').value = '';
    document.getElementById('cameraInput').value = '';
    document.getElementById('clearPhotoBtn').style.display = 'none';
}

async function saveReceipt() {
    try {
        const formMessage = document.getElementById('formMessage');
        formMessage.className = 'form-message info';
        formMessage.textContent = 'Saving receipt...';

        const details = document.getElementById('details').value.trim();
        const category = document.getElementById('category').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const receiptDate = document.getElementById('receiptDate').value;

        if (!details || !category || !amount || !receiptDate) {
            throw new Error('Please fill in all required fields');
        }

        let imageUrl = null;
        let imagePath = null;

        // Upload image if selected
        if (selectedPhotoFile) {
            const uploadResult = await uploadReceiptImage(selectedPhotoFile);
            imageUrl = uploadResult.url;
            imagePath = uploadResult.path;
        }

        // Add receipt to database
        const receiptData = {
            receipt_date: receiptDate,
            details: details,
            category: category,
            amount: amount,
            image_url: imageUrl,
            image_path: imagePath,
            created_at: new Date().toISOString()
        };

        await addReceipt(receiptData);

        formMessage.className = 'form-message success';
        formMessage.textContent = '✅ Receipt saved successfully!';

        // Reset form
        document.getElementById('receiptForm').reset();
        clearPhoto();
        document.getElementById('receiptDate').valueAsDate = new Date();

        // Redirect after success
        setTimeout(() => {
            window.location.href = 'receipts.html';
        }, 1500);
    } catch (error) {
        console.error('Error saving receipt:', error);
        const formMessage = document.getElementById('formMessage');
        formMessage.className = 'form-message error';
        formMessage.textContent = `❌ Error: ${error.message}`;
    }
}

// ==================== RECEIPTS PAGE ====================
async function initReceiptsPage() {
    await loadReceipts();
    setupFilterHandlers('receipts');
    setupImageModal();
    setupEditModal();
}

async function loadReceipts(filters = {}) {
    try {
        const receipts = await getReceipts(filters);

        // Update summary
        const totalAmount = receipts.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
        document.getElementById('totalRecordsCount').textContent = receipts.length;
        document.getElementById('totalAmountCount').textContent = formatCurrency(totalAmount);

        // Render table view (desktop)
        renderReceiptsTable(receipts);

        // Render cards view (mobile)
        renderReceiptsCards(receipts);
    } catch (error) {
        console.error('Error loading receipts:', error);
        showNotification('Error loading receipts', 'error');
    }
}

function renderReceiptsTable(receipts) {
    const tbody = document.getElementById('receiptsTableBody');

    if (receipts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No receipts found</td></tr>';
        return;
    }

    tbody.innerHTML = receipts.map(receipt => `
        <tr>
            <td>
                ${receipt.image_url ? `
                    <img src="${receipt.image_url}" alt="Receipt" class="receipt-photo-thumb" 
                         onclick="openImageModal('${receipt.image_url}')">
                ` : '<span style="color: #95a5a6;">No image</span>'}
            </td>
            <td>${formatDate(receipt.receipt_date)}</td>
            <td>${escapeHtml(receipt.details)}</td>
            <td>${receipt.category}</td>
            <td>${formatCurrency(receipt.amount)}</td>
            <td>
                <div class="action-buttons">
                    ${receipt.image_url ? `
                        <button class="btn-view" onclick="openImageModal('${receipt.image_url}')">View</button>
                    ` : ''}
                    <button class="btn-edit" onclick="openEditModal(${receipt.id})">Edit</button>
                    <button class="btn-delete" onclick="confirmDelete(${receipt.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderReceiptsCards(receipts) {
    const container = document.getElementById('receiptsCards');

    if (receipts.length === 0) {
        container.innerHTML = '<p class="no-data">No receipts found</p>';
        return;
    }

    container.innerHTML = receipts.map(receipt => `
        <div class="receipt-card">
            ${receipt.image_url ? `
                <img src="${receipt.image_url}" alt="Receipt" class="card-image" 
                     onclick="openImageModal('${receipt.image_url}')">
            ` : '<div style="height: 200px; background-color: #ecf0f1; display: flex; align-items: center; justify-content: center;">No image</div>'}
            <div class="card-content">
                <div class="card-date">${formatDate(receipt.receipt_date)}</div>
                <div class="card-details">${escapeHtml(receipt.details)}</div>
                <div class="card-category">${receipt.category}</div>
                <div class="card-amount">${formatCurrency(receipt.amount)}</div>
                <div class="card-actions">
                    ${receipt.image_url ? `
                        <button class="btn-view" onclick="openImageModal('${receipt.image_url}')">View</button>
                    ` : ''}
                    <button class="btn-edit" onclick="openEditModal(${receipt.id})">Edit</button>
                    <button class="btn-delete" onclick="confirmDelete(${receipt.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== EDIT MODAL ====================
let currentEditingReceiptId = null;
let currentEditingReceiptImagePath = null;
let editPhotoFile = null;

function setupEditModal() {
    const modal = document.getElementById('editModal');
    const closeButtons = modal.querySelectorAll('.close, .close-modal');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
            resetEditModal();
        });
    });

    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveEditedReceipt();
    });

    document.getElementById('editPhoto').addEventListener('change', (e) => {
        editPhotoFile = e.target.files[0];
    });
}

async function openEditModal(receiptId) {
    try {
        const receipt = await getReceiptById(receiptId);
        currentEditingReceiptId = receiptId;
        currentEditingReceiptImagePath = receipt.image_path;

        document.getElementById('editDetails').value = receipt.details;
        document.getElementById('editCategory').value = receipt.category;
        document.getElementById('editAmount').value = receipt.amount;
        document.getElementById('editDate').value = receipt.receipt_date;

        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        console.error('Error opening edit modal:', error);
        showNotification('Error loading receipt details', 'error');
    }
}

async function saveEditedReceipt() {
    try {
        const details = document.getElementById('editDetails').value.trim();
        const category = document.getElementById('editCategory').value;
        const amount = parseFloat(document.getElementById('editAmount').value);
        const receiptDate = document.getElementById('editDate').value;

        if (!details || !category || !amount || !receiptDate) {
            throw new Error('Please fill in all fields');
        }

        const updateData = {
            details: details,
            category: category,
            amount: amount,
            receipt_date: receiptDate,
            updated_at: new Date().toISOString()
        };

        // Upload new image if provided
        if (editPhotoFile) {
            const uploadResult = await uploadReceiptImage(editPhotoFile);
            updateData.image_url = uploadResult.url;
            updateData.image_path = uploadResult.path;

            // Delete old image
            if (currentEditingReceiptImagePath) {
                await deleteReceiptImage(currentEditingReceiptImagePath);
            }
        }

        await updateReceipt(currentEditingReceiptId, updateData);

        document.getElementById('editModal').style.display = 'none';
        resetEditModal();
        showNotification('Receipt updated successfully', 'success');
        await loadReceipts();
    } catch (error) {
        console.error('Error updating receipt:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

function resetEditModal() {
    currentEditingReceiptId = null;
    currentEditingReceiptImagePath = null;
    editPhotoFile = null;
    document.getElementById('editForm').reset();
}

// ==================== DELETE RECEIPT ====================
async function confirmDelete(receiptId) {
    if (confirm('Are you sure you want to delete this receipt? This action cannot be undone.')) {
        await deleteReceiptRecord(receiptId);
    }
}

async function deleteReceiptRecord(receiptId) {
    try {
        const receipt = await getReceiptById(receiptId);
        
        // Delete from database
        await deleteReceipt(receiptId);

        // Delete image from storage if it exists
        if (receipt.image_path) {
            await deleteReceiptImage(receipt.image_path);
        }

        showNotification('Receipt deleted successfully', 'success');
        await loadReceipts();
    } catch (error) {
        console.error('Error deleting receipt:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// ==================== IMAGE MODAL ====================
function setupImageModal() {
    const modal = document.getElementById('imageModal');
    const closeBtn = modal.querySelector('.close');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function openImageModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImage');
    img.src = imageUrl;
    modal.style.display = 'block';
}

// ==================== REPORTS PAGE ====================
async function initReportsPage() {
    const now = new Date();
    document.getElementById('reportFromDate').valueAsDate = new Date(now.getFullYear(), 0, 1);
    document.getElementById('reportToDate').valueAsDate = new Date(now.getFullYear(), 11, 31);

    document.getElementById('reportFilterBtn').addEventListener('click', generateReport);
    document.getElementById('reportClearBtn').addEventListener('click', clearReportFilters);
    document.getElementById('exportCSVBtn').addEventListener('click', exportToCSV);
    document.getElementById('printReportBtn').addEventListener('click', printReport);

    await generateReport();
}

async function generateReport() {
    try {
        const fromDate = document.getElementById('reportFromDate').value;
        const toDate = document.getElementById('reportToDate').value;

        const receipts = await getReceipts({
            fromDate: fromDate,
            toDate: toDate
        });

        const totalExpenses = receipts.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
        const avgAmount = receipts.length > 0 ? totalExpenses / receipts.length : 0;

        // Update stats
        document.getElementById('reportTotalExpenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('reportTotalReceipts').textContent = receipts.length;
        document.getElementById('reportAverageAmount').textContent = formatCurrency(avgAmount);

        // Update tables
        updateMonthlyTable(receipts);
        updateYearlyTable(receipts);
        updateCategoryTable(receipts);
    } catch (error) {
        console.error('Error generating report:', error);
        showNotification('Error generating report', 'error');
    }
}

function updateMonthlyTable(receipts) {
    const monthlyData = {};

    receipts.forEach(receipt => {
        const date = new Date(receipt.receipt_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { total: 0, count: 0 };
        }
        monthlyData[monthKey].total += parseFloat(receipt.amount) || 0;
        monthlyData[monthKey].count += 1;
    });

    const tbody = document.getElementById('monthlyTableBody');
    const rows = Object.entries(monthlyData)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([month, data]) => `
            <tr>
                <td>${month}</td>
                <td>${formatCurrency(data.total)}</td>
                <td>${data.count}</td>
            </tr>
        `);

    tbody.innerHTML = rows.length > 0 ? rows.join('') : '<tr><td colspan="3" class="no-data">No data</td></tr>';
}

function updateYearlyTable(receipts) {
    const yearlyData = {};

    receipts.forEach(receipt => {
        const date = new Date(receipt.receipt_date);
        const year = date.getFullYear().toString();
        
        if (!yearlyData[year]) {
            yearlyData[year] = { total: 0, count: 0 };
        }
        yearlyData[year].total += parseFloat(receipt.amount) || 0;
        yearlyData[year].count += 1;
    });

    const tbody = document.getElementById('yearlyTableBody');
    const rows = Object.entries(yearlyData)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([year, data]) => `
            <tr>
                <td>${year}</td>
                <td>${formatCurrency(data.total)}</td>
                <td>${data.count}</td>
            </tr>
        `);

    tbody.innerHTML = rows.length > 0 ? rows.join('') : '<tr><td colspan="3" class="no-data">No data</td></tr>';
}

function updateCategoryTable(receipts) {
    const categoryData = {};

    receipts.forEach(receipt => {
        const category = receipt.category || 'Other';
        if (!categoryData[category]) {
            categoryData[category] = { total: 0, count: 0 };
        }
        categoryData[category].total += parseFloat(receipt.amount) || 0;
        categoryData[category].count += 1;
    });

    const totalAmount = Object.values(categoryData).reduce((sum, d) => sum + d.total, 0);
    
    const tbody = document.getElementById('categoryTableBody');
    const rows = Object.entries(categoryData)
        .sort((a, b) => b[1].total - a[1].total)
        .map(([category, data]) => {
            const percentage = totalAmount > 0 ? ((data.total / totalAmount) * 100).toFixed(1) : 0;
            return `
                <tr>
                    <td>${category}</td>
                    <td>${formatCurrency(data.total)}</td>
                    <td>${percentage}%</td>
                    <td>${data.count}</td>
                </tr>
            `;
        });

    tbody.innerHTML = rows.length > 0 ? rows.join('') : '<tr><td colspan="4" class="no-data">No data</td></tr>';
}

function clearReportFilters() {
    const now = new Date();
    document.getElementById('reportFromDate').valueAsDate = new Date(now.getFullYear(), 0, 1);
    document.getElementById('reportToDate').valueAsDate = new Date(now.getFullYear(), 11, 31);
    generateReport();
}

async function exportToCSV() {
    try {
        const fromDate = document.getElementById('reportFromDate').value;
        const toDate = document.getElementById('reportToDate').value;
        const receipts = await getReceipts({ fromDate, toDate });

        let csv = 'Date,Details,Category,Amount\n';
        receipts.forEach(receipt => {
            csv += `"${receipt.receipt_date}","${receipt.details}","${receipt.category}","${receipt.amount}"\n`;
        });

        downloadCSV(csv, 'renson-farm-receipts.csv');
        showNotification('CSV exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting CSV:', error);
        showNotification('Error exporting CSV', 'error');
    }
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

function printReport() {
    window.print();
}

// ==================== SETTINGS PAGE ====================
async function initSettingsPage() {
    // Check Supabase configuration
    if (getSupabaseClient()) {
        document.getElementById('supabaseStatus').textContent = '✅ Configured';
    }

    document.getElementById('exportAllBtn').addEventListener('click', exportAllData);
    document.getElementById('deleteAllBtn').addEventListener('click', deleteAllReceipts);
    document.getElementById('clearCacheBtn').addEventListener('click', clearCache);
}

async function exportAllData() {
    try {
        showNotification('Preparing export...', 'info');
        const receipts = await getReceipts();

        let csv = 'Date,Details,Category,Amount,Created At\n';
        receipts.forEach(receipt => {
            csv += `"${receipt.receipt_date}","${receipt.details}","${receipt.category}","${receipt.amount}","${receipt.created_at}"\n`;
        });

        downloadCSV(csv, `renson-farm-inventory-${new Date().toISOString().split('T')[0]}.csv`);
        showNotification('Data exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data', 'error');
    }
}

async function deleteAllReceipts() {
    const confirmed = confirm('⚠️ WARNING: This will delete ALL receipts and images. This action CANNOT be undone. Are you absolutely sure?');
    if (!confirmed) return;

    const doubleConfirm = prompt('Type "DELETE ALL" to confirm:');
    if (doubleConfirm !== 'DELETE ALL') {
        showNotification('Action cancelled', 'info');
        return;
    }

    try {
        showNotification('Deleting all receipts...', 'info');
        const receipts = await getReceipts();

        for (const receipt of receipts) {
            await deleteReceipt(receipt.id);
            if (receipt.image_path) {
                await deleteReceiptImage(receipt.image_path);
            }
        }

        showNotification('All receipts deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting all receipts:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

function clearCache() {
    localStorage.clear();
    sessionStorage.clear();
    showNotification('Cache cleared successfully', 'success');
}

// ==================== FILTER HANDLERS ====================
function setupFilterHandlers(page) {
    const filterBtn = document.getElementById('filterBtn');
    const clearBtn = document.getElementById('clearFilterBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    if (filterBtn) {
        filterBtn.addEventListener('click', async () => {
            const filters = getFilters();
            if (page === 'receipts') {
                await loadReceipts(filters);
            } else if (page === 'dashboard') {
                const receipts = await getReceipts(filters);
                updateRecentTransactions(receipts.slice(0, 6));
                updateCategorySummary(receipts);
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            clearFilterInputs();
            if (page === 'receipts') {
                await loadReceipts();
            } else if (page === 'dashboard') {
                await initDashboard();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

function getFilters() {
    return {
        fromDate: document.getElementById('filterFromDate')?.value || null,
        toDate: document.getElementById('filterToDate')?.value || null,
        category: document.getElementById('filterCategory')?.value || null,
        searchText: document.getElementById('searchInput')?.value || null
    };
}

function clearFilterInputs() {
    const fromDate = document.getElementById('filterFromDate');
    const toDate = document.getElementById('filterToDate');
    const category = document.getElementById('filterCategory');
    const searchInput = document.getElementById('searchInput');

    if (fromDate) fromDate.value = '';
    if (toDate) toDate.value = '';
    if (category) category.value = '';
    if (searchInput) searchInput.value = '';
}

async function performSearch() {
    const filters = getFilters();
    if (document.getElementById('receiptsTableBody')) {
        await loadReceipts(filters);
    }
}

// ==================== UTILITY FUNCTIONS ====================
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `form-message ${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '400px';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
}