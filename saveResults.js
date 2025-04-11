
      function formatTime(ms) {
          let totalSeconds = ms / 10;
          let minutes = Math.floor(totalSeconds / 6000);
          let seconds = Math.floor((totalSeconds % 6000) / 100);
          let hundredths = Math.floor(totalSeconds % 100);
          return `${minutes}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
      }

      let savedRecords = localStorage.getItem("raceRecords");
      savedRecords = savedRecords ? JSON.parse(savedRecords) : [];
      let container = document.getElementById("recordsContainer");

      function renderRecords() {
          container.innerHTML = "";
          if(savedRecords.length === 0) {
              container.innerHTML = "<p>لا توجد سجلات محفوظة.</p>";
          } else {
              savedRecords.forEach((record, index) => {
                  let recordDiv = document.createElement("div");
                  recordDiv.className = "record";
                  let header = `<h3>سجل ${index + 1} - ${record.timestamp}</h3>`;
                  let extraInfo = `<p><strong>نوع السباحة:</strong> ${record.swimType} | <strong>المسافة:</strong> ${record.distance || 'غير محدد'} | <strong>اسم الفائز الأول:</strong> ${record.winnerName || '-'}</p>`;
                  let tableHTML = `
                      <table>
                          <thead>
                              <tr>
                                  <th>رقم السباح</th>
                                  <th>الوقت</th>
                              </tr>
                          </thead>
                          <tbody>
                  `;
                  for(let i = 0; i < record.results.length; i++){
                      let time = record.results[i] ? formatTime(record.results[i]) : "-";
                      tableHTML += `<tr><td>${i + 1}</td><td>${time}</td></tr>`;
                  }
                  tableHTML += `</tbody></table>`;
                  let deleteButton = `<button class="delete-btn" onclick="deleteRecord(${index})">حذف السجل</button>`;
                  recordDiv.innerHTML = header + extraInfo + tableHTML + deleteButton;
                  container.appendChild(recordDiv);
              });
          }
      }

      function deleteRecord(index) {
          if(confirm("هل أنت متأكد من حذف هذا السجل؟")) {
              savedRecords.splice(index, 1);
              localStorage.setItem("raceRecords", JSON.stringify(savedRecords));
              renderRecords();
          }
      }

      function goBack() {
          window.location.href = "counter.html";
      }
      function goBack1() {
          window.location.href = "index.html";
      }
      function goBack2() {
          window.location.href = "résultats.html";
      }

      renderRecords();
  