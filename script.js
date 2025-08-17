
// Utilities
function rupiah(x){ return new Intl.NumberFormat('id-ID').format(x); }
function beli(nama, harga){
  localStorage.setItem('selectedProduct', JSON.stringify({nama, harga}));
  window.location.href = 'transaksi.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const prodSelect = document.getElementById('produkSelect');
  const hargaInput = document.getElementById('hargaInput');
  const qtyInput = document.getElementById('qtyInput');
  const shippingSelect = document.getElementById('shippingSelect');

  // Prefill from selected product
  const sel = localStorage.getItem('selectedProduct');
  if (sel && prodSelect){
    const obj = JSON.parse(sel);
    [...prodSelect.options].forEach(opt => {
      if (opt.value === obj.nama){ opt.selected = true; hargaInput.value = obj.harga; }
    });
  }

  if (prodSelect && hargaInput){
    prodSelect.addEventListener('change', () => {
      const price = parseInt(prodSelect.selectedOptions[0].dataset.price,10);
      hargaInput.value = price;
    });
  }

  // Render invoice when on invoice page
  const invoiceEl = document.getElementById('invoice');
  if (invoiceEl){
    const data = JSON.parse(localStorage.getItem('lastOrder') || 'null');
    if (!data){
      invoiceEl.innerHTML = '<p class="small">Belum ada data transaksi. Silakan buat pesanan di halaman Transaksi.</p>';
      return;
    }
    const rows = [
      ['Produk', data.produk],
      ['Harga Satuan', 'Rp ' + rupiah(data.harga)],
      ['Jumlah', data.qty],
      ['Subtotal', 'Rp ' + rupiah(data.subtotal)],
      ['Ongkir ('+data.shipping+')', 'Rp ' + rupiah(data.ongkir)],
      ['PPN 11%', 'Rp ' + rupiah(data.ppn)],
      ['Total', '<b>Rp ' + rupiah(data.total) + '</b>'],
      ['Pembayaran', data.payment],
      ['Nama', data.nama],
      ['Email', data.email],
      ['Telepon', data.phone],
      ['Alamat', data.alamat],
      ['Catatan', data.catatan || '-'],
      ['No. Invoice', data.invoiceNo],
      ['Tanggal', data.tanggal],
    ];

    const table = document.createElement('table');
    table.className = 'table';
    table.innerHTML = '<thead><tr><th>Rincian</th><th>Nilai</th></tr></thead>';
    const tbody = document.createElement('tbody');
    rows.forEach(([k,v]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${k}</td><td>${v}</td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    invoiceEl.appendChild(table);
  }
});

function submitOrder(e){
  e.preventDefault();
  const f = e.target;
  const produk = f.produk.value;
  const harga = parseInt(document.getElementById('hargaInput').value,10);
  const qty = parseInt(document.getElementById('qtyInput').value,10) || 1;
  const shipOpt = document.getElementById('shippingSelect').selectedOptions[0];
  const shipping = shipOpt.value;
  const ongkir = parseInt(shipOpt.dataset.cost,10);

  const subtotal = harga * qty;
  const ppn = Math.round(subtotal * 0.11);
  const total = subtotal + ppn + ongkir;

  const invoiceNo = 'INV-' + Date.now();
  const tanggal = new Date().toLocaleString('id-ID');

  const data = {
    produk, harga, qty, subtotal, ppn, ongkir, total,
    payment: f.payment.value,
    nama: f.nama.value,
    email: f.email.value,
    phone: f.phone.value,
    alamat: f.alamat.value,
    catatan: f.catatan.value,
    shipping, invoiceNo, tanggal
  };
  localStorage.setItem('lastOrder', JSON.stringify(data));
  localStorage.removeItem('selectedProduct');
  window.location.href = 'invoice.html';
  return false;
}
