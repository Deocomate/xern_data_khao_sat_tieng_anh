function renderTableDataBase(data, filter) {
    const tableContainer = document.getElementById("renderTableDataBase");
    let tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Họ và tên</th>
                    <th>Ngày sinh</th>
                    <th>Nơi sinh</th>
                    <th>Vị trí công tác</th>
                    <th>Vị trí sát hạch</th>
                    <th>Đạt mức</th>
                    <th>Kết quả</th>
                    <th>Mã sinh viên</th>
                    <th>Năm</th>
                </tr>
            </thead>
            <tbody>
    `;

    const filteredData = data.filter(item => {
        for (const key in filter) {
            if (filter[key].length > 0) {
                if (item[key] == null || !filter[key].includes(String(item[key]))) {
                    return false;
                }
            }
        }
        return true;
    });

    filteredData.forEach(student => {
        tableHTML += `
                <tr>
                    <td>${student.stt}</td>
                    <td>${student.họ_và_tên}</td>
                    <td>${student.ngày_tháng_năm_sinh}</td>
                    <td>${student.nơi_sinh}</td>
                    <td>${student.vị_trí_công_tác_hiện_tại}</td>
                    <td>${student.vị_trí_sát_hạch}</td>
                    <td>${student.đạt_mức}</td>
                    <td>${student.kết_quả}</td>
                    <td>${student.mã_sinh_viên}</td>
                    <td>${student.năm}</td>
                </tr>
        `;
    });
    tableHTML += `
            </tbody>
        </table>
        `
    tableContainer.innerHTML = tableHTML;
}

function renderChartKetQuaTrungBinhTheoNam(filteredData) {
    // 1. Xử lý dữ liệu: Tính trung bình theo năm
    const dataByYear = {};
    filteredData.forEach(item => {
        const year = item.năm;
        if (!dataByYear[year]) {
            dataByYear[year] = {sum: 0, count: 0};
        }
        dataByYear[year].sum += item.mức_đạt;
        dataByYear[year].count++;
    });

    const years = Object.keys(dataByYear).sort(); // Sắp xếp năm
    const averages = years.map(year => {
        return (dataByYear[year].sum / dataByYear[year].count).toFixed(2)
    });

    console.log(years)
    console.log(averages)

    // 2. Vẽ biểu đồ bằng Plotly
    const data = [{
        x: years,
        y: averages,
        type: 'bar',
        text: averages, // Hiển thị giá trị trên cột
        textposition: 'auto', // Tự động điều chỉnh vị trí hiển thị
        marker: {
            color: 'rgb(55, 128, 191)', // Màu xanh dương
        }
    }];

    const layout = {
        title: 'KẾT QUẢ TB THEO NĂM',
        xaxis: {
            title: 'Năm',
            type: 'category' // Đảm bảo trục x hiển thị dạng category
        },
        yaxis: {
            title: 'Kết quả trung bình'
        },
        margin: { // Điều chỉnh margin để tránh bị cắt chữ
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
        },
        bargap: 0.15,
        bargroupgap: 0.1
    };

    Plotly.newPlot('renderKetQuaTrungBinhTheoNam', data, layout);
}

function renderChartKetQuaTrungBinhTheoNhomThiSinhSatHach(filteredData) {
    // 1. Xử lý dữ liệu: Tính trung bình theo nhóm
    const dataByGroup = {};
    filteredData.forEach(item => {
        const group = item.vị_trí_sát_hạch;
        if (!dataByGroup[group]) {
            dataByGroup[group] = {sum: 0, count: 0};
        }
        dataByGroup[group].sum += item.mức_đạt;
        dataByGroup[group].count++;
    });

    const groups = Object.keys(dataByGroup);
    const averages = groups.map(group => {
        return (dataByGroup[group].sum / dataByGroup[group].count).toFixed(2);
    });


    // 2. Vẽ biểu đồ bằng Plotly
    const data = [{
        y: groups,
        x: averages,
        type: 'bar',
        text: averages, // Hiển thị giá trị trên cột
        textposition: 'auto', // Tự động điều chỉnh vị trí hiển thị
        orientation: 'h',
        marker: {
            color: 'rgb(55, 128, 191)', // Màu xanh dương
        }
    }];

    const layout = {
        title: 'KẾT QUẢ TB THEO NHÓM THI SÁT HẠCH',
        xaxis: {
            title: 'Kết quả trung bình'
        },
        yaxis: {
            title: 'Nhóm',
            type: 'category' // Đảm bảo trục y hiển thị dạng category
        },
        margin: { // Điều chỉnh margin để tránh bị cắt chữ
            l: 150,
            r: 50,
            b: 100,
            t: 100,
            pad: 4
        },
        bargap: 0.15,
        bargroupgap: 0.1
    };

    Plotly.newPlot('renderKetQuaTrungBinhTheoNhomThiSinhSatHach', data, layout);
}

function renderTiLeDatKhongDat(filteredData) {
    // 1. Xử lý dữ liệu: Đếm số lượng đạt, không đạt, không rõ
    const counts = {
        'Đạt': 0,
        'Không đạt': 0,
        'Không rõ': 0
    };

    filteredData.forEach(item => {
        if (item.kết_quả === 'đạt') {
            counts['Đạt']++;
        } else if (item.đạt_mức === "không đạt") {
            counts['Không đạt']++;
        } else {
            counts['Không rõ']++;
        }
    });

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    // 2. Vẽ biểu đồ tròn bằng Plotly
    const data = [{
        values: values,
        labels: labels,
        type: 'pie',
        hole: 0.4, // Tạo hiệu ứng donut chart
        textinfo: 'percent+label', // Hiển thị giá trị và phần trăm
        marker: {
            colors: ['rgb(55, 128, 191)', 'rgb(255, 0, 0)', 'rgb(128, 128, 128)'] // Màu sắc tương ứng
        }
    }];

    const layout = {
        title: 'TỶ LỆ ĐẠT/KHÔNG ĐẠT',
        showlegend: true, // Hiển thị legend
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        }
    };

    Plotly.newPlot('renderTiLeDatKhongDat', data, layout);
}

function renderAllChart(data, filter) {
    const filteredData = data.filter(item => {
        for (const key in filter) {
            if (filter[key].length > 0) {
                if (item[key] == null || !filter[key].includes(String(item[key]))) {
                    return false;
                }
            }
        }
        return true;
    });
    renderTableDataBase(data, filter)
    renderChartKetQuaTrungBinhTheoNam(filteredData)
    renderChartKetQuaTrungBinhTheoNhomThiSinhSatHach(filteredData)
    renderTiLeDatKhongDat(filteredData)
}