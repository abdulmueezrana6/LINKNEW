const countryLanguageMap = {
  "AF": "ps", // Afghanistan - Pashto
  "AL": "sq", // Albania - Albanian
  "DZ": "ar", // Algeria - Arabic
  "AD": "ca", // Andorra - Catalan
  "AO": "pt", // Angola - Portuguese
  "AG": "en", // Antigua & Barbuda - English
  "AR": "es", // Argentina - Spanish
  "AM": "hy", // Armenia - Armenian
  "AU": "en", // Australia - English
  "AT": "de", // Austria - German
  "AZ": "az", // Azerbaijan - Azerbaijani
  "BS": "en", // Bahamas - English
  "BH": "ar", // Bahrain - Arabic
  "BD": "bn", // Bangladesh - Bengali
  "BB": "en", // Barbados - English
  "BY": "be", // Belarus - Belarusian
  "BE": "nl", // Belgium - Dutch/French (chọn Dutch là mặc định)
  "BZ": "en", // Belize - English
  "BJ": "fr", // Benin - French
  "BT": "dz", // Bhutan - Dzongkha
  "BO": "es", // Bolivia - Spanish
  "BA": "bs", // Bosnia & Herzegovina - Bosnian
  "BW": "en", // Botswana - English
  "BR": "pt", // Brazil - Portuguese
  "BN": "ms", // Brunei - Malay
  "BG": "bg", // Bulgaria - Bulgarian
  "BF": "fr", // Burkina Faso - French
  "BI": "fr", // Burundi - French
  "KH": "km", // Cambodia - Khmer
  "CM": "fr", // Cameroon - French
  "CA": "en", // Canada - English
  "CV": "pt", // Cape Verde - Portuguese
  "CF": "fr", // Central African Republic - French
  "TD": "fr", // Chad - French
  "CL": "es", // Chile - Spanish
  "CN": "zh", // China - Chinese
  "CO": "es", // Colombia - Spanish
  "KM": "ar", // Comoros - Arabic
  "CG": "fr", // Congo - French
  "CD": "fr", // Congo (DRC) - French
  "CR": "es", // Costa Rica - Spanish
  "CI": "fr", // Côte d'Ivoire - French
  "HR": "hr", // Croatia - Croatian
  "CU": "es", // Cuba - Spanish
  "CY": "el", // Cyprus - Greek
  "CZ": "cs", // Czech Republic - Czech
  "DK": "da", // Denmark - Danish
  "DJ": "fr", // Djibouti - French
  "DM": "en", // Dominica - English
  "DO": "es", // Dominican Republic - Spanish
  "EC": "es", // Ecuador - Spanish
  "EG": "ar", // Egypt - Arabic
  "SV": "es", // El Salvador - Spanish
  "GQ": "es", // Equatorial Guinea - Spanish
  "ER": "ti", // Eritrea - Tigrinya
  "EE": "et", // Estonia - Estonian
  "SZ": "en", // Eswatini - English
  "ET": "am", // Ethiopia - Amharic
  "FJ": "en", // Fiji - English
  "FI": "fi", // Finland - Finnish
  "FR": "fr", // France - French
  "GA": "fr", // Gabon - French
  "GM": "en", // Gambia - English
  "GE": "ka", // Georgia - Georgian
  "DE": "de", // Germany - German
  "GH": "en", // Ghana - English
  "GR": "el", // Greece - Greek
  "GD": "en", // Grenada - English
  "GT": "es", // Guatemala - Spanish
  "GN": "fr", // Guinea - French
  "GW": "pt", // Guinea-Bissau - Portuguese
  "GY": "en", // Guyana - English
  "HT": "fr", // Haiti - French
  "HN": "es", // Honduras - Spanish
  "HU": "hu", // Hungary - Hungarian
  "IS": "is", // Iceland - Icelandic
  "IN": "hi", // India - Hindi
  "ID": "id", // Indonesia - Indonesian
  "IR": "fa", // Iran - Persian
  "IQ": "ar", // Iraq - Arabic
  "IE": "en", // Ireland - English
  "IL": "he", // Israel - Hebrew
  "IT": "it", // Italy - Italian
  "JM": "en", // Jamaica - English
  "JP": "ja", // Japan - Japanese
  "JO": "ar", // Jordan - Arabic
  "KZ": "kk", // Kazakhstan - Kazakh
  "KE": "sw", // Kenya - Swahili
  "KI": "en", // Kiribati - English
  "KW": "ar", // Kuwait - Arabic
  "KG": "ky", // Kyrgyzstan - Kyrgyz
  "LA": "lo", // Laos - Lao
  "LV": "lv", // Latvia - Latvian
  "LB": "ar", // Lebanon - Arabic
  "LS": "en", // Lesotho - English
  "LR": "en", // Liberia - English
  "LY": "ar", // Libya - Arabic
  "LI": "de", // Liechtenstein - German
  "LT": "lt", // Lithuania - Lithuanian
  "LU": "fr", // Luxembourg - French
  "MG": "mg", // Madagascar - Malagasy
  "MW": "en", // Malawi - English
  "MY": "ms", // Malaysia - Malay
  "MV": "dv", // Maldives - Dhivehi
  "ML": "fr", // Mali - French
  "MT": "mt", // Malta - Maltese
  "MH": "en", // Marshall Islands - English
  "MR": "ar", // Mauritania - Arabic
  "MU": "en", // Mauritius - English
  "MX": "es", // Mexico - Spanish
  "FM": "en", // Micronesia - English
  "MD": "ro", // Moldova - Romanian
  "MC": "fr", // Monaco - French
  "MN": "mn", // Mongolia - Mongolian
  "ME": "sr", // Montenegro - Serbian
  "MA": "ar", // Morocco - Arabic
  "MZ": "pt", // Mozambique - Portuguese
  "MM": "my", // Myanmar - Burmese
  "NA": "en", // Namibia - English
  "NR": "en", // Nauru - English
  "NP": "ne", // Nepal - Nepali
  "NL": "nl", // Netherlands - Dutch
  "NZ": "en", // New Zealand - English
  "NI": "es", // Nicaragua - Spanish
  "NE": "fr", // Niger - French
  "NG": "en", // Nigeria - English
  "KP": "ko", // North Korea - Korean
  "NO": "no", // Norway - Norwegian
  "OM": "ar", // Oman - Arabic
  "PK": "ur", // Pakistan - Urdu
  "PW": "en", // Palau - English
  "PA": "es", // Panama - Spanish
  "PG": "en", // Papua New Guinea - English
  "PY": "es", // Paraguay - Spanish
  "PE": "es", // Peru - Spanish
  "PH": "en", // Philippines - English
  "PL": "pl", // Poland - Polish
  "PT": "pt", // Portugal - Portuguese
  "QA": "ar", // Qatar - Arabic
  "RO": "ro", // Romania - Romanian
  "RU": "ru", // Russia - Russian
  "RW": "rw", // Rwanda - Kinyarwanda
  "KN": "en", // Saint Kitts & Nevis - English
  "LC": "en", // Saint Lucia - English
  "VC": "en", // Saint Vincent & Grenadines - English
  "WS": "sm", // Samoa - Samoan
  "SM": "it", // San Marino - Italian
  "ST": "pt", // São Tomé & Príncipe - Portuguese
  "SA": "ar", // Saudi Arabia - Arabic
  "SN": "fr", // Senegal - French
  "RS": "sr", // Serbia - Serbian
  "SC": "fr", // Seychelles - French
  "SL": "en", // Sierra Leone - English
};

export function getLanguageByCountryCode(countryCode) {
  return countryLanguageMap[countryCode] || "en"; // Mặc định trả về tiếng Anh nếu không tìm thấy
}