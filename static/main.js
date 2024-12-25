$(document).ready(async function () {
    // Global var
    let filterOptionList = {
        năm: [],
        vị_trí_công_tác_hiện_tại: [],
        vị_trí_sát_hạch: [],
        mã_sinh_viên: [],
        nơi_sinh: [],
        kết_quả: [],
        mức_đạt: [],
    }
    let studentDataBase = await getRawData()
    let studentDataTest = getTestData(studentDataBase)
    console.log(studentDataTest)

    // Thuat toan
    let optionFilterKeys = getUniqueValuesByKey(studentDataBase)
    console.log(optionFilterKeys)

    initSelect2(optionFilterKeys)

    renderAllChart(studentDataBase, filterOptionList)

    // Funtion
    async function getRawData() {
        let data = []
        await axios({
            method: 'get', url: './static/data.json', responseType: 'json'
        }).then(function (response) {
            data = response.data
        });
        return data
    }

    function getTestData(studentDataBase) {
        let studentDataTest = []
        for (let i = 0; i < 500; i++) {
            studentDataTest.push(studentDataBase[i])
        }
        return studentDataTest
    }

    function getUniqueValuesByKey(studentData) {
        if (!studentData || studentData.length === 0) {
            return {};
        }

        const uniqueValues = {};
        const firstItem = studentData[0];

        for (const key in firstItem) {
            if (firstItem.hasOwnProperty(key)) {
                uniqueValues[key] = [];
                const valueSet = new Set();
                studentData.forEach(item => {
                    if (item[key] != null) {
                        valueSet.add(item[key]);
                    }
                })
                uniqueValues[key] = Array.from(valueSet).sort();
            }
        }

        return uniqueValues;
    }

    function initSelect2(optionFilterKeys) {

        let optionNamDanhGia = optionFilterKeys["năm"];
        $(".select2-nam_danh_gia").select2({
            data: optionNamDanhGia.map(data => ({id: data, text: data})),
        });

        let optionViTriCongTac = optionFilterKeys["vị_trí_công_tác_hiện_tại"];
        $(".select2-vi_tri_cong_tac").select2({
            data: optionViTriCongTac.map(data => ({id: data, text: data})),
        });

        let optionViTriSatHach = optionFilterKeys["vị_trí_sát_hạch"];
        $(".select2-vi_tri_sat_hach").select2({
            data: optionViTriSatHach.map(data => ({id: data, text: data})),
        });

        let optionMaNhanVien = optionFilterKeys["mã_sinh_viên"];
        $(".select2-ma_nhan_vien").select2({
            data: optionMaNhanVien.map(data => ({id: data, text: data})),
        });

        let optionNoiSinh = optionFilterKeys["nơi_sinh"];
        $(".select2-noi_sinh").select2({
            data: optionNoiSinh.map(data => ({id: data, text: data})),
        });

        let optionKeyQua = optionFilterKeys["kết_quả"];
        $(".select2-ket_qua").select2({
            data: optionKeyQua.map(data => ({id: data, text: data})),
        });

        let optionDiem = optionFilterKeys["mức_đạt"];
        $(".select2-diem").select2({
            data: optionDiem.map(data => ({id: data, text: data})),
        });

        // Phần dùng chung:
        selectAllSetting()
        selectOnchangeAddToFilterList()
    }

    function selectAllSetting() {
        $(".select2-init").on('select2:select', function (e) {
            var selectedValue = e.params.data.id;
            if (selectedValue === "*") {
                // Nếu chọn "Chọn tất cả", xoá hết các option đã chọn khác
                $(this).val(["*"]).trigger("change");
            } else {
                // Nếu không phải "Chọn tất cả", bỏ chọn "Chọn tất cả" nếu nó đang được chọn
                let selectedValues = $(this).val();
                if (selectedValues && selectedValues.includes("*")) {
                    selectedValues = selectedValues.filter(value => value !== "*");
                    $(this).val(selectedValues).trigger("change");
                }
            }
        });
        $(".select2-init").on('select2:unselect', function (e) {
            var unselectedValue = e.params.data.id;
            if (unselectedValue === "*") {
                $(this).val([]).trigger("change");
            }
        });
    }

    function selectOnchangeAddToFilterList() {
        $(".select2-init").on("change", function () {
            const selectName = $(this).attr("name");
            const selectedValues = $(this).val();
            if (selectedValues && selectedValues.includes("*")) {
                filterOptionList[selectName] = [];
            } else {
                filterOptionList[selectName] = selectedValues || [];
            }
            console.log(filterOptionList)
            renderAllChart(studentDataBase, filterOptionList)
        });
    }
});
