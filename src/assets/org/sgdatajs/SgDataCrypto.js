/*
 * Copyright (c) 2015, SeguriData <www.seguridata.com>
 * Author 2015, fborja <fborja@seguridata.com>.
 * Todos los derechos y beneficios provenientes del uso de las marcas, logotipos y
 * nombres comerciales de SeguriData son y pertenecen únicamente a SeguriData y
 * estan protegidos por las leyes y tratados sobre derechos de autor y propiedad
 * intelectual aplicables.  Asimismo, la titularidad y derechos de autor con
 * respecto al componente “Javascript” es propiedad de SeguriData incluyendo, pero
 * sin limitarse a código fuente, código objeto, imágenes, fotografías, animaciones,
 * vídeo, audio, música, texto, rutinas y "applets" o subprogramas incorporados, así
 * como manuales y los materiales que en su caso lo acompañen. Usted se obliga a no
 * alterar, ni remover cualquier referencia de marca, logotipos y/o nombres
 * comerciales de SeguriData insertados, asentados o de cualquier otra forma
 * contenidos en cualquiera de sus productos o componentes. En caso de violación a
 * esta disposición, se hará acreedor a las penas impuestas por la legislación sobre
 * Propiedad Industrial  y el Código Penal Federal.
 */

	function isWCAPISupported() {
		var crypto;
		var cryptoSubtle;
			
		if (window.msCrypto) { // IE
			crypto = window.msCrypto;
		} else if (window.crypto) {  // all others
			crypto = window.crypto;
		} else {
			alert("Your current browser does not support the Web Cryptography API! This page will not work. [No Crypto Namespace]");
			return false;
		}
		
		// get crypto.subtle
		if (crypto.webkitSubtle) {  // Safari
			cryptoSubtle = crypto.webkitSubtle;
		} else if (crypto.subtle) { // all others
			cryptoSubtle = crypto.subtle;
		} else {
			alert("Your current browser does not support the Web Cryptography API! This page will not work. [No Crypto.Subtle Namespace]");
			return false;
		}
		
		return true;
	}
	
	function convertStringToArrayBufferView(str) {
		var bytes = new Uint8Array(str.length);
		for (var iii = 0; iii < str.length; iii++) 
		{
			bytes[iii] = str.charCodeAt(iii);
		}

		return bytes;
	}   
		
	function convertArrayBufferViewtoString(buffer) {
		var str = "";
		for (var iii = 0; iii < buffer.byteLength; iii++) 
		{
			str += String.fromCharCode(buffer[iii]);
		}

		return str;
	}
	
	function formatPEM(pem_string) {
            /// <summary>Format string in order to have each line with length equal to 63</summary>
            /// <param name="pem_string" type="String">String to format</param>

            var string_length = pem_string.length;
            var result_string = "";

            for(var i = 0, count = 0; i < string_length; i++, count++)
            {
                if(count > 63)
                {
                    result_string = result_string + "\r\n";
                    count = 0;
                }

                result_string = result_string + pem_string[i];
            }

            return result_string;
    }
	
	function base64toBlob(base64Data, contentType) {
		contentType = contentType || '';
		var sliceSize = 1024;
		var byteCharacters = atob(base64Data);
		var bytesLength = byteCharacters.length;
		var slicesCount = Math.ceil(bytesLength / sliceSize);
		var byteArrays = new Array(slicesCount);

		for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
			var begin = sliceIndex * sliceSize;
			var end = Math.min(begin + sliceSize, bytesLength);

			var bytes = new Array(end - begin);
			for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
			}
			byteArrays[sliceIndex] = new Uint8Array(bytes);
		}
		return new Blob(byteArrays, { type: contentType });
	}
	
	function isNPAPIPluginsSupported() {
		var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
		var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		// At least Safari 3+: "[object HTMLElementConstructor]"
		var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
		var isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6
		
		return isIE;
	}
	
	function signContent(cipheredKey, password, hashAlgorithm, dataToSign) {
		
		return new Promise(function(resolve, reject) {
			var crypto;
			var cryptoSubtle;
			
			if (window.msCrypto) { // IE
				crypto = window.msCrypto;
			} else if (window.crypto) {  // all others
				crypto = window.crypto;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto Namespace]"));
			}
			
			// get crypto.subtle
			if (crypto.webkitSubtle) {  // Safari
				cryptoSubtle = crypto.webkitSubtle;
			} else if (crypto.subtle) { // all others
				cryptoSubtle = crypto.subtle;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto.Subtle Namespace] 6"));
			}

			SDSgLib_openPKCS8PrivateKey(cipheredKey,
										password).
										then(function(pkcs8) {
											if(pkcs8[0x00] != '0') {
												reject(Error(SDSGL_ERR_03));
											}
											cryptoSubtle.importKey("pkcs8",
																rawStringToBuffer(pkcs8),
																{
																	name: "RSASSA-PKCS1-v1_5",
																	hash: {
																		name: hashAlgorithm
																	}
																},
																false,
																["sign"]).
																then(function(privateKey) {
																	cryptoSubtle.sign(
																				{name: "RSASSA-PKCS1-v1_5",
																				 hash: {
																					name: hashAlgorithm
																				 }
																				},
																				privateKey,
																				convertStringToArrayBufferView(dataToSign)).
																				then(function(signature) {
																					// Converting ArrayBuffer to String 
																					var signatureString = "";
																					var view = new Uint8Array(signature);

																					for(var i = 0; i < view.length; i++)
																						signatureString = signatureString + String.fromCharCode(view[i]);

																					// Converting to base64
																					var b64Signature;
																					b64Signature = window.btoa(signatureString);
																					resolve(b64Signature);
																				}, function(error) {
																					reject(Error("Error during signing data: " + error.message));
																				});
																}, function(error) {
																	reject(Error("Error during importing pkcs8: " + error.message));
																});
										}, function(error) {
											reject(Error("Error during getting pkcs8: " + error.message));
										});
		});
	} // End of signContent
	
	function signHash(cipheredKey, password, hashAlgorithm, hashToSign) {
		
		return new Promise(function(resolve, reject) {
			var crypto;
			var cryptoSubtle;
			
			if (window.msCrypto) { // IE
				crypto = window.msCrypto;
			} else if (window.crypto) {  // all others
				crypto = window.crypto;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto Namespace]"));
			}
			
			// get crypto.subtle
			if (crypto.webkitSubtle) {  // Safari
				cryptoSubtle = crypto.webkitSubtle;
			} else if (crypto.subtle) { // all others
				cryptoSubtle = crypto.subtle;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto.Subtle Namespace] 7"));
			}

			SDSgLib_openPKCS8PrivateKey(cipheredKey,
										password).
										then(function(pkcs8) {
											if(pkcs8[0x00] != '0') {
												reject(Error(SDSGL_ERR_03));
											}

											// Converting pkcs8 to base64
											var pkcs8B64;
											pkcs8B64 = formatPEM(window.btoa(pkcs8));
															
											var signature = Module.ccall('jsglibSignFromHashV2' , 'string', 
												  ['string', 'number', 'string', 'number', 'number'], 
												  [pkcs8B64, pkcs8B64.length, hashToSign, hashToSign.length, hashAlgorithm]);

											if(!signature)
												reject(Error("Error during signing hash"));
											
											resolve(signature);
										}, function(error) {
											reject(Error("Error during getting pkcs8: " + error.message));
										});
		});
	} // End of signHash
	
	function multiSignHash(cipheredKey, password, hashAlgorithm, arrayDoc) {
		var mrn= arrayDoc[0],
			hashToSign= arrayDoc[2];
		
		return new Promise(function(resolve, reject) {
			var crypto;
			var cryptoSubtle;
			
			if (window.msCrypto) { // IE
				crypto = window.msCrypto;
			} else if (window.crypto) {  // all others
				crypto = window.crypto;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto Namespace]"));
			}
			
			// get crypto.subtle
			if (crypto.webkitSubtle) {  // Safari
				cryptoSubtle = crypto.webkitSubtle;
			} else if (crypto.subtle) { // all others
				cryptoSubtle = crypto.subtle;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto.Subtle Namespace] 8"));
			}

			SDSgLib_openPKCS8PrivateKey(cipheredKey,
										password).
										then(function(pkcs8) {
											if(pkcs8[0x00] != '0') {
												reject(Error(SDSGL_ERR_03));
											}

											// Converting pkcs8 to base64
											var pkcs8B64;
											pkcs8B64 = formatPEM(window.btoa(pkcs8));
															
											var signature = Module.ccall('jsglibSignFromHashV2' , 'string', 
												  ['string', 'number', 'string', 'number', 'number'], 
												  [pkcs8B64, pkcs8B64.length, hashToSign, hashToSign.length, hashAlgorithm]);

											if(!signature)
												reject(Error("Error during signing hash"));
											
											resolve(signature+"|"+mrn);
										}, function(error) {
											reject(Error("Error during getting pkcs8: " + error.message));
										});
		});
	} // End of multiSignHash
	
	function pkcs7FromHash(password, cipheredKey, certX509, hashAlgorithm, hashToSign) {
		
		return new Promise(function(resolve, reject) {
			var crypto;
			var cryptoSubtle;
			
			if (window.msCrypto) { // IE
				crypto = window.msCrypto;
			} else if (window.crypto) {  // all others
				crypto = window.crypto;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto Namespace]"));
			}
	
			// get crypto.subtle
			if (crypto.webkitSubtle) {  // Safari
				cryptoSubtle = crypto.webkitSubtle;
			} else if (crypto.subtle) { // all others
				cryptoSubtle = crypto.subtle;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto.Subtle Namespace] 9" + JSON.stringify(crypto) ));
			}

			SDSgLib_openPKCS8PrivateKey(cipheredKey,
										password).
										then(function(pkcs8) {
											if(pkcs8[0x00] != '0') {
												reject(Error(SDSGL_ERR_03));
											}

											// Converting pkcs8 to base64
											var pkcs8B64;
											pkcs8B64 = formatPEM(window.btoa(pkcs8));
															
											var pkcs1 = Module.ccall('jsglibSignFromHashV2' , 'string', 
												  ['string', 'number', 'string', 'number', 'number'], 
												  [pkcs8B64, pkcs8B64.length, hashToSign, hashToSign.length, hashAlgorithm]);

											if(!pkcs1)
												reject(Error("Error during getting pkcs1"));
											
											if(pkcs1.substring(0, 7) == "[Error]") {
												reject(Error(pkcs1));
											}
											
											var hashAlgStr;
											switch(hashAlgorithm)
											{
												case 2:
													hashAlgStr = "SHA-1";
													break;
												case 3:
													hashAlgStr = "SHA-256";
													break;
												case 4:
													hashAlgStr = "SHA-384";
													break;
												case 5:
													hashAlgStr = "SHA-512";
													break;
												default:
													hashAlgStr = "SHA-256";
											}
											
											SDSgLib_encodePKCS7Detached(certX509,  str2ab(window.atob(pkcs1)), hashAlgStr).
											then(function(pkcs7) {
												resolve(pkcs7);
											} , function(error) {
												reject(Error("Error during getting pkcs7: " + error.message));
											});
											
										}, function(error) {
											reject(Error("Error during getting pkcs8: " + error.message));
										});
		});
	} // End of pkcs7FromHash
	
	function pkcs7FromContent(password, cipheredKey, certX509, hashAlgorithm, dataToSign, doDetached) {
		return new Promise(function(resolve, reject) {
			var crypto;
			var cryptoSubtle;
			
			if (window.msCrypto) { // IE
				crypto = window.msCrypto;
			} else if (window.crypto) {  // all others
				crypto = window.crypto;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto Namespace]"));
			}

		
			
			// get crypto.subtle
			if (crypto.webkitSubtle) {  // Safari
				cryptoSubtle = crypto.webkitSubtle;
			} else if (crypto.subtle) { // all others
				cryptoSubtle = crypto.subtle;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto.Subtle Namespace] 10"));
			}
			
			SDSgLib_openPKCS8PrivateKey(cipheredKey,
										password).
										then(function(pkcs8) {
											if(pkcs8[0x00] != '0') {
												reject(Error(SDSGL_ERR_03));
											}
											cryptoSubtle.importKey("pkcs8",
																rawStringToBuffer(pkcs8),
																{
																	name: "RSASSA-PKCS1-v1_5",
																	hash: {
																		name: hashAlgorithm
																	}
																},
																false,
																["sign"]).
																then(function(privateKey) {
																	cryptoSubtle.sign(
																				{name: "RSASSA-PKCS1-v1_5",
																				 hash: {
																					name: hashAlgorithm
																				 }
																				},
																				privateKey,
																				convertStringToArrayBufferView(dataToSign)).
																				then(function(signature) {
																					SDSgLib_encodePKCS7(certX509, signature, hashAlgorithm, doDetached ? null : str2ab(dataToSign)).then(function(pkcs7) {
																						resolve(pkcs7);
																					}, function(error) {
																						var error_ = new Object();
																						error_.reason="some reason!";
																						error_.message=error;
																						reject(error_);
																					});
																				}, function(error) {
																					reject(Error("Error during signing data: " + error.message));
																				});
																}, function(error) {
																	reject(Error("Error during importing pkcs8: " + error.message));
																});
										}, function(error) {
											reject(Error("Error during getting pkcs8: " + error.message));
										});
		});
	} // End of pkcs7FromContent
	
	function privateDecrypt(cipheredKey, password, encryptedData) {
		
		return new Promise(function(resolve, reject) {
			var crypto;
			var cryptoSubtle;
			
			if (window.msCrypto) { // IE
				crypto = window.msCrypto;
			} else if (window.crypto) {  // all others
				crypto = window.crypto;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto Namespace]"));
			}
			
			// get crypto.subtle
			if (crypto.webkitSubtle) {  // Safari
				cryptoSubtle = crypto.webkitSubtle;
			} else if (crypto.subtle) { // all others
				cryptoSubtle = crypto.subtle;
			} else {
				reject(Error("Web Cryptography API not supported. [No Crypto.Subtle Namespace] 11"));
			}

			SDSgLib_openPKCS8PrivateKey(cipheredKey,
										password).
										then(function(pkcs8) {
											if(pkcs8[0x00] != '0') {
												reject(Error(SDSGL_ERR_03));
											}

											// Converting pkcs8 to base64
											var pkcs8B64;
											pkcs8B64 = formatPEM(window.btoa(pkcs8));
															
											var plainText = Module.ccall('jsglibPrivateDecryptV2' , 'string', 
												  ['string', 'number', 'string', 'number'], 
												  [pkcs8B64, pkcs8B64.length, encryptedData, encryptedData.length]);

											if(!plainText)
												reject(Error("Error during decrypting data"));
											
											resolve(plainText);
										}, function(error) {
											reject(Error("Error during getting pkcs8: " + error.message));
										});
		});
	} // End of signHash


