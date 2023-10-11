import sign from "jwt-encode"
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'

const myPlugin = {
	install(app) {
		app.config.globalProperties.twoDigit = (value) => {
			if(value.toString().length <= 1) return "0"+value.toString();
			return value.toString();
		},
		app.config.globalProperties.nikValidator = (event, data) => {
			if (data.length > 15) event.preventDefault();
			if (event.key.match(/[0-9]/g)) return event;
			else event.preventDefault();
		},
		app.config.globalProperties.getJWT = (obj) => {
			const secret = 'os5r6a!'
			return sign(obj, secret)
		},
		app.config.globalProperties.translateJWT = (token) => {
			const obj = jwt_decode(token)
			return obj
		},
		app.config.globalProperties.onlyDecimal = (event) => {
			const charCode = event.which ? event.which : event.keyCode;
			if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
				event.preventDefault();
			return event;
		},
		app.config.globalProperties.onlyWord = (event, lengthData = null, data = null) => {
			if (event.key.match(/[a-zA-Z ]/g)) {
				if (lengthData === null) {
					return event
				}
				if (data.length < lengthData) {
					return event
				}
				event.preventDefault()
			} else {
				event.preventDefault()
			}
			return ''
		},
		app.config.globalProperties.onlyNumber = (event, lengthData = null, data = null) => {
			if (event.key.match(/[0-9]/g)) {
				if (lengthData == null) {
					return event;
				} else {
					if (data.length < lengthData) return event;
					else event.preventDefault();
				}
			} else event.preventDefault();
		},
		app.config.globalProperties.onlyJustNumber = (event) => {
			if (event.key.match(/[0-9]/g)) {
				console.log(event);
				return event;
			} else event.preventDefault();
		},
		app.config.globalProperties.onlyNumberPreventPaste = (event, lengthData = null, data = null) => {
			const keys = event.key;
			const keysCtrl = event.ctrlKey;
			if (keysCtrl) return event.preventDefault();
			if (event.keyCode == 8 || event.keyCode == 46) return event;
			if (keys.match(/[0-9]/g)) {
				if (lengthData == null) return event;
				if (data.length < lengthData) return event;
			} else {
				event.preventDefault();
			}
		},
		app.config.globalProperties.preventAll = (event) => {
			const keys = event.key;
			const keysCtrl = event.ctrlKey;
			if (keys || keysCtrl ) return event.preventDefault();
		},
		app.config.globalProperties.decimalInput = (event) => {
			const { keyCode, key } = event;
			if (keyCode === 110 || keyCode === 46) return event;
			else if (key.match(/[0-9]/g)) return event;
			else event.preventDefault();
		},
		app.config.globalProperties.onlyAlphanumeric = (event) => {
			if (event.key.match(/^[a-zA-Z ]*$/)) return event;
			else event.preventDefault();
		},
		app.config.globalProperties.onlyCustom = (event, lengthData = null, data = null, pattern) => {
			const patternRegexp = new RegExp(pattern);
			if (event.key.match(patternRegexp)) {
				if (lengthData == null) {
					return event;
				} else {
					if (data.length < lengthData) return event;
					else event.preventDefault();
				}
			} else event.preventDefault();
		},
		app.config.globalProperties.currencyFormat = (data = null) => {
			const newData = parseFloat(data.replace(/,/g, ""));
			return newData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		app.config.globalProperties.currencyToNumber = (data = null) => {
			return parseFloat(data.replace(/,/g, ""));
		},
		app.config.globalProperties.processingDate = (string) => {
			const date = string // 2021-07-15T14:11:41.956Z
			return this.$moment(date).format('LL') // 15 Juli 2021
		},
		app.config.globalProperties.processingIdProyek = (string) => {
			if (!string) return '-'
			const strNumber = string.split('-')[1].split('')
			strNumber.splice(6, 0, '-') // 202108-211332517796385
			strNumber.splice(11, 0, '-') // 202108-2113-32517796385
			strNumber.splice(16, 0, '-') // 202108-2113-32517796385
			strNumber.splice(21, 0, '-') // 202108-2113-3251-7796385
			return strNumber.join('')
		},
		app.config.globalProperties.formatDateToPicker = (date) => {
			if (!date) return null;
			const [year, month, day] = date.split("-");
			//this.register.tgl_lahir = `${day}-${month}-${year}`;
			return `${day}-${month}-${year}`;
		},
		app.config.globalProperties.spesialDateFormat = (date) => {
			if (!date) return null;
			const temp = date.split('-').reverse()
			temp.push('01')
			const result = temp.join('-') 
			return result
		},
		app.config.globalProperties.formatDateToPickerMonth = (date) => {
			if(!date) return null
			const [year,month,day] = date.split("-")
			return `${month}-${year}`
		},
		app.config.globalProperties.makeRandom = (n) => {
			let result = '';
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			const charactersLength = characters.length;
			for ( let i = 0; i < n; i++ ) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result;
		},
		app.config.globalProperties.makeRandomAngka = (n) => {
			let result = '';
			const characters = '0123456789';
			const charactersLength = characters.length;
			for ( let i = 0; i < n; i++ ) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result;
		},
		app.config.globalProperties.changeDateFormat = (date) => {
			const temp = date.split('-')
			switch (temp[1]) {
				case '01':
					temp[1] = 'Januari'
					break
				case '02':
					temp[1] = 'Februari'
					break
				case '03':
					temp[1] = 'Maret'
					break
				case '04':
					temp[1] = 'April'
					break
				case '05':
					temp[1] = 'Mei'
					break
				case '06':
					temp[1] = 'Juni'
					break
				case '07':
					temp[1] = 'Juli'
					break
				case '08':
					temp[1] = 'Agustus'
					break
				case '09':
					temp[1] = 'September'
					break
				case '10':
					temp[1] = 'Oktober'
					break
				case '11':
					temp[1] = 'November'
					break
				case '12':
					temp[1] = 'Desember'
					break
				default:
					break
			}
			return temp.reverse().join(' ')
		},
		app.config.globalProperties.convertDateToPicker = (data = null) => {
			if (data == null) {
				return this.$moment().format("YYYY-MM-DD");
			} else {
				const [year, month, day] = data.split("-");
				return `${year}-${month}-${day}`;
			}
		},
		app.config.globalProperties.convertDateToPicker2 = (data = null) => {
			if (data == null) {
				return this.$moment().format("YYYY-MM-DD");
			} else {
				let date = new Date(data),
				mnth = ("0" + (date.getMonth() + 1)).slice(-2),
				day = ("0" + date.getDate()).slice(-2);
				const valueConvert = [date.getFullYear(), mnth, day].join("-");
				return valueConvert
			}
		},
		app.config.globalProperties.convertDateToPicker3 = (data = null) => {
			if (data == null) {
				return this.$moment().format("YYYY-MM-DD");
			} else {
				let date = new Date(data),
				mnth = ("0" + (date.getMonth() + 1)).slice(-2),
				day = ("0" + date.getDate()).slice(-2);
				const valueConvert = [day, mnth, date.getFullYear()].join("-");
				return valueConvert
			}
		},
		app.config.globalProperties.convertDate = (data) => {
			const [year, month, day] = data.split("-");
			return `${year}${month}${day}`;
		},
		app.config.globalProperties.convertDateForMonth = (str) => {
			const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
			let date = new Date(str),
			mnth = bulan[date.getMonth()],
			day = ("0" + date.getDate()).slice(-2);
			const valueConvertDate = [day, mnth, date.getFullYear()].join(" ");
			return valueConvertDate
		},
		app.config.globalProperties.convertDateTime = (str) => {
			const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
			let date = new Date(str),
			mnth = bulan[date.getMonth()],
			day = ("0" + date.getDate()).slice(-2);
			const valueConvertDate = [day, mnth, date.getFullYear()].join(" ");
		
			let time = new Date(str),
			jam = ("0" + time.getHours()).slice(-2),
			menit = ("0" + time.getMinutes()).slice(-2),
			detik = ("0" + time.getSeconds()).slice(-2);
			const valueConvertTime = [jam, menit, detik].join(":");
		
			const datetime = [valueConvertDate, valueConvertTime].join(" ");
			return datetime
		},
		app.config.globalProperties.convertDateTime2 = (str) => {
			let date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
			const valueConvertDate = [date.getFullYear(), mnth, day].join("-");

			let time = new Date(str),
			jam = ("0" + time.getHours()).slice(-2),
			menit = ("0" + time.getMinutes()).slice(-2),
			detik = ("0" + time.getSeconds()).slice(-2);
			const valueConvertTime = [jam, menit, detik].join(":");

			const datetime = [valueConvertDate, valueConvertTime].join(" ");

			return datetime
		},
		app.config.globalProperties.uppercaseLetterFirst = (textInput) => {
			textInput = textInput.toLowerCase();
			var stringArray = textInput.split(/\b(\s)/);
			for (var i = 0; i < stringArray.length; i++) {
				stringArray[i] =
					stringArray[i].charAt(0).toUpperCase() +
					stringArray[i].substring(1);
			}
			var finalText = stringArray.join("");
			return finalText;
		},
		app.config.globalProperties.uppercaseLetterFirst2 = (textInput) => {
			let regex = /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g
			let cek = regex.test(textInput)
			textInput = textInput.toLowerCase();
			var stringArray = ''
			if(cek){
				stringArray = textInput.split(". ");
			}else{
				stringArray = textInput.split(/\b(\s)/);
			}
			for (var i = 0; i < stringArray.length; i++) {
				stringArray[i] =
					stringArray[i].charAt(0).toUpperCase() +
					stringArray[i].substring(1);
			}
			var finalText = cek ? stringArray.join(". ") : stringArray.join("");
			return finalText;
		},
		app.config.globalProperties.isNumeric = (value) => {
			return /^-?\d+$/.test(value);
		},
		app.config.globalProperties.inisialuppercaseLetterFirst = (textInput) => {
			textInput = textInput.toLowerCase();
			var stringArray = textInput.split(/\b(\s)/);
			var dataText = [];
			for (var i = 0; i < stringArray.length; i++) {
				var numeric = /^-?\d+$/.test(stringArray[i]);
				if(numeric){
					stringArray[i] = stringArray[i]
				}else{
					stringArray[i] =
					stringArray[i].charAt(0).toUpperCase()
				}
				if(stringArray[i] !== ' '){
					dataText.push(stringArray[i])
				}
			}
			var finalText = dataText.join("");
			return finalText;
		},
		app.config.globalProperties.uppercaseLetter = (textInput) => {
			let result = textInput.toUpperCase();
			return result;
		},
		app.config.globalProperties.currencyDotFormat = (value) => {
			if(value){
				var currency = value.match(/.{1,3}/g).join(".");
				var currency = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
				return currency;
			}
		},
		app.config.globalProperties.currencyDotFormatNumber = (value) => {
			if(value){
				var currency = value.toString().match(/.{1,3}/g).join(".");
				var currency = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
				return currency;
			}
		},
		app.config.globalProperties.npwpFormat = (value) => {
			let result = ''
			for (let i = 0; i < value.length; i++) {
				result += value[i]
				if (i === 1 || i === 4 || i === 7 || i === 11) result += '.'
				if (i === 8 ) result += '-'
			}
			return result
		},
		app.config.globalProperties.InvertnpwpFormat = (value) => {
			let hasil, result
			hasil = value.replaceAll('.', '');
			result = hasil.replaceAll('-', '');
			return result
		},
		app.config.globalProperties.replaceDots = (data = null) => {
			return data.replace(/\./g, "");
		},
		app.config.globalProperties.replaceComma = (data = null) => {
			return data.replace(/\,/g, "");
		},
		app.config.globalProperties.encodeBinary = (blob) => {
			return new Promise((resolve, reject) => {
				let reader = new FileReader();
				reader.onload = (event) => {
					resolve(event.target.result);
				};
				reader.onerror = (error) => {
					reader.abort();
					reject(error);
				};
				reader.readAsDataURL(blob);
			})
		},
		app.config.globalProperties.uuidv4 = () => {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		app.config.globalProperties.PrintcurrencyLanguageFormatter = (nominal = '0') => {
			let strNominal = nominal ? nominal.replace('.00', '') : '0';
			const lengthNominal = strNominal.length - 1;
			if (lengthNominal == 9) {
				return `${strNominal[0]}.${strNominal[1]} Miliar`;
			} else if (lengthNominal == 12) {
				return `${strNominal[0]}.${strNominal[1]} Triliun`;
			} else if (lengthNominal == 15) {
				return `${strNominal[0]}.${strNominal[1]} Kuadriliun`;
			} else if (lengthNominal == 18) {
				return `${strNominal[0]}.${strNominal[1]} Kuintiliun`
			} else if (lengthNominal == 21) {
				return `${strNominal[0]}.${strNominal[1]} Sekstiliun`;
			} else if (lengthNominal == 24) {
				return `${strNominal[0]}.${strNominal[1]} Septiliun`;
			} else if (lengthNominal == 27) {
				return `${strNominal[0]}.${strNominal[1]} Oktiliun`;
			} else if (lengthNominal == 30) {
				return `${strNominal[0]}.${strNominal[1]} Noniliun`;
			} else if (lengthNominal == 33) {
				return `${strNominal[0]}.${strNominal[1]} Desiliun`;
			} else {
				return this.currencyDotFormat(strNominal);
			}
		},
		app.config.globalProperties.changeCurrencyLanguageFormatterInput = (nominal = '0') => {
			let strNominal = nominal ? nominal.replace('.00', '') : '0';
			let nominalRp = this.currencyDotFormat(strNominal);
			return nominalRp;
		},
		app.config.globalProperties.currencyCommaFormat = (value) => {
			if(value){
				var currency = value.match(/.{1,3}/g).join(",");
				var currency = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				return currency;
			}
		},
		app.config.globalProperties.getDayJS = (waktu, text) => {
			let date = dayjs().add(waktu, text).toDate()
			return date;
		},
		app.config.globalProperties.setPembilang = {
			pembilang(nilai) {
				nilai = Math.abs(nilai);
				var simpanNilaiBagi=0;
				var huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
				var temp="";
				if (nilai < 12) {
					temp = " "+huruf[nilai];
				}
				else if (nilai <20) {
					temp = this.pembilang(nilai - 10) + " Belas";
				}
				else if (nilai < 100) {
					simpanNilaiBagi = Math.floor(nilai/10);
					temp = this.pembilang(simpanNilaiBagi)+" Puluh"+ this.pembilang(nilai % 10);
				}
				else if (nilai < 200) {
					temp = " Seratus" + this.pembilang(nilai - 100);
				}
				else if (nilai < 1000) {
					simpanNilaiBagi = Math.floor(nilai/100);
					temp = this.pembilang(simpanNilaiBagi) + " Ratus" + this.pembilang(nilai % 100);
				}
				else if (nilai < 2000) {
					temp = " Seribu" + this.pembilang(nilai - 1000);
				}
				else if (nilai < 1000000) {
					simpanNilaiBagi = Math.floor(nilai/1000);
					temp = this.pembilang(simpanNilaiBagi) + " Ribu" + this.pembilang(nilai % 1000);
				} 
				else if (nilai < 1000000000) {
					simpanNilaiBagi = Math.floor(nilai/1000000);
					temp =this.pembilang(simpanNilaiBagi) + " Juta" + this.pembilang(nilai % 1000000);
				} 
				else if (nilai < 1000000000000) {
					simpanNilaiBagi = Math.floor(nilai/1000000000);
					temp = this.pembilang(simpanNilaiBagi) + " Miliar" + this.pembilang(nilai % 1000000000);
				} 
				else if (nilai < 1000000000000000) {
					simpanNilaiBagi = Math.floor(nilai/1000000000000);
					temp = this.pembilang(nilai/1000000000000) + " Triliun" + this.pembilang(nilai % 1000000000000);
				}
				return temp;
			}
		}
	}
}
 
export default myPlugin;