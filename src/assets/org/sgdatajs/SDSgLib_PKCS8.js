/*
 * Copyright (c) 2015, SeguriData <www.seguridata.com>
 * Author adiaz <adiaz@seguridata.com>,
 * Modified by fborja <fborja@seguridata.com>.
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
   
  var SD_TripleDES = "1.2.840.113549.3.7";
 
  var SDSGL_ERR_01 = "Error while decoding pkcs#8 encrypted private key stream";
  var SDSGL_ERR_02 = "Invalid or unsupported algorithm: ";
  var SDSGL_ERR_03 = "La contraseña proporcionada es incorrecta.";
  var SDSGL_ERR_04 = "Error while deriving symmetric key";
  
  var ADJUSTED_3DES_KEY_LENGTH = 24 * 2;

   // function to convert string to ArrayBuffer
   function str2ab(str) {
      var buf = new ArrayBuffer(str.length);
	  var bufView = new Uint8Array(buf);
	  
	  for(var i = 0, strLen = str.length; i < strLen; i++)
	     bufView[i] = str.charCodeAt(i);
	  return buf;
	};	
	
	function StringToBinary(string) {
		var chars, code, i, isUCS2, len, _i;
		len = string.length;

		chars = [];
		isUCS2 = false;
		for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
			code = String.prototype.charCodeAt.call(string, i);
			if (code > 255) {
				isUCS2 = true;
				chars = null;
				break;
			} else {
				chars.push(code);
			}
		}

		if (isUCS2 === true) {
			return unescape(encodeURIComponent(string));
		} else {
			return String.fromCharCode.apply(null, Array.prototype.slice.apply(chars));
		}
	}
	
	function StringToUint8Array(string) {
		var binary, binLen, buffer, chars, i, _i;
		binary = StringToBinary(string);
		binLen = binary.length;
		buffer = new ArrayBuffer(binLen);
		chars  = new Uint8Array(buffer);
		for (i = _i = 0; 0 <= binLen ? _i < binLen : _i > binLen; i = 0 <= binLen ? ++_i : --_i) {
			chars[i] = String.prototype.charCodeAt.call(binary, i);
		}
		return chars;
	}	
	
	function uint8ArrayToHexStr(byteArray) {
		var hexString = "";
		var nextHexByte;
		
		for (var i=0; i<byteArray.byteLength; i++) {
			nextHexByte = byteArray[i].toString(16);
            if (nextHexByte.length < 2) {
                nextHexByte = "0" + nextHexByte;     // Otherwise 10 becomes just a instead of 0a
            }
            hexString += nextHexByte;
        }
        return hexString;
	}

    function arrayBufferToHexString(arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        var hexString = "";
        var nextHexByte;

        for (var i=0; i<byteArray.byteLength; i++) {
            nextHexByte = byteArray[i].toString(16);  // Integer to base 16
            if (nextHexByte.length < 2) {
                nextHexByte = "0" + nextHexByte;     // Otherwise 10 becomes just a instead of 0a
            }
            hexString += nextHexByte;
        }
        return hexString;
    }

	function arrayBufferToString(buffer,onSuccess,onFail) {
		var bufView = new Uint8Array(buffer);
		var length = bufView.length;
		var result = '';

		for(var i = 0;i<length;i+=65535) {
			var addition = 65535;
			if(i + 65535 > length) {
				addition = length - i;
			}
			result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
		}

		if(result) {
			if(onSuccess)
				onSuccess(result);
		} else {
			if(onFail)
				onFail('buffer was invalid');
	    }
		return result;
	}

	function binStringToHex(s) {
		var s2 = [], c;
		var result = '';
		for ( var i = 0, l = s.length; i < l; ++i ) {
			c = s.charCodeAt(i);
			result = result + (c >> 4 ).toString(16) + (c & 0xF ).toString(16);
		}
		return result;
	}
	
	function rawStringToBuffer( str ) {
		var indx, theLen = str.length, arr = new Array( theLen );
		for ( indx = 0 ; indx < theLen ; ++indx ) {
			arr[ indx ] = str.charCodeAt(indx) & 0xFF;
		}
		// You may create an ArrayBuffer from a standard array (of values) as follows:
		return new Uint8Array( arr ).buffer;
	}
	
	/**
	* Decipher data with TripleDES
	*@param cipheredInfo Data to Decrypt
	*
	*@param secretPhrase Symmetric key
	*
	*@param ivValue Initialization vector
	*/	
	function decipher3DES(cipheredInfo, secretPhrase, ivValue) {
		var decrypted = CryptoJS.TripleDES.decrypt({ciphertext: cipheredInfo}, secretPhrase, {iv: ivValue, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
		
		return decrypted;
	}
	
	/**
	* Cipher data with TripleDES
	*@param plainInfo Data to Encrypt
	*
	*@param secretPhrase Symmetric key
	*
	*@param ivValue Initialization vector
	*/
	function cipher3DES(plainInfo, secretPhrase, ivValue) {
		var encrypted = CryptoJS.TripleDES.encrypt(CryptoJS.enc.Hex.parse(plainInfo), CryptoJS.enc.Hex.parse(secretPhrase), {iv: CryptoJS.enc.Hex.parse(ivValue), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
		return encrypted.ciphertext;
	}
	
	/**
	* Adjust encryption key to odd parity (3DES Key)
	*@param buffer ArrayBuffer of derived key to adjust parity
	*
	*@param size Total bytes to adjust parity
	*/
	function makeOddParity(buffer, size) {
		var i = 0;
		var j = 0;
		var cnt1s = 0;
		var c = 0;
	
		for( i = 0 ; i < size ; i++ ) {
              for( cnt1s = 0, j = 0 ; j < 8 ; j++ ) {
                c = 1 ;
                c = c << j ;
                if( (buffer[i] & c) != 0 ) cnt1s++;
              }
              if( cnt1s % 2 == 0 ) 
			      buffer[i] = buffer[i] ^ 0x01;
            }
        return forge.util.binary.hex.encode(buffer);
	}

	/**
	* Opens a PKCS#8 ciphered RSA private key
	* @param binaryPrivateKey Binary PKCS#8 ciphered RSA key
	*
	* @param password Pssword to decrypt ciphered private key.
	*
	* @return promise with resulting deciphered private key or error.
	*/
	function SDSgLib_openPKCS8PrivateKey(binaryPrivateKey, password) {
		
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
				reject(Error("Web Cryptography API not supported. [No Crypto.Subtle Namespace]"));
			}
			
			var hash = "SHA-1";
			//console.log("Inicia proceso " + new Date());
			//Parseando la codificación ASN1 de la llave encriptada PKCS#8
			var decoded_asn1 = org.pkijs.fromBER(rawStringToBuffer(binaryPrivateKey));

			if(decoded_asn1.offset === (-1)) {
				// Error during decoding
				reject(Error(SDSGL_ERR_01));
			}
			
			//console.log("ASN.1 decodificado " + new Date());
			//Verificando que el asn1 corresponda a una llave privada encriptada PKCS#8	(v2.0)
			var pkcs8_simpl = new org.pkijs.simpl.pkcs8.ENCRYPTED_PRIVATEKEY_INFO_WP52({ schema: decoded_asn1.result });
			
			//console.log("Comparación contra esquema " + new Date());
			
			//Validando que el algoritmo de encripción sea 3DES
			var cipherAlgorithm = pkcs8_simpl.encryptionAlgorithm.parameters.encryptionScheme.algorithm_id;
			
			if (cipherAlgorithm != SD_TripleDES) {
				reject(Error(SDSGL_ERR_02 + cipherAlgorithm));
			}

			//console.log("Antes de disponer valores " + new Date());
			var iterations = pkcs8_simpl.encryptionAlgorithm.parameters.EncAlgWPBKDF2params.keyDevParams.iterationCount;
			var salt = binStringToHex(arrayBufferToString(pkcs8_simpl.encryptionAlgorithm.parameters.EncAlgWPBKDF2params.keyDevParams.salt.value_block.value_hex));			

			var info2Decipher = CryptoJS.enc.Hex.parse(binStringToHex(arrayBufferToString(pkcs8_simpl.encryptedData.value_block.value_hex, false, true)));
			
			//console.log("Luego de disponer valores " + new Date());
			
			//Trying ansi password to decrypt key
			var pwd_buffer = forge.util.createBuffer(password);
			
			SgLib_PBKDF2(pwd_buffer, salt, iterations, 192).then(function(derivedKey) {	
				derivedKey = makeOddParity(forge.util.binary.hex.decode(derivedKey), 192/8);
				
				var dKey = CryptoJS.enc.Hex.parse(derivedKey);
				var iv = CryptoJS.enc.Hex.parse(binStringToHex(arrayBufferToString(pkcs8_simpl.encryptionAlgorithm.parameters.encryptionScheme.algorithm_params.value_block.value_hex, false, true)));
				var decipheredInfo = decipher3DES(info2Decipher, dKey, iv);
				
				//console.log("Llave desencriptada: " + new Date());
				var binaryPrivKey = decipheredInfo.toString(CryptoJS.enc.Latin1);
				
				if (binaryPrivKey.length <= 0) {
					//console.log("Deciphered binary private key length is zero " + new Date());
					reject(Error(SDSGL_ERR_03));
				}

				if (binaryPrivKey[0x00] != '0') {
					console.log("Unable to decrypt ciphered private key " + new Date());
					//Trying utf-8 password to decrypt key
					pwd_buffer = forge.util.createBuffer(forge.util.encodeUtf8(password));
					SgLib_PBKDF2(pwd_buffer, salt, iterations, 192).then(function(derivedKey) {
						derivedKey = makeOddParity(forge.util.binary.hex.decode(derivedKey), 192/8);
						var dKey = CryptoJS.enc.Hex.parse(derivedKey);
						var decipheredInfo = decipher3DES(info2Decipher, dKey, iv);
						var binaryPrivKey = decipheredInfo.toString(CryptoJS.enc.Latin1);

						if (binaryPrivKey.length <= 0) {
							console.log("Deciphered binary private key length is zero " + new Date());
							reject(Error(SDSGL_ERR_03));
						}
						if (binaryPrivKey[0x00] != '0') {
							reject(Error(SDSGL_ERR_03));
						} else
							resolve(binaryPrivKey);
					});
				} else
					resolve(binaryPrivKey);				
				
			});
		}); //End of Promise
  } //End of SDSgLib_openPKCS8PrivateKey

  /*Encripta una llave privada PKCS#8  con PKCS5 v2*/  
  function SDSgLib_cipherPKCS8Key(plainKey, password) {
	  return new Promise(function(resolve, reject) {
			var crypto;
			var cryptoSubtle;
			var hash = "SHA-1";
			var iterations = 2048;

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
				reject(Error("Web Cryptography API not supported. [No Crypto.Subtle Namespace] 5"));
			}
			
			var salt = new Uint8Array(8);
			crypto.getRandomValues(salt);
			
			var iv = new Uint8Array(8);
			crypto.getRandomValues(iv);
			
			var hexSalt = uint8ArrayToHexStr(salt);
			
			SgLib_PBKDF2(password, hexSalt, iterations, 192).then(function(derivedKey) {
				derivedKey = makeOddParity(forge.util.binary.hex.decode(derivedKey), 192/8);
				var ivHex = uint8ArrayToHexStr(iv);
				var cipheredInfo = cipher3DES(arrayBufferToHexString(plainKey), derivedKey, ivHex);
										
				var cryptoObj = {"cipherText": cipheredInfo,
				"salt": salt,
				"iv": iv,
				"iterations":iterations
				}
				
				create_PKCS8_enc(cryptoObj, SD_PBES2, SD_PBKDF2, SD_TripleDES).then(function(result) {
					resolve(result);
				}, function(error) {
					reject(Error("Error while encoding ciphered key: " + error.message));
				}
				);			
				
			});			
			
	  }); //End of Promise
  }// End of SDSgLib_cipherPKCS8Key

  
		
