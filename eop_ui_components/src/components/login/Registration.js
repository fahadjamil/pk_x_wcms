import React, { useRef, useState } from 'react';
import Axios from 'axios';
import { eopUserRegistration } from '../../config/path';
import { BiErrorAlt } from 'react-icons/bi';
import { BsFillHandThumbsUpFill } from 'react-icons/bs';
import toast, { Toaster } from 'react-hot-toast';

export const Registration = (props) => {
    const permCountry = useRef(null);
    const currentCountry = useRef(null);
    const { lang } = props;
    const [dependent_value, setDependent_value] = useState([]);
    const [same_as, setSame_as] = useState(false);
    const [data, setdata] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        mobile: '',
        cnic: '',
        passport_number: '',
        iqama_number: '',
        password: '',
        confirm_password: '',
        current_city: '',
        current_state: '',
        current_country: '',
        current_postal_code: '',
        current_address: '',
        permanent_city: '',
        permanent_state: '',
        permanent_country: '',
        permanent_postal_code: '',
        permanent_address: '',
        father_name: '',
        profession: '',
        account_holder: '',
        problem: '',
    });
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [error, setError] = useState('');
    const [registration, setRegistration] = useState('');

    const SignupDependent = (value, index, propName) => {
        let dependentAry = dependent_value;
        let dependentData = dependentAry[index];
        if (!dependentData) {
            dependentData = {
                name: '',
                age: '',
                iqamaNo: '',
                relation: '',
            };
        }

        if (propName === 'name') {
            dependentData.name = value;
        }

        if (propName === 'age') {
            dependentData.age = value;
        }

        if (propName === 'iqamaNo') {
            dependentData.iqamaNo = value;
        }

        if (propName === 'relation') {
            dependentData.relation = value;
        }

        dependentAry[index] = dependentData;
        setDependent_value(dependentAry);
    };
    const countryListAllIsoData = [
        { code: 'AF', code3: 'AFG', name: 'Afghanistan', number: '004' },
        { code: 'AL', code3: 'ALB', name: 'Albania', number: '008' },
        { code: 'DZ', code3: 'DZA', name: 'Algeria', number: '012' },
        { code: 'AS', code3: 'ASM', name: 'American Samoa', number: '016' },
        { code: 'AD', code3: 'AND', name: 'Andorra', number: '020' },
        { code: 'AO', code3: 'AGO', name: 'Angola', number: '024' },
        { code: 'AI', code3: 'AIA', name: 'Anguilla', number: '660' },
        { code: 'AQ', code3: 'ATA', name: 'Antarctica', number: '010' },
        { code: 'AG', code3: 'ATG', name: 'Antigua and Barbuda', number: '028' },
        { code: 'AR', code3: 'ARG', name: 'Argentina', number: '032' },
        { code: 'AM', code3: 'ARM', name: 'Armenia', number: '051' },
        { code: 'AW', code3: 'ABW', name: 'Aruba', number: '533' },
        { code: 'AU', code3: 'AUS', name: 'Australia', number: '036' },
        { code: 'AT', code3: 'AUT', name: 'Austria', number: '040' },
        { code: 'AZ', code3: 'AZE', name: 'Azerbaijan', number: '031' },
        { code: 'BS', code3: 'BHS', name: 'Bahamas (the)', number: '044' },
        { code: 'BH', code3: 'BHR', name: 'Bahrain', number: '048' },
        { code: 'BD', code3: 'BGD', name: 'Bangladesh', number: '050' },
        { code: 'BB', code3: 'BRB', name: 'Barbados', number: '052' },
        { code: 'BY', code3: 'BLR', name: 'Belarus', number: '112' },
        { code: 'BE', code3: 'BEL', name: 'Belgium', number: '056' },
        { code: 'BZ', code3: 'BLZ', name: 'Belize', number: '084' },
        { code: 'BJ', code3: 'BEN', name: 'Benin', number: '204' },
        { code: 'BM', code3: 'BMU', name: 'Bermuda', number: '060' },
        { code: 'BT', code3: 'BTN', name: 'Bhutan', number: '064' },
        { code: 'BO', code3: 'BOL', name: 'Bolivia (Plurinational State of)', number: '068' },
        { code: 'BQ', code3: 'BES', name: 'Bonaire, Sint Eustatius and Saba', number: '535' },
        { code: 'BA', code3: 'BIH', name: 'Bosnia and Herzegovina', number: '070' },
        { code: 'BW', code3: 'BWA', name: 'Botswana', number: '072' },
        { code: 'BV', code3: 'BVT', name: 'Bouvet Island', number: '074' },
        { code: 'BR', code3: 'BRA', name: 'Brazil', number: '076' },
        { code: 'IO', code3: 'IOT', name: 'British Indian Ocean Territory (the)', number: '086' },
        { code: 'BN', code3: 'BRN', name: 'Brunei Darussalam', number: '096' },
        { code: 'BG', code3: 'BGR', name: 'Bulgaria', number: '100' },
        { code: 'BF', code3: 'BFA', name: 'Burkina Faso', number: '854' },
        { code: 'BI', code3: 'BDI', name: 'Burundi', number: '108' },
        { code: 'CV', code3: 'CPV', name: 'Cabo Verde', number: '132' },
        { code: 'KH', code3: 'KHM', name: 'Cambodia', number: '116' },
        { code: 'CM', code3: 'CMR', name: 'Cameroon', number: '120' },
        { code: 'CA', code3: 'CAN', name: 'Canada', number: '124' },
        { code: 'KY', code3: 'CYM', name: 'Cayman Islands (the)', number: '136' },
        { code: 'CF', code3: 'CAF', name: 'Central African Republic (the)', number: '140' },
        { code: 'TD', code3: 'TCD', name: 'Chad', number: '148' },
        { code: 'CL', code3: 'CHL', name: 'Chile', number: '152' },
        { code: 'CN', code3: 'CHN', name: 'China', number: '156' },
        { code: 'CX', code3: 'CXR', name: 'Christmas Island', number: '162' },
        { code: 'CC', code3: 'CCK', name: 'Cocos (Keeling) Islands (the)', number: '166' },
        { code: 'CO', code3: 'COL', name: 'Colombia', number: '170' },
        { code: 'KM', code3: 'COM', name: 'Comoros (the)', number: '174' },
        { code: 'CD', code3: 'COD', name: 'Congo (the Democratic Republic of the)', number: '180' },
        { code: 'CG', code3: 'COG', name: 'Congo (the)', number: '178' },
        { code: 'CK', code3: 'COK', name: 'Cook Islands (the)', number: '184' },
        { code: 'CR', code3: 'CRI', name: 'Costa Rica', number: '188' },
        { code: 'HR', code3: 'HRV', name: 'Croatia', number: '191' },
        { code: 'CU', code3: 'CUB', name: 'Cuba', number: '192' },
        { code: 'CW', code3: 'CUW', name: 'Curaçao', number: '531' },
        { code: 'CY', code3: 'CYP', name: 'Cyprus', number: '196' },
        { code: 'CZ', code3: 'CZE', name: 'Czechia', number: '203' },
        { code: 'CI', code3: 'CIV', name: "Côte d'Ivoire", number: '384' },
        { code: 'DK', code3: 'DNK', name: 'Denmark', number: '208' },
        { code: 'DJ', code3: 'DJI', name: 'Djibouti', number: '262' },
        { code: 'DM', code3: 'DMA', name: 'Dominica', number: '212' },
        { code: 'DO', code3: 'DOM', name: 'Dominican Republic (the)', number: '214' },
        { code: 'EC', code3: 'ECU', name: 'Ecuador', number: '218' },
        { code: 'EG', code3: 'EGY', name: 'Egypt', number: '818' },
        { code: 'SV', code3: 'SLV', name: 'El Salvador', number: '222' },
        { code: 'GQ', code3: 'GNQ', name: 'Equatorial Guinea', number: '226' },
        { code: 'ER', code3: 'ERI', name: 'Eritrea', number: '232' },
        { code: 'EE', code3: 'EST', name: 'Estonia', number: '233' },
        { code: 'SZ', code3: 'SWZ', name: 'Eswatini', number: '748' },
        { code: 'ET', code3: 'ETH', name: 'Ethiopia', number: '231' },
        { code: 'FK', code3: 'FLK', name: 'Falkland Islands (the) [Malvinas]', number: '238' },
        { code: 'FO', code3: 'FRO', name: 'Faroe Islands (the)', number: '234' },
        { code: 'FJ', code3: 'FJI', name: 'Fiji', number: '242' },
        { code: 'FI', code3: 'FIN', name: 'Finland', number: '246' },
        { code: 'FR', code3: 'FRA', name: 'France', number: '250' },
        { code: 'GF', code3: 'GUF', name: 'French Guiana', number: '254' },
        { code: 'PF', code3: 'PYF', name: 'French Polynesia', number: '258' },
        { code: 'TF', code3: 'ATF', name: 'French Southern Territories (the)', number: '260' },
        { code: 'GA', code3: 'GAB', name: 'Gabon', number: '266' },
        { code: 'GM', code3: 'GMB', name: 'Gambia (the)', number: '270' },
        { code: 'GE', code3: 'GEO', name: 'Georgia', number: '268' },
        { code: 'DE', code3: 'DEU', name: 'Germany', number: '276' },
        { code: 'GH', code3: 'GHA', name: 'Ghana', number: '288' },
        { code: 'GI', code3: 'GIB', name: 'Gibraltar', number: '292' },
        { code: 'GR', code3: 'GRC', name: 'Greece', number: '300' },
        { code: 'GL', code3: 'GRL', name: 'Greenland', number: '304' },
        { code: 'GD', code3: 'GRD', name: 'Grenada', number: '308' },
        { code: 'GP', code3: 'GLP', name: 'Guadeloupe', number: '312' },
        { code: 'GU', code3: 'GUM', name: 'Guam', number: '316' },
        { code: 'GT', code3: 'GTM', name: 'Guatemala', number: '320' },
        { code: 'GG', code3: 'GGY', name: 'Guernsey', number: '831' },
        { code: 'GN', code3: 'GIN', name: 'Guinea', number: '324' },
        { code: 'GW', code3: 'GNB', name: 'Guinea-Bissau', number: '624' },
        { code: 'GY', code3: 'GUY', name: 'Guyana', number: '328' },
        { code: 'HT', code3: 'HTI', name: 'Haiti', number: '332' },
        { code: 'HM', code3: 'HMD', name: 'Heard Island and McDonald Islands', number: '334' },
        { code: 'VA', code3: 'VAT', name: 'Holy See (the)', number: '336' },
        { code: 'HN', code3: 'HND', name: 'Honduras', number: '340' },
        { code: 'HK', code3: 'HKG', name: 'Hong Kong', number: '344' },
        { code: 'HU', code3: 'HUN', name: 'Hungary', number: '348' },
        { code: 'IS', code3: 'ISL', name: 'Iceland', number: '352' },
        { code: 'IN', code3: 'IND', name: 'India', number: '356' },
        { code: 'ID', code3: 'IDN', name: 'Indonesia', number: '360' },
        { code: 'IR', code3: 'IRN', name: 'Iran (Islamic Republic of)', number: '364' },
        { code: 'IQ', code3: 'IRQ', name: 'Iraq', number: '368' },
        { code: 'IE', code3: 'IRL', name: 'Ireland', number: '372' },
        { code: 'IM', code3: 'IMN', name: 'Isle of Man', number: '833' },
        { code: 'IL', code3: 'ISR', name: 'Israel', number: '376' },
        { code: 'IT', code3: 'ITA', name: 'Italy', number: '380' },
        { code: 'JM', code3: 'JAM', name: 'Jamaica', number: '388' },
        { code: 'JP', code3: 'JPN', name: 'Japan', number: '392' },
        { code: 'JE', code3: 'JEY', name: 'Jersey', number: '832' },
        { code: 'JO', code3: 'JOR', name: 'Jordan', number: '400' },
        { code: 'KZ', code3: 'KAZ', name: 'Kazakhstan', number: '398' },
        { code: 'KE', code3: 'KEN', name: 'Kenya', number: '404' },
        { code: 'KI', code3: 'KIR', name: 'Kiribati', number: '296' },
        {
            code: 'KP',
            code3: 'PRK',
            name: "Korea (the Democratic People's Republic of)",
            number: '408',
        },
        { code: 'KR', code3: 'KOR', name: 'Korea (the Republic of)', number: '410' },
        { code: 'KW', code3: 'KWT', name: 'Kuwait', number: '414' },
        { code: 'KG', code3: 'KGZ', name: 'Kyrgyzstan', number: '417' },
        { code: 'LA', code3: 'LAO', name: "Lao People's Democratic Republic (the)", number: '418' },
        { code: 'LV', code3: 'LVA', name: 'Latvia', number: '428' },
        { code: 'LB', code3: 'LBN', name: 'Lebanon', number: '422' },
        { code: 'LS', code3: 'LSO', name: 'Lesotho', number: '426' },
        { code: 'LR', code3: 'LBR', name: 'Liberia', number: '430' },
        { code: 'LY', code3: 'LBY', name: 'Libya', number: '434' },
        { code: 'LI', code3: 'LIE', name: 'Liechtenstein', number: '438' },
        { code: 'LT', code3: 'LTU', name: 'Lithuania', number: '440' },
        { code: 'LU', code3: 'LUX', name: 'Luxembourg', number: '442' },
        { code: 'MO', code3: 'MAC', name: 'Macao', number: '446' },
        { code: 'MG', code3: 'MDG', name: 'Madagascar', number: '450' },
        { code: 'MW', code3: 'MWI', name: 'Malawi', number: '454' },
        { code: 'MY', code3: 'MYS', name: 'Malaysia', number: '458' },
        { code: 'MV', code3: 'MDV', name: 'Maldives', number: '462' },
        { code: 'ML', code3: 'MLI', name: 'Mali', number: '466' },
        { code: 'MT', code3: 'MLT', name: 'Malta', number: '470' },
        { code: 'MH', code3: 'MHL', name: 'Marshall Islands (the)', number: '584' },
        { code: 'MQ', code3: 'MTQ', name: 'Martinique', number: '474' },
        { code: 'MR', code3: 'MRT', name: 'Mauritania', number: '478' },
        { code: 'MU', code3: 'MUS', name: 'Mauritius', number: '480' },
        { code: 'YT', code3: 'MYT', name: 'Mayotte', number: '175' },
        { code: 'MX', code3: 'MEX', name: 'Mexico', number: '484' },
        { code: 'FM', code3: 'FSM', name: 'Micronesia (Federated States of)', number: '583' },
        { code: 'MD', code3: 'MDA', name: 'Moldova (the Republic of)', number: '498' },
        { code: 'MC', code3: 'MCO', name: 'Monaco', number: '492' },
        { code: 'MN', code3: 'MNG', name: 'Mongolia', number: '496' },
        { code: 'ME', code3: 'MNE', name: 'Montenegro', number: '499' },
        { code: 'MS', code3: 'MSR', name: 'Montserrat', number: '500' },
        { code: 'MA', code3: 'MAR', name: 'Morocco', number: '504' },
        { code: 'MZ', code3: 'MOZ', name: 'Mozambique', number: '508' },
        { code: 'MM', code3: 'MMR', name: 'Myanmar', number: '104' },
        { code: 'NA', code3: 'NAM', name: 'Namibia', number: '516' },
        { code: 'NR', code3: 'NRU', name: 'Nauru', number: '520' },
        { code: 'NP', code3: 'NPL', name: 'Nepal', number: '524' },
        { code: 'NL', code3: 'NLD', name: 'Netherlands (the)', number: '528' },
        { code: 'NC', code3: 'NCL', name: 'New Caledonia', number: '540' },
        { code: 'NZ', code3: 'NZL', name: 'New Zealand', number: '554' },
        { code: 'NI', code3: 'NIC', name: 'Nicaragua', number: '558' },
        { code: 'NE', code3: 'NER', name: 'Niger (the)', number: '562' },
        { code: 'NG', code3: 'NGA', name: 'Nigeria', number: '566' },
        { code: 'NU', code3: 'NIU', name: 'Niue', number: '570' },
        { code: 'NF', code3: 'NFK', name: 'Norfolk Island', number: '574' },
        { code: 'MP', code3: 'MNP', name: 'Northern Mariana Islands (the)', number: '580' },
        { code: 'NO', code3: 'NOR', name: 'Norway', number: '578' },
        { code: 'OM', code3: 'OMN', name: 'Oman', number: '512' },
        { code: 'PK', code3: 'PAK', name: 'Pakistan', number: '586' },
        { code: 'PW', code3: 'PLW', name: 'Palau', number: '585' },
        { code: 'PS', code3: 'PSE', name: 'Palestine, State of', number: '275' },
        { code: 'PA', code3: 'PAN', name: 'Panama', number: '591' },
        { code: 'PG', code3: 'PNG', name: 'Papua New Guinea', number: '598' },
        { code: 'PY', code3: 'PRY', name: 'Paraguay', number: '600' },
        { code: 'PE', code3: 'PER', name: 'Peru', number: '604' },
        { code: 'PH', code3: 'PHL', name: 'Philippines (the)', number: '608' },
        { code: 'PN', code3: 'PCN', name: 'Pitcairn', number: '612' },
        { code: 'PL', code3: 'POL', name: 'Poland', number: '616' },
        { code: 'PT', code3: 'PRT', name: 'Portugal', number: '620' },
        { code: 'PR', code3: 'PRI', name: 'Puerto Rico', number: '630' },
        { code: 'QA', code3: 'QAT', name: 'Qatar', number: '634' },
        { code: 'MK', code3: 'MKD', name: 'Republic of North Macedonia', number: '807' },
        { code: 'RO', code3: 'ROU', name: 'Romania', number: '642' },
        { code: 'RU', code3: 'RUS', name: 'Russian Federation (the)', number: '643' },
        { code: 'RW', code3: 'RWA', name: 'Rwanda', number: '646' },
        { code: 'RE', code3: 'REU', name: 'Réunion', number: '638' },
        { code: 'BL', code3: 'BLM', name: 'Saint Barthélemy', number: '652' },
        {
            code: 'SH',
            code3: 'SHN',
            name: 'Saint Helena, Ascension and Tristan da Cunha',
            number: '654',
        },
        { code: 'KN', code3: 'KNA', name: 'Saint Kitts and Nevis', number: '659' },
        { code: 'LC', code3: 'LCA', name: 'Saint Lucia', number: '662' },
        { code: 'MF', code3: 'MAF', name: 'Saint Martin (French part)', number: '663' },
        { code: 'PM', code3: 'SPM', name: 'Saint Pierre and Miquelon', number: '666' },
        { code: 'VC', code3: 'VCT', name: 'Saint Vincent and the Grenadines', number: '670' },
        { code: 'WS', code3: 'WSM', name: 'Samoa', number: '882' },
        { code: 'SM', code3: 'SMR', name: 'San Marino', number: '674' },
        { code: 'ST', code3: 'STP', name: 'Sao Tome and Principe', number: '678' },
        { code: 'SA', code3: 'SAU', name: 'Saudi Arabia', number: '682' },
        { code: 'SN', code3: 'SEN', name: 'Senegal', number: '686' },
        { code: 'RS', code3: 'SRB', name: 'Serbia', number: '688' },
        { code: 'SC', code3: 'SYC', name: 'Seychelles', number: '690' },
        { code: 'SL', code3: 'SLE', name: 'Sierra Leone', number: '694' },
        { code: 'SG', code3: 'SGP', name: 'Singapore', number: '702' },
        { code: 'SX', code3: 'SXM', name: 'Sint Maarten (Dutch part)', number: '534' },
        { code: 'SK', code3: 'SVK', name: 'Slovakia', number: '703' },
        { code: 'SI', code3: 'SVN', name: 'Slovenia', number: '705' },
        { code: 'SB', code3: 'SLB', name: 'Solomon Islands', number: '090' },
        { code: 'SO', code3: 'SOM', name: 'Somalia', number: '706' },
        { code: 'ZA', code3: 'ZAF', name: 'South Africa', number: '710' },
        {
            code: 'GS',
            code3: 'SGS',
            name: 'South Georgia and the South Sandwich Islands',
            number: '239',
        },
        { code: 'SS', code3: 'SSD', name: 'South Sudan', number: '728' },
        { code: 'ES', code3: 'ESP', name: 'Spain', number: '724' },
        { code: 'LK', code3: 'LKA', name: 'Sri Lanka', number: '144' },
        { code: 'SD', code3: 'SDN', name: 'Sudan (the)', number: '729' },
        { code: 'SR', code3: 'SUR', name: 'Suriname', number: '740' },
        { code: 'SJ', code3: 'SJM', name: 'Svalbard and Jan Mayen', number: '744' },
        { code: 'SE', code3: 'SWE', name: 'Sweden', number: '752' },
        { code: 'CH', code3: 'CHE', name: 'Switzerland', number: '756' },
        { code: 'SY', code3: 'SYR', name: 'Syrian Arab Republic', number: '760' },
        { code: 'TW', code3: 'TWN', name: 'Taiwan', number: '158' },
        { code: 'TJ', code3: 'TJK', name: 'Tajikistan', number: '762' },
        { code: 'TZ', code3: 'TZA', name: 'Tanzania, United Republic of', number: '834' },
        { code: 'TH', code3: 'THA', name: 'Thailand', number: '764' },
        { code: 'TL', code3: 'TLS', name: 'Timor-Leste', number: '626' },
        { code: 'TG', code3: 'TGO', name: 'Togo', number: '768' },
        { code: 'TK', code3: 'TKL', name: 'Tokelau', number: '772' },
        { code: 'TO', code3: 'TON', name: 'Tonga', number: '776' },
        { code: 'TT', code3: 'TTO', name: 'Trinidad and Tobago', number: '780' },
        { code: 'TN', code3: 'TUN', name: 'Tunisia', number: '788' },
        { code: 'TR', code3: 'TUR', name: 'Turkey', number: '792' },
        { code: 'TM', code3: 'TKM', name: 'Turkmenistan', number: '795' },
        { code: 'TC', code3: 'TCA', name: 'Turks and Caicos Islands (the)', number: '796' },
        { code: 'TV', code3: 'TUV', name: 'Tuvalu', number: '798' },
        { code: 'UG', code3: 'UGA', name: 'Uganda', number: '800' },
        { code: 'UA', code3: 'UKR', name: 'Ukraine', number: '804' },
        { code: 'AE', code3: 'ARE', name: 'United Arab Emirates (the)', number: '784' },
        {
            code: 'GB',
            code3: 'GBR',
            name: 'United Kingdom of Great Britain and Northern Ireland (the)',
            number: '826',
        },
        {
            code: 'UM',
            code3: 'UMI',
            name: 'United States Minor Outlying Islands (the)',
            number: '581',
        },
        { code: 'US', code3: 'USA', name: 'United States of America (the)', number: '840' },
        { code: 'UY', code3: 'URY', name: 'Uruguay', number: '858' },
        { code: 'UZ', code3: 'UZB', name: 'Uzbekistan', number: '860' },
        { code: 'VU', code3: 'VUT', name: 'Vanuatu', number: '548' },
        { code: 'VE', code3: 'VEN', name: 'Venezuela (Bolivarian Republic of)', number: '862' },
        { code: 'VN', code3: 'VNM', name: 'Viet Nam', number: '704' },
        { code: 'VG', code3: 'VGB', name: 'Virgin Islands (British)', number: '092' },
        { code: 'VI', code3: 'VIR', name: 'Virgin Islands (U.S.)', number: '850' },
        { code: 'WF', code3: 'WLF', name: 'Wallis and Futuna', number: '876' },
        { code: 'EH', code3: 'ESH', name: 'Western Sahara', number: '732' },
        { code: 'YE', code3: 'YEM', name: 'Yemen', number: '887' },
        { code: 'ZM', code3: 'ZMB', name: 'Zambia', number: '894' },
        { code: 'ZW', code3: 'ZWE', name: 'Zimbabwe', number: '716' },
        { code: 'AX', code3: 'ALA', name: 'Åland Islands', number: '248' },
    ];

    const Signup = (e) => {
        if (e.target.id === 'first_name') {
            setdata({ ...data, first_name: e.target.value });
        }
        if (e.target.id === 'last_name') {
            setdata({ ...data, last_name: e.target.value });
        }
        if (e.target.id === 'gender') {
            setdata({ ...data, gender: e.target.value });
        }
        if (e.target.id === 'email') {
            setdata({ ...data, email: e.target.value });
        }
        if (e.target.id === 'mobile') {
            setdata({ ...data, mobile: e.target.value });
        }
        if (e.target.id === 'cnic') {
            setdata({ ...data, cnic: e.target.value });
        }
        if (e.target.id === 'passport_number') {
            setdata({ ...data, passport_number: e.target.value });
        }
        if (e.target.id === 'iqama_number') {
            setdata({ ...data, iqama_number: e.target.value });
        }
        if (e.target.id === 'password') {
            setdata({ ...data, password: e.target.value });
        }
        if (e.target.id === 'confirm_password') {
            setdata({ ...data, confirm_password: e.target.value });
        }
        if (e.target.id === 'current_address') {
            setdata({ ...data, current_address: e.target.value });
        }
        if (e.target.id === 'current_city') {
            setdata({ ...data, current_city: e.target.value });
        }
        if (e.target.id === 'current_state') {
            setdata({ ...data, current_state: e.target.value });
        }
        if (e.target.id === 'current_country') {
            setdata({ ...data, current_country: e.target.value });
        }
        if (e.target.id === 'current_postal_code') {
            setdata({ ...data, current_postal_code: e.target.value });
        }
        if (e.target.id === 'permanent_address') {
            setdata({ ...data, permanent_address: e.target.value });
        }
        if (e.target.id === 'permanent_city') {
            setdata({ ...data, permanent_city: e.target.value });
        }
        if (e.target.id === 'permanent_state') {
            setdata({ ...data, permanent_state: e.target.value });
        }
        if (e.target.id === 'permanent_country') {
            setdata({ ...data, permanent_country: e.target.value });
        }
        if (e.target.id === 'permanent_postal_code') {
            setdata({ ...data, permanent_postal_code: e.target.value });
        }
        if (e.target.id === 'father_name') {
            setdata({ ...data, father_name: e.target.value });
        }
        if (e.target.id === 'profession') {
            setdata({ ...data, profession: e.target.value });
        }
        if (e.target.id === 'account_yes') {
            setdata({ ...data, account_holder: e.target.value });
        }
        if (e.target.id === 'account_no') {
            setdata({ ...data, account_holder: e.target.value });
        }
        if (e.target.id === 'problem') {
            setdata({ ...data, problem: e.target.value });
        }
    };
    const same_as_function = (e) => {
        if (e.target.id === 'same_as') {
            setSame_as(e.target.checked ? true : false);
            currentCountry.current.value = e.target.checked ? permCountry.current.value : '';
        }
    };
    const dependent_section = (value) => {
        debugger;
        let ary = [];
        for (var i = 0; i < value; i++) {
            ary.push({
                name: '',
                age: '',
                iqamaNo: '',
                relation: '',
            });
        }
        setDependent_value(ary);
        console.log(dependent_value);
    };
    const form_fieldset = {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
    };
    const form_legend = {
        padding: '10px',
        width: 'auto',
    };
    const register = (e) => {
        e.preventDefault();
        let ca, cp, cc, cs, cco;
        if (same_as) {
            ca = data.permanent_address;
            cp = data.permanent_postal_code;
            cc = data.permanent_city;
            cs = data.permanent_state;
            cco = data.permanent_country;
        } else {
            ca = data.current_address;
            cp = data.current_postal_code;
            cc = data.current_city;
            cs = data.current_state;
            cco = data.current_country;
        }
        console.log(data);
        console.log(dependent_value);
        console.log(ca, cp, cc, cs, cco);
        if (data.password != data.confirm_password) {
            setError('Password & Confirm Password mismatch');
            toast.error('Password & Confirm Password mismatch');
        } else if (!data.account_holder) {
            setError('Please select an option for Roshan Digital Account Holder status');
            toast.error('Please select an option for Roshan Digital Account Holder status');
        } else {
            console.log('--before axios call--');
            Axios.get('/getCSRFToken').then((response) => {
                if (response.data.csrfToken) {
                    Axios.post(
                        eopUserRegistration(),
                        {
                            first_name: data.first_name,
                            last_name: data.last_name,
                            gender: data.gender,
                            email: data.email,
                            mobile: data.mobile,
                            cnic: data.cnic,
                            passport_number: data.passport_number,
                            iqama_number: data.iqama_number,
                            password: data.password,
                            confirm_password: data.confirm_password,
                            current_city: cc,
                            current_state: cs,
                            current_country: cco,
                            current_postal_code: cp,
                            current_address: ca,
                            permanent_city: data.permanent_city,
                            permanent_state: data.permanent_state,
                            permanent_country: data.permanent_country,
                            permanent_postal_code: data.permanent_postal_code,
                            permanent_address: data.permanent_address,
                            father_name: data.father_name,
                            profession: data.profession,
                            account_holder: data.account_holder,
                            dependent_value: dependent_value,
                            problem: data.problem,
                        },
                        {
                            headers: {
                                'x-xsrf-token': response.data.csrfToken,
                            },
                        }
                    ).then((res) => {
                        console.log(res);
                        console.log('code');
                        console.log(res.data.status);
                        if (res.data.status == 'success') {
                            toast.success(res.data.message);
                            setRegistration(convertByLang(res.data.message_ar, res.data.message));
                            window.location = `/${lang.langKey}/`;
                        } else {
                            toast.error(res.data.message);
                            setError(convertByLang(res.data.message_ar, res.data.message));
                        }
                    });
                }
            });
        }
    };
    console.log('Same As');
    console.log(same_as);

    return (
        <div className="row">
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000,
                }}
            />
            <div className="col-md-12 ml-3 ml-sm-0">
                {error ? (
                    <p className="mt-5 mx-1 alert alert-danger" role="alert">
                        {error}
                    </p>
                ) : (
                    ''
                )}
                {registration ? (
                    <p className="mt-5 mx-1 alert alert-success" role="alert">
                        {registration}
                    </p>
                ) : (
                    ''
                )}
                <form onSubmit={register} style={{ position: 'relative' }}>
                    <fieldset className="row col-md-12" style={form_fieldset}>
                        <legend style={form_legend}>Personal Information</legend>
                        <div className="form-group col-md-6">
                            <label htmlFor="first-name" className="form-label">
                                First Name
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                title="Please enter the first name..."
                                className="form-control"
                                onChange={Signup}
                                id="first_name"
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="last-name" className="form-label">
                                Last Name
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                title="Please enter the last name..."
                                className="form-control"
                                onChange={Signup}
                                id="last_name"
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="gender" className="form-label">
                                Gender
                                <span className="text-danger">*</span>
                            </label>
                            <select className="form-control" id="gender" onChange={Signup} required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-6"></div>
                        <div className="form-group col-md-6">
                            <label htmlFor="email" className="form-label">
                                Email
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                title="Please enter the email address..."
                                className="form-control"
                                placeholder="example@domain.com"
                                onChange={Signup}
                                id="email"
                                required
                            />
                            <small className='form-text text-muted'>Your working &amp; valid Email address, this will be used for portal login &amp; further communication</small>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="mobile" className="form-label">
                                Mobile Number
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                pattern="^(\d{1,3}[- ]?)?\d{10}$"
                                placeholder="966xxxxxxxxx"
                                title="Working mobile phone number"
                                maxLength="13"
                                onChange={Signup}
                                id="mobile"
                                required
                            />
                            <small className='form-text text-muted'>Your working KSA mobile number</small>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="password" className="form-label">
                                Password
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                className="form-control"
                                onChange={Signup}
                                id="password"
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="confirm_password" className="form-label">
                                Confirm Password
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                className="form-control"
                                onChange={Signup}
                                id="confirm_password"
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="cnic" className="form-label">
                                CNIC
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="12345-1234567-1"
                                pattern="^\d{5}-\d{7}-\d{1}$"
                                title="CNIC should contain 15 characters long and should include dashes according to the specified sample format"
                                className="form-control"
                                onChange={Signup}
                                id="cnic"
                                required
                            />
                            <small className='form-text text-muted'>Format 12345-1234567-1</small>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="passport_number" className="form-label">
                                Passport Number
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                pattern="^(?!^0+$)[a-zA-Z0-9]{6,9}$"
                                onChange={Signup}
                                maxLength="9"
                                id="passport_number"
                            />
                            <small className='form-text text-muted'>Valid input fromat for passport number starts with 0 and contains 6 to 9 alphanumeric digits, e.g. 0A1234567</small>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="iqama_number" className="form-label">
                                Iqama Number
                            </label>
                            <input
                                type="text"
                                title="10 digit Iqama No., starting with '2'"
                                className="form-control"
                                onChange={Signup}
                                pattern="^[2]\d{9}$"
                                maxLength="10"
                                id="iqama_number"
                            />
                            <small className='form-text text-muted'>10 digit Iqama No., starting with '2'</small>
                        </div>
                        <div className="col-md-6"></div>
                        <div className="form-group col-md-6">
                            <label htmlFor="father_name" className="form-label">
                                Father's Name
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={Signup}
                                id="father_name"
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="profession" className="form-label">
                                Profession
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={Signup}
                                id="profession"
                            />
                        </div>
                        <div className="form-group col-md-12">
                            <label className="form-label mr-4">
                                Roshan Digital Account Holder?
                                <span className="text-danger">*</span>
                            </label>
                            <div class="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="yes_no"
                                    onChange={Signup}
                                    id="account_yes"
                                    value="Yes"
                                />
                                <label className="form-check-label" htmlFor="account_yes">
                                    Yes
                                </label>
                            </div>
                            <div class="form-check form-check-inline ml-2">
                                <div class="form-check form-check-inline">
                                    <input
                                        type="radio"
                                        name="yes_no"
                                        onChange={Signup}
                                        id="account_no"
                                        value="No"
                                    />
                                </div>
                                <label className="form-check-label" htmlFor="account_no">
                                    No
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="row col-md-12" style={form_fieldset}>
                        <legend style={form_legend}>Permanent Address</legend>
                        <div className="col-md-8 mt-2">
                            <label htmlFor="permanent_address" className="form-label">
                                Address
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={Signup}
                                id="permanent_address"
                            />
                        </div>
                        <div className="col-md-4 mt-2">
                            <label htmlFor="permanent_postal_code" className="form-label">
                                Postal code
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={Signup}
                                id="permanent_postal_code"
                            />
                        </div>
                        <div className="col-md-4 mt-4">
                            <label htmlFor="permanent_city" className="form-label">
                                City
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={Signup}
                                id="permanent_city"
                            />
                        </div>
                        <div className="col-md-4 mt-4">
                            <label htmlFor="permanent_state" className="form-label">
                                State/Province
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={Signup}
                                id="permanent_state"
                            />
                        </div>
                        <div className="col-md-4 mt-4">
                            <label htmlFor="permanent_country" className="form-label">
                                Country
                            </label>
                            <select
                                ref={permCountry}
                                id="permanent_country"
                                name="permanent_country"
                                onChange={Signup}
                                class="form-control"
                            >
                                <option value="">Select Country</option>
                                {countryListAllIsoData &&
                                    countryListAllIsoData.map((countrydata, index) => {
                                        let data = countrydata.name;
                                        return data ? (
                                            <option key={countrydata._id} value={countrydata.code3}>
                                                {countrydata.name}
                                            </option>
                                        ) : (
                                            ''
                                        );
                                    })}
                            </select>
                        </div>
                    </fieldset>

                    <fieldset className="row col-md-12" style={form_fieldset}>
                        <legend style={form_legend}>Current Address</legend>
                        <div className="col-md-12">
                            <div className="form-check m-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="same_as"
                                    onClick={same_as_function}
                                />
                                <label className="form-check-label" for="same_as">
                                    Same as Permanent Address
                                </label>
                            </div>
                        </div>
                        <div className="col-md-8 mt-2">
                            <label htmlFor="current_address" className="form-label">
                                Address
                            </label>
                            <input
                                type="text"
                                readOnly={same_as}
                                className="form-control"
                                defaultValue={same_as ? data.permanent_address : ''}
                                onChange={Signup}
                                id="current_address"
                            />
                        </div>
                        <div className="col-md-4 mt-2">
                            <label htmlFor="current_postal_code" className="form-label">
                                Postal code
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                readOnly={same_as}
                                defaultValue={same_as ? data.permanent_postal_code : ''}
                                onChange={Signup}
                                id="current_postal_code"
                            />
                        </div>
                        <div className="col-md-4 mt-4">
                            <label htmlFor="current_city" className="form-label">
                                City
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                readOnly={same_as}
                                defaultValue={same_as ? data.permanent_city : ''}
                                onChange={Signup}
                                id="current_city"
                            />
                        </div>
                        <div className="col-md-4 mt-4">
                            <label htmlFor="current_state" className="form-label">
                                State/Province
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={same_as ? data.permanent_state : ''}
                                onChange={Signup}
                                readOnly={same_as}
                                id="current_state"
                            />
                        </div>
                        <div className="col-md-4 mt-4">
                            <label htmlFor="current_country" className="form-label">
                                Country
                            </label>
                            <select
                                ref={currentCountry}
                                id="current_country"
                                name="current_country"
                                onChange={Signup}
                                class="form-control"
                                readOnly={same_as}
                            >
                                <option value="">Select Country</option>
                                {countryListAllIsoData &&
                                    countryListAllIsoData.map((countrydata, index) => {
                                        let data = countrydata.name;
                                        return data ? (
                                            <option key={countrydata._id} value={countrydata.code3}>
                                                {countrydata.name}
                                            </option>
                                        ) : (
                                            ''
                                        );
                                    })}
                            </select>
                        </div>
                    </fieldset>

                    <fieldset className="row col-md-12" style={form_fieldset}>
                        <legend style={form_legend}>Dependent Details</legend>
                        <div className="form-group col-md-6 mb-4">
                            <div class="form-check form-check-inline">
                                <label
                                    htmlFor="number_of_dependent"
                                    className="form-check-label mr-3"
                                >
                                    Number of Dependents in KSA
                                </label>
                                <span className="text-danger">*</span>
                                <input
                                    type="number"
                                    min="0"
                                    size="4"
                                    className="form-control-inline"
                                    style={{ width: '60px' }}
                                    onChange={(e) => dependent_section(e.target.value)}
                                    id="number_of_dependent"
                                    aria-describedby="dependentsHelpInline"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-12 my-2">
                            {dependent_value
                                ? dependent_value.map((item, index) => {
                                    return (
                                        <div className="row mt-5 mt-sm-0" key={index}>
                                            <div className="form-group col-md-3">
                                                <label
                                                    htmlFor="dependent_name"
                                                    className="form-label"
                                                >
                                                    Dependent Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        SignupDependent(
                                                            e.target.value,
                                                            index,
                                                            'name'
                                                        );
                                                    }}
                                                    id="dependent_name"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group col-md-2">
                                                <label
                                                    htmlFor="dependent_age"
                                                    className="form-label"
                                                >
                                                    Dependent Age
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        SignupDependent(
                                                            e.target.value,
                                                            index,
                                                            'age'
                                                        );
                                                    }}
                                                    id="dependent_age"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label
                                                    htmlFor="dependent_Iqama"
                                                    className="form-label"
                                                >
                                                    Dependent Iqama No.
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        SignupDependent(
                                                            e.target.value,
                                                            index,
                                                            'iqamaNo'
                                                        );
                                                    }}
                                                    id="dependent_Iqama"
                                                    pattern="^[2]\d{9}$"
                                                    maxLength="10"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group col-md-3">
                                                <label
                                                    htmlFor="dependent_relation"
                                                    className="form-label"
                                                >
                                                    Dependent Relation
                                                </label>
                                                <select
                                                    className="form-control"
                                                    id="dependent_relation"
                                                    onChange={(e) => {
                                                        SignupDependent(
                                                            e.target.value,
                                                            index,
                                                            'relation'
                                                        );
                                                    }}
                                                    required
                                                >
                                                    <option value="">Select Relation</option>
                                                    <option value="Mother">Mother</option>
                                                    <option value="Father">Father</option>
                                                    <option value="Daughter">Daughter</option>
                                                    <option value="Son">Son</option>
                                                    <option value="Sister">Sister</option>
                                                    <option value="Brother">Brother</option>
                                                    <option value="Auntie">Auntie</option>
                                                    <option value="Uncle">Uncle</option>
                                                    <option value="Niece">Niece</option>
                                                    <option value="Nephew">Nephew</option>
                                                    <option value="Cousin">Cousin</option>
                                                    <option value="Grandmother">
                                                        Grandmother
                                                    </option>
                                                    <option value="Grandfather">
                                                        Grandfather
                                                    </option>
                                                    <option value="Granddaughter">
                                                        Granddaughter
                                                    </option>
                                                    <option value="Grandson">Grandson</option>
                                                    <option value="Stepsister">Stepsister</option>
                                                    <option value="Stepbrother">
                                                        Stepbrother
                                                    </option>
                                                    <option value="Stepmother">Stepmother</option>
                                                    <option value="Stepfather">Stepfather</option>
                                                    <option value="Stepdaughter">
                                                        Stepdaughter
                                                    </option>
                                                    <option value="Stepson">Stepson</option>
                                                    <option value="Sister-in-law">
                                                        Sister-in-law
                                                    </option>
                                                    <option value="Brother-in-law">
                                                        Brother-in-law
                                                    </option>
                                                    <option value="Mother-in-law">
                                                        Mother-in-law
                                                    </option>
                                                    <option value="Father-in-law">
                                                        Father-in-law
                                                    </option>
                                                    <option value="Daughter-in-law">
                                                        Daughter-in-law
                                                    </option>
                                                    <option value="Son-in-law">Son-in-law</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })
                                : ''}
                        </div>
                    </fieldset>
                    <fieldset className="row col-md-12" style={form_fieldset}>
                        <legend style={form_legend}>Problem(s) being faced in KSA</legend>
                        <div className="form-group col-md-12">
                            <textarea
                                rows="5"
                                cols="60"
                                type="text"
                                className="form-control"
                                onChange={Signup}
                                id="problem"
                                aria-describedby="problemHelpBlock"
                            />
                            <small id="problemHelpBlock" class="form-text text-muted">
                                Provide detailed description of the problem(s) you are facing in KSA
                                for which you need Embassy&apos;s help.
                            </small>
                        </div>
                    </fieldset>
                    <div className="col-md-12 text-right">
                        <input
                            type="reset"
                            className="btn btn-lg btn-secondary mt-4"
                            value="Clear Form"
                        />
                        <input
                            type="submit"
                            className="btn btn-lg btn-primary mt-4 ml-5"
                            value="Register New Account"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
