var getFormData = function( form ){
    var form_data = {};
    Array.prototype.forEach.call( form.elements, function( el, i ){
        switch( el.tagName ){
            case 'INPUT':
            case 'TEXTAREA':
            case 'SELECT':
                var value = el.value;
                if( el.type === 'number' || el.type === 'range' ){
                    value = parseInt( value, 10 );
                }
                form_data[el.name] = value;
            break;
        }
    });
    return form_data;
};
