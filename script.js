const exchangeModule = (function () {
    const radiosName = ["USD", "EUR", "GBP", "TRY"];

    // const currencyKeys = Object.keys(radiosName);
    const $parentFromEl = document.querySelector("#currency-box-from");
    const $parentToEl = document.querySelector("#currency-box-to");

    const $calculateButton = document.querySelector("#calculate-button");

    const fadeAnimation = document.querySelector(".list-last");
    const $resultList = document.querySelector(".list-last-value");
    const $inputText = document.querySelector("#input-text");

    const currencyFromInputName = "currency_from";
    const currencyToInputName = "currency_to";
    const amountInputName = "amount";

    //Check from target radios group.
    const getCheckedFromTarget = () => document.querySelector("input[name='" + currencyFromInputName + "']:checked");

    //Check to target radios group.
    const getCheckedToTarget = () => document.querySelector("input[name='" + currencyToInputName + "']:checked");

//Get amount value.
    const getAmount = () => document.querySelector("input[name='" + amountInputName + "']").value;

//Error snackbar
    const showError = () => {
        let x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function () {
            x.className = x.className.replace("show", "");
        }, 1400);
    }

    const renderRadios = (elements, root, inputName) => {
        elements.forEach((element) => {
            const currencyKeyDiv = document.createElement("div");
            const currencyKeyInput = document.createElement("input");
            currencyKeyInput.setAttribute("type", "radio");
            currencyKeyInput.setAttribute("name", inputName);
            currencyKeyInput.setAttribute("id", inputName + element);
            currencyKeyInput.setAttribute("value", element);
            const currencyKeyLabel = document.createElement("label");
            currencyKeyLabel.setAttribute("for", inputName + element);
            currencyKeyLabel.textContent = element;
            currencyKeyLabel.style.cursor = "pointer";
            currencyKeyDiv.appendChild(currencyKeyInput);
            currencyKeyDiv.appendChild(currencyKeyLabel);
            root.appendChild(currencyKeyDiv);
        })
    }

    const getBaseData = async (fromTarget) => {
        const response = await fetch(`https://api.exchangeratesapi.io/latest?base=${fromTarget}`);
        // https://api.exchangeratesapi.io/latest?base=
        const responseJSON = await response.json();
        return responseJSON.rates;
    };


    const checkRadios = (checkFrom, checkTo) => {
        if (!checkFrom) {
            //birinci buton secim yapilmadiysa yazdirir
            errorFrom = document.getElementById("snackbar");
            errorFrom.textContent = 'First choice not selected'
            showError();
        } else if (!checkTo) {
            //ikinci buton secim yapilmadiysa yazdirir
            errorTo = document.getElementById("snackbar");
            errorTo.textContent = 'Second choice not selected'
            showError();
        } else if (!checkFrom && !checkTo) {
            //ikiside secim yapmadiysa yazdirir
            errorBoth = document.getElementById("snackbar");
            errorBoth.textContent = 'Any choice not selected'
            showError();
        } else if (checkFrom.value === checkTo.value) {
            //Secimlerin benzerligi kontrol edildi
            errorSame = document.getElementById("snackbar");
            errorSame.textContent = "You shouldn't make same choice"
            showError();
        } else {
            return true;
        }
    }

    //Check amount
    const checkAmountType = (amount) => {
        if (amount === "") {
            errorFill = document.getElementById("snackbar");
            errorFill.textContent = " Fill the amount. "
            showError();
        } else if (isNaN(amount)) {
            // Number kontrolu yapildi
            errorNaN = document.getElementById("snackbar");
            errorNaN.textContent = " Amount not a number. "
            showError();

        } else {
            return true;
        }
    }

    // fadeAnimation
    const fadeAnimationFunc = () => {
        fadeAnimation.classList.add("fadein");
        // Fadein class i ekledikten sonra bir sonraki click te yine aynisini yapmak icin
        // kaldiridi
        fadeAnimation.addEventListener('animationend', function (e) {
            fadeAnimation.classList.remove('fadein');
        })
    }

    const renderResult = () => {
        const $selectedFrom = getCheckedFromTarget();
        const $selectedTo = getCheckedToTarget();
        const checkedRadious = checkRadios($selectedFrom, $selectedTo);
        const amount = getAmount();
        const checkedAmount = checkAmountType(amount);
        if (checkedAmount && checkedRadious) {
            const listElement = document.createElement("li");
            fadeAnimationFunc();
            getBaseData($selectedFrom.value).then((rates) => {
                const resultForOne = rates[$selectedTo.value];
                const result = amount * resultForOne;
                listElement.textContent = `${amount} ${$selectedFrom.value} = ${result.toFixed(2)} ${$selectedTo.value}`;
                $resultList.insertBefore(listElement, $resultList.firstChild);
            });
            //Reset selection
            $selectedFrom.checked = false;
            $selectedTo.checked = false;
            $inputText.value = "";
        }
    };

    const bindCalculateEvent = () => {
        $inputText.addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                $calculateButton.click();
            }
        });
        $calculateButton.addEventListener("click", function () {
            renderResult();
        });
    }

    const init = function () {
        // from icin radiolari olustur
        renderRadios(radiosName, $parentFromEl, currencyFromInputName);

        // to icin radiolari olustur
        renderRadios(radiosName, $parentToEl, currencyToInputName);

        // bind calculate event
        bindCalculateEvent();
    };

    return {
        init,
    }
})();

exchangeModule.init();

