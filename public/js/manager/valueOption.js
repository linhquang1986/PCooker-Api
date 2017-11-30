

expressionsV = [];
function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
var getAllVOption = () => {
    get('/wit/getAll/options', res => {
        new Promise((resolve, reject) => {
            dataEntityOptions = res.body.values;
            dataEntityOptions.sort(dynamicSort('metadata'))
            dataEntityOptions.forEach(item => {
                item.srtEx = '';
                if (item.expressions.length > 0) {
                    item.expressions.forEach(e => {
                        item.srtEx += e + ','
                    })
                }
            })
            resolve(dataEntityOptions);
        }).then(rs => {
            renderTableVOption(rs);
        })
    })
}
getAllVOption();
var renderTableVOption = (data) => {
    let vOptions = $('#tableVOption');
    vOptions.find('tbody').empty();
    for (let i = 0; i < data.length; i++) {
        let index = i + 1;
        let intent = `<tr index="${i}"><td>${data[i].value}</td><td>${data[i].srtEx}</td><td>${data[i].metadata}</td><td><button onclick="delvOption('${data[i].value}')" class='btn btn-danger'>Del</button></td></tr>`
        vOptions.append(intent);
    }
}
$('#expressionV').on("keypress", function (e) {
    let expressionV = $('ul.expressionV')
    if (e.which === 13) {
        let text = $('#expressionV').val();
        if (text != '') {
            expressionsV.push(text);
            expressionV.append(`<li class="list-group-item">${text}<span onclick='removeExpressionV(this)' class="glyphicon glyphicon-remove" style="float:right"></span></li>`)
            $('#expressionV').val('');
        }
    }
});

var delvOption = (value) => {
    post('/wit/delValue', { entitiId: "options", value: value }, res => {
        if (res.res.statusCode == 200)
            getAllVOption();
    })
}

var removeExpressionV = (e) => {
    let parent = $(e).parent()
    expressionsV.pop(parent.text())
    parent.remove()
}

var submitFormVOption = (form) => {
    let error = false;
    let data = $(form).serializeArray();
    let optiondata = {
        entitiId: 'options',
        value: null,
        expressions: expressionsV,
        metadata: null
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
                switch (item.name) {
                    case 'metadata': optiondata.metadata = item.value; break;
                    case 'valueName': optiondata.value = item.value; break;
                }
            }
        });
        resolve(optiondata)
    }).then(rs => {
        if (!error) {
            post('/wit/addValue', optiondata, res => {
                if (res.res.statusCode == 200) {
                    getAllVOption();
                    clearForm(form)
                }
            })
        }
    })
}