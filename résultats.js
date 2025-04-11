
    // دالة لتحويل الزمن من الثواني إلى صيغة ساعات:دقائق:ثواني
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === null) return "-"; 
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // قراءة السجلات المحفوظة من localStorage
    let raceRecords = JSON.parse(localStorage.getItem("raceRecords")) || [];

    // دالة لتحليل وعرض السجلات
    function analyzeResults() {
        let resultsBySwimmer = {};

        // جمع النتائج الخاصة بكل سباح
        raceRecords.forEach(record => {
            let swimmer = record.winnerName || "غير معروف";
            let swimType = record.swimType || "غير محدد";
            let distance = record.distance || "غير معروفة";
            let key = `${swimmer}-${swimType}-${distance}`;

            // إذا لم يكن هناك سجل مسبق، نضيفه
            if (!resultsBySwimmer[key]) {
                resultsBySwimmer[key] = {
                    swimmer: swimmer,
                    swimType: swimType,
                    distance: distance,
                    totalRaces: 0,
                    times: [],
                    lastRace: record.timestamp
                };
            }

            // إضافة النتائج إلى السجل
            resultsBySwimmer[key].totalRaces++;
            resultsBySwimmer[key].times.push(...record.results);
        });

        // تحديث المحتوى لعرض السجلات
        let container = document.getElementById("resultsContainer");
        container.innerHTML = ""; 

        // عرض السجلات
        for (let key in resultsBySwimmer) {
            let data = resultsBySwimmer[key];
            let validTimes = data.times.filter(t => t !== null);
            let bestTime = validTimes.length ? Math.min(...validTimes) : "لا يوجد";
            let avgTime = validTimes.length ? validTimes.reduce((sum, t) => sum + t, 0) / validTimes.length : "لا يوجد";

            // تنسيق الزمن
            bestTime = bestTime !== "لا يوجد" ? formatTime(bestTime) : bestTime;
            avgTime = avgTime !== "لا يوجد" ? formatTime(avgTime) : avgTime;

            // إنشاء وعرض السجلات
            let recordDiv = document.createElement("div");
            recordDiv.className = "record";
            recordDiv.innerHTML = `
                <h3>السباح: ${data.swimmer}</h3>
                <p><strong>نوع السباق:</strong> ${data.swimType}</p>
                <p><strong>المسافة:</strong> ${data.distance} متر</p>
                <p><strong>عدد المشاركات:</strong> ${data.totalRaces}</p>
                <p><strong>أفضل زمن:</strong> ${bestTime}</p>
                <p><strong>متوسط الزمن:</strong> ${avgTime}</p>
                <p><strong>آخر سباق:</strong> ${data.lastRace}</p>
            `;
            container.appendChild(recordDiv);
        }

        // تحديث خيارات الفلاتر
        updateFilterOptions();
        filterResults();
    }

    // دالة لتحديث خيارات الفلاتر
    function updateFilterOptions() {
        let swimmers = new Set();
        let swimTypes = new Set();
        let distances = new Set();

        raceRecords.forEach(record => {
            swimmers.add(record.winnerName);
            swimTypes.add(record.swimType);
            distances.add(record.distance);
        });

        // تحديث قائمة الفلاتر
        let swimmerFilter = document.getElementById("swimmerFilter");
        let swimTypeFilter = document.getElementById("swimTypeFilter");
        let distanceFilter = document.getElementById("distanceFilter");

        // إضافة الخيارات إلى قائمة السباحين
        swimmers.forEach(swimmer => {
            let option = document.createElement("option");
            option.value = swimmer;
            option.textContent = swimmer;
            swimmerFilter.appendChild(option);
        });

        // إضافة الخيارات إلى قائمة أنواع السباقات
        swimTypes.forEach(type => {
            let option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            swimTypeFilter.appendChild(option);
        });

        // إضافة الخيارات إلى قائمة المسافات
        distances.forEach(distance => {
            let option = document.createElement("option");
            option.value = distance;
            option.textContent = distance;
            distanceFilter.appendChild(option);
        });
    }

    // دالة لتصفية النتائج بناءً على الفلاتر
    function filterResults() {
        let swimmer = document.getElementById("swimmerFilter").value;
        let swimType = document.getElementById("swimTypeFilter").value;
        let distance = document.getElementById("distanceFilter").value;

        let filteredRecords = raceRecords.filter(record => {
            return (
                (swimmer === "" || record.winnerName === swimmer) &&
                (swimType === "" || record.swimType === swimType) &&
                (distance === "" || record.distance === distance)
            );
        });

        // تحديث النتائج المعروضة
        renderFilteredResults(filteredRecords);
    }

    // دالة لعرض النتائج المصفاة
    function renderFilteredResults(records) {
        let container = document.getElementById("resultsContainer");
        container.innerHTML = ""; 

        records.forEach(record => {
            let recordDiv = document.createElement("div");
            recordDiv.className = "record";
            recordDiv.innerHTML = `
                <h3>السباح: ${record.winnerName}</h3>
                <p><strong>نوع السباق:</strong> ${record.swimType}</p>
                <p><strong>المسافة:</strong> ${record.distance} متر</p>
                <p><strong>الوقت:</strong> ${formatTime(record.results[0])}</p>
                <p><strong>التاريخ:</strong> ${record.timestamp}</p>
            `;
            container.appendChild(recordDiv);
        });
    }

    // استدعاء دالة التحليل عند تحميل الصفحة
    analyzeResults();

    // العودة إلى الصفحة السابقة
    function goBack() {
        window.history.back();
    }

    // العودة إلى الصفحة الرئيسية
    function goBack1() {
        window.location.href = "index.html";
    }
