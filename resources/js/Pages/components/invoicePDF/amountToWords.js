export function amountToWordsLT(amount) {
    const ones = [
      "", "vienas", "du", "trys", "keturi", "penki",
      "šeši", "septyni", "aštuoni", "devyni"
    ];
  
    const teens = [
      "dešimt", "vienuolika", "dvylika", "trylika", "keturiolika",
      "penkiolika", "šešiolika", "septyniolika",
      "aštuoniolika", "devyniolika"
    ];
  
    const tens = [
      "", "", "dvidešimt", "trisdešimt", "keturiasdešimt",
      "penkiasdešimt", "šešiasdešimt",
      "septyniasdešimt", "aštuoniasdešimt", "devyniasdešimt"
    ];
  
    const hundreds = [
      "", "šimtas", "du šimtai", "trys šimtai", "keturi šimtai",
      "penki šimtai", "šeši šimtai", "septyni šimtai",
      "aštuoni šimtai", "devyni šimtai"
    ];
  
    function convertHundreds(num) {
      let result = "";
  
      if (num >= 100) {
        result += hundreds[Math.floor(num / 100)] + " ";
        num %= 100;
      }
  
      if (num >= 20) {
        result += tens[Math.floor(num / 10)] + " ";
        num %= 10;
      }
  
      if (num >= 10) {
        result += teens[num - 10] + " ";
        return result.trim();
      }
  
      if (num > 0) {
        result += ones[num] + " ";
      }
  
      return result.trim();
    }
  
    function thousandForm(n) {
      if (n % 10 === 1 && n % 100 !== 11) return "tūkstantis";
      if (n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 10 || n % 100 >= 20))
        return "tūkstančiai";
      return "tūkstančių";
    }
  
    function euroForm(n) {
      if (n % 10 === 1 && n % 100 !== 11) return "euras";
      if (n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 10 || n % 100 >= 20))
        return "eurai";
      return "eurų";
    }
  
    let [eur, ct] = Number(amount).toFixed(2).split(".");
    eur = parseInt(eur, 10);
  
    let words = "";
  
    if (eur === 0) {
      words = "nulis";
    } else {
      const thousands = Math.floor(eur / 1000);
      const rest = eur % 1000;
  
      if (thousands > 0) {
        words +=
          convertHundreds(thousands) +
          " " +
          thousandForm(thousands) +
          " ";
      }
  
      if (rest > 0) {
        words += convertHundreds(rest);
      }
    }
  
    return `${words.trim()} ${euroForm(eur)} ${ct} ct €`;
  }