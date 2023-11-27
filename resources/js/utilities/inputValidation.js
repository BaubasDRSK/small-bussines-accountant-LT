export default function inputValidation(type, value) {
    if (type === 'name'){ return [type, nameValidation(value)]};
    if (type === 'code'){ return [type, codeValidation(value)]};
    if (type === 'vatcode'){ return [type, vatcodeValidation(value)]};
    if (type === 'street'){ return [type, streetValidation(value)]};
    if (type === 'city'){ return [type, cityValidation(value)]};
    if (type === 'country'){ return [type, countryValidation(value)]};
    if (type === 'phone'){ return [type, phoneValidation(value)]};
    if (type === 'email'){ return [type, emailValidation(value)]};
    if (type === 'web'){ return [type, webValidation(value)]};

};

const nameValidation = (value) => {
    let validationMessages = [];
    value.length === 0 ? validationMessages= [...validationMessages, "Field is required"] : null;
    /\d/.test(value.trim()) ? validationMessages = [...validationMessages, "No numbers allowed"] : null;
    !(/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ0-9-\s]*$/.test(value.trim())) ? validationMessages = [...validationMessages, "No special characters allowed"]: null;

    return validationMessages;
}

const codeValidation = (value) => {
    let validationMessages = [];
    value.length === 0 ? setValidations((prevValidations) => ({ ...prevValidations, ['code']: [...prevValidations['code'], "Field is required"], })) : null;
    /[a-zA-Z]/.test(value.trim()) ?  validationMessages = [...validationMessages, "Code must be only numbers"] : null;
    !(/^[a-zA-Z0-9]*$/.test(value.trim())) ? validationMessages = [...validationMessages, "No special characters allowed"] : null;

    return validationMessages;
}

const vatcodeValidation = (value) => {
    let validationMessages = [];
    value.length === 0 ? validationMessages= [...validationMessages, "Field is required"] : null;
    !(/^(LT\d{9}(?:\d{3})?|-)$/.test(value.trim())) ?  validationMessages = [...validationMessages, "Check your VAT code"]:null;

    return validationMessages;
    }

const streetValidation = (value) => {
    let validationMessages = [];
    value.length === 0 ? validationMessages= [...validationMessages, "Field is required"] : null;
    !(/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\d.\s-]{2,}$/.test(value.trim())) ?  validationMessages = [...validationMessages, "Check info again"] : null;

    return validationMessages;
    }

const cityValidation = (value) => {
    let validationMessages = [];
    value.length === 0 ? validationMessages= [...validationMessages, "Field is required"] : null;
    !(/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]{2,}$/.test(value.trim())) ? validationMessages = [...validationMessages, "Check info again"] : null;

    return validationMessages;
    }

const countryValidation = (value) => {
    let validationMessages = [];
    value.length === 0 ? validationMessages= [...validationMessages, "Field is required"] : null;
    !(/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s-]{2,}$/.test(value.trim())) ?  validationMessages = [...validationMessages, "Check info again"] : null;

    return validationMessages;
    }

const phoneValidation = (value) => {
    let validationMessages = [];
    value.length === 0 ? validationMessages= [...validationMessages, "Field is required"] : null;
    !(/^\+(?:[0-9]\s?){6,14}[0-9]$/.test(value.trim())) ?  validationMessages = [...validationMessages, "Check number"] : null;

    return validationMessages;
    }

const emailValidation = (value) => {
    let validationMessages = [];
    value.length === 0 ? validationMessages= [...validationMessages, "Field is required"] : null;
    !(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())) ?  validationMessages = [...validationMessages, "Check email again"] : null;

    return validationMessages;
    }


const webValidation = (value) => {
    let validationMessages = [];
    value.length === 0 ? validationMessages= [...validationMessages, "Field is required"] : null;
    !(/^w*\.?[^\s]*\.[a-zA-Z]{2,4}$/.test(value.trim())) ?  validationMessages = [...validationMessages, "Check web address again"] : null;

    return validationMessages;
    }
