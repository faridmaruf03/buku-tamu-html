const form = document.getElementById("guestForm");
const tableBody = document.querySelector("#guestTable tbody");

let guests = JSON.parse(localStorage.getItem("guests")) || [];
let editIndex = null;

// Render tabel
function renderTable() {
  tableBody.innerHTML = "";
  guests.forEach((guest, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${guest.nama}</td>
      <td>${guest.tanggal}</td>
      <td>${guest.keperluan}</td>
      <td><img src="${guest.foto}" alt="Foto ${guest.nama}" height="60"></td>
      <td>
        <button class="btn-edit" onclick="editGuest(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteGuest(${index})">Hapus</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Tambah / Update data tamu
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const nama = document.getElementById("nama").value;
  const tanggal = document.getElementById("tanggal").value;
  const keperluan = document.getElementById("keperluan").value;
  const fotoInput = document.getElementById("foto").files[0];

  const saveGuest = (fotoBase64) => {
    const guest = { nama, tanggal, keperluan, foto: fotoBase64 };
    if (editIndex !== null) {
      guests[editIndex] = guest;
      editIndex = null;
    } else {
      guests.push(guest);
    }
    localStorage.setItem("guests", JSON.stringify(guests));
    renderTable();
    form.reset();
  };

  // Jika user upload foto baru
  if (fotoInput) {
    const reader = new FileReader();
    reader.onload = (event) => saveGuest(event.target.result);
    reader.readAsDataURL(fotoInput);
  } else {
    // Jika edit tapi tidak pilih foto baru, gunakan foto lama
    saveGuest(editIndex !== null ? guests[editIndex].foto : "");
  }
});

// Edit tamu
function editGuest(index) {
  const guest = guests[index];
  document.getElementById("nama").value = guest.nama;
  document.getElementById("tanggal").value = guest.tanggal;
  document.getElementById("keperluan").value = guest.keperluan;
  editIndex = index;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Hapus tamu
function deleteGuest(index) {
  if (confirm("Apakah Anda yakin ingin menghapus tamu ini?")) {
    guests.splice(index, 1);
    localStorage.setItem("guests", JSON.stringify(guests));
    renderTable();
  }
}

// Hapus semua tamu
function hapusSemua() {
  if (confirm("Apakah Anda yakin ingin menghapus semua data tamu?")) {
    guests = [];
    localStorage.removeItem("guests");
    renderTable();
  }
}

// Cetak PDF menggunakan html2pdf
function cetakPDF() {
  const element = document.getElementById('guestTable');
  const opt = {
    margin: 0.5,
    filename: 'Rekap_Buku_Tamu.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

// Render awal
renderTable();
