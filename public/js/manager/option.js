
var dataOption = null;
var dataEntityOptions = null;
var submitFormOption = (form) => {
    let error = false;
    let data = $(form).serializeArray();
    let optionData = {
        value: null,
        question: null
    }
    //validate
    new Promise((resolve, reject) => {
        data.forEach(item => {
            if (item.value === "") {
                $(form).find('.error').html('Please complete information').show();
                error = true;
                setTimeout(() => {
                    $(form).find('.error').hide()
                }, 2000)
                return;
            } else {
                if (item.name == "value")
                    optionData.value = item.value
                if (item.name == "question")
                    optionData.question = item.value
            }
        });
        resolve(optionData)
    }).then(rs => {
        //if no error
        if (!error) {
            post('/drink/addOption', optionData, (res) => {
                clearForm(form);
                getAllOption();
            })
        }
    })
}
var delOption = (id, value) => {
    _delete('/drink/delOption/', id, (res) => {
        if (res.success) {
            getAllOption();
            dataEntityOptions.forEach(v => {
                if (v.metadata == value) {
                    post('/wit/delValue', { entitiId: 'options', value: v.value }, res => {
                        console.log(res)
                    })
                }
            })
        }
    })
}
var renderSelectOption = (data) => {
    let select = $("#listOptons");
    select.empty();
    data.forEach(d => {
        let item = `<option value="${d.value}">${d.value}</option>`;
        select.append(item);
    })
}
var renderDropdowOption = (data) => {
    let dropdow = $('#dropdowOption')
    dropdow.empty();
    data.forEach(op => {
        let item = `<li>
                        <a href="#" class="small" data-value="${op._id}" tabIndex="-1">
                            <input type="checkbox" />&nbsp;${op.value}</a>
                    </li>`;
        dropdow.append(item)
    })
    $('#dropdowOption a').on('click', function (event) {

        var $target = $(event.currentTarget),
            val = $target.attr('data-value'),
            $inp = $target.find('input'),
            idx;

        if ((idx = drinkOptions.indexOf(val)) > -1) {
            drinkOptions.splice(idx, 1);
            setTimeout(function () { $inp.prop('checked', false) }, 0);
        } else {
            drinkOptions.push(val);
            setTimeout(function () { $inp.prop('checked', true) }, 0);
        }
        $(event.target).blur();
        return false;
    });
}
var renderTableOption = (data) => {
    let option = $('#tableOption');
    option.find('tbody').empty();
    for (let i = 0; i < data.length; i++) {
        let index = i + 1;
        let intent = `<tr index="${i}"><td>${index}</td><td>${data[i].value}</td><td>${data[i].question}</td><td><button onclick='delOption("${data[i]._id}","${data[i].value}")' class='btn btn-danger'>Del</button><td><tr>`
        option.append(intent);
    }
}
var getAllOption = () => {
    get('/drink/getAllOption', data => {
        dataOption = data;
        renderTableOption(data);
        renderDropdowOption(data);
        renderSelectOption(data);
    })
}
getAllOption();