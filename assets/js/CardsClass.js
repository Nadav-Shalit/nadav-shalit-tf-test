var CardsClass = function (options) {
    var _this = this;
    this.contactImgPath = options.contactImgPath || '';
    this.cordsLink = 'https://www.google.com/maps/@lat,lng,10z';
    this.init = function () {
        _this.initEvents();
        _this.loadContacts();

    };

    this.initEvents = function () {

        $('div#crdConatiner div.add-crd').bind('click', function () {
            $('#crdConatiner').toggleClass('show-form');
            _this.resetForm();
            $('div.clearfix.form').show();
        });

        $('div.clearfix.form button.close').bind('click', function () {
            $('#crdConatiner').toggleClass('show-form');
            _this.resetForm();
            $('div.clearfix.form').hide();
        });
        $('div#crdConatiner div.cords').bind('click', function () {
            var cardId = $(this).data('crdid');
            var cardData = data.find(function (p) {
                return p.id === cardId;
            });
            if (!!cardData) {
                var mapLink = _this.cordsLink.replace(/lat/, cardData.cords.lat).replace(/lng/, cardData.cords.lng);
                window.open(mapLink,'_blank');
            }

        });
        $('div#crdConatiner a.edit').bind('click', function () {
            $('#crdConatiner').toggleClass('show-form');
            var cardId = $(this).data('crdid');
            _this.setContact(cardId);
            $('div.clearfix.form div.action button').data('action', 'edit').data('cardId', cardId).text('save');
            $('div.clearfix.form').show();

        });
        $('div#crdConatiner a.delete').bind('click', function () {
            $('#crdConatiner').toggleClass('show-form');
            var cardId = $(this).data('crdid');
            _this.setContact(cardId);
            $('div.form input').prop('disabled', true);
            $('div.clearfix.form div.action button').data('action', 'delete').data('cardId', cardId).text('delete');
            $('div.clearfix.form').show();
        });
        $('div.clearfix.form div.action button').bind('click', function () {
            if (!!_this.validateForm()) {
                var cardId = $(this).data('cardId');
                if ($(this).data('action') === 'add') {
                    _this.addCard();
                } else if ($(this).data('action') === 'edit') {
                    _this.updateCard(cardId);
                } else if ($(this).data('action') === 'delete') {
                    _this.deleteCard(cardId);
                }
                $('div.clearfix.form button.close').click();
            }
        });
        $('img.img-thumbnail').on('error', function (evt) {
            evt.currentTarget.onerror = '';
            evt.currentTarget.src = 'https://picsum.photos/200/200?random=' + new Date().getSeconds();
            return true;
        });
    };
    this.loadSingleCard = function (item) {
        var $cloneCard = $('div#crdConatiner').find('.template').clone(true);
        $cloneCard.removeClass('template');
        $($cloneCard).attr('id', 'card-' + item.id);
        $($cloneCard).find('img').attr('src', _this.contactImgPath + item.name + '.jpg');
        $($cloneCard).find('img').attr('alt', item.name);
        $($cloneCard).find('div.job-title').text(item.jobTitle);
        $($cloneCard).find('div.name').text(item.name);
        $($cloneCard).find('div.company').text(item.company);
        $($cloneCard).find('div.address').text(item.address);
        $($cloneCard).find('div.phone span').text(item.phone);
        $($cloneCard).find('div.cords span.a-desc').text(item.address);
        $($cloneCard).find('div.cords').data('crdid', item.id);
        $($cloneCard).find('div.action a.edit').data('crdid', item.id);
        $($cloneCard).find('div.action a.delete').data('crdid', item.id);
        $cloneCard.insertBefore('div.add-crd');
    };
    this.loadContacts = function () {
        $(data).each(function (idx, item) {
            _this.loadSingleCard(item);
        });
    };
    this.setContact = function (cardId) {
        var cardData = data.find(function (p) {
            return p.id === cardId;
        });
        if (!!cardData) {
            $('div.form img').attr('src', _this.contactImgPath + cardData.name + '.jpg');
            $('div.form input#title').val(cardData.jobTitle);
            $('div.form input#name').val(cardData.name);
            $('div.form input#company').val(cardData.company);
            $('div.form input#address').val(cardData.address);
            $('div.form input#phone').val(cardData.phone);

        }
    };
    this.resetForm = function () {
        $('div.clearfix.form div.action button').data('action', 'add').data('cardId', 0).text('add');
        $('div.form input').val('');
        $('div.form input').prop('disabled', false);
    };
    this.validateForm = function () {
        var regex = /^[(]\d{3}[)]\d{3}-\d{4}$/gm;
       
        if (!!!$('div.form input#name').val()) {
            _this.setError($('div.form input#name'));
            return false;
        }
        if (!regex.test($('div.form input#phone').val())) {
            _this.setError($('div.form input#phone'));
            return false;
        }
        return true;
    };
    this.addCard = function () {
        var newCard = {
            id: (data.length) + 1,
            name: $('div.form input#name').val(),
            company: $('div.form input#company').val(),
            address: $('div.form input#address').val(),
            cords: _this.setCords($('div.form input#address').val()),
            phone: $('div.form input#phone').val(),
            jobTitle: $('div.form input#title').val()
        };
        data.push(newCard);
        _this.loadSingleCard(newCard);
        _this.animate($('div#card-' + newCard.id), 'updated');
    };
    this.updateCard = function (cardId) {
        var cardData = data.find(function (p) {
            return p.id === cardId;
        });
        if (!!cardData) {
            var $card = $('div#card-' + cardId);
            cardData.name = $('div.form input#name').val();
            cardData.company = $('div.form input#company').val();
            cardData.address = $('div.form input#address').val();
            cardData.cords = _this.setCords(cardData.address);
            cardData.phone = $('div.form input#phone').val();
            cardData.jobTitle = $('div.form input#title').val();
            data[cardId - 1] = cardData;
            $card.find('img').attr('src', _this.contactImgPath + cardData.name + '.jpg');
            $card.find('img').attr('alt', cardData.name);
            $card.find('div.job-title').text(cardData.jobTitle);
            $card.find('div.name').text(cardData.name);
            $card.find('div.company').text(cardData.company);
            $card.find('div.address').text(cardData.address);

            $card.find('div.phone span').text(cardData.phone);
            _this.animate($card, 'updated');
        }

    };
    this.deleteCard = function (cardId) {
        var $card = $('div#card-' + cardId);
        data = data.filter(function (obj) {
            return obj.id !== cardId;
        });
        $('div#card-' + cardId).remove();
    };
    this.setError = function ($input) {
        $input.addClass('error').delay(3000)
            .queue(function (next) {
                $(this).removeClass('error');
                next();
            });
    };
    this.animate = function ($obj, className) {
        $obj.addClass(className).delay(2500)
            .queue(function (next) {
                $(this).removeClass(className);
                next();
            });
    };

    this.setCords = function (searchTerm) {
        var cords = {
            lng: '32.000000',
            lat: '33.000000'
        };
        searchTerm = $.trim(searchTerm);
        if (searchTerm.length > 0) {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + searchTerm + '&key=AIzaSyDKvvBgAkSCugEbXckutuAFuqPzthsCnJ8', {})
                .then((response) => {
                    return response.json();
                })
                .then((jsonObject) => {
                    if (jsonObject.results.length > 0) { ///pseodo code 
                        cords.lng = jsonObject.results[0].lng;
                        cords.lat = jsonObject.results[0].lat;
                    }
                });
        }
        return cords;
    };
    this.debug = function () {
        console.log(data);
    };
};