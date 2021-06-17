/*
 * Copyright (c) 2015, SeguriData <www.seguridata.com>
 * Author adiaz <adiaz@seguridata.com>,
 * Todos los derechos y beneficios provenientes del uso de las marcas, logotipos y
 * nombres comerciales de SeguriData son y pertenecen únicamente a SeguriData y
 * están protegidos por las leyes y tratados sobre derechos de autor y propiedad
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

	var SD_PBKDF2 = "1.2.840.113549.1.5.12";
	var SD_PBES2  = "1.2.840.113549.1.5.13";
	
	longToByteArray = function(long_) {
		// we want to represent the input as a 8-bytes array
		var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

		for ( var index = 0; index < byteArray.length; index ++ ) {
			var byte = long_ & 0xff;
			byteArray [ index ] = byte;
			long_ = (long_ - byte) / 256 ;
		}

		return byteArray;
	};
	
	function wordToByteArray(wordArray) {
		var byteArray = [], word, i, j;
		for (i = 0; i < wordArray.length; ++i) {
			word = wordArray[i];
			for (j = 3; j >= 0; --j) {
				byteArray.push((word >> 8 * j) & 0xFF);
			}
		}
		return byteArray;
	}
	
	function _base64ToArrayBuffer(base64) {
		var binary_string =  window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array( len );
		for (var i = 0; i < len; i++)        {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}
		
	//*********************************************************************************
	// #region Create Encrypted PKCS#8  
	//*********************************************************************************
	function create_PKCS8_enc(cryptoObj, pbes2, pbkdf2, encAlg)
	{
		return new Promise(function(resolve, reject) {
			// #region Initial variables 
			var sequence = Promise.resolve();
			var PBKDF2params_ = new org.pkijs.simpl.cms.PBKDF2_params();
			
			PBKDF2params_.salt = new org.pkijs.asn1.OCTETSTRING({ value_hex: cryptoObj.salt.buffer});
			PBKDF2params_.iterationCount = cryptoObj.iterations;
			
			//PBKDF2 Algorithm and params		
			var params_coding = PBKDF2params_.toSchema();	
			var pbkdf2Alg = new org.pkijs.simpl.ALGORITHM_IDENTIFIER( {
			   algorithm_id: pbkdf2,
			   algorithm_params: params_coding
			}
			);
			
			//Internal encryption algorithm
			var encAlg_ = new org.pkijs.simpl.ALGORITHM_IDENTIFIER( {
			   algorithm_id: encAlg,
			   algorithm_params: (new org.pkijs.asn1.OCTETSTRING({ value_hex: cryptoObj.iv.buffer}))
			}
			);
			
			//Encryption algorithm and pbkdf2AlgAndParams		
			var iSequence = new org.pkijs.simpl.pkcs8.PARAMETERS({
				EncAlgWPBKDF2params: pbkdf2Alg,
				encryptionScheme: encAlg_
			})
			;
			
			//Encryption algorithm			
			var encryptionAlgorithm_ = new org.pkijs.simpl.ALGORITHM_IDENTIFIER( {
				algorithm_id: SD_PBES2,
				algorithm_params: iSequence.toSchema()
			}
			);
			
			var b64Cipher = cryptoObj.cipherText.toString(CryptoJS.enc.Base64);
			var binCipher = _base64ToArrayBuffer(b64Cipher);
			
			//PKCS#8 Encrypted private key		
			var pkcs8EncryptedKey = new org.pkijs.simpl.pkcs8.ENCRYPTED_PRIVATEKEY_INFO_WP52({
				encryptionAlgorithm: encryptionAlgorithm_,
				encryptedData: (new org.pkijs.asn1.OCTETSTRING({ value_hex: binCipher}))
			}
			);
			
			var pkcs8_wp52_schema = pkcs8EncryptedKey.toSchema();
			var pkcs8Wp52Buffer = pkcs8_wp52_schema.toBER(false);

			resolve(pkcs8Wp52Buffer);
		});
	}
	//*********************************************************************************
	// #endregion 
	//*********************************************************************************